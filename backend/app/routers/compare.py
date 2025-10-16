from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from ..services.orchestrator_agent import OrchestratorAgent


router = APIRouter()


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
    return result
  except HTTPException:
    raise
  except Exception as exc:  # noqa: BLE001
    raise HTTPException(status_code=500, detail=str(exc))


