"""
Uplokal Backend - User Model
=============================
User authentication and role management.
"""

from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from app.database import Base


class UserRole(str, PyEnum):
    """User role enumeration."""
    USER = "user"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class OAuthProvider(str, PyEnum):
    """OAuth provider enumeration."""
    GOOGLE = "google"
    # Future: FACEBOOK = "facebook", APPLE = "apple"


class User(Base):
    """User model for authentication and profile."""
    
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # Nullable for OAuth users
    full_name = Column(String(255))
    phone = Column(String(20))
    avatar_url = Column(String(500))  # Profile picture from OAuth
    
    # OAuth fields
    oauth_provider = Column(Enum(OAuthProvider, native_enum=False), nullable=True)
    oauth_id = Column(String(255), nullable=True)  # Provider's user ID
    
    # Role and status
    role = Column(Enum(UserRole, native_enum=False), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime)
    
    # Relationships
    business = relationship("Business", back_populates="owner", uselist=False)
    documents = relationship("Document", back_populates="owner")
    sent_messages = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
    subscription = relationship("UserSubscription", back_populates="user", uselist=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
