"""
Uplokal Backend - FastAPI Application Entry Point
==================================================
Main application with middleware, routes, and lifecycle management.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import get_settings
from app.database import init_db, close_db
from app.routers import auth, business, diagnostic, documents, rfq, messages, admin
from app.routers import subscription, payment

settings = get_settings()

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management."""
    # Startup
    await init_db()
    yield
    # Shutdown
    await close_db()


# Create FastAPI application
app = FastAPI(
    title="Uplokal API",
    description="Backend API for Uplokal - From Local Up To Global",
    version="1.0.0",
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None,
    lifespan=lifespan
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"]
)


# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses."""
    response = await call_next(request)
    
    # Security headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    if not settings.debug:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle uncaught exceptions."""
    if settings.debug:
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc), "type": type(exc).__name__}
        )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(business.router, prefix="/api/business", tags=["Business"])
app.include_router(diagnostic.router, prefix="/api/diagnostic", tags=["Diagnostic"])
app.include_router(documents.router, prefix="/api/documents", tags=["Document Vault"])
app.include_router(rfq.router, prefix="/api/rfq", tags=["RFQ & Matchmaking"])
app.include_router(messages.router, prefix="/api/messages", tags=["Messages"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(subscription.router, prefix="/api/subscription", tags=["Subscription"])
app.include_router(payment.router, prefix="/api/payment", tags=["Payment"])


# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "environment": settings.app_env
    }


# Root redirect
@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Uplokal API v1.0.0", "docs": "/api/docs"}
