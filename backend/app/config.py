"""
Uplokal Backend - Configuration Module
=======================================
Loads environment variables with validation using Pydantic Settings.
"""

from functools import lru_cache
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database (Supabase PostgreSQL)
    database_url: str = Field(..., description="PostgreSQL connection URL")
    
    # Supabase (optional, for direct client usage)
    supabase_url: Optional[str] = None
    supabase_anon_key: Optional[str] = None
    supabase_service_role_key: Optional[str] = None
    
    # Redis
    redis_url: str = Field(default="redis://localhost:6379/0")
    
    # JWT Authentication
    jwt_secret: str = Field(..., min_length=32, description="JWT signing secret")
    jwt_algorithm: str = Field(default="HS256")
    jwt_expiry_minutes: int = Field(default=60)
    
    # Google OAuth
    google_client_id: Optional[str] = None
    google_client_secret: Optional[str] = None
    
    # Midtrans Payment Gateway
    midtrans_server_key: Optional[str] = None
    midtrans_client_key: Optional[str] = None
    midtrans_is_production: bool = Field(default=False)
    midtrans_merchant_id: Optional[str] = None
    
    # Encryption
    hashids_salt: str = Field(..., description="Salt for Hashids ID obfuscation")
    aes_key: str = Field(..., min_length=32, max_length=32, description="32-byte AES-256 key")
    signed_url_expiry_seconds: int = Field(default=1800)  # 30 minutes
    
    # Storage
    storage_path: str = Field(default="./storage/documents")
    storage_bucket: Optional[str] = None  # Supabase storage bucket
    
    # CORS
    cors_origins: str = Field(default="http://localhost:5500")
    
    # Application
    debug: bool = Field(default=False)
    app_env: str = Field(default="development")
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    @property
    def use_supabase_storage(self) -> bool:
        """Check if Supabase storage is configured."""
        return all([
            self.supabase_url,
            self.supabase_service_role_key,
            self.storage_bucket
        ])
    
    @property
    def google_oauth_enabled(self) -> bool:
        """Check if Google OAuth is configured."""
        return bool(self.google_client_id)
    
    @property
    def midtrans_enabled(self) -> bool:
        """Check if Midtrans is configured."""
        return bool(self.midtrans_server_key and self.midtrans_client_key)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()

