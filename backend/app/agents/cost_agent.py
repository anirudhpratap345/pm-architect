import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv
from pathlib import Path

# Handle imports for both module and standalone execution
try:
    from ..models import ComparisonContext
except ImportError:
    # Fallback for standalone execution
    import sys
    backend_path = Path(__file__).resolve().parent.parent.parent
    if str(backend_path) not in sys.path:
        sys.path.insert(0, str(backend_path))
    from app.models import ComparisonContext

# Load .env from project root
project_root = Path(__file__).resolve().parent.parent.parent.parent
load_dotenv(project_root / ".env.local", override=True)
load_dotenv(project_root / ".env")
load_dotenv(project_root / "backend" / ".env.local", override=True)
load_dotenv(project_root / "backend" / ".env")

client = AsyncOpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

async def run(context: ComparisonContext) -> ComparisonContext:
    """
    CostAgent: Calculates Year 1 TCO, breakeven point, and slider data using 2025 pricing.
    """
    prompt = f"""
You are a ruthless cost analyst using accurate 2025 pricing data.
Compare {context.option_a} vs {context.option_b}.

Constraints: {", ".join(context.constraints) or "general MVP"}
Use case: {context.use_case or "standard startup app"}
Team/Budget: {context.team_size or "small"}, {context.budget or "cost-sensitive"}

Provide:
- Year 1 total cost of ownership at typical usage (e.g., 5K–10K monthly active users)
- Breakeven point (when the more expensive option becomes cheaper)
- Slider data for interactive frontend: exact costs at 1K, 10K, 50K users
- Key cost traps

Respond with ONLY valid JSON in this format:
{{
  "year1_tco": {{"a": 300, "b": 1140}},
  "breakeven_users": 40000,
  "slider_data": {{
    "users_levels": [1000, 10000, 50000],
    "costs_a": [25, 50, 100],
    "costs_b": [95, 200, 500]
  }},
  "traps": ["Firebase read overages on viral spikes", "Supabase paid add-ons for advanced features"]
}}
"""

    try:
        response = await client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=512
        )
        response_text = response.choices[0].message.content.strip()
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            response_text = "\n".join([l for l in lines if not l.startswith("```")])
        parsed = json.loads(response_text)
        context.cost_breakdown = parsed
    except Exception as e:
        print(f"CostAgent error: {e}")
        context.cost_breakdown = {"error": str(e)}

    return context

# Standalone test
if __name__ == "__main__":
    import asyncio
    async def test():
        ctx = ComparisonContext(query="test", option_a="Firebase", option_b="Supabase")
        ctx.constraints = ["low cost", "bootstrapped"]
        result = await run(ctx)
        print("Cost Breakdown:")
        print(json.dumps(result.cost_breakdown, indent=2))
    asyncio.run(test())
