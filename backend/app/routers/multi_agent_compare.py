"""
Multi-Agent Compare Router
The new $500/hr technical co-founder endpoint powered by multi-agent architecture.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import asyncio
import sys
from pathlib import Path

# Import the multi-agent orchestrator
from ..models import ComparisonContext, SavedComparison
from ..agents.context_agent import run as context_run
from ..agents.cost_agent import run as cost_run
from ..agents.performance_agent import run as perf_run
from ..agents.risk_agent import run as risk_run
from ..agents.narrative_agent import run as narrative_run
from ..utils.value_calculator import calculate_value_delivered
from ..utils.comparison_storage import save_comparison, get_comparison, get_storage_stats

router = APIRouter(tags=["Multi-Agent Compare"])


class QueryRequest(BaseModel):
    """Request model for multi-agent comparison"""
    query: str


async def compare_anything(query: str) -> Dict[str, Any]:
    """
    Full multi-agent pipeline orchestrator.
    Returns both the result and the context for saving.
    """
    # Start with raw query
    context = ComparisonContext(query=query, option_a="", option_b="")

    # 1. Parse context
    context = await context_run(context)

    # 2. Run specialist agents in parallel
    cost_task = cost_run(context)
    perf_task = perf_run(context)
    risk_task = risk_run(context)

    # Agents modify context in place, so we just await them
    await asyncio.gather(cost_task, perf_task, risk_task)

    # 3. Synthesize final brief
    context = await narrative_run(context)

    # 4. Calculate value metrics
    value_metrics = calculate_value_delivered(
        context,
        context.cost_breakdown,
        context.performance,
        context.risks
    )

    # Return both brief and any interactive data, plus context for saving
    return {
        "brief": context.final_brief,
        "slider_data": context.cost_breakdown.get("slider_data", {}),
        "value_metrics": value_metrics,  # Add value metrics separately
        "context": context  # Return context for saving
    }


@router.post("/compare")
async def compare(request: QueryRequest) -> Dict[str, Any]:
    """
    Main endpoint: Takes a raw query and returns the full Decision Brief.
    
    This is the $500/hr technical co-founder in your pocket - delivering
    instant, opinionated Decision Briefs that drive immediate action.
    """
    try:
        # Run the comparison pipeline
        result = await compare_anything(request.query)
        
        # Get context from result
        context = result.get("context")
        
        # Save the comparison
        saved_comparison = SavedComparison(
            query=request.query,
            option_a=context.option_a if context else "",
            option_b=context.option_b if context else "",
            tech_category=context.tech_category if context else "other",
            brief=result["brief"],
            slider_data=result.get("slider_data"),
            value_metrics=result.get("value_metrics")
        )
        
        comparison_id = save_comparison(saved_comparison)
        
        # Get base URL from environment or use default
        import os
        base_url = os.getenv("BASE_URL", "http://localhost:3000")  # Default to localhost for dev
        
        return {
            "brief": result["brief"],
            "slider_data": result.get("slider_data", {}),  # For future interactive frontend
            "value_metrics": result.get("value_metrics", {}),  # Value metrics for frontend
            "query": request.query,
            "comparison_id": comparison_id,  # NEW: Return the shareable ID
            "share_url": f"{base_url}/c/{comparison_id}"  # NEW: Shareable URL
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Comparison generation failed: {str(e)}"
        )


@router.get("/comparison/{comparison_id}")
async def get_saved_comparison(comparison_id: str) -> Dict[str, Any]:
    """
    Retrieve a saved comparison by its ID.
    Used when someone visits /c/{id}
    """
    comparison = get_comparison(comparison_id)
    
    if not comparison:
        raise HTTPException(status_code=404, detail="Comparison not found")
    
    return {
        "query": comparison.query,
        "option_a": comparison.option_a,
        "option_b": comparison.option_b,
        "tech_category": comparison.tech_category,
        "brief": comparison.brief,
        "slider_data": comparison.slider_data,
        "value_metrics": comparison.value_metrics,
        "created_at": comparison.created_at.isoformat() if comparison.created_at else None,
        "view_count": comparison.view_count
    }


@router.get("/stats")
async def get_stats() -> Dict[str, Any]:
    """
    Optional: Analytics endpoint for admin dashboard
    """
    return get_storage_stats()

