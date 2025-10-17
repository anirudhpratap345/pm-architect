from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any
import logging

from .config import settings
from .routers.compare import router as compare_router
from .routers.jobs import router as jobs_router
from .db import init_db, test_db_connection, get_db, get_engine
from .redis_client import test_redis_connection
from .redis_store import save_data, get_data, list_keys

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PMArchitect.ai Backend", version="0.1.0")

app.add_middleware(
  CORSMiddleware,
  allow_origins=[str(o) for o in settings.cors_origins] or ["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database and test connections on startup"""
    try:
        logger.info("🚀 Starting PMArchitect Backend...")
        
        # Initialize database (skips if DATABASE_URL not set)
        init_db()

        # Test connections (report-only)
        db_ok = test_db_connection()
        redis_ok = test_redis_connection()

        if db_ok:
            logger.info("✅ Database connected successfully")
        else:
            logger.warning("⚠️  Database not configured or connection failed - features depending on DB are disabled")
        
        if redis_ok:
            logger.info("✅ Redis connected successfully")
        else:
            logger.warning("⚠️  Redis not configured or connection failed - caching and background jobs disabled")

        logger.info("🎉 Backend startup completed successfully")
    except Exception as e:
        logger.error(f"❌ Startup encountered errors: {e}")
        # Do not raise - app should start with degraded functionality


@app.get("/health")
def health():
    """Health check endpoint"""
    db_ok = test_db_connection()
    redis_ok = test_redis_connection()
    
    return {
        "status": "ok",
        "database": "connected" if db_ok else "disconnected",
        "redis": "connected" if redis_ok else "disconnected"
    }


@app.get("/api/test-redis")
def test_redis():
    """Test Redis connection endpoint"""
    redis_ok = test_redis_connection()
    if redis_ok:
        return {"status": "success", "message": "Redis connection successful"}
    else:
        raise HTTPException(status_code=500, detail="Redis connection failed")


@app.get("/")
def root():
    """Root endpoint - confirms backend is live"""
    return {"message": "PM Architect Backend is live!"}


# Demo endpoints for Redis persistence
class SavePayload(BaseModel):
    key: str
    message: str
    data: Dict[str, Any] = {}


@app.post("/save")
def save_item(payload: SavePayload):
    """Save data to Redis (demo endpoint)"""
    data = {
        "key": payload.key,
        "message": payload.message,
        "data": payload.data
    }
    success = save_data(payload.key, data)
    if success:
        return {"status": "saved", "key": payload.key}
    else:
        raise HTTPException(status_code=503, detail="Redis unavailable")


@app.get("/get/{key}")
def get_item(key: str):
    """Get data from Redis (demo endpoint)"""
    data = get_data(key)
    if data:
        return {"key": key, "data": data}
    return {"error": "not found"}


@app.get("/keys")
def list_all_keys(pattern: str = "*"):
    """List all Redis keys matching pattern (demo endpoint)"""
    keys = list_keys(pattern)
    return {"pattern": pattern, "keys": keys, "count": len(keys)}


# Include routers - compare router works without DB
app.include_router(compare_router, prefix="/api")

# Jobs router requires database - conditionally include
engine = get_engine()
if engine:
    logger.info("✅ Including jobs router (database available)")
    app.include_router(jobs_router, prefix="/api")
else:
    logger.warning("⚠️ Skipping jobs router (database unavailable)")
    
    # Add a placeholder endpoint that explains the situation
    @app.get("/api/jobs/{job_id}")
    def jobs_unavailable(job_id: str):
        raise HTTPException(
            status_code=503, 
            detail="Job management requires database. Use /api/compare endpoint for direct comparisons."
        )
    
    @app.post("/api/jobs")
    def create_job_unavailable():
        raise HTTPException(
            status_code=503,
            detail="Job management requires database. Use /api/compare endpoint for direct comparisons."
        )


