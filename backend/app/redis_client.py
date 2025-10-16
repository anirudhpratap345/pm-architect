import redis
import json
import logging
from typing import Optional, Any, Dict
from rq import Queue, Worker
from rq.job import Job

logger = logging.getLogger(__name__)

# Global Redis client and queue (initialized lazily)
_redis_client: Optional[redis.Redis] = None
_queue: Optional[Queue] = None
_redis_init_attempted = False


def get_redis_client() -> Optional[redis.Redis]:
    """
    Lazy initialization of Redis client.
    Supports both redis:// and rediss:// (TLS) URLs.
    """
    global _redis_client, _redis_init_attempted
    
    if _redis_init_attempted:
        return _redis_client
    
    _redis_init_attempted = True
    
    try:
        from .config import settings
        
        if not settings.redis_url:
            logger.warning("⚠️  REDIS_URL not configured - Redis features disabled")
            return None
        
        # Determine if TLS is required
        use_ssl = settings.redis_url.startswith("rediss://")
        
        # Configure SSL parameters if needed
        ssl_params = {}
        if use_ssl:
            ssl_params = {
                "ssl_cert_reqs": None,  # Don't verify SSL certificates (for Redis Cloud)
            }
        
        # Initialize Redis client
        _redis_client = redis.from_url(
            settings.redis_url,
            decode_responses=True,
            **ssl_params
        )
        
        # Test connection
        _redis_client.ping()
        
        # Extract host for logging (mask password)
        redis_host = settings.redis_url.split('@')[-1] if '@' in settings.redis_url else settings.redis_url
        logger.info(f"✅ Redis connected successfully: {redis_host}")
        
        return _redis_client
        
    except Exception as e:
        logger.warning(f"⚠️  Redis connection failed: {e}")
        _redis_client = None
        return None


def get_queue() -> Optional[Queue]:
    """Get RQ queue (initialized lazily)."""
    global _queue
    
    if _queue is None:
        client = get_redis_client()
        if client:
            _queue = Queue(connection=client)
    
    return _queue


# For backward compatibility
redis_client = None  # Will be set on first access
queue = None  # Will be set on first access


class RedisCache:
    """Redis-based cache implementation"""
    
    def __init__(self, ttl_seconds: int = 3600):
        self.ttl_seconds = ttl_seconds
        self.client = get_redis_client()
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.client:
            return None
        try:
            value = self.client.get(f"compare_cache:{key}")
            return json.loads(value) if value else None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    def set(self, key: str, value: Any) -> bool:
        """Set value in cache"""
        if not self.client:
            return False
        try:
            self.client.setex(
                f"compare_cache:{key}", 
                self.ttl_seconds, 
                json.dumps(value)
            )
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete value from cache"""
        if not self.client:
            return False
        try:
            self.client.delete(f"compare_cache:{key}")
            return True
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
            return False


def enqueue_compare_job(job_data: Dict[str, Any]) -> Optional[str]:
    """Enqueue a comparison job"""
    q = get_queue()
    if not q:
        logger.error("Queue not available")
        return None
    
    try:
        job = q.enqueue(
            'app.tasks.process_comparison',
            job_data,
            timeout='10m',
            job_id=job_data.get('job_id')
        )
        logger.info(f"Job enqueued: {job.id}")
        return job.id
    except Exception as e:
        logger.error(f"Failed to enqueue job: {e}")
        return None


def get_job_status(job_id: str) -> Optional[Dict[str, Any]]:
    """Get job status"""
    client = get_redis_client()
    if not client:
        return None
    
    try:
        job = Job.fetch(job_id, connection=client)
        return {
            "id": job.id,
            "status": job.get_status(),
            "result": job.result,
            "created_at": job.created_at.isoformat() if job.created_at else None,
            "started_at": job.started_at.isoformat() if job.started_at else None,
            "ended_at": job.ended_at.isoformat() if job.ended_at else None,
            "exc_info": job.exc_info
        }
    except Exception as e:
        logger.error(f"Failed to get job status: {e}")
        return None


def test_redis_connection() -> bool:
    """Test Redis connection"""
    client = get_redis_client()
    if not client:
        return False
    try:
        client.ping()
        return True
    except Exception as e:
        logger.error(f"Redis test failed: {e}")
        return False
