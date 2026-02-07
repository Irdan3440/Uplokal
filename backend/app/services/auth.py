"""
Uplokal Backend - Authentication Service
==========================================
JWT token management and password hashing.
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.config import get_settings

settings = get_settings()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# =============================================================================
# PASSWORD HASHING
# =============================================================================

def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    
    Use this when:
    - Creating new user accounts
    - Changing passwords
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    Use this during login to validate credentials.
    """
    return pwd_context.verify(plain_password, hashed_password)


# =============================================================================
# JWT TOKEN MANAGEMENT
# =============================================================================

def create_access_token(
    user_id: int,
    role: str,
    additional_claims: Optional[Dict[str, Any]] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a JWT access token for authenticated users.
    
    Args:
        user_id: The user's database ID
        role: User role (user, admin, super_admin)
        additional_claims: Extra data to include in the token
        expires_delta: Custom expiration time
    
    Returns:
        Encoded JWT token string
    """
    # Calculate expiration
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.jwt_expiry_minutes)
    
    # Build token payload
    payload = {
        "sub": str(user_id),  # Subject (user ID)
        "role": role,
        "exp": expire,
        "iat": datetime.utcnow(),  # Issued at
        "type": "access"
    }
    
    # Add any additional claims
    if additional_claims:
        payload.update(additional_claims)
    
    # Encode and return
    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm
    )


def create_refresh_token(user_id: int) -> str:
    """
    Create a refresh token for obtaining new access tokens.
    
    Refresh tokens have a longer expiration (7 days).
    """
    expire = datetime.utcnow() + timedelta(days=7)
    
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    }
    
    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm
    )


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a JWT access token.
    
    Returns:
        Token payload dict if valid, None if invalid/expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm]
        )
        
        # Verify token type
        if payload.get("type") != "access":
            return None
        
        return payload
    except JWTError:
        return None


def decode_refresh_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a JWT refresh token.
    
    Returns:
        Token payload dict if valid, None if invalid/expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm]
        )
        
        # Verify token type
        if payload.get("type") != "refresh":
            return None
        
        return payload
    except JWTError:
        return None


def get_user_id_from_token(token: str) -> Optional[int]:
    """
    Extract user ID from a valid access token.
    
    Returns None if token is invalid.
    """
    payload = decode_access_token(token)
    if payload and "sub" in payload:
        try:
            return int(payload["sub"])
        except ValueError:
            return None
    return None


def get_role_from_token(token: str) -> Optional[str]:
    """
    Extract user role from a valid access token.
    
    Returns None if token is invalid.
    """
    payload = decode_access_token(token)
    return payload.get("role") if payload else None
