"""
Uplokal Backend - Document Model
=================================
Document vault with encryption support.
"""

from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, BigInteger, Enum
from sqlalchemy.orm import relationship
from app.database import Base


class DocumentCategory(str, PyEnum):
    """Document category enumeration."""
    LEGAL = "legal"
    FINANCIAL = "financial"
    EXPORT = "export"
    CERTIFICATION = "certification"
    CONTRACT = "contract"
    OTHER = "other"


class Document(Base):
    """Document model for the Document Vault."""
    
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    
    # File info
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    mime_type = Column(String(100))
    file_size = Column(BigInteger)  # In bytes
    
    # Storage
    storage_path = Column(String(500), nullable=False)  # Encrypted path
    storage_type = Column(String(20), default="local")  # local, s3
    
    # Metadata
    category = Column(Enum(DocumentCategory), default=DocumentCategory.OTHER)
    description = Column(Text)
    tags = Column(String(500))  # Comma-separated tags
    
    # Security
    is_encrypted = Column(String(10), default="true")  # At-rest encryption flag
    access_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime)  # Optional expiration
    
    # Relationships
    owner = relationship("User", back_populates="documents")
    business = relationship("Business", back_populates="documents")
    
    def __repr__(self):
        return f"<Document(id={self.id}, filename={self.original_filename})>"
