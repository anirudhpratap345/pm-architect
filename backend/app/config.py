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
        "http://localhost:3001",               # Local dev frontend (alternate port)
        # Railway backend domains (add your specific Railway URL after deployment)
        # Example: "https://your-app.up.railway.app"
    ]
    
    # Allow Railway/Replit/Vercel domains dynamically (for production)
    @property
    def allowed_origins(self) -> List[str]:
        """Get CORS origins, including any deployment platform URLs from env"""
        origins = self.cors_origins.copy()
        
        # Railway backend domains
        railway_url = os.getenv("RAILWAY_PUBLIC_DOMAIN")
        if railway_url:
            origins.append(f"https://{railway_url}")
        
        # Replit backend domains (no card needed!)
        # Replit provides REPL_SLUG and REPL_OWNER environment variables
        repl_slug = os.getenv("REPL_SLUG")
        repl_owner = os.getenv("REPL_OWNER")
        if repl_slug and repl_owner:
            # Allow the specific Replit URL
            origins.append(f"https://{repl_slug}.{repl_owner}.repl.co")
        
        # Also check for explicit Replit URL from env (if set manually)
        repl_url = os.getenv("REPLIT_URL")
        if repl_url:
            origins.append(repl_url)
        
        # Vercel preview deployments
        vercel_url = os.getenv("VERCEL_URL")
        if vercel_url:
            origins.append(f"https://{vercel_url}")
        
        # PythonAnywhere domains
        pythonanywhere_user = os.getenv("PYTHONANYWHERE_USER")
        if pythonanywhere_user:
            origins.append(f"https://{pythonanywhere_user}.pythonanywhere.com")
        
        return origins

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
