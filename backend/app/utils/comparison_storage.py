"""
Simple in-memory storage for saved comparisons.
In production, replace with database (PostgreSQL, MongoDB, etc.)
"""

from typing import Dict, Optional
from pathlib import Path
import sys

# Handle imports for both module and standalone execution
try:
    from ..models import SavedComparison
except ImportError:
    # Fallback for standalone execution
    backend_path = Path(__file__).resolve().parent.parent.parent
    if str(backend_path) not in sys.path:
        sys.path.insert(0, str(backend_path))
    from app.models import SavedComparison

# In-memory storage (replace with DB later)
_comparisons_store: Dict[str, SavedComparison] = {}


def save_comparison(comparison: SavedComparison) -> str:
    """
    Save a comparison and return its ID.
    
    Args:
        comparison: SavedComparison object
        
    Returns:
        str: The comparison ID (e.g., "abc123XY")
    """
    _comparisons_store[comparison.id] = comparison
    return comparison.id


def get_comparison(comparison_id: str) -> Optional[SavedComparison]:
    """
    Retrieve a comparison by ID.
    
    Args:
        comparison_id: The short ID (e.g., "abc123XY")
        
    Returns:
        SavedComparison if found, None otherwise
    """
    comparison = _comparisons_store.get(comparison_id)
    
    if comparison:
        # Increment view count
        comparison.view_count += 1
    
    return comparison


def get_recent_comparisons(limit: int = 10) -> list[SavedComparison]:
    """
    Get most recent comparisons (for analytics/admin).
    
    Args:
        limit: Max number to return
        
    Returns:
        List of SavedComparison objects, sorted by created_at desc
    """
    comparisons = list(_comparisons_store.values())
    comparisons.sort(key=lambda x: x.created_at, reverse=True)
    return comparisons[:limit]


def get_storage_stats() -> dict:
    """Get stats about stored comparisons"""
    return {
        "total_comparisons": len(_comparisons_store),
        "total_views": sum(c.view_count for c in _comparisons_store.values())
    }

