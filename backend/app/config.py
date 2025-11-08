from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env.local or .env from project root (one level above backend/)
# __file__ is backend/app/config.py, so parent.parent.parent is project root
project_root = Path(__file__).resolve().parent.parent.parent
load_dotenv(project_root / ".env.local", override=True)
load_dotenv(project_root / ".env")

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

    # ✅ Gemini API Key - loaded from .env.local
    @property
    def gemini_api_key(self) -> str:
        return os.getenv("GEMINI_API_KEY", "")

    # ✅ Gemini default model
    @property
    def gemini_model(self) -> str:
        return os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # ✅ Environment name
    @property
    def app_env(self) -> str:
        return os.getenv("APP_ENV", "development")

settings = Settings()
