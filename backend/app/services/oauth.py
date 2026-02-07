"""
Uplokal Backend - Google OAuth Service
========================================
Google OAuth token verification.
"""

from typing import Dict, Any, Optional
import httpx
from google.oauth2 import id_token
from google.auth.transport import requests

from app.config import get_settings

settings = get_settings()


async def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify Google OAuth ID token and extract user info.
    
    Args:
        token: Google ID token from frontend
        
    Returns:
        User info dict with email, name, picture, or None if invalid
    """
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            settings.google_client_id
        )
        
        # Token is valid
        return {
            "email": idinfo.get("email"),
            "email_verified": idinfo.get("email_verified", False),
            "name": idinfo.get("name"),
            "picture": idinfo.get("picture"),
            "google_id": idinfo.get("sub"),
            "given_name": idinfo.get("given_name"),
            "family_name": idinfo.get("family_name")
        }
    except ValueError as e:
        # Invalid token
        print(f"Google token verification failed: {e}")
        return None


async def get_google_user_info(access_token: str) -> Optional[Dict[str, Any]]:
    """
    Get user info from Google using access token.
    
    Alternative method using Google's userinfo endpoint.
    
    Args:
        access_token: Google OAuth access token
        
    Returns:
        User info dict or None if failed
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "email": data.get("email"),
                    "email_verified": data.get("email_verified", False),
                    "name": data.get("name"),
                    "picture": data.get("picture"),
                    "google_id": data.get("sub"),
                    "given_name": data.get("given_name"),
                    "family_name": data.get("family_name")
                }
            else:
                return None
    except Exception as e:
        print(f"Failed to get Google user info: {e}")
        return None
