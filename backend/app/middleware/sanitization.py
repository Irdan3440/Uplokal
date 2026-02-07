"""
Uplokal Backend - Input Sanitization Middleware
=================================================
Cleans user input to prevent XSS and SQL injection.
"""

import re
from typing import Any
import bleach


# Allowed HTML tags for rich text fields (if any)
ALLOWED_TAGS = ["p", "br", "strong", "em", "u", "ul", "ol", "li", "a"]
ALLOWED_ATTRIBUTES = {"a": ["href", "title"]}

# SQL injection patterns to detect
SQL_PATTERNS = [
    r"(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bUNION\b)",
    r"(--|;|'|\"|\\)",
    r"(\/\*|\*\/)",
    r"(\bOR\b\s+\d+\s*=\s*\d+|\bAND\b\s+\d+\s*=\s*\d+)",
]


def sanitize_string(value: str, allow_html: bool = False) -> str:
    """
    Sanitize a string value.
    
    Args:
        value: The string to sanitize
        allow_html: If True, allows safe HTML tags for rich text
    
    Returns:
        Cleaned string
    """
    if not isinstance(value, str):
        return value
    
    # Strip leading/trailing whitespace
    value = value.strip()
    
    if allow_html:
        # Clean HTML but allow safe tags
        value = bleach.clean(
            value,
            tags=ALLOWED_TAGS,
            attributes=ALLOWED_ATTRIBUTES,
            strip=True
        )
    else:
        # Remove all HTML tags
        value = bleach.clean(value, tags=[], strip=True)
    
    # Remove null bytes
    value = value.replace("\x00", "")
    
    return value


def detect_sql_injection(value: str) -> bool:
    """
    Detect potential SQL injection attempts.
    
    Returns True if suspicious patterns are found.
    """
    if not isinstance(value, str):
        return False
    
    for pattern in SQL_PATTERNS:
        if re.search(pattern, value, re.IGNORECASE):
            return True
    
    return False


def sanitize_dict(data: dict, allow_html_fields: list = None) -> dict:
    """
    Recursively sanitize all string values in a dictionary.
    
    Args:
        data: Dictionary to sanitize
        allow_html_fields: Field names that allow HTML content
    """
    if allow_html_fields is None:
        allow_html_fields = []
    
    sanitized = {}
    
    for key, value in data.items():
        if isinstance(value, str):
            allow_html = key in allow_html_fields
            sanitized[key] = sanitize_string(value, allow_html)
        elif isinstance(value, dict):
            sanitized[key] = sanitize_dict(value, allow_html_fields)
        elif isinstance(value, list):
            sanitized[key] = [
                sanitize_dict(item, allow_html_fields) if isinstance(item, dict)
                else sanitize_string(item) if isinstance(item, str)
                else item
                for item in value
            ]
        else:
            sanitized[key] = value
    
    return sanitized


def sanitize_filename(filename: str) -> str:
    """
    Sanitize a filename to prevent path traversal attacks.
    
    Removes:
    - Path separators (/, \\)
    - Parent directory references (..)
    - Null bytes
    - Special characters
    """
    if not filename:
        return "unnamed"
    
    # Remove path components
    filename = filename.replace("/", "").replace("\\", "")
    filename = filename.replace("..", "")
    filename = filename.replace("\x00", "")
    
    # Remove or replace special characters
    filename = re.sub(r'[<>:"|?*]', "_", filename)
    
    # Limit length
    if len(filename) > 255:
        name, ext = filename.rsplit(".", 1) if "." in filename else (filename, "")
        filename = name[:250] + ("." + ext if ext else "")
    
    return filename or "unnamed"


class InputSanitizer:
    """
    Pydantic validator mixin for automatic input sanitization.
    
    Usage in schemas:
        class MySchema(BaseModel, InputSanitizer):
            name: str
            description: str
    """
    
    @classmethod
    def sanitize_values(cls, values: dict) -> dict:
        """Sanitize all string values."""
        return sanitize_dict(values)
