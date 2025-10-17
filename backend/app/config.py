from pydantic import AnyHttpUrl, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional, Union
from pathlib import Path
import logging
import json

logger = logging.getLogger(__name__)

# Determine the correct .env file path
# Try .env.local first (for local development), fall back to .env
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_LOCAL = BASE_DIR / ".env.local"
ENV_FILE = BASE_DIR / ".env"

# Use .env.local if it exists, otherwise .env
env_file_path = ENV_LOCAL if ENV_LOCAL.exists() else ENV_FILE


class Settings(BaseSettings):
  gemini_api_key: str = Field(default="", env="GEMINI_API_KEY")
  cors_origins: Union[List[AnyHttpUrl], str] = Field(default_factory=list, env="CORS_ORIGINS")
  
  @field_validator('cors_origins', mode='before')
  @classmethod
  def parse_cors_origins(cls, v):
    """Parse CORS_ORIGINS from various formats"""
    if not v or v == "":
      return []
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
    return []
  model_name: str = Field(default="gemini-2.5-pro", env="GEMINI_MODEL")
  use_dummy_agents: bool = Field(default=False, env="USE_DUMMY_AGENTS")
  use_researcher: bool = Field(default=True, env="USE_RESEARCHER")
  use_validator: bool = Field(default=True, env="USE_VALIDATOR")
  validator_model: Optional[str] = Field(default=None, env="VALIDATOR_MODEL")
  
  # Database configuration
  database_url: str = Field(default="", env="DATABASE_URL")
  
  # Redis configuration
  redis_url: str = Field(default="", env="REDIS_URL")
  
  # App configuration
  secret_key: str = Field(default="dev-secret-key-change-in-production", env="SECRET_KEY")
  app_env: str = Field(default="development", env="APP_ENV")

  model_config = SettingsConfigDict(
    case_sensitive=False,
    env_file=str(env_file_path) if env_file_path.exists() else None,
    extra="ignore",
    protected_namespaces=("settings_",),
  )


# Initialize settings
settings = Settings()  # type: ignore[call-arg]

# Log configuration on startup
logger.info(f"📁 Environment file: {env_file_path if env_file_path.exists() else 'None (using OS env vars only)'}")
logger.info(f"🔧 APP_ENV: {settings.app_env}")
if settings.redis_url:
    # Mask password in Redis URL for logging
    redis_log = settings.redis_url.split('@')[-1] if '@' in settings.redis_url else settings.redis_url
    logger.info(f"🔍 REDIS_URL configured: ...@{redis_log}")
else:
    logger.warning("⚠️  REDIS_URL not set - Redis features will be disabled")
    
if settings.database_url:
    db_log = settings.database_url.split('@')[-1] if '@' in settings.database_url else "configured"
    logger.info(f"🔍 DATABASE_URL configured: ...@{db_log}")
else:
    logger.warning("⚠️  DATABASE_URL not set - Database features will be disabled")


