from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
import json

from ..db import get_db, Comparison
from ..redis_client import get_job_status
from ..tasks import create_comparison_job

router = APIRouter()


@router.post("/jobs")
async def create_job(
    options: list,
    metrics: list,
    context: str = "",
    query: str = "",
    db: Session = Depends(get_db)
):
    """Create a new comparison job"""
    try:
        job_id = create_comparison_job(options, metrics, context, query)
        return {"job_id": job_id, "status": "pending"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/jobs/{job_id}")
async def get_job(job_id: str, db: Session = Depends(get_db)):
    """Get job status and result"""
    try:
        # Get from database
        comparison = db.query(Comparison).filter(Comparison.job_id == job_id).first()
        if not comparison:
            raise HTTPException(status_code=404, detail="Job not found")
        
        # Get from Redis for real-time status
        redis_status = get_job_status(job_id)
        
        result = {
            "job_id": job_id,
            "status": comparison.status,
            "options": json.loads(comparison.options) if comparison.options else [],
            "metrics": json.loads(comparison.metrics) if comparison.metrics else [],
            "context": comparison.context,
            "created_at": comparison.created_at.isoformat() if comparison.created_at else None,
            "updated_at": comparison.updated_at.isoformat() if comparison.updated_at else None,
        }
        
        if comparison.status == "completed" and comparison.result:
            result["result"] = json.loads(comparison.result)
        elif comparison.status == "failed" and comparison.error_message:
            result["error"] = comparison.error_message
        
        # Add Redis status if available
        if redis_status:
            result["redis_status"] = redis_status.get("status")
            result["redis_result"] = redis_status.get("result")
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
