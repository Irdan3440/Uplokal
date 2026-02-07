"""
Uplokal Backend - Authentication Routes
=========================================
User registration, login, logout, and token refresh.
"""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, UserRole
from app.services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_refresh_token
)
from app.middleware.auth import get_current_user, get_token_from_request
from app.middleware.sanitization import sanitize_string

router = APIRouter()


# =============================================================================
# SCHEMAS
# =============================================================================

class RegisterRequest(BaseModel):
    """User registration request."""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2, max_length=255)
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    """User login request."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response (for API clients)."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    """User profile response."""
    id: int
    email: str
    full_name: Optional[str]
    role: str
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    """Simple message response."""
    message: str
    success: bool = True


# =============================================================================
# ROUTES
# =============================================================================

@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account.
    
    - Validates email uniqueness
    - Hashes password with bcrypt
    - Creates user with 'user' role
    """
    # Sanitize inputs
    email = sanitize_string(data.email).lower()
    full_name = sanitize_string(data.full_name)
    
    # Check if email already exists
    existing = await db.execute(
        select(User).where(User.email == email)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=email,
        password_hash=hash_password(data.password),
        full_name=full_name,
        phone=sanitize_string(data.phone) if data.phone else None,
        role=UserRole.USER
    )
    
    db.add(user)
    await db.commit()
    
    return MessageResponse(message="Registration successful. Please login.")


@router.post("/login")
async def login(
    data: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user and issue JWT token in HttpOnly cookie.
    
    - Validates credentials
    - Returns JWT in secure HttpOnly cookie
    - Updates last_login timestamp
    """
    email = sanitize_string(data.email).lower()
    
    # Find user
    result = await db.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    # Generate tokens
    access_token = create_access_token(user.id, user.role.value)
    refresh_token = create_refresh_token(user.id)
    
    # Set HttpOnly cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=3600  # 1 hour
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=604800  # 7 days
    )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    return {
        "message": "Login successful",
        "success": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value
        }
    }


@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response):
    """
    Logout user by clearing auth cookies.
    """
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    
    return MessageResponse(message="Logged out successfully")


@router.post("/refresh")
async def refresh_token(
    request_data: dict,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token using refresh token.
    """
    from fastapi import Request
    # Get refresh token from cookie
    # This would normally come from the request object
    
    # For now, return error - needs proper implementation with Request object
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh via cookie - use login endpoint"
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    user: User = Depends(get_current_user)
):
    """
    Get current authenticated user's profile.
    """
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role.value,
        is_verified=user.is_verified,
        created_at=user.created_at
    )


@router.post("/admin-login")
async def admin_login(
    data: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """
    Admin-specific login endpoint.
    
    - Only allows admin and super_admin roles
    - Returns JWT in HttpOnly cookie
    """
    email = sanitize_string(data.email).lower()
    
    # Find user
    result = await db.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Check admin role
    if user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    # Generate token
    access_token = create_access_token(user.id, user.role.value)
    
    # Set HttpOnly cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=3600
    )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    return {
        "message": "Admin authentication successful",
        "success": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value
        }
    }


# =============================================================================
# GOOGLE OAUTH
# =============================================================================

class GoogleAuthRequest(BaseModel):
    """Google OAuth request."""
    id_token: str


@router.post("/google")
async def google_auth(
    data: GoogleAuthRequest,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate or register user via Google OAuth.
    
    - Verifies Google ID token
    - Creates new user if not exists
    - Issues JWT in HttpOnly cookie
    """
    from app.services.oauth import verify_google_token
    from app.models.user import OAuthProvider
    from app.config import get_settings
    
    settings = get_settings()
    
    if not settings.google_oauth_enabled:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth not configured"
        )
    
    # Verify Google token
    google_user = await verify_google_token(data.id_token)
    
    if not google_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    
    if not google_user.get("email_verified"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google email not verified"
        )
    
    email = google_user["email"].lower()
    
    # Find existing user by email
    result = await db.execute(
        select(User).where(User.email == email)
    )
    user = result.scalar_one_or_none()
    
    if user:
        # Update OAuth info if not set
        if not user.oauth_provider:
            user.oauth_provider = OAuthProvider.GOOGLE
            user.oauth_id = google_user["google_id"]
        if not user.avatar_url and google_user.get("picture"):
            user.avatar_url = google_user["picture"]
    else:
        # Create new user from Google data
        user = User(
            email=email,
            password_hash=None,  # OAuth users don't have password
            full_name=google_user.get("name"),
            avatar_url=google_user.get("picture"),
            oauth_provider=OAuthProvider.GOOGLE,
            oauth_id=google_user["google_id"],
            is_verified=True,  # Google verified email
            role=UserRole.USER
        )
        db.add(user)
        await db.flush()
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    # Generate tokens
    access_token = create_access_token(user.id, user.role.value)
    refresh_token = create_refresh_token(user.id)
    
    # Set HttpOnly cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=3600
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=604800
    )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    return {
        "message": "Google authentication successful",
        "success": True,
        "is_new_user": user.created_at == user.last_login,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value,
            "avatar_url": user.avatar_url
        }
    }
