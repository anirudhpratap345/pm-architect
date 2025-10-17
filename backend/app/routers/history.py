from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

from ..data_store import (
    save_decision,
    get_all_decisions,
    get_decision_by_id,
    delete_decision,
)


router = APIRouter()


class DecisionIn(BaseModel):
    left: Optional[str] = Field(None)
    right: Optional[str] = Field(None)
    metrics: Optional[Dict[str, Any]] = Field(default_factory=dict)
    confidence: Optional[str] = Field(None)
    validation: Optional[str] = Field(None)
    evidence: Optional[List[str]] = Field(default_factory=list)
    timestamp: Optional[int] = Field(None)


@router.get("/history")
def list_history():
    return {"items": get_all_decisions()}


@router.get("/history/{decision_id}")
def get_history_item(decision_id: str):
    item = get_decision_by_id(decision_id)
    if not item:
        raise HTTPException(status_code=404, detail="Decision not found")
    return item


@router.post("/history")
def create_history_item(payload: DecisionIn):
    saved = save_decision(payload.dict(exclude_none=True))
    return saved


@router.delete("/history/{decision_id}")
def remove_history_item(decision_id: str):
    ok = delete_decision(decision_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Decision not found")
    return {"status": "deleted", "id": decision_id}


