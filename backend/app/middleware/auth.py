"""
Uplokal Backend - Authentication Middleware
=============================================
JWT token verification and user injection for protected routes.
"""

from typing import Optional
from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.auth import decode_access_token, get_user_id_from_token
from app.models.user import User


# HTTP Bearer scheme for Authorization header
security = HTTPBearer(auto_error=False)


async def get_token_from_request(request: Request) -> Optional[str]:
    """
    Extract JWT token from request.
    
    Checks in order:
    1. HttpOnly cookie (preferred, more secure)
    2. Authorization header (for API clients)
    """
    # Try HttpOnly cookie first
    token = request.cookies.get("access_token")
    if token:
        return token
    
    # Try Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:]
    
    return None


async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Dependency to get the current authenticated user.
    
    Usage in routes:
        @router.get("/protected")
        async def protected_route(user: User = Depends(get_current_user)):
            ...
    """
    token = await get_token_from_request(request)
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Decode and validate token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Get user from database
    user_id = int(payload.get("sub"))
    user = await db.get(User, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    return user


async def get_current_user_optional(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """
    Optional authentication - returns None if not authenticated.
    
    Useful for routes that behave differently for logged-in users.
    """
    try:
        return await get_current_user(request, db)
    except HTTPException:
        return None


class AuthRequired:
    """
    Dependency class for requiring authentication.
    
    Can be used with additional checks like email verification.
    """
    
    def __init__(self, verified_only: bool = False):
        self.verified_only = verified_only
    
    async def __call__(
        self,
        request: Request,
        db: AsyncSession = Depends(get_db)
    ) -> User:
        user = await get_current_user(request, db)
        
        if self.verified_only and not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email verification required"
            )
        
        return user
