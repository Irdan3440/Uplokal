"""
Uplokal Backend - Midtrans Payment Service
============================================
Integration with Midtrans payment gateway.
"""

import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import midtransclient

from app.config import get_settings

settings = get_settings()


def _get_snap_client():
    """Get Midtrans Snap client."""
    return midtransclient.Snap(
        is_production=settings.midtrans_is_production,
        server_key=settings.midtrans_server_key,
        client_key=settings.midtrans_client_key
    )


def _get_core_client():
    """Get Midtrans Core API client."""
    return midtransclient.CoreApi(
        is_production=settings.midtrans_is_production,
        server_key=settings.midtrans_server_key,
        client_key=settings.midtrans_client_key
    )


def generate_order_id() -> str:
    """Generate unique order ID for Midtrans."""
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex[:8].upper()
    return f"UPL-{timestamp}-{unique_id}"


async def create_subscription_transaction(
    user_id: int,
    user_email: str,
    user_name: str,
    plan_name: str,
    amount: int,
    billing_cycle: str = "monthly"
) -> Dict[str, Any]:
    """
    Create a Midtrans Snap transaction for subscription payment.
    
    Args:
        user_id: User's database ID
        user_email: User's email
        user_name: User's full name
        plan_name: Subscription plan name (e.g., "Pro")
        amount: Amount in IDR (e.g., 299000)
        billing_cycle: "monthly" or "yearly"
    
    Returns:
        Dict with token, redirect_url, and order_id
    """
    snap = _get_snap_client()
    order_id = generate_order_id()
    
    transaction_params = {
        "transaction_details": {
            "order_id": order_id,
            "gross_amount": amount
        },
        "item_details": [{
            "id": f"subscription-{plan_name.lower()}",
            "price": amount,
            "quantity": 1,
            "name": f"Uplokal {plan_name} - {billing_cycle.capitalize()}"
        }],
        "customer_details": {
            "first_name": user_name.split()[0] if user_name else "User",
            "last_name": " ".join(user_name.split()[1:]) if user_name and len(user_name.split()) > 1 else "",
            "email": user_email
        },
        "callbacks": {
            "finish": f"{settings.cors_origins.split(',')[0]}/subscription/success",
            "error": f"{settings.cors_origins.split(',')[0]}/subscription/error",
            "pending": f"{settings.cors_origins.split(',')[0]}/subscription/pending"
        },
        "expiry": {
            "unit": "hours",
            "duration": 24
        },
        "custom_field1": str(user_id),
        "custom_field2": plan_name,
        "custom_field3": billing_cycle
    }
    
    try:
        snap_response = snap.create_transaction(transaction_params)
        return {
            "success": True,
            "token": snap_response.get("token"),
            "redirect_url": snap_response.get("redirect_url"),
            "order_id": order_id
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "order_id": order_id
        }


def verify_signature(
    order_id: str,
    status_code: str,
    gross_amount: str,
    signature_key: str
) -> bool:
    """
    Verify Midtrans webhook signature.
    
    Signature = SHA512(order_id + status_code + gross_amount + server_key)
    """
    import hashlib
    
    raw_signature = f"{order_id}{status_code}{gross_amount}{settings.midtrans_server_key}"
    calculated_signature = hashlib.sha512(raw_signature.encode()).hexdigest()
    
    return calculated_signature == signature_key


async def get_transaction_status(order_id: str) -> Dict[str, Any]:
    """
    Get transaction status from Midtrans.
    
    Returns transaction status details.
    """
    core = _get_core_client()
    
    try:
        status = core.transactions.status(order_id)
        return {
            "success": True,
            "status": status
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def parse_webhook_notification(notification: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse Midtrans webhook notification.
    
    Returns standardized payment status and details.
    """
    transaction_status = notification.get("transaction_status")
    fraud_status = notification.get("fraud_status", "accept")
    
    # Determine final status
    if transaction_status == "capture":
        if fraud_status == "accept":
            status = "success"
        else:
            status = "pending"
    elif transaction_status == "settlement":
        status = "success"
    elif transaction_status in ["cancel", "deny"]:
        status = "failed"
    elif transaction_status == "expire":
        status = "expired"
    elif transaction_status == "pending":
        status = "pending"
    elif transaction_status == "refund":
        status = "refunded"
    else:
        status = "pending"
    
    return {
        "order_id": notification.get("order_id"),
        "transaction_id": notification.get("transaction_id"),
        "status": status,
        "transaction_status": transaction_status,
        "fraud_status": fraud_status,
        "payment_metadata": notification, # Added this line as per instruction
        "payment_type": notification.get("payment_type"),
        "gross_amount": notification.get("gross_amount"),
        "bank": notification.get("bank"),
        "va_number": notification.get("va_numbers", [{}])[0].get("va_number") if notification.get("va_numbers") else None,
        "signature_key": notification.get("signature_key"),
        "user_id": notification.get("custom_field1"),
        "plan_name": notification.get("custom_field2"),
        "billing_cycle": notification.get("custom_field3")
    }


def get_client_key() -> str:
    """Get Midtrans client key for frontend."""
    return settings.midtrans_client_key


def is_production() -> bool:
    """Check if Midtrans is in production mode."""
    return settings.midtrans_is_production
