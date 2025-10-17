from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from ..services.orchestrator_agent import OrchestratorAgent
from ..data_store import save_decision
import logging


router = APIRouter()
logger = logging.getLogger(__name__)


class CompareRequest(BaseModel):
  query: Optional[str] = Field(None, description="User comparison prompt, supports 'A vs B'")
  options: Optional[List[str]] = Field(None, description="Explicit options to compare (prefer exactly two)")
  metrics: Optional[List[str]] = Field(None, description="Metrics to evaluate")
  context: Optional[str] = Field(None, description="Additional domain context")


class CompareResponse(BaseModel):
  task: str
  options: List[str]
  metrics: List[str]
  analysis: Dict[str, Any]
  synthesis: Dict[str, Any]
  model: str
  cost_estimate: Dict[str, Any]


@router.post("/compare", response_model=CompareResponse)
async def compare(req: CompareRequest):
  try:
    orchestrator = OrchestratorAgent()
    result = await orchestrator.run(
      query=req.query,
      options=req.options,
      metrics=req.metrics,
      context=req.context,
    )
    # Best-effort auto-save to file store; do not impact response on failure
    try:
      # Normalize into Phase 5-Lite shape expected by UI/history
      r = result if isinstance(result, dict) else {}
      options = r.get('options') or (req.options or [])
      left = None
      right = None
      if isinstance(options, list) and len(options) >= 2:
        left, right = options[0], options[1]
      # Try pull metrics/confidence/evidence from common locations
      synthesis = r.get('synthesis') or {}
      analysis = r.get('analysis') or {}
      metrics = r.get('metrics') or synthesis.get('metrics') or analysis.get('metrics') or {}
      confidence = r.get('confidence') or synthesis.get('confidence')
      validation = r.get('validation') or synthesis.get('validation')
      evidence = r.get('evidence') or synthesis.get('evidence') or analysis.get('evidence') or []
      decision_payload = {
        'left': synthesis.get('left') or left,
        'right': synthesis.get('right') or right,
        'metrics': metrics,
        'confidence': confidence,
        'validation': validation,
        'evidence': evidence,
        'raw': r,
      }
      save_decision(decision_payload)
    except Exception as save_exc:  # noqa: BLE001
      logger.warning(f"History auto-save failed: {save_exc}")
    return result
  except HTTPException:
    raise
  except Exception as exc:  # noqa: BLE001
    raise HTTPException(status_code=500, detail=str(exc))


