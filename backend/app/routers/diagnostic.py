"""
Uplokal Backend - Diagnostic Routes
=====================================
Business diagnostic questionnaire and AI analysis.
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.business import Business
from app.models.user import User
from app.middleware.auth import get_current_user
from app.services.ai_stubs import analyze_diagnostic

router = APIRouter()


# =============================================================================
# SCHEMAS
# =============================================================================

class DiagnosticSubmission(BaseModel):
    """Questionnaire submission."""
    answers: Dict[str, Any]


class DiagnosticResult(BaseModel):
    """AI analysis result."""
    health_score: int
    scores: Dict[str, int]
    status: str
    recommendations: List[Dict[str, Any]]
    export_readiness: Dict[str, Any]


# =============================================================================
# ROUTES
# =============================================================================

@router.post("/submit", response_model=DiagnosticResult)
async def submit_diagnostic(
    data: DiagnosticSubmission,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Submit diagnostic questionnaire for AI analysis.
    
    - Stores answers in business profile
    - Returns AI-generated scores and recommendations
    """
    # Get user's business
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile required. Please create one first."
        )
    
    # Run AI analysis
    analysis = await analyze_diagnostic(data.answers)
    
    # Update business with scores
    business.diagnostic_data = data.answers
    business.health_score = analysis["health_score"]
    business.marketing_score = analysis["scores"].get("marketing", 0)
    business.finance_score = analysis["scores"].get("finance", 0)
    business.legal_score = analysis["scores"].get("legal", 0)
    
    await db.commit()
    
    return DiagnosticResult(
        health_score=analysis["health_score"],
        scores=analysis["scores"],
        status=analysis["status"],
        recommendations=analysis["recommendations"],
        export_readiness=analysis["export_readiness"]
    )


@router.get("/result", response_model=DiagnosticResult)
async def get_diagnostic_result(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Get latest diagnostic result for current user.
    """
    result = await db.execute(
        select(Business).where(Business.owner_id == user.id)
    )
    business = result.scalar_one_or_none()
    
    if not business:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business profile not found"
        )
    
    if not business.diagnostic_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No diagnostic data. Please complete the questionnaire."
        )
    
    # Re-run analysis to get full result
    analysis = await analyze_diagnostic(business.diagnostic_data)
    
    return DiagnosticResult(
        health_score=business.health_score,
        scores={
            "marketing": business.marketing_score,
            "finance": business.finance_score,
            "legal": business.legal_score,
            "operations": analysis["scores"].get("operations", 75)
        },
        status=analysis["status"],
        recommendations=analysis["recommendations"],
        export_readiness=analysis["export_readiness"]
    )
