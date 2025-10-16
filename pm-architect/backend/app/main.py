from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging

from .config import settings
from .routers.compare import router as compare_router
from .routers.jobs import router as jobs_router
from .db import init_db, test_db_connection, get_db
from .redis_client import test_redis_connection

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
        # Initialize database
        init_db()
        
        # Test connections
        db_ok = test_db_connection()
        redis_ok = test_redis_connection()
        
        if not db_ok:
            logger.warning("Database connection failed - some features may not work")
        if not redis_ok:
            logger.warning("Redis connection failed - caching and background jobs disabled")
            
        logger.info("Backend startup completed")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        # Don't raise - allow app to start with degraded functionality


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


app.include_router(compare_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")


