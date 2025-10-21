from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """
    Configuration for PM Architect backend (Lite Orchestrator).
    Includes explicit CORS origins for frontend integration.
    """
    # ✅ Explicit allowed origins for frontend calls
    cors_origins: List[str] = [
        "https://pm-architect-ai.vercel.app",  # Production frontend (Vercel)
        "http://localhost:3000",               # Local dev frontend
    ]

    # ✅ Gemini API Key (optional)
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")

    # ✅ Environment name
    app_env: str = os.getenv("APP_ENV", "development")

    class Config:
        env_file = ".env"

settings = Settings()
