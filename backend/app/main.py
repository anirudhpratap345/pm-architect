# backend/app/main.py
"""
PM Architect Backend - Lite Orchestrator Version

Clean, minimal FastAPI backend with:
- Single Gemini-powered comparison endpoint
- File-based JSON persistence
- No PostgreSQL, no Redis, no background jobs
- Production-ready for Render deployment
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from .config import settings
from .orchestrator import router as orchestrator_router
from .routers.history import router as history_router
from .routers.options import router as options_router
from .routers.catalog import router as catalog_router
from .routers.multi_agent_compare import router as multi_agent_router


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Initialize FastAPI app
app = FastAPI(
    title="PM Architect.ai",
    version="2.0-multi-agent",
    description="The $500/hr technical co-founder that tells you exactly what tech to pick."
)


# ✅ Strict, safe CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,  # Uses dynamic Railway/Vercel URL detection
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Log startup information"""
    logger.info("🚀 PM Architect Backend starting...")
    logger.info(f"   Environment: {settings.app_env}")
    logger.info(f"   Gemini API: {'Configured ✅' if settings.gemini_api_key else 'Dev Stub Mode ⚠️'}")
    logger.info("🎉 Backend ready!")


@app.get("/")
def root():
    """Root endpoint - confirms backend is live"""
    return {
        "message": "PM Architect.ai multi-agent is live. POST to /api/compare with {'query': 'your question'}",
        "version": "2.0-multi-agent",
        "status": "operational",
        "vision": "technical co-founder in your pocket"
    }


@app.get("/health")
def health():
    """Health check endpoint for monitoring and deployment"""
    return {
        "status": "healthy",
        "version": "2.0-multi-agent",
        "vision": "technical co-founder in your pocket",
        "gemini_configured": bool(settings.gemini_api_key),
        "allowed_origins": settings.cors_origins,
    }


# Include routers
app.include_router(multi_agent_router, prefix="/api")  # New multi-agent endpoint at /api/compare
app.include_router(orchestrator_router, prefix="/api")  # Legacy endpoint
app.include_router(history_router, prefix="/api")
app.include_router(options_router, prefix="/api")
app.include_router(catalog_router, prefix="/api")


logger.info("✅ All routes registered successfully")
