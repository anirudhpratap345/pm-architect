import os
import redis
import json
import logging
from typing import Optional, Any, Dict
from rq import Queue, Worker
from rq.job import Job

logger = logging.getLogger(__name__)

# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Initialize Redis connection
try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    redis_client.ping()  # Test connection
    logger.info("Redis connection successful")
except Exception as e:
    logger.warning(f"Redis connection failed: {e}")
    redis_client = None

# Initialize RQ queue
if redis_client:
    queue = Queue(connection=redis_client)
else:
    queue = None


class RedisCache:
    """Redis-based cache implementation"""
    
    def __init__(self, ttl_seconds: int = 3600):
        self.ttl_seconds = ttl_seconds
        self.client = redis_client
    
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
    if not queue:
        logger.error("Queue not available")
        return None
    
    try:
        job = queue.enqueue(
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
    if not queue:
        return None
    
    try:
        job = Job.fetch(job_id, connection=redis_client)
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
    if not redis_client:
        return False
    try:
        redis_client.ping()
        return True
    except Exception as e:
        logger.error(f"Redis test failed: {e}")
        return False
