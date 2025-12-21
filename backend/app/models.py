from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import datetime
import secrets

class ComparisonContext(BaseModel):
    query: str = Field(..., description="Original user query")
    option_a: str = Field(default="", description="First tech/stack")
    option_b: str = Field(default="", description="Second tech/stack")
    constraints: List[str] = Field(default_factory=list)
    use_case: Optional[str] = None
    team_size: Optional[str] = None
    timeline: Optional[str] = None
    budget: Optional[str] = None
    tech_category: str = Field(default="other", description="Technology category (database, language, web_framework, etc.)")
    cost_breakdown: Dict[str, Any] = Field(default_factory=dict)
    performance: Dict[str, Any] = Field(default_factory=dict)
    risks: Dict[str, Any] = Field(default_factory=dict)
    final_brief: str = ""


class SavedComparison(BaseModel):
    """Saved comparison that can be shared via URL"""
    id: str = Field(default_factory=lambda: secrets.token_urlsafe(8))  # Generates short ID like "abc123XY"
    query: str
    option_a: str
    option_b: str
    tech_category: str
    brief: str
    slider_data: Optional[Dict[str, Any]] = None
    value_metrics: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    view_count: int = 0
    
    model_config = {
        "json_encoders": {
            datetime: lambda v: v.isoformat()
        }
    }

