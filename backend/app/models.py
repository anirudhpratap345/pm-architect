from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List

class ComparisonContext(BaseModel):
    query: str = Field(..., description="Original user query")
    option_a: str = Field(default="", description="First tech/stack")
    option_b: str = Field(default="", description="Second tech/stack")
    constraints: List[str] = Field(default_factory=list)
    use_case: Optional[str] = None
    team_size: Optional[str] = None
    timeline: Optional[str] = None
    budget: Optional[str] = None
    cost_breakdown: Dict[str, Any] = Field(default_factory=dict)
    performance: Dict[str, Any] = Field(default_factory=dict)
    risks: Dict[str, Any] = Field(default_factory=dict)
    final_brief: str = ""

