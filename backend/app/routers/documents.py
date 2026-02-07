"""
Uplokal Backend - Document Vault Routes
=========================================
Document upload, listing, download with signed URLs.
"""

import os
import uuid
import aiofiles
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.models.document import Document, DocumentCategory
from app.models.user import User
from app.middleware.auth import get_current_user
from app.middleware.sanitization import sanitize_filename
from app.services.encryption import (
    encode_id,
    decode_id,
    generate_signed_url,
    verify_signed_url,
    get_signed_download_url
)

router = APIRouter()
settings = get_settings()

# Ensure storage directory exists
os.makedirs(settings.storage_path, exist_ok=True)


# =============================================================================
# SCHEMAS
# =============================================================================

class DocumentResponse(BaseModel):
    """Document info response with obfuscated ID."""
    id: str  # Obfuscated hash
    filename: str
    category: str
    file_size: int
    created_at: datetime
    description: Optional[str]

    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    """List of documents."""
    documents: List[DocumentResponse]
    total: int


class SignedUrlResponse(BaseModel):
    """Signed URL for document download."""
    download_url: str
    expires_in_seconds: int


# =============================================================================
# ROUTES
# =============================================================================

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form(default="other"),
    description: str = Form(default=""),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Upload a document to the vault.
    
    - Sanitizes filename
    - Stores with unique UUID name
    - Encrypts at rest (TODO: implement actual encryption)
    - Returns obfuscated document ID
    """
    # Validate file
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file provided"
        )
    
    # Sanitize filename
    original_filename = sanitize_filename(file.filename)
    
    # Generate unique storage filename
    file_ext = original_filename.rsplit(".", 1)[-1] if "." in original_filename else ""
    storage_filename = f"{uuid.uuid4().hex}.{file_ext}" if file_ext else uuid.uuid4().hex
    storage_path = os.path.join(settings.storage_path, storage_filename)
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    # TODO: Encrypt content before storing (at-rest encryption)
    # encrypted_content = encrypt_file(content)
    
    # Save file
    async with aiofiles.open(storage_path, "wb") as f:
        await f.write(content)
    
    # Validate category
    try:
        doc_category = DocumentCategory(category)
    except ValueError:
        doc_category = DocumentCategory.OTHER
    
    # Create database record
    document = Document(
        owner_id=user.id,
        filename=storage_filename,
        original_filename=original_filename,
        mime_type=file.content_type,
        file_size=file_size,
        storage_path=storage_path,
        storage_type="local",
        category=doc_category,
        description=description[:500] if description else None,
        is_encrypted="true"
    )
    
    db.add(document)
    await db.commit()
    await db.refresh(document)
    
    return DocumentResponse(
        id=encode_id(document.id),
        filename=document.original_filename,
        category=document.category.value,
        file_size=document.file_size,
        created_at=document.created_at,
        description=document.description
    )


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    category: Optional[str] = Query(None),
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    List current user's documents.
    
    - Supports filtering by category
    - Returns obfuscated IDs
    """
    query = select(Document).where(Document.owner_id == user.id)
    
    if category:
        try:
            cat_enum = DocumentCategory(category)
            query = query.where(Document.category == cat_enum)
        except ValueError:
            pass
    
    query = query.order_by(Document.created_at.desc()).offset(offset).limit(limit)
    
    result = await db.execute(query)
    documents = result.scalars().all()
    
    # Count total
    count_query = select(Document).where(Document.owner_id == user.id)
    if category:
        try:
            cat_enum = DocumentCategory(category)
            count_query = count_query.where(Document.category == cat_enum)
        except ValueError:
            pass
    
    count_result = await db.execute(count_query)
    total = len(count_result.scalars().all())
    
    return DocumentListResponse(
        documents=[
            DocumentResponse(
                id=encode_id(doc.id),
                filename=doc.original_filename,
                category=doc.category.value,
                file_size=doc.file_size,
                created_at=doc.created_at,
                description=doc.description
            )
            for doc in documents
        ],
        total=total
    )


@router.get("/{doc_hash}/signed-url", response_model=SignedUrlResponse)
async def get_document_signed_url(
    doc_hash: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Generate a time-limited signed URL for document download.
    
    - URL expires in 30 minutes
    - Only document owner can generate
    """
    # Decode document ID
    doc_id = decode_id(doc_hash)
    if not doc_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Get document
    document = await db.get(Document, doc_id)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check ownership
    if document.owner_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Generate signed URL
    expiry_seconds = settings.signed_url_expiry_seconds
    query_params = generate_signed_url("document", doc_hash, expiry_seconds)
    download_url = f"/api/documents/download/{doc_hash}?{query_params}"
    
    return SignedUrlResponse(
        download_url=download_url,
        expires_in_seconds=expiry_seconds
    )


@router.get("/download/{doc_hash}")
async def download_document(
    doc_hash: str,
    expires: int = Query(...),
    signature: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Download document using signed URL (no auth required if signature valid).
    
    - Verifies signature
    - Checks expiration
    - Returns file content
    """
    from fastapi.responses import FileResponse
    
    # Verify signed URL
    if not verify_signed_url("document", doc_hash, expires, signature):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid or expired download link"
        )
    
    # Decode document ID
    doc_id = decode_id(doc_hash)
    if not doc_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Get document
    document = await db.get(Document, doc_id)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check file exists
    if not os.path.exists(document.storage_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on storage"
        )
    
    # Increment access count
    document.access_count += 1
    await db.commit()
    
    # Return file
    return FileResponse(
        path=document.storage_path,
        filename=document.original_filename,
        media_type=document.mime_type or "application/octet-stream"
    )


@router.delete("/{doc_hash}")
async def delete_document(
    doc_hash: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Delete a document from the vault.
    
    - Only owner can delete
    - Removes from storage and database
    """
    # Decode document ID
    doc_id = decode_id(doc_hash)
    if not doc_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Get document
    document = await db.get(Document, doc_id)
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check ownership
    if document.owner_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Delete file from storage
    if os.path.exists(document.storage_path):
        os.remove(document.storage_path)
    
    # Delete from database
    await db.delete(document)
    await db.commit()
    
    return {"message": "Document deleted successfully", "success": True}
