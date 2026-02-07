"""Uplokal Backend - Router Package."""

from app.routers import auth, business, diagnostic, documents, rfq, messages, admin

__all__ = [
    "auth",
    "business", 
    "diagnostic",
    "documents",
    "rfq",
    "messages",
    "admin"
]
