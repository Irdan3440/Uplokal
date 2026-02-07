"""
Uplokal Backend - Subscription Routes
======================================
Subscription plans and user subscription management.
"""

from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.models.subscription import (
    SubscriptionPlan, 
    UserSubscription, 
    SubscriptionTier, 
    SubscriptionStatus
)
from app.middleware.auth import get_current_user
from app.services.encryption import encode_id

router = APIRouter()


# =============================================================================
# SCHEMAS
# =============================================================================

class PlanResponse(BaseModel):
    """Subscription plan response."""
    id: str
    name: str
    tier: str
    description: str | None
    price_monthly: int
    price_yearly: int
    currency: str
    features: list
    max_documents: int
    ai_diagnostic: bool
    ai_assistant: bool
    b2b_matchmaking: bool
    priority_support: bool
    is_popular: bool


class UserSubscriptionResponse(BaseModel):
    """User subscription response."""
    plan: PlanResponse
    status: str
    billing_cycle: str
    start_date: datetime
    end_date: datetime
    auto_renew: bool


class SubscribeRequest(BaseModel):
    """Subscribe to a plan request."""
    plan_tier: str  # "starter", "pro", "enterprise"
    billing_cycle: str = "monthly"  # "monthly" or "yearly"


# =============================================================================
# ROUTES
# =============================================================================

@router.get("/plans", response_model=List[PlanResponse])
async def get_subscription_plans(
    db: AsyncSession = Depends(get_db)
):
    """
    Get all available subscription plans.
    
    Public endpoint - no authentication required.
    """
    result = await db.execute(
        select(SubscriptionPlan)
        .where(SubscriptionPlan.is_active == True)
        .order_by(SubscriptionPlan.display_order)
    )
    plans = result.scalars().all()
    
    return [
        PlanResponse(
            id=encode_id(p.id),
            name=p.name,
            tier=p.tier.value,
            description=p.description,
            price_monthly=p.price_monthly,
            price_yearly=p.price_yearly,
            currency=p.currency,
            features=p.features or [],
            max_documents=p.max_documents,
            ai_diagnostic=p.ai_diagnostic,
            ai_assistant=p.ai_assistant,
            b2b_matchmaking=p.b2b_matchmaking,
            priority_support=p.priority_support,
            is_popular=p.is_popular
        )
        for p in plans
    ]


@router.get("/my-subscription", response_model=UserSubscriptionResponse | None)
async def get_my_subscription(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Get current user's subscription."""
    result = await db.execute(
        select(UserSubscription)
        .where(UserSubscription.user_id == user.id)
        .where(UserSubscription.status == SubscriptionStatus.ACTIVE)
    )
    subscription = result.scalar_one_or_none()
    
    if not subscription:
        return None
    
    plan = await db.get(SubscriptionPlan, subscription.plan_id)
    
    return UserSubscriptionResponse(
        plan=PlanResponse(
            id=encode_id(plan.id),
            name=plan.name,
            tier=plan.tier.value,
            description=plan.description,
            price_monthly=plan.price_monthly,
            price_yearly=plan.price_yearly,
            currency=plan.currency,
            features=plan.features or [],
            max_documents=plan.max_documents,
            ai_diagnostic=plan.ai_diagnostic,
            ai_assistant=plan.ai_assistant,
            b2b_matchmaking=plan.b2b_matchmaking,
            priority_support=plan.priority_support,
            is_popular=plan.is_popular
        ),
        status=subscription.status.value,
        billing_cycle=subscription.billing_cycle,
        start_date=subscription.start_date,
        end_date=subscription.end_date,
        auto_renew=subscription.auto_renew
    )


@router.post("/subscribe")
async def subscribe_to_plan(
    data: SubscribeRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Subscribe to a plan - creates Midtrans payment.
    
    Returns Midtrans Snap token for payment popup.
    """
    from app.services.payment import create_subscription_transaction
    from app.config import get_settings
    
    settings = get_settings()
    
    # Get plan
    try:
        tier = SubscriptionTier(data.plan_tier)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan tier"
        )
    
    result = await db.execute(
        select(SubscriptionPlan).where(SubscriptionPlan.tier == tier)
    )
    plan = result.scalar_one_or_none()
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plan not found"
        )
    
    # Free plan - just create subscription
    if tier == SubscriptionTier.FREE:
        # Cancel existing subscription if any
        existing = await db.execute(
            select(UserSubscription).where(UserSubscription.user_id == user.id)
        )
        existing_sub = existing.scalar_one_or_none()
        if existing_sub:
            existing_sub.status = SubscriptionStatus.CANCELLED
            existing_sub.cancelled_at = datetime.utcnow()
        
        # Create free subscription
        subscription = UserSubscription(
            user_id=user.id,
            plan_id=plan.id,
            status=SubscriptionStatus.ACTIVE,
            billing_cycle="monthly",
            start_date=datetime.utcnow(),
            end_date=datetime.utcnow() + timedelta(days=36500),  # 100 years
            auto_renew=False
        )
        db.add(subscription)
        await db.commit()
        
        return {
            "success": True,
            "message": "Subscribed to free plan",
            "requires_payment": False
        }
    
    # Paid plan - create Midtrans transaction
    if not settings.midtrans_enabled:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment gateway not configured"
        )
    
    # Determine amount
    amount = plan.price_yearly if data.billing_cycle == "yearly" else plan.price_monthly
    
    # Create Midtrans transaction
    payment_result = await create_subscription_transaction(
        user_id=user.id,
        user_email=user.email,
        user_name=user.full_name or "User",
        plan_name=plan.name,
        amount=amount,
        billing_cycle=data.billing_cycle
    )
    
    if not payment_result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment creation failed: {payment_result.get('error')}"
        )
    
    return {
        "success": True,
        "requires_payment": True,
        "snap_token": payment_result["token"],
        "redirect_url": payment_result["redirect_url"],
        "order_id": payment_result["order_id"],
        "amount": amount,
        "plan_name": plan.name
    }


@router.post("/cancel")
async def cancel_subscription(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Cancel current subscription (will expire at end of period)."""
    result = await db.execute(
        select(UserSubscription)
        .where(UserSubscription.user_id == user.id)
        .where(UserSubscription.status == SubscriptionStatus.ACTIVE)
    )
    subscription = result.scalar_one_or_none()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active subscription found"
        )
    
    subscription.auto_renew = False
    subscription.cancelled_at = datetime.utcnow()
    await db.commit()
    
    return {
        "success": True,
        "message": "Subscription cancelled. Access continues until end of current period.",
        "expires_at": subscription.end_date
    }
