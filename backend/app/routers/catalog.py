import json
import os
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field, AnyUrl


router = APIRouter(tags=["Catalog"])


# Simple file-backed cache with mtime checks
_CACHE: Dict[str, Dict[str, Any]] = {}


def _data_path(filename: str) -> str:
    base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
    return os.path.join(base_dir, filename)


def _load_json_cached(filename: str) -> Any:
    path = _data_path(filename)
    if not os.path.exists(path):
        return []
    mtime = os.path.getmtime(path)
    entry = _CACHE.get(path)
    if entry and entry.get("mtime") == mtime:
        return entry["data"]
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    _CACHE[path] = {"mtime": mtime, "data": data}
    return data


class Category(BaseModel):
    id: str
    label: str
    description: Optional[str] = None


class Tech(BaseModel):
    id: str
    name: str
    slug: str
    short_desc: Optional[str] = None
    categories: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    aliases: List[str] = Field(default_factory=list)
    meta: Dict[str, Any] = Field(default_factory=dict)
    popularity: float = 0.0


class MetricTemplate(BaseModel):
    metric_id: str
    title: str
    description: str
    scale: Optional[str] = None


class EvidenceRef(BaseModel):
    source_id: str
    excerpt: str
    url: Optional[AnyUrl] = None


class TechMetricItem(BaseModel):
    metric_id: str
    score: float
    delta: Optional[float] = None
    explained_reason: Optional[str] = None
    confidence: Optional[float] = None
    evidence_refs: Optional[List[EvidenceRef]] = None


class TechMetricsResponse(BaseModel):
    tech_id: str
    metrics: List[TechMetricItem]
    last_updated: Optional[str] = None


@router.get("/categories", response_model=List[Category])
def get_categories() -> List[Category]:
    data = _load_json_cached("categories.json")
    return [Category(**c) for c in data]


@router.get("/techs", response_model=List[Tech])
def get_techs(
    category: Optional[str] = Query(None, description="Filter by category id"),
    search: Optional[str] = Query(None, description="Search name/slug/aliases/tags"),
    limit: int = Query(20, ge=1, le=100),
) -> List[Tech]:
    rows = [Tech(**t) for t in _load_json_cached("techs.json")]
    if category:
        rows = [t for t in rows if category.lower() in {c.lower() for c in t.categories}]
    if search:
        q = search.lower()
        def match(t: Tech) -> bool:
            hay = [t.name, t.slug] + t.aliases + t.tags
            return any(q in (s or "").lower() for s in hay)
        rows = [t for t in rows if match(t)]
    # Sort by popularity descending, then name asc
    rows.sort(key=lambda t: (-t.popularity, t.name.lower()))
    return rows[:limit]


@router.get("/tech/{tech_id}", response_model=Tech)
def get_tech(tech_id: str) -> Tech:
    rows = [Tech(**t) for t in _load_json_cached("techs.json")]
    for t in rows:
        if t.id == tech_id or t.slug == tech_id:
            return t
    raise HTTPException(status_code=404, detail="Tech not found")


@router.get("/metrics/templates", response_model=List[MetricTemplate])
def get_metric_templates() -> List[MetricTemplate]:
    rows = [MetricTemplate(**m) for m in _load_json_cached("metric_templates.json")]
    return rows


@router.get("/tech/{tech_id}/metrics", response_model=TechMetricsResponse)
def get_tech_metrics(tech_id: str) -> TechMetricsResponse:
    rows = _load_json_cached("tech_metrics.json")
    # tech_metrics.json structure: [{"tech_id": "react", "metrics": [...], "last_updated": "..."}, ...]
    for item in rows:
        if item.get("tech_id") == tech_id:
            # Validate via Pydantic
            metrics = [TechMetricItem(**m) for m in item.get("metrics", [])]
            return TechMetricsResponse(tech_id=tech_id, metrics=metrics, last_updated=item.get("last_updated"))
    # Not found – return empty metrics (better than 404 for lazy UI)
    return TechMetricsResponse(tech_id=tech_id, metrics=[], last_updated=None)


