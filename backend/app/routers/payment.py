"""
Uplokal Backend - Payment Routes
=================================
Midtrans payment and webhook handling.
"""

from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Request, status
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
from app.models.payment import PaymentTransaction, PaymentStatus, PaymentMethod
from app.middleware.auth import get_current_user
from app.services.payment import (
    verify_signature,
    parse_webhook_notification,
    get_client_key,
    is_production
)
from app.services.encryption import encode_id

router = APIRouter()


# =============================================================================
# SCHEMAS
# =============================================================================

class PaymentConfigResponse(BaseModel):
    """Midtrans configuration for frontend."""
    client_key: str
    is_production: bool


class PaymentHistoryResponse(BaseModel):
    """Payment transaction history."""
    order_id: str
    amount: int
    status: str
    payment_method: str | None
    description: str | None
    created_at: datetime
    paid_at: datetime | None


# =============================================================================
# ROUTES
# =============================================================================

@router.get("/config", response_model=PaymentConfigResponse)
async def get_payment_config():
    """
    Get Midtrans configuration for frontend Snap integration.
    
    Public endpoint - returns client key only.
    """
    from app.config import get_settings
    settings = get_settings()
    
    if not settings.midtrans_enabled:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment gateway not configured"
        )
    
    return PaymentConfigResponse(
        client_key=get_client_key(),
        is_production=is_production()
    )


@router.post("/webhook")
async def midtrans_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Handle Midtrans webhook notifications.
    
    This endpoint is called by Midtrans when payment status changes.
    Must be publicly accessible and respond with 200 OK.
    """
    try:
        notification = await request.json()
    except Exception:
        return {"status": "error", "message": "Invalid JSON"}
    
    # Parse notification
    parsed = parse_webhook_notification(notification)
    
    # Verify signature
    if not verify_signature(
        parsed["order_id"],
        notification.get("status_code", ""),
        parsed["gross_amount"],
        parsed["signature_key"]
    ):
        return {"status": "error", "message": "Invalid signature"}
    
    # Find or create payment transaction
    result = await db.execute(
        select(PaymentTransaction).where(
            PaymentTransaction.order_id == parsed["order_id"]
        )
    )
    transaction = result.scalar_one_or_none()
    
    if not transaction and parsed.get("user_id"):
        # Create new transaction record
        transaction = PaymentTransaction(
            user_id=int(parsed["user_id"]),
            order_id=parsed["order_id"],
            transaction_id=parsed["transaction_id"],
            amount=int(float(parsed["gross_amount"])),
            status=PaymentStatus.PENDING,
            description=f"Subscription - {parsed.get('plan_name', 'Unknown')}"
        )
        db.add(transaction)
    
    if transaction:
        # Update transaction status
        status_map = {
            "success": PaymentStatus.SUCCESS,
            "pending": PaymentStatus.PENDING,
            "failed": PaymentStatus.FAILED,
            "expired": PaymentStatus.EXPIRED,
            "refunded": PaymentStatus.REFUNDED
        }
        transaction.status = status_map.get(parsed["status"], PaymentStatus.PENDING)
        transaction.transaction_id = parsed["transaction_id"]
        transaction.payment_type = parsed["payment_type"]
        transaction.bank = parsed["bank"]
        transaction.va_number = parsed["va_number"]
        transaction.metadata = notification
        
        if parsed["status"] == "success":
            transaction.paid_at = datetime.utcnow()
            
            # Activate subscription
            if parsed.get("user_id") and parsed.get("plan_name"):
                await _activate_subscription(
                    db,
                    user_id=int(parsed["user_id"]),
                    plan_name=parsed["plan_name"],
                    billing_cycle=parsed.get("billing_cycle", "monthly"),
                    order_id=parsed["order_id"]
                )
    
    await db.commit()
    
    return {"status": "ok"}


async def _activate_subscription(
    db: AsyncSession,
    user_id: int,
    plan_name: str,
    billing_cycle: str,
    order_id: str
):
    """Helper to activate user subscription after successful payment."""
    # Find plan by name
    result = await db.execute(
        select(SubscriptionPlan).where(SubscriptionPlan.name == plan_name)
    )
    plan = result.scalar_one_or_none()
    
    if not plan:
        return
    
    # Cancel existing subscription
    existing = await db.execute(
        select(UserSubscription).where(UserSubscription.user_id == user_id)
    )
    existing_sub = existing.scalar_one_or_none()
    
    if existing_sub:
        existing_sub.status = SubscriptionStatus.EXPIRED
        existing_sub.cancelled_at = datetime.utcnow()
    
    # Create new subscription
    duration = timedelta(days=365) if billing_cycle == "yearly" else timedelta(days=30)
    
    subscription = UserSubscription(
        user_id=user_id,
        plan_id=plan.id,
        status=SubscriptionStatus.ACTIVE,
        billing_cycle=billing_cycle,
        start_date=datetime.utcnow(),
        end_date=datetime.utcnow() + duration,
        auto_renew=True,
        last_payment_id=order_id
    )
    db.add(subscription)


@router.get("/history")
async def get_payment_history(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Get user's payment history."""
    result = await db.execute(
        select(PaymentTransaction)
        .where(PaymentTransaction.user_id == user.id)
        .order_by(PaymentTransaction.created_at.desc())
        .limit(50)
    )
    transactions = result.scalars().all()
    
    return [
        PaymentHistoryResponse(
            order_id=t.order_id,
            amount=t.amount,
            status=t.status.value,
            payment_method=t.payment_type,
            description=t.description,
            created_at=t.created_at,
            paid_at=t.paid_at
        )
        for t in transactions
    ]
