"""
Uplokal Backend - Encryption Service
======================================
Provides ID obfuscation (Hashids), AES-256 encryption, and signed URLs.
"""

import base64
import hashlib
import hmac
import json
import secrets
import time
from typing import Any, Dict, Optional

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from hashids import Hashids

from app.config import get_settings

settings = get_settings()

# Initialize Hashids for ID obfuscation
_hashids = Hashids(
    salt=settings.hashids_salt,
    min_length=8,
    alphabet="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
)

# AES-256 key (must be 32 bytes)
_aes_key = settings.aes_key.encode()[:32]


# =============================================================================
# HASHIDS - ID Obfuscation
# =============================================================================

def encode_id(id: int) -> str:
    """
    Encode a numeric database ID to an obfuscated string.
    
    Example: 123 → 'XyZ7kL9m'
    
    Use this for:
    - URL parameters (e.g., /invoice/XyZ7kL9m instead of /invoice/123)
    - Any exposed IDs that could reveal business data
    """
    return _hashids.encode(id)


def decode_id(hash_str: str) -> Optional[int]:
    """
    Decode an obfuscated string back to a numeric ID.
    
    Example: 'XyZ7kL9m' → 123
    
    Returns None if the hash is invalid.
    """
    decoded = _hashids.decode(hash_str)
    return decoded[0] if decoded else None


def encode_ids(*ids: int) -> str:
    """Encode multiple IDs into a single hash."""
    return _hashids.encode(*ids)


def decode_ids(hash_str: str) -> tuple:
    """Decode a hash back to multiple IDs."""
    return _hashids.decode(hash_str)


# =============================================================================
# AES-256-GCM - Encrypted Parameters
# =============================================================================

def encrypt_params(data: Dict[str, Any]) -> str:
    """
    Encrypt a dictionary of parameters using AES-256-GCM.
    
    Use this for:
    - Sensitive URL parameters (e.g., questionnaire report access)
    - Document access tokens
    - Any data that must be tamper-proof
    
    Returns: Base64 URL-safe encoded string
    """
    # Serialize to JSON bytes
    plaintext = json.dumps(data, separators=(",", ":")).encode()
    
    # Generate random 12-byte nonce (required for GCM)
    nonce = secrets.token_bytes(12)
    
    # Encrypt using AES-256-GCM
    aesgcm = AESGCM(_aes_key)
    ciphertext = aesgcm.encrypt(nonce, plaintext, None)
    
    # Combine nonce + ciphertext and encode
    encrypted = nonce + ciphertext
    return base64.urlsafe_b64encode(encrypted).decode()


def decrypt_params(token: str) -> Optional[Dict[str, Any]]:
    """
    Decrypt an encrypted parameter token back to a dictionary.
    
    Returns None if decryption fails (invalid or tampered token).
    """
    try:
        # Decode from Base64
        encrypted = base64.urlsafe_b64decode(token.encode())
        
        # Extract nonce (first 12 bytes) and ciphertext
        nonce = encrypted[:12]
        ciphertext = encrypted[12:]
        
        # Decrypt
        aesgcm = AESGCM(_aes_key)
        plaintext = aesgcm.decrypt(nonce, ciphertext, None)
        
        # Parse JSON
        return json.loads(plaintext.decode())
    except Exception:
        return None


# =============================================================================
# SIGNED URLs - Time-Limited Access
# =============================================================================

def generate_signed_url(
    resource_type: str,
    resource_hash: str,
    expiry_seconds: Optional[int] = None,
    extra_data: Optional[Dict[str, Any]] = None
) -> str:
    """
    Generate a signed URL with expiration for secure resource access.
    
    Args:
        resource_type: Type of resource (e.g., 'document', 'report')
        resource_hash: The obfuscated resource ID
        expiry_seconds: URL validity period (default: from settings)
        extra_data: Additional data to include in the signature
    
    Returns:
        URL query string: ?expires={timestamp}&signature={sig}
    
    Example:
        /api/documents/download/XyZ7kL9m?expires=1699123456&signature=abc123
    """
    if expiry_seconds is None:
        expiry_seconds = settings.signed_url_expiry_seconds
    
    # Calculate expiration timestamp
    expires = int(time.time()) + expiry_seconds
    
    # Build signature payload
    payload = f"{resource_type}:{resource_hash}:{expires}"
    if extra_data:
        payload += f":{json.dumps(extra_data, sort_keys=True)}"
    
    # Generate HMAC-SHA256 signature
    signature = hmac.new(
        _aes_key,
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return f"expires={expires}&signature={signature}"


def verify_signed_url(
    resource_type: str,
    resource_hash: str,
    expires: int,
    signature: str,
    extra_data: Optional[Dict[str, Any]] = None
) -> bool:
    """
    Verify a signed URL's signature and check if it's expired.
    
    Returns True if valid and not expired, False otherwise.
    """
    # Check expiration
    if int(time.time()) > expires:
        return False
    
    # Rebuild signature payload
    payload = f"{resource_type}:{resource_hash}:{expires}"
    if extra_data:
        payload += f":{json.dumps(extra_data, sort_keys=True)}"
    
    # Verify HMAC signature (constant-time comparison)
    expected_sig = hmac.new(
        _aes_key,
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_sig)


def get_signed_download_url(document_id: int, expiry_minutes: int = 30) -> str:
    """
    Convenience function to generate a complete signed download URL.
    
    Args:
        document_id: Numeric document ID
        expiry_minutes: How long the URL should be valid
    
    Returns:
        Full URL path: /api/documents/download/{hash}?expires=...&signature=...
    """
    doc_hash = encode_id(document_id)
    query = generate_signed_url("document", doc_hash, expiry_minutes * 60)
    return f"/api/documents/download/{doc_hash}?{query}"
