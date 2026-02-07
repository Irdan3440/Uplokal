"""
Uplokal Backend - Admin Routes
===============================
Protected admin routes with RBAC.
"""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, UserRole
from app.models.business import Business
from app.models.document import Document
from app.models.rfq import RFQ
from app.middleware.auth import get_current_user
from app.middleware.rbac import RequireRole, require_admin, require_super_admin
from app.services.encryption import encode_id

router = APIRouter()


# =============================================================================
# SCHEMAS
# =============================================================================

class AdminUserResponse(BaseModel):
    """User info for admin."""
    id: str
    email: str
    full_name: Optional[str]
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime]


class AdminStatsResponse(BaseModel):
    """Admin dashboard stats."""
    total_users: int
    total_businesses: int
    verified_businesses: int
    total_documents: int
    total_rfqs: int
    open_rfqs: int


class BusinessVerificationRequest(BaseModel):
    """Request to verify/unverify business."""
    verified: bool


# =============================================================================
# ROUTES
# =============================================================================

@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Get admin dashboard statistics.
    
    Requires: admin or super_admin role
    """
    # Count users
    users_result = await db.execute(select(func.count(User.id)))
    total_users = users_result.scalar() or 0
    
    # Count businesses
    businesses_result = await db.execute(select(func.count(Business.id)))
    total_businesses = businesses_result.scalar() or 0
    
    verified_result = await db.execute(
        select(func.count(Business.id)).where(Business.is_verified == True)
    )
    verified_businesses = verified_result.scalar() or 0
    
    # Count documents
    docs_result = await db.execute(select(func.count(Document.id)))
    total_documents = docs_result.scalar() or 0
    
    # Count RFQs
    rfqs_result = await db.execute(select(func.count(RFQ.id)))
    total_rfqs = rfqs_result.scalar() or 0
    
    open_rfqs_result = await db.execute(
        select(func.count(RFQ.id)).where(RFQ.status == "open")
    )
    open_rfqs = open_rfqs_result.scalar() or 0
    
    return AdminStatsResponse(
        total_users=total_users,
        total_businesses=total_businesses,
        verified_businesses=verified_businesses,
        total_documents=total_documents,
        total_rfqs=total_rfqs,
        open_rfqs=open_rfqs
    )


@router.get("/users", response_model=List[AdminUserResponse])
async def list_users(
    role: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    limit: int = Query(default=50, le=200),
    offset: int = Query(default=0),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    List all users.
    
    Requires: admin or super_admin role
    """
    query = select(User)
    
    if role:
        try:
            role_enum = UserRole(role)
            query = query.where(User.role == role_enum)
        except ValueError:
            pass
    
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    
    query = query.order_by(User.created_at.desc()).offset(offset).limit(limit)
    
    result = await db.execute(query)
    users = result.scalars().all()
    
    return [
        AdminUserResponse(
            id=encode_id(u.id),
            email=u.email,
            full_name=u.full_name,
            role=u.role.value,
            is_active=u.is_active,
            is_verified=u.is_verified,
            created_at=u.created_at,
            last_login=u.last_login
        )
        for u in users
    ]


@router.patch("/users/{user_hash}/deactivate")
async def deactivate_user(
    user_hash: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Deactivate a user account.
    
    Requires: admin or super_admin role
    """
    from app.services.encryption import decode_id
    
    user_id = decode_id(user_hash)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deactivating admins unless super admin
    if user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        if admin.role != UserRole.SUPER_ADMIN:
            raise HTTPException(
                status_code=403,
                detail="Only super admin can deactivate admin accounts"
            )
    
    user.is_active = False
    await db.commit()
    
    return {"message": "User deactivated successfully"}


@router.patch("/businesses/{business_hash}/verify")
async def verify_business(
    business_hash: str,
    data: BusinessVerificationRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin)
):
    """
    Verify or unverify a business.
    
    Requires: admin or super_admin role
    """
    from app.services.encryption import decode_id
    
    business_id = decode_id(business_hash)
    if not business_id:
        raise HTTPException(status_code=404, detail="Business not found")
    
    business = await db.get(Business, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    business.is_verified = data.verified
    business.updated_at = datetime.utcnow()
    await db.commit()
    
    status_msg = "verified" if data.verified else "unverified"
    return {"message": f"Business {status_msg} successfully"}


@router.get("/logs")
async def get_system_logs(
    limit: int = Query(default=100, le=500),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    """
    Get system logs.
    
    Requires: super_admin role only
    """
    # In production, this would read from a logging system
    # For now, return mock data
    return {
        "logs": [
            {
                "timestamp": datetime.utcnow().isoformat(),
                "level": "INFO",
                "message": "System logs endpoint accessed",
                "user_id": encode_id(admin.id)
            }
        ],
        "total": 1
    }


@router.post("/users/{user_hash}/promote")
async def promote_user_to_admin(
    user_hash: str,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_super_admin)
):
    """
    Promote a user to admin role.
    
    Requires: super_admin role only
    """
    from app.services.encryption import decode_id
    
    user_id = decode_id(user_hash)
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=400, detail="Cannot modify super admin")
    
    user.role = UserRole.ADMIN
    await db.commit()
    
    return {"message": f"User {user.email} promoted to admin"}
