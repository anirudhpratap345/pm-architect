# backend/app/config.py
"""
Simplified configuration for PM Architect Lite Orchestrator.

Only essential environment variables:
- GEMINI_API_KEY (optional - uses dev stub if missing)
- CORS_ORIGINS (optional - defaults to *)
- APP_ENV (optional - defaults to development)
"""

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
from pathlib import Path
import json
import logging

logger = logging.getLogger(__name__)

# Determine .env file path
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_LOCAL = BASE_DIR / ".env.local"
ENV_FILE = BASE_DIR / ".env"
env_file_path = ENV_LOCAL if ENV_LOCAL.exists() else ENV_FILE


class Settings(BaseSettings):
    """Application settings with sensible defaults"""
    
    # Gemini API configuration
    gemini_api_key: str = Field(
        default="",
        env="GEMINI_API_KEY",
        description="Google Gemini API key (optional - uses dev stub if missing)"
    )
    
    # CORS configuration
    cors_origins: Union[List[str], str] = Field(
        default_factory=lambda: ["*"],
        env="CORS_ORIGINS",
        description="Allowed CORS origins (comma-separated or JSON array)"
    )
    
    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS_ORIGINS from various formats"""
        if not v or v == "":
            return ["*"]
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            # Try JSON parse first
            try:
                parsed = json.loads(v)
                return parsed if isinstance(parsed, list) else [parsed]
            except (json.JSONDecodeError, ValueError):
                # Fall back to comma-separated
                return [origin.strip() for origin in v.split(',') if origin.strip()]
        return ["*"]
    
    # Application environment
    app_env: str = Field(
        default="development",
        env="APP_ENV",
        description="Application environment (development/production)"
    )
    
    # Model configuration
    class Config:
        env_file = str(env_file_path) if env_file_path.exists() else None
        case_sensitive = False
        extra = "ignore"


# Initialize settings
settings = Settings()  # type: ignore[call-arg]

# Log configuration
if env_file_path.exists():
    logger.info(f"📁 Loaded config from: {env_file_path}")
else:
    logger.info("📁 No .env file found, using environment variables")

logger.info(f"🔧 Environment: {settings.app_env}")
if settings.gemini_api_key:
    logger.info("🔑 Gemini API key configured")
else:
    logger.warning("⚠️  No GEMINI_API_KEY - using dev stub mode")
