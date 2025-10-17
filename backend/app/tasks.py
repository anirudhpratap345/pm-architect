import os
import json
import logging
from typing import Dict, Any
from rq import get_current_job
from sqlalchemy.orm import Session

from .db import get_session_local, Comparison, ActivityLog
from .redis_client import RedisCache
from .redis_store import RedisJobStore
from .services.orchestrator_agent import OrchestratorAgent

logger = logging.getLogger(__name__)


def process_comparison(job_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process a comparison job - this runs in the RQ worker.
    Works with or without PostgreSQL by falling back to Redis.
    """
    job = get_current_job()
    job_id = job.id if job else "unknown"
    
    logger.info(f"Processing comparison job: {job_id}")
    
    session_factory = get_session_local()
    use_database = session_factory is not None
    
    db = None
    comparison = None
    cache = RedisCache()
    
    try:
        # Initialize database if available
        if use_database:
            db = session_factory()
            comparison = db.query(Comparison).filter(Comparison.job_id == job_id).first()
            
            # Update job status to processing
            if comparison:
                comparison.status = "processing"
                db.commit()
                
                # Log activity
                activity = ActivityLog(
                    comparison_id=comparison.id,
                    action="job_started",
                    details=json.dumps({"job_id": job_id})
                )
                db.add(activity)
                db.commit()
        else:
            # Use Redis fallback
            logger.info("Using Redis for job tracking (database not available)")
            RedisJobStore.update_job_status(job_id, "processing")
        
        # Check cache first
        cache_key = f"{job_data.get('options', [])}_{job_data.get('metrics', [])}_{job_data.get('context', '')}"
        cached_result = cache.get(cache_key)
        
        if cached_result:
            logger.info(f"Cache hit for job {job_id}")
            result = cached_result
        else:
            # Run the actual comparison
            logger.info(f"Running comparison for job {job_id}")
            orchestrator = OrchestratorAgent()
            result = orchestrator.run_sync(
                query=job_data.get('query'),
                options=job_data.get('options'),
                metrics=job_data.get('metrics'),
                context=job_data.get('context')
            )
            
            # Cache the result
            cache.set(cache_key, result)
        
        # Update with result
        if use_database and comparison:
            comparison.status = "completed"
            comparison.result = json.dumps(result)
            db.commit()
            
            # Log completion
            activity = ActivityLog(
                comparison_id=comparison.id,
                action="job_completed",
                details=json.dumps({"job_id": job_id, "result_keys": list(result.keys())})
            )
            db.add(activity)
            db.commit()
        else:
            # Use Redis fallback
            RedisJobStore.update_job_status(job_id, "completed", result=result)
        
        logger.info(f"Job {job_id} completed successfully")
        return result
        
    except Exception as e:
        logger.error(f"Job {job_id} failed: {e}")
        
        # Update with error
        if use_database and comparison:
            comparison.status = "failed"
            comparison.error_message = str(e)
            db.commit()
            
            # Log failure
            activity = ActivityLog(
                comparison_id=comparison.id,
                action="job_failed",
                details=json.dumps({"job_id": job_id, "error": str(e)})
            )
            db.add(activity)
            db.commit()
        else:
            # Use Redis fallback
            RedisJobStore.update_job_status(job_id, "failed", error=str(e))
        
        raise e
        
    finally:
        if db:
            db.close()


def create_comparison_job(
    options: list,
    metrics: list,
    context: str = "",
    query: str = ""
) -> str:
    """
    Create a new comparison job and return job ID.
    Works with or without PostgreSQL by falling back to Redis.
    """
    import uuid
    
    session_factory = get_session_local()
    use_database = session_factory is not None
    
    job_id = str(uuid.uuid4())
    
    if not use_database:
        # Use Redis-only approach
        logger.info("Creating job in Redis (database not available)")
        success = RedisJobStore.create_job(job_id, options, metrics, context, query)
        
        if not success:
            logger.error("Failed to create job in Redis")
            raise Exception("Failed to create job - Redis unavailable")
        
        # Enqueue job
        job_data = {
            "job_id": job_id,
            "options": options,
            "metrics": metrics,
            "context": context,
            "query": query
        }
        
        from .redis_client import enqueue_compare_job
        enqueued_job_id = enqueue_compare_job(job_data)
        
        if not enqueued_job_id:
            RedisJobStore.update_job_status(job_id, "failed", error="Failed to enqueue job")
            raise Exception("Failed to enqueue job")
        
        return job_id
    
    # Use database approach
    db = session_factory()
    try:
        # Create comparison record
        comparison = Comparison(
            job_id=job_id,
            options=json.dumps(options),
            metrics=json.dumps(metrics),
            context=context,
            status="pending"
        )
        db.add(comparison)
        db.commit()
        
        # Log creation
        activity = ActivityLog(
            comparison_id=comparison.id,
            action="job_created",
            details=json.dumps({"job_id": job_id, "options": options, "metrics": metrics})
        )
        db.add(activity)
        db.commit()
        
        # Enqueue job
        job_data = {
            "job_id": job_id,
            "options": options,
            "metrics": metrics,
            "context": context,
            "query": query
        }
        
        from .redis_client import enqueue_compare_job
        enqueued_job_id = enqueue_compare_job(job_data)
        
        if not enqueued_job_id:
            comparison.status = "failed"
            comparison.error_message = "Failed to enqueue job"
            db.commit()
            raise Exception("Failed to enqueue job")
        
        return job_id
        
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create comparison job: {e}")
        raise e
    finally:
        db.close()
