"""
Redis-based data persistence layer.
Used when PostgreSQL is not available.
"""
import json
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime

from .redis_client import get_redis_client

logger = logging.getLogger(__name__)


def save_data(key: str, value: dict, expire: int = 86400) -> bool:
    """
    Save data to Redis with optional expiration.
    
    Args:
        key: Redis key
        value: Dictionary to store
        expire: TTL in seconds (default 24 hours)
    
    Returns:
        True if successful, False otherwise
    """
    client = get_redis_client()
    if not client:
        logger.warning("Redis client not available")
        return False
    
    try:
        client.set(key, json.dumps(value), ex=expire)
        logger.info(f"✅ Saved data to Redis: {key}")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to save data to Redis: {e}")
        return False


def get_data(key: str) -> Optional[Dict[str, Any]]:
    """
    Get data from Redis.
    
    Args:
        key: Redis key
    
    Returns:
        Dictionary if found, None otherwise
    """
    client = get_redis_client()
    if not client:
        logger.warning("Redis client not available")
        return None
    
    try:
        data = client.get(key)
        if data:
            logger.info(f"✅ Retrieved data from Redis: {key}")
            return json.loads(data)
        return None
    except Exception as e:
        logger.error(f"❌ Failed to get data from Redis: {e}")
        return None


def delete_data(key: str) -> bool:
    """
    Delete data from Redis.
    
    Args:
        key: Redis key
    
    Returns:
        True if successful, False otherwise
    """
    client = get_redis_client()
    if not client:
        logger.warning("Redis client not available")
        return False
    
    try:
        client.delete(key)
        logger.info(f"✅ Deleted data from Redis: {key}")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to delete data from Redis: {e}")
        return False


def list_keys(pattern: str = "*") -> List[str]:
    """
    List all keys matching a pattern.
    
    Args:
        pattern: Redis key pattern (default: all keys)
    
    Returns:
        List of matching keys
    """
    client = get_redis_client()
    if not client:
        logger.warning("Redis client not available")
        return []
    
    try:
        keys = client.keys(pattern)
        return keys if keys else []
    except Exception as e:
        logger.error(f"❌ Failed to list keys from Redis: {e}")
        return []


class RedisJobStore:
    """
    Job storage using Redis (replaces PostgreSQL Comparison table).
    """
    
    @staticmethod
    def create_job(job_id: str, options: list, metrics: list, context: str = "", query: str = "") -> bool:
        """Create a new job record in Redis"""
        job_data = {
            "job_id": job_id,
            "options": options,
            "metrics": metrics,
            "context": context,
            "query": query,
            "status": "pending",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        return save_data(f"job:{job_id}", job_data, expire=604800)  # 7 days
    
    @staticmethod
    def get_job(job_id: str) -> Optional[Dict[str, Any]]:
        """Get job record from Redis"""
        return get_data(f"job:{job_id}")
    
    @staticmethod
    def update_job_status(job_id: str, status: str, result: Any = None, error: str = None) -> bool:
        """Update job status"""
        job_data = RedisJobStore.get_job(job_id)
        if not job_data:
            logger.warning(f"Job {job_id} not found")
            return False
        
        job_data["status"] = status
        job_data["updated_at"] = datetime.utcnow().isoformat()
        
        if result is not None:
            job_data["result"] = result
        
        if error is not None:
            job_data["error_message"] = error
        
        return save_data(f"job:{job_id}", job_data, expire=604800)
    
    @staticmethod
    def list_jobs() -> List[Dict[str, Any]]:
        """List all jobs"""
        job_keys = list_keys("job:*")
        jobs = []
        for key in job_keys:
            job_data = get_data(key)
            if job_data:
                jobs.append(job_data)
        return jobs

