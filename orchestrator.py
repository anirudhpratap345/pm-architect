import asyncio
import sys
from pathlib import Path

# Add backend/app to path for imports
backend_app_path = Path(__file__).resolve().parent / "backend" / "app"
if str(backend_app_path) not in sys.path:
    sys.path.insert(0, str(backend_app_path))

from models import ComparisonContext
from agents.context_agent import run as context_run
from agents.cost_agent import run as cost_run
from agents.performance_agent import run as perf_run
from agents.risk_agent import run as risk_run
from agents.narrative_agent import run as narrative_run

async def compare_anything(query: str) -> dict:
    """
    Full multi-agent pipeline orchestrator.
    """
    # Start with raw query
    context = ComparisonContext(query=query, option_a="", option_b="")

    # 1. Parse context
    context = await context_run(context)

    # 2. Run specialist agents in parallel
    cost_task = cost_run(context)
    perf_task = perf_run(context)
    risk_task = risk_run(context)

    # Agents modify context in place, so we just await them
    await asyncio.gather(cost_task, perf_task, risk_task)

    # 3. Synthesize final brief
    context = await narrative_run(context)

    # Return both brief and any interactive data
    return {
        "brief": context.final_brief,
        "slider_data": context.cost_breakdown.get("slider_data", {})
    }

# Standalone test
if __name__ == "__main__":
    import asyncio
    import sys
    # Handle Unicode encoding for Windows console
    if sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except:
            pass  # If reconfigure fails, continue anyway
    async def full_test():
        result = await compare_anything("Firebase vs Supabase for a low-cost bootstrapped MVP with React")
        print(result["brief"])
    asyncio.run(full_test())
