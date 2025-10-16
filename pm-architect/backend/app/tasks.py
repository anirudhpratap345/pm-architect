import os
import json
import logging
from typing import Dict, Any
from rq import get_current_job
from sqlalchemy.orm import Session

from .db import SessionLocal, Comparison, ActivityLog
from .redis_client import RedisCache
from .services.orchestrator_agent import OrchestratorAgent

logger = logging.getLogger(__name__)


def process_comparison(job_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Process a comparison job - this runs in the RQ worker
    """
    job = get_current_job()
    job_id = job.id if job else "unknown"
    
    logger.info(f"Processing comparison job: {job_id}")
    
    db = SessionLocal()
    cache = RedisCache()
    
    try:
        # Update job status to processing
        comparison = db.query(Comparison).filter(Comparison.job_id == job_id).first()
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
        
        # Update database with result
        if comparison:
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
        
        logger.info(f"Job {job_id} completed successfully")
        return result
        
    except Exception as e:
        logger.error(f"Job {job_id} failed: {e}")
        
        # Update database with error
        if comparison:
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
        
        raise e
        
    finally:
        db.close()


def create_comparison_job(
    options: list,
    metrics: list,
    context: str = "",
    query: str = ""
) -> str:
    """
    Create a new comparison job and return job ID
    """
    import uuid
    
    job_id = str(uuid.uuid4())
    
    db = SessionLocal()
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
