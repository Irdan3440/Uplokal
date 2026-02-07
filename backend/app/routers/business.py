"""
Uplokal Backend - Business Profile Routes
==========================================
Business profile CRUD operations.
"""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.business import Business
from app.models.user import User
from app.middleware.auth import get_current_user
from app.middleware.sanitization import sanitize_string, sanitize_dict
from app.services.encryption import encode_id, decode_id

router = APIRouter()


# =============================================================================
# SCHEMAS
# =============================================================================

class BusinessCreateRequest(BaseModel):
    """Create business profile."""
    name: str = Field(..., min_length=2, max_length=255)
    tagline: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    business_type: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None


class BusinessUpdateRequest(BaseModel):
    """Update business profile."""
    name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    business_type: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    postal_code: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    established_year: Optional[int] = None
    employee_count: Optional[int] = None
    annual_revenue: Optional[str] = None


class BusinessResponse(BaseModel):
    """Business profile response."""
    id: str  # Obfuscated
    name: str
    tagline: Optional[str]
    description: Optional[str]
    category: Optional[str]
    province: Optional[str]
    city: Optional[str]
    health_score: int
    export_ready: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class BusinessListResponse(BaseModel):
    """List of businesses for directory."""
    businesses: List[BusinessResponse]
    total: int


# =============================================================================
# ROUTES
# =============================================================================

@router.post("", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
async def create_business(
    data: BusinessCreateRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Create a business profile for the current user.
    
    - One business per user
    - Sanitizes all input
    """
    # Check if user already has a business
    existing = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has a business profile"
        )
    
    # Sanitize input
    clean_data = sanitize_dict(data.model_dump(exclude_unset=True))
    
    # Create business
    business = Business(
        owner_id=user.id,
        **clean_data
    )
    
    db.add(business)
    await db.commit()
    await db.refresh(business)
    
    return BusinessResponse(
        id=encode_id(business.id),
        name=business.name,
        tagline=business.tagline,
        description=business.description,
        category=business.category,
        province=business.province,
        city=business.city,
        health_score=business.health_score,
        export_ready=business.export_ready,
        is_verified=business.is_verified,
        created_at=business.created_at
    )


@router.get("/me", response_model=BusinessResponse)
async def get_my_business(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Get current user's business profile."""
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile not found"
        )
    
    return BusinessResponse(
        id=encode_id(business.id),
        name=business.name,
        tagline=business.tagline,
        description=business.description,
        category=business.category,
        province=business.province,
        city=business.city,
        health_score=business.health_score,
        export_ready=business.export_ready,
        is_verified=business.is_verified,
        created_at=business.created_at
    )


@router.put("/me", response_model=BusinessResponse)
async def update_my_business(
    data: BusinessUpdateRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Update current user's business profile."""
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile not found"
        )
    
    # Sanitize and update
    clean_data = sanitize_dict(data.model_dump(exclude_unset=True))
    for key, value in clean_data.items():
        setattr(business, key, value)
    
    business.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(business)
    
    return BusinessResponse(
        id=encode_id(business.id),
        name=business.name,
        tagline=business.tagline,
        description=business.description,
        category=business.category,
        province=business.province,
        city=business.city,
        health_score=business.health_score,
        export_ready=business.export_ready,
        is_verified=business.is_verified,
        created_at=business.created_at
    )


@router.get("/directory", response_model=BusinessListResponse)
async def list_businesses(
    category: Optional[str] = Query(None),
    province: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    export_ready: Optional[bool] = Query(None),
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0),
    db: AsyncSession = Depends(get_db)
):
    """
    Public business directory listing.
    
    - Only shows verified businesses
    - Supports filtering and search
    - Returns obfuscated IDs
    """
    query = select(Business).where(Business.is_verified == True)
    
    if category:
        query = query.where(Business.category == sanitize_string(category))
    
    if province:
        query = query.where(Business.province == sanitize_string(province))
    
    if export_ready is not None:
        query = query.where(Business.export_ready == export_ready)
    
    if search:
        search_term = f"%{sanitize_string(search)}%"
        query = query.where(
            or_(
                Business.name.ilike(search_term),
                Business.description.ilike(search_term),
                Business.tagline.ilike(search_term)
            )
        )
    
    # Order by featured first, then health score
    query = query.order_by(
        Business.is_featured.desc(),
        Business.health_score.desc()
    ).offset(offset).limit(limit)
    
    result = await db.execute(query)
    businesses = result.scalars().all()
    
    # Count total
    count_query = select(Business).where(Business.is_verified == True)
    count_result = await db.execute(count_query)
    total = len(count_result.scalars().all())
    
    return BusinessListResponse(
        businesses=[
            BusinessResponse(
                id=encode_id(b.id),
                name=b.name,
                tagline=b.tagline,
                description=b.description[:200] if b.description else None,
                category=b.category,
                province=b.province,
                city=b.city,
                health_score=b.health_score,
                export_ready=b.export_ready,
                is_verified=b.is_verified,
                created_at=b.created_at
            )
            for b in businesses
        ],
        total=total
    )


@router.get("/{business_hash}", response_model=BusinessResponse)
async def get_business(
    business_hash: str,
    db: AsyncSession = Depends(get_db)
):
    """Get public business profile by ID."""
    business_id = decode_id(business_hash)
    if not business_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    
    business = await db.get(Business, business_id)
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business not found"
        )
    
    return BusinessResponse(
        id=encode_id(business.id),
        name=business.name,
        tagline=business.tagline,
        description=business.description,
        category=business.category,
        province=business.province,
        city=business.city,
        health_score=business.health_score,
        export_ready=business.export_ready,
        is_verified=business.is_verified,
        created_at=business.created_at
    )
