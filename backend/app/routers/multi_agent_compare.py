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
from ..models import ComparisonContext
from ..agents.context_agent import run as context_run
from ..agents.cost_agent import run as cost_run
from ..agents.performance_agent import run as perf_run
from ..agents.risk_agent import run as risk_run
from ..agents.narrative_agent import run as narrative_run

router = APIRouter(tags=["Multi-Agent Compare"])


class QueryRequest(BaseModel):
    """Request model for multi-agent comparison"""
    query: str


async def compare_anything(query: str) -> Dict[str, Any]:
    """
    Full multi-agent pipeline orchestrator.
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

    # Return both brief and any interactive data
    return {
        "brief": context.final_brief,
        "slider_data": context.cost_breakdown.get("slider_data", {})
    }


@router.post("/compare")
async def compare(request: QueryRequest) -> Dict[str, Any]:
    """
    Main endpoint: Takes a raw query and returns the full Decision Brief.
    
    This is the $500/hr technical co-founder in your pocket - delivering
    instant, opinionated Decision Briefs that drive immediate action.
    """
    try:
        result = await compare_anything(request.query)
        return {
            "brief": result["brief"],
            "slider_data": result.get("slider_data", {}),  # For future interactive frontend
            "query": request.query
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Comparison generation failed: {str(e)}"
        )

