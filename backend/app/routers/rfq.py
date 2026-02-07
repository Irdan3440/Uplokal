"""
Uplokal Backend - RFQ & Matchmaking Routes
============================================
Request for Quotation management and B2B matching.
"""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.rfq import RFQ, RFQResponse, RFQStatus, RFQResponseStatus
from app.models.business import Business
from app.models.user import User
from app.middleware.auth import get_current_user
from app.middleware.sanitization import sanitize_dict
from app.services.encryption import encode_id, decode_id
from app.services.ai_stubs import match_b2b, generate_rfq_suggestions

router = APIRouter()


# =============================================================================
# SCHEMAS
# =============================================================================

class RFQCreateRequest(BaseModel):
    """Create RFQ request."""
    title: str = Field(..., min_length=5, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[str] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    currency: str = "USD"
    deadline: Optional[datetime] = None


class RFQResponse(BaseModel):
    """RFQ info response."""
    id: str
    title: str
    description: Optional[str]
    category: Optional[str]
    quantity: Optional[str]
    budget_range: Optional[str]
    status: str
    deadline: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class RFQListResponse(BaseModel):
    """List of RFQs."""
    rfqs: List[RFQResponse]
    total: int


class MatchResult(BaseModel):
    """B2B match result."""
    business_id: str
    name: str
    category: str
    location: str
    compatibility_score: int
    match_reasons: List[str]


# =============================================================================
# ROUTES
# =============================================================================

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_rfq(
    data: RFQCreateRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Create a new Request for Quotation."""
    # Get user's business
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile required"
        )
    
    clean_data = sanitize_dict(data.model_dump(exclude_unset=True))
    
    rfq = RFQ(
        business_id=business.id,
        title=clean_data.get("title"),
        description=clean_data.get("description"),
        category=clean_data.get("category"),
        quantity=clean_data.get("quantity"),
        budget_min=clean_data.get("budget_min"),
        budget_max=clean_data.get("budget_max"),
        currency=clean_data.get("currency", "USD"),
        deadline=clean_data.get("deadline"),
        status=RFQStatus.DRAFT
    )
    
    db.add(rfq)
    await db.commit()
    await db.refresh(rfq)
    
    budget_range = None
    if rfq.budget_min and rfq.budget_max:
        budget_range = f"${rfq.budget_min:,.0f} - ${rfq.budget_max:,.0f}"
    
    return {
        "id": encode_id(rfq.id),
        "title": rfq.title,
        "status": rfq.status.value,
        "message": "RFQ created successfully"
    }


@router.get("", response_model=RFQListResponse)
async def list_rfqs(
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = Query(None),
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0),
    db: AsyncSession = Depends(get_db)
):
    """List open RFQs (public)."""
    query = select(RFQ).where(RFQ.status == RFQStatus.OPEN)
    
    if category:
        query = query.where(RFQ.category == category)
    
    query = query.order_by(RFQ.created_at.desc()).offset(offset).limit(limit)
    
    result = await db.execute(query)
    rfqs = result.scalars().all()
    
    return RFQListResponse(
        rfqs=[
            RFQResponse(
                id=encode_id(r.id),
                title=r.title,
                description=r.description[:200] if r.description else None,
                category=r.category,
                quantity=r.quantity,
                budget_range=f"${r.budget_min:,.0f} - ${r.budget_max:,.0f}" if r.budget_min else None,
                status=r.status.value,
                deadline=r.deadline,
                created_at=r.created_at
            )
            for r in rfqs
        ],
        total=len(rfqs)
    )


@router.get("/my-rfqs", response_model=RFQListResponse)
async def list_my_rfqs(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """List current user's RFQs."""
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        return RFQListResponse(rfqs=[], total=0)
    
    result = await db.execute(
        select(RFQ).where(RFQ.business_id == business.id).order_by(RFQ.created_at.desc())
    )
    rfqs = result.scalars().all()
    
    return RFQListResponse(
        rfqs=[
            RFQResponse(
                id=encode_id(r.id),
                title=r.title,
                description=r.description,
                category=r.category,
                quantity=r.quantity,
                budget_range=f"${r.budget_min:,.0f} - ${r.budget_max:,.0f}" if r.budget_min else None,
                status=r.status.value,
                deadline=r.deadline,
                created_at=r.created_at
            )
            for r in rfqs
        ],
        total=len(rfqs)
    )


@router.get("/matches", response_model=List[MatchResult])
async def get_matches(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Get AI-powered B2B matches for current business."""
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile required"
        )
    
    # Get AI matches
    matches = await match_b2b({
        "id": business.id,
        "name": business.name,
        "category": business.category,
        "province": business.province
    })
    
    return [MatchResult(**m) for m in matches]


@router.get("/suggestions")
async def get_rfq_suggestions(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Get AI-suggested RFQs for current business."""
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile required"
        )
    
    suggestions = await generate_rfq_suggestions({
        "id": business.id,
        "name": business.name,
        "category": business.category
    })
    
    return {"suggestions": suggestions}
