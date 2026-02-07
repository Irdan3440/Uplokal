"""
Uplokal Backend - Payment Transaction Models
==============================================
Midtrans payment transaction history.
"""

from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, 
    ForeignKey, Enum, Float, JSON
)
from sqlalchemy.orm import relationship

from app.database import Base


class PaymentStatus(str, PyEnum):
    """Payment transaction status."""
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentMethod(str, PyEnum):
    """Payment method types."""
    QRIS = "qris"
    BANK_TRANSFER = "bank_transfer"
    GOPAY = "gopay"
    SHOPEEPAY = "shopeepay"
    OVO = "ovo"
    DANA = "dana"
    CREDIT_CARD = "credit_card"
    OTHER = "other"


class PaymentTransaction(Base):
    """
    Payment transaction record.
    
    Stores all payment attempts and their status from Midtrans.
    """
    __tablename__ = "payment_transactions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subscription_id = Column(Integer, ForeignKey("user_subscriptions.id"))
    
    # Midtrans Transaction Info
    order_id = Column(String(255), unique=True, nullable=False)  # Our order ID
    transaction_id = Column(String(255))  # Midtrans transaction ID
    
    # Amount
    amount = Column(Integer, nullable=False)  # In IDR (smallest unit)
    currency = Column(String(3), default="IDR")
    amount = Column(Integer, nullable=False)
    
    # Status
    status = Column(Enum(PaymentStatus, native_enum=False), default=PaymentStatus.PENDING)
    payment_method = Column(Enum(PaymentMethod, native_enum=False))
    
    # Metadata
    description = Column(String(500))  # e.g., "Subscription - Pro Plan (Monthly)"
    
    # Payment Details (from Midtrans webhook)
    payment_type = Column(String(50))  # Midtrans payment_type
    bank = Column(String(50))  # For VA payments
    va_number = Column(String(50))  # Virtual Account number
    payment_metadata = Column(JSON, default=dict)  # Renamed from 'metadata' to avoid reservation
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    paid_at = Column(DateTime)  # When payment was confirmed
    expired_at = Column(DateTime)  # Payment expiry
    
    # Relationships
    user = relationship("User", backref="payments")
