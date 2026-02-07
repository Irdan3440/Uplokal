"""
Uplokal Backend - Message Model
================================
Messaging system for B2B communication.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class Conversation(Base):
    """Conversation between two parties."""
    
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Participants (business IDs)
    participant_1_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    participant_2_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    
    # Context
    subject = Column(String(255))
    rfq_id = Column(Integer, ForeignKey("rfqs.id"))  # Optional RFQ context
    
    # Status
    is_archived_1 = Column(Boolean, default=False)  # Archived by participant 1
    is_archived_2 = Column(Boolean, default=False)  # Archived by participant 2
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_message_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    messages = relationship("Message", back_populates="conversation", order_by="Message.created_at")
    
    def __repr__(self):
        return f"<Conversation(id={self.id})>"


class Message(Base):
    """Individual message within a conversation."""
    
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Content
    content = Column(Text, nullable=False)
    attachment_ids = Column(String(500))  # Comma-separated document IDs
    
    # Status
    is_read = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    read_at = Column(DateTime)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", back_populates="sent_messages")
    
    def __repr__(self):
        return f"<Message(id={self.id}, conversation_id={self.conversation_id})>"
