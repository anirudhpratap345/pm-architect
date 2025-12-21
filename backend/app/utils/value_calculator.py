"""
Value Calculator for Decision Briefs
Calculates time saved, money saved, confidence score
"""

from typing import Dict, Any
from pathlib import Path
import sys

# Handle imports for both module and standalone execution
try:
    from ..models import ComparisonContext
except ImportError:
    # Fallback for standalone execution
    backend_path = Path(__file__).resolve().parent.parent.parent
    if str(backend_path) not in sys.path:
        sys.path.insert(0, str(backend_path))
    from app.models import ComparisonContext


def calculate_time_saved(context: ComparisonContext, cost_data: dict, perf_data: dict, risk_data: dict) -> int:
    """
    Calculate estimated time saved in hours.
    
    Logic:
    - Base: 4 hours (typical research time)
    - +2 hours if >2 constraints (complex requirements)
    - +4 hours if production/scale mentioned (needs deeper research)
    - +2 hours if performance-critical mentioned
    - Cap at 12 hours (believable maximum)
    
    Returns:
        int: Hours saved (4-12 range)
    """
    time_saved = 4  # Base research time
    
    # Complex requirements add time
    if len(context.constraints) > 2:
        time_saved += 2
    
    # Production/scale considerations add significant time
    use_case_lower = (context.use_case or "").lower()
    query_lower = context.query.lower()
    constraints_lower = " ".join(context.constraints).lower()
    
    if any(keyword in use_case_lower or keyword in query_lower or keyword in constraints_lower 
           for keyword in ['production', 'scale', 'enterprise', 'large', 'high-traffic', 'high traffic']):
        time_saved += 4
    
    # Performance-critical adds time
    if any(keyword in query_lower or keyword in constraints_lower 
           for keyword in ['high-performance', 'low-latency', 'fast', 'performance']):
        time_saved += 2
    
    # Cap at 12 hours (believable)
    return min(time_saved, 12)


def calculate_money_saved(cost_data: dict) -> int:
    """
    Calculate money saved by picking the cheaper option.
    
    Returns:
        int: Dollar amount saved in Year 1
    """
    if not cost_data or 'year1_tco' not in cost_data:
        return 0
    
    tco = cost_data['year1_tco']
    cost_a = tco.get('a', 0)
    cost_b = tco.get('b', 0)
    
    if isinstance(cost_a, (int, float)) and isinstance(cost_b, (int, float)):
        return int(abs(cost_a - cost_b))
    
    return 0


def calculate_confidence_score(cost_data: dict, perf_data: dict, risk_data: dict, context: ComparisonContext) -> Dict[str, Any]:
    """
    Calculate confidence level based on data quality.
    
    Scoring:
    - Clear cost difference (>50%): +30 points
    - Moderate cost difference (25-50%): +20 points
    - Small cost difference (<25%): +10 points
    - Performance benchmarks available: +20 points
    - Migration path documented: +20 points
    - Clear user requirements (2+ constraints): +15 points
    - Community data available: +15 points
    
    Returns:
        dict: {
            'score': int (0-100),
            'level': str ('Very High', 'High', 'Moderate', 'Low'),
            'explanation': str,
            'factors': list[str]
        }
    """
    score = 0
    factors = []
    
    # Factor 1: Cost difference clarity (30 points max)
    if cost_data and 'year1_tco' in cost_data:
        tco = cost_data['year1_tco']
        cost_a = tco.get('a', 1)
        cost_b = tco.get('b', 1)
        
        if cost_a > 0 and cost_b > 0:
            max_cost = max(cost_a, cost_b)
            cost_diff_pct = abs(cost_a - cost_b) / max_cost * 100
            
            if cost_diff_pct > 50:
                score += 30
                factors.append("Large cost difference (>50%)")
            elif cost_diff_pct > 25:
                score += 20
                factors.append("Moderate cost difference (25-50%)")
            else:
                score += 10
                factors.append("Small cost difference (<25%)")
    
    # Factor 2: Performance data available (20 points)
    if perf_data and perf_data.get('benchmarks'):
        score += 20
        factors.append("Performance benchmarks available")
    elif perf_data and perf_data.get('war_stories'):
        score += 10
        factors.append("Real-world performance examples")
    else:
        score += 5
        factors.append("Limited performance data")
    
    # Factor 3: Migration path documented (20 points)
    if risk_data and risk_data.get('migration_effort'):
        score += 20
        factors.append("Migration paths documented")
    else:
        score += 5
        factors.append("Migration paths unclear")
    
    # Factor 4: User context clarity (15 points)
    if len(context.constraints) >= 2:
        score += 15
        factors.append("Clear user requirements")
    else:
        score += 5
        factors.append("General requirements")
    
    # Factor 5: Community/real-world data (15 points)
    # Check for gotchas (indicates real-world knowledge)
    if risk_data and (risk_data.get('gotchas_a') or risk_data.get('gotchas_b')):
        score += 15
        factors.append("Real-world gotchas identified")
    else:
        score += 10
        factors.append("Industry knowledge applied")
    
    # Determine level
    if score >= 85:
        level = "Very High"
        explanation = "Strong evidence across all factors"
    elif score >= 70:
        level = "High"
        explanation = "Solid data with minor gaps"
    elif score >= 50:
        level = "Moderate"
        explanation = "Good data but some uncertainty"
    else:
        level = "Low"
        explanation = "Limited data or very close call"
    
    return {
        'score': score,
        'level': level,
        'explanation': explanation,
        'factors': factors
    }


def calculate_resources_consulted() -> Dict[str, int]:
    """
    Return typical resources a user would have consulted manually.
    These are realistic estimates based on typical research patterns.
    
    Returns:
        dict: Resource counts
    """
    return {
        'reddit_threads': 12,
        'youtube_videos': 3,
        'documentation_pages': 15,
        'stackoverflow_posts': 8
    }


def calculate_value_delivered(
    context: ComparisonContext,
    cost_data: dict,
    perf_data: dict,
    risk_data: dict
) -> Dict[str, Any]:
    """
    Main function: Calculate all value metrics for the decision brief.
    
    Returns:
        dict: Complete value metrics including time, money, resources, confidence
    """
    time_saved = calculate_time_saved(context, cost_data, perf_data, risk_data)
    money_saved = calculate_money_saved(cost_data)
    confidence = calculate_confidence_score(cost_data, perf_data, risk_data, context)
    resources = calculate_resources_consulted()
    
    return {
        'time_saved_hours': time_saved,
        'money_saved': money_saved,
        'resources_consulted': resources,
        'confidence': confidence,
        'completion_time_seconds': 6  # Typical API response time
    }

