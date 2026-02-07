"""
Uplokal Backend - Business Model
=================================
UMKM business profile with diagnostic data.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Business(Base):
    """Business profile model for UMKM."""
    
    __tablename__ = "businesses"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Basic info
    name = Column(String(255), nullable=False, index=True)
    tagline = Column(String(500))
    description = Column(Text)
    logo_url = Column(String(500))
    
    # Classification
    category = Column(String(100), index=True)
    subcategory = Column(String(100))
    business_type = Column(String(50))  # manufacturer, supplier, exporter, etc.
    
    # Location
    province = Column(String(100), index=True)
    city = Column(String(100))
    address = Column(Text)
    postal_code = Column(String(10))
    
    # Contact
    website = Column(String(255))
    email = Column(String(255))
    phone = Column(String(20))
    whatsapp = Column(String(20))
    
    # Business metrics
    established_year = Column(Integer)
    employee_count = Column(Integer)
    annual_revenue = Column(String(50))  # Range string for privacy
    
    # Diagnostic scores (0-100)
    health_score = Column(Integer, default=0)
    marketing_score = Column(Integer, default=0)
    finance_score = Column(Integer, default=0)
    legal_score = Column(Integer, default=0)
    
    # Export readiness
    export_ready = Column(Boolean, default=False)
    export_countries = Column(JSON)  # List of target countries
    certifications = Column(JSON)  # List of certifications
    
    # AI diagnostic data (raw questionnaire answers)
    diagnostic_data = Column(JSON)
    
    # Status
    is_verified = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="business")
    documents = relationship("Document", back_populates="business")
    rfqs = relationship("RFQ", back_populates="business")
    rfq_responses = relationship("RFQResponse", back_populates="responder")
    
    def __repr__(self):
        return f"<Business(id={self.id}, name={self.name})>"
