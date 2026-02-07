"""
Uplokal Backend - Messages Routes
==================================
B2B messaging system.
"""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.message import Conversation, Message
from app.models.business import Business
from app.models.user import User
from app.middleware.auth import get_current_user
from app.middleware.sanitization import sanitize_string
from app.services.encryption import encode_id, decode_id

router = APIRouter()


# =============================================================================
# SCHEMAS
# =============================================================================

class SendMessageRequest(BaseModel):
    """Send message request."""
    recipient_id: str  # Obfuscated business ID
    content: str = Field(..., min_length=1, max_length=5000)
    subject: Optional[str] = None


class MessageResponse(BaseModel):
    """Message response."""
    id: str
    sender_id: str
    content: str
    is_read: bool
    created_at: datetime


class ConversationResponse(BaseModel):
    """Conversation response."""
    id: str
    other_party: dict
    subject: Optional[str]
    last_message: Optional[str]
    last_message_at: datetime
    unread_count: int


# =============================================================================
# ROUTES
# =============================================================================

@router.post("/send", status_code=status.HTTP_201_CREATED)
async def send_message(
    data: SendMessageRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Send a message to another business."""
    # Get sender's business
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    sender_business = result.scalar_one_or_none()
    
    if not sender_business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile required to send messages"
        )
    
    # Get recipient business
    recipient_id = decode_id(data.recipient_id)
    if not recipient_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found"
        )
    
    recipient_business = await db.get(Business, recipient_id)
    if not recipient_business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found"
        )
    
    # Find or create conversation
    result = await db.execute(
        select(Conversation).where(
            or_(
                and_(
                    Conversation.participant_1_id == sender_business.id,
                    Conversation.participant_2_id == recipient_business.id
                ),
                and_(
                    Conversation.participant_1_id == recipient_business.id,
                    Conversation.participant_2_id == sender_business.id
                )
            )
        )
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        conversation = Conversation(
            participant_1_id=sender_business.id,
            participant_2_id=recipient_business.id,
            subject=sanitize_string(data.subject) if data.subject else None
        )
        db.add(conversation)
        await db.flush()
    
    # Create message
    message = Message(
        conversation_id=conversation.id,
        sender_id=user.id,
        content=sanitize_string(data.content)
    )
    
    db.add(message)
    conversation.last_message_at = datetime.utcnow()
    await db.commit()
    
    return {
        "message": "Message sent successfully",
        "conversation_id": encode_id(conversation.id),
        "message_id": encode_id(message.id)
    }


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """List all conversations for current user."""
    # Get user's business
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        return []
    
    # Get conversations
    result = await db.execute(
        select(Conversation).where(
            or_(
                Conversation.participant_1_id == business.id,
                Conversation.participant_2_id == business.id
            )
        ).order_by(Conversation.last_message_at.desc())
    )
    conversations = result.scalars().all()
    
    response = []
    for conv in conversations:
        # Determine other party
        other_id = conv.participant_2_id if conv.participant_1_id == business.id else conv.participant_1_id
        other_business = await db.get(Business, other_id)
        
        # Get last message
        msg_result = await db.execute(
            select(Message)
            .where(Message.conversation_id == conv.id)
            .order_by(Message.created_at.desc())
            .limit(1)
        )
        last_msg = msg_result.scalar_one_or_none()
        
        # Count unread
        unread_result = await db.execute(
            select(Message).where(
                and_(
                    Message.conversation_id == conv.id,
                    Message.sender_id != user.id,
                    Message.is_read == False
                )
            )
        )
        unread_count = len(unread_result.scalars().all())
        
        response.append(ConversationResponse(
            id=encode_id(conv.id),
            other_party={
                "id": encode_id(other_business.id) if other_business else None,
                "name": other_business.name if other_business else "Unknown"
            },
            subject=conv.subject,
            last_message=last_msg.content[:100] if last_msg else None,
            last_message_at=conv.last_message_at,
            unread_count=unread_count
        ))
    
    return response


@router.get("/{conversation_hash}", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_hash: str,
    limit: int = Query(default=50, le=100),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Get messages in a conversation."""
    conv_id = decode_id(conversation_hash)
    if not conv_id:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conversation = await db.get(Conversation, conv_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Verify access
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    business = result.scalar_one_or_none()
    
    if not business or business.id not in [conversation.participant_1_id, conversation.participant_2_id]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get messages
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conv_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
    )
    messages = result.scalars().all()
    
    # Mark as read
    for msg in messages:
        if msg.sender_id != user.id and not msg.is_read:
            msg.is_read = True
            msg.read_at = datetime.utcnow()
    
    await db.commit()
    
    return [
        MessageResponse(
            id=encode_id(m.id),
            sender_id=encode_id(m.sender_id),
            content=m.content,
            is_read=m.is_read,
            created_at=m.created_at
        )
        for m in reversed(messages)
    ]
