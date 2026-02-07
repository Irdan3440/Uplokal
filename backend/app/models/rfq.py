"""
Uplokal Backend - RFQ Model
============================
Request for Quotation for B2B Matchmaking.
"""

from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Enum, Numeric
from sqlalchemy.orm import relationship
from app.database import Base


class RFQStatus(str, PyEnum):
    """RFQ status enumeration."""
    DRAFT = "draft"
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class RFQResponseStatus(str, PyEnum):
    """RFQ response status enumeration."""
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    NEGOTIATING = "negotiating"


class RFQ(Base):
    """Request for Quotation model."""
    
    __tablename__ = "rfqs"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    
    # RFQ details
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100), index=True)
    
    # Requirements
    quantity = Column(String(100))
    unit = Column(String(50))
    specifications = Column(JSON)  # Detailed specs as JSON
    
    # Budget
    budget_min = Column(Numeric(15, 2))
    budget_max = Column(Numeric(15, 2))
    currency = Column(String(3), default="USD")
    
    # Timeline
    deadline = Column(DateTime)
    delivery_date = Column(DateTime)
    
    # Location preferences
    origin_countries = Column(JSON)  # Preferred supplier countries
    delivery_location = Column(String(255))
    
    # Status
    status = Column(Enum(RFQStatus), default=RFQStatus.DRAFT, index=True)
    view_count = Column(Integer, default=0)
    response_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="rfqs")
    responses = relationship("RFQResponse", back_populates="rfq")
    
    def __repr__(self):
        return f"<RFQ(id={self.id}, title={self.title})>"


class RFQResponse(Base):
    """Response to an RFQ from a supplier."""
    
    __tablename__ = "rfq_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    rfq_id = Column(Integer, ForeignKey("rfqs.id"), nullable=False)
    responder_id = Column(Integer, ForeignKey("businesses.id"), nullable=False)
    
    # Quote details
    proposed_price = Column(Numeric(15, 2))
    currency = Column(String(3), default="USD")
    lead_time_days = Column(Integer)
    
    # Response content
    message = Column(Text)
    attachments = Column(JSON)  # List of document IDs
    
    # Status
    status = Column(Enum(RFQResponseStatus), default=RFQResponseStatus.PENDING)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    rfq = relationship("RFQ", back_populates="responses")
    responder = relationship("Business", back_populates="rfq_responses")
    
    def __repr__(self):
        return f"<RFQResponse(id={self.id}, rfq_id={self.rfq_id})>"
