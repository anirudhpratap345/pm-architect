from fastapi import APIRouter, Query
from pydantic import BaseModel, Field, AnyUrl
from typing import List, Optional


router = APIRouter()


class Tech(BaseModel):
    id: str
    name: str
    slug: str
    categories: List[str]
    short_desc: Optional[str] = None
    official_url: Optional[AnyUrl] = None


# Minimal static dataset to power the Options feature without a DB
_CATEGORIES: List[str] = [
    "frontend", "backend", "databases", "cloud", "devops", "apis", "ml", "ai"
]

_TECHS: List[Tech] = [
    Tech(
        id="react", name="React", slug="react",
        categories=["frontend"],
        short_desc="UI library for building interactive UIs",
        official_url="https://react.dev",
    ),
    Tech(
        id="vue", name="Vue", slug="vue",
        categories=["frontend"],
        short_desc="Progressive framework for building UIs",
        official_url="https://vuejs.org",
    ),
    Tech(
        id="nextjs", name="Next.js", slug="nextjs",
        categories=["frontend"],
        short_desc="React framework for production apps",
        official_url="https://nextjs.org",
    ),
    Tech(
        id="fastapi", name="FastAPI", slug="fastapi",
        categories=["backend"],
        short_desc="High-performance Python API framework",
        official_url="https://fastapi.tiangolo.com",
    ),
    Tech(
        id="django", name="Django", slug="django",
        categories=["backend"],
        short_desc="Batteries-included Python web framework",
        official_url="https://www.djangoproject.com",
    ),
    Tech(
        id="postgres", name="PostgreSQL", slug="postgres",
        categories=["databases"],
        short_desc="Advanced open-source relational database",
        official_url="https://www.postgresql.org",
    ),
    Tech(
        id="redis", name="Redis", slug="redis",
        categories=["databases", "devops"],
        short_desc="In-memory data store for cache and queues",
        official_url="https://redis.io",
    ),
    Tech(
        id="aws", name="AWS", slug="aws",
        categories=["cloud", "devops"],
        short_desc="Comprehensive cloud platform",
        official_url="https://aws.amazon.com",
    ),
]

_PRESETS: List[str] = [
    "frontend", "backend", "databases", "cloud"
]


@router.get("/options/categories", response_model=List[str])
def get_categories() -> List[str]:
    return _CATEGORIES


@router.get("/options/presets", response_model=List[str])
def get_presets() -> List[str]:
    return _PRESETS


@router.get("/options/techs", response_model=List[Tech])
def get_techs(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search by name or slug"),
) -> List[Tech]:
    results = _TECHS
    if category:
        results = [t for t in results if category.lower() in {c.lower() for c in t.categories}]
    if search:
        q = search.lower()
        results = [t for t in results if q in t.name.lower() or q in t.slug.lower()]
    return results


@router.get("/options/debug")
def options_debug():
    return {
        "categories": _CATEGORIES,
        "presets": _PRESETS,
        "tech_count": len(_TECHS),
        "sample_frontend": [t.dict() for t in _TECHS if "frontend" in t.categories][:3],
    }


