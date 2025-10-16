from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, text
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.sql import func
from typing import Generator, Optional
import logging

logger = logging.getLogger(__name__)

# Global database engine and session (initialized lazily)
_engine = None
_SessionLocal = None
_db_init_attempted = False
Base = declarative_base()


def get_engine():
    """Lazy initialization of database engine."""
    global _engine, _db_init_attempted
    
    if _db_init_attempted:
        return _engine
    
    _db_init_attempted = True
    
    try:
        from .config import settings
        
        if not settings.database_url:
            logger.warning("⚠️  DATABASE_URL not configured - Database features disabled")
            return None
        
        # Normalize URL for sync SQLAlchemy engine
        db_url = settings.database_url
        if db_url.startswith("postgresql+asyncpg://"):
            db_url = db_url.replace("postgresql+asyncpg://", "postgresql://")
        
        _engine = create_engine(db_url, echo=False, pool_pre_ping=True)
        
        # Extract host for logging (mask password)
        db_host = db_url.split('@')[-1] if '@' in db_url else "configured"
        logger.info(f"✅ Database engine created: ...@{db_host}")
        
        return _engine
        
    except Exception as e:
        logger.warning(f"⚠️  Database engine creation failed: {e}")
        _engine = None
        return None


def get_session_local():
    """Get SQLAlchemy session factory (initialized lazily)."""
    global _SessionLocal
    
    if _SessionLocal is None:
        engine = get_engine()
        if engine:
            _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    return _SessionLocal


# For backward compatibility
engine = None
SessionLocal = None


class Comparison(Base):
    __tablename__ = "comparisons"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, unique=True, index=True)
    options = Column(Text)  # JSON string
    metrics = Column(Text)  # JSON string
    context = Column(Text)
    status = Column(String, default="pending")  # pending, processing, completed, failed
    result = Column(Text)  # JSON string
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    error_message = Column(Text)


class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    comparison_id = Column(Integer, index=True)
    action = Column(String)  # job_created, job_started, job_completed, job_failed
    details = Column(Text)  # JSON string
    created_at = Column(DateTime, default=func.now())


def get_db() -> Generator:
    """Dependency to get database session (no-op if DB disabled)."""
    session_factory = get_session_local()
    if not session_factory:
        # Yield a dummy None for compatibility; callers should handle missing DB in production
        yield None
        return
    db = session_factory()
    try:
        yield db
    finally:
        db.close()


def init_db() -> bool:
    """Initialize database tables. Returns False if DB is not configured."""
    engine = get_engine()
    if not engine:
        logger.warning("⚠️  DATABASE_URL not set; skipping database initialization")
        return False
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {e}")
        return False


def test_db_connection() -> bool:
    """Test database connection. Returns False if DB is not configured."""
    engine = get_engine()
    if not engine:
        return False
    
    try:
        # Test connection with a simple query
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("✅ Database connection test successful")
        return True
    except Exception as e:
        logger.warning(f"⚠️  Database connection test failed: {e}")
        return False
