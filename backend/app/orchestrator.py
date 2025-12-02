# backend/app/orchestrator.py
"""
Lite Orchestrator for PM Architect - Single Gemini Call Architecture

This simplified orchestrator:
- Takes comparison request (query, options, context)
- Makes ONE Gemini API call
- Returns structured JSON comparison
- Auto-saves to decisions.json (file-based persistence)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
import json
import time
import uuid
import os
from .config import settings

from .agents.llm_client import call_gemini, LLMResponse
from .data_store import save_decision


router = APIRouter(tags=["Orchestrator"])


class CompareRequest(BaseModel):
    """Request model for comparison endpoint"""
    query: Optional[str] = Field(None, description="Natural language comparison query")
    options: List[str] = Field(..., min_length=2, description="Two options to compare [A, B]")
    metrics: Optional[List[str]] = Field(default_factory=list, description="Specific metrics to evaluate")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional context")


# System prompt for Gemini
SYSTEM_PROMPT = """You are an intelligent metric comparison engine for PM Architect.

Given a user query and two options to compare, produce a structured JSON comparison with:
- Clear metrics with numerical scores (0-100) for each option
- A concise summary recommendation
- Confidence level (high/medium/low)
- Evidence-based bullet points
- Detailed explanations for each metric per option

Output **ONLY valid JSON** in this exact format:
{
  "left": "<Option A name>",
  "right": "<Option B name>",
  "metrics": [
    {
      "name": "Performance",
      "A": 85,
      "B": 78,
      "delta": "+9%",
      "explanation": "General explanation of what this metric measures",
      "A_reason": "Why option A got this score (1-2 sentences)",
      "B_reason": "Why option B got this score (1-2 sentences)"
    },
    {
      "name": "Scalability",
      "A": 90,
      "B": 85,
      "delta": "+6%",
      "explanation": "General explanation of what this metric measures",
      "A_reason": "Specific reason for A's score",
      "B_reason": "Specific reason for B's score"
    }
  ],
  "summary": "Brief recommendation (2-3 sentences max)",
  "confidence": "high",
  "evidence": [
    "Specific factual point 1",
    "Specific factual point 2"
  ]
}

Rules:
- Use realistic, domain-appropriate metrics (3-5 metrics)
- Scores must be 0-100 range
- Delta can be percentage or absolute difference
- Include 'explanation' for what each metric measures (generic)
- Include 'A_reason' and 'B_reason' for tech-specific score explanations
- Keep all text concise (1-2 sentences per reason)
- Evidence must be factual and specific
- Respond ONLY with valid JSON, no markdown, no extra text
"""


@router.post("/orchestrator/compare")
async def compare(request: CompareRequest) -> Dict[str, Any]:
    """
    Single-call comparison endpoint.
    
    Process:
    1. Validate input (need at least 2 options)
    2. Build prompt from request
    3. Call Gemini once
    4. Parse JSON response
    5. Save to decisions.json
    6. Return structured result
    """
    # Validate options
    if len(request.options) < 2:
        raise HTTPException(
            status_code=400,
            detail="Must provide at least two options to compare"
        )
    
    option_a = request.options[0]
    option_b = request.options[1]
    task_id = str(uuid.uuid4())
    
    # Build user prompt
    user_prompt_parts = []
    
    if request.query:
        user_prompt_parts.append(f"Query: {request.query}")
    
    user_prompt_parts.append(f"Options to compare: {option_a} vs {option_b}")
    
    if request.metrics:
        user_prompt_parts.append(f"Focus on metrics: {', '.join(request.metrics)}")
    
    if request.context:
        user_prompt_parts.append(f"Context: {json.dumps(request.context)}")
    
    user_prompt = "\n".join(user_prompt_parts)
    
    # Call Gemini (or dev stub)
    is_stub_response = False
    stub_reason = None
    
    try:
        llm_response: LLMResponse = call_gemini(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            max_tokens=700,
            model=None  # Use default from settings (gemini-2.5-flash)
        )
        
        is_stub_response = llm_response.is_stub
        stub_reason = llm_response.error
        raw_response = llm_response.text
        
        # Parse JSON response
        # Remove markdown code blocks if present
        cleaned = raw_response.strip()
        if cleaned.startswith("```"):
            # Extract JSON from code block
            lines = cleaned.split("\n")
            cleaned = "\n".join([l for l in lines if not l.startswith("```")])
        
        comparison_data = json.loads(cleaned)
        
    except json.JSONDecodeError as e:
        # If JSON parsing fails, return a fallback structure
        is_stub_response = True
        stub_reason = f"JSON parse error: {str(e)}"
        comparison_data = {
            "left": option_a,
            "right": option_b,
            "metrics": [
                {"name": "Overall Score", "A": 75, "B": 70, "delta": "+7%"}
            ],
            "summary": f"Comparison generated with fallback data due to parse error: {str(e)}",
            "confidence": "low",
            "evidence": ["Generated with fallback due to LLM response parsing error"]
        }
    
    except Exception as e:
        # Any other error: return error response
        raise HTTPException(
            status_code=500,
            detail=f"Comparison generation failed: {str(e)}"
        )
    
    # Enrich response with metadata
    response = {
        "id": task_id,
        "task_id": task_id,
        "timestamp": int(time.time()),
        "query": request.query or f"Compare {option_a} vs {option_b}",
        "left": comparison_data.get("left", option_a),
        "right": comparison_data.get("right", option_b),
        "metrics": _normalize_metrics(comparison_data.get("metrics", [])),
        "summary": comparison_data.get("summary", ""),
        "confidence": comparison_data.get("confidence", "medium"),
        "evidence": comparison_data.get("evidence", []),
        "context": request.context or {},
        # Metadata about response source
        "source": "stub" if is_stub_response else "gemini",
    }
    
    # Only save to decisions.json if this is a REAL API response (not stub data)
    if not is_stub_response:
        try:
            save_decision(response)
        except Exception as e:
            # Log but don't fail the request if persistence fails
            print(f"⚠️  Failed to save decision: {e}")
    else:
        print(f"⚠️  Skipping save: stub response ({stub_reason})")
    
    return response


def _normalize_metrics(metrics: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """
    Convert metrics array to dict format expected by frontend.
    
    Input:  [{"name": "Performance", "A": 85, "B": 78, "delta": "+9%"}, ...]
    Output: {"Performance": {"A": 85, "B": 78, "delta": "+9%"}, ...}
    """
    result = {}
    for m in metrics:
        name = m.get("name", "Metric")
        result[name] = {
            "A": m.get("A", 0),
            "B": m.get("B", 0),
            "delta": m.get("delta", "0%")
        }
    return result


@router.get("/debug/compare")
async def debug_compare():
    """
    Developer route for verifying orchestrator + Gemini pipeline.
    - Works in stub mode if GEMINI_API_KEY missing.
    - Returns timing, mode, and example output.
    """
    start = time.time()
    api_key = settings.gemini_api_key
    
    system_prompt = "You are an evaluation engine that compares two technologies concisely in JSON."
    user_prompt = (
        "Compare Redis and MongoDB for caching and scalability. "
        "Return valid JSON with metrics, summary, and confidence."
    )
    
    try:
        llm_response: LLMResponse = call_gemini(system_prompt, user_prompt)
        duration = round(time.time() - start, 2)
        
        mode = "stub" if llm_response.is_stub else "real"
        
        # Try to parse as JSON, fallback to raw text
        try:
            parsed_result = json.loads(llm_response.text) if llm_response.text.strip().startswith("{") else {"raw_text": llm_response.text}
        except json.JSONDecodeError:
            parsed_result = {"raw_text": llm_response.text}
        
        return {
            "status": "ok",
            "mode": mode,
            "is_stub": llm_response.is_stub,
            "stub_reason": llm_response.error,
            "duration_sec": duration,
            "example_query": "Redis vs MongoDB",
            "result": parsed_result,
            "model": settings.gemini_model,
            "api_key_configured": bool(api_key),
        }
    except Exception as e:
        return {
            "status": "error", 
            "error": str(e), 
            "mode": "unknown",
            "duration_sec": round(time.time() - start, 2)
        }
