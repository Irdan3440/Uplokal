"""
Uplokal Backend - Subscription Models
======================================
Subscription plans and user subscriptions.
"""

from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Boolean, 
    ForeignKey, Enum, Float, JSON
)
from sqlalchemy.orm import relationship

from app.database import Base


class SubscriptionTier(str, PyEnum):
    """Subscription tier levels."""
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class SubscriptionStatus(str, PyEnum):
    """User subscription status."""
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    PENDING = "pending"


class SubscriptionPlan(Base):
    """
    Subscription plan definitions.
    
    Each plan has defined features, limits, and pricing.
    """
    __tablename__ = "subscription_plans"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Plan Info
    name = Column(String(100), nullable=False)  # "Gratis", "Starter", "Pro"
    tier = Column(Enum(SubscriptionTier, native_enum=False), nullable=False, unique=True)
    description = Column(Text)
    
    # Pricing (in IDR)
    price_monthly = Column(Integer, default=0)  # Rp 0, 99000, 299000
    price_yearly = Column(Integer, default=0)   # Annual pricing with discount
    currency = Column(String(3), default="IDR")
    
    # Features & Limits
    features = Column(JSON, default=list)  # List of feature strings
    max_documents = Column(Integer, default=5)
    max_rfq_per_month = Column(Integer, default=3)
    ai_diagnostic = Column(Boolean, default=False)
    ai_assistant = Column(Boolean, default=False)
    b2b_matchmaking = Column(Boolean, default=False)
    priority_support = Column(Boolean, default=False)
    white_label = Column(Boolean, default=False)
    api_access = Column(Boolean, default=False)
    
    # Display
    is_popular = Column(Boolean, default=False)  # Highlight badge
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subscriptions = relationship("UserSubscription", back_populates="plan")


class UserSubscription(Base):
    """
    User's active subscription.
    
    Tracks which plan a user is subscribed to and billing period.
    """
    __tablename__ = "user_subscriptions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Foreign Keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"), nullable=False)
    
    # Subscription Status
    status = Column(Enum(SubscriptionStatus, native_enum=False), default=SubscriptionStatus.ACTIVE)
    
    # Billing Period
    billing_cycle = Column(String(20), default="monthly")  # "monthly" or "yearly"
    start_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
    
    # Auto-renew
    auto_renew = Column(Boolean, default=True)
    
    # Payment Reference
    last_payment_id = Column(String(255))  # Midtrans order ID
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    cancelled_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="subscription")
    plan = relationship("SubscriptionPlan", back_populates="subscriptions")
