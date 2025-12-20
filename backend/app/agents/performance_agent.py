import os
import json
from groq import Groq
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

# Initialize Groq client lazily
_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables. Please set it in .env or .env.local")
        _client = Groq(api_key=api_key)
    return _client

async def run(context: ComparisonContext) -> ComparisonContext:
    prompt = f"""
Compare performance of {context.option_a} vs {context.option_b} using real 2025 benchmarks.
Focus on metrics relevant to: {", ".join(context.constraints) or "general MVP"}

Provide:
- Key performance differences (latency, scalability, cold starts, etc.)
- 1–2 short real-world war stories or examples

Output ONLY valid JSON:
{{
  "benchmarks": {{"latency_ms": {{"a": 100, "b": 200}}, "scalability": {{"a": "excellent beyond 100K", "b": "strong to 50K"}}}},
  "war_stories": ["One team saw 300ms faster loads after switching to A", "B caused cold start issues in serverless"]
}}
"""

    try:
        client = get_client()
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=512
        )
        response_text = completion.choices[0].message.content.strip()
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            response_text = "\n".join([l for l in lines if not l.startswith("```")])
        parsed = json.loads(response_text)
        context.performance = parsed
    except Exception as e:
        print(f"PerformanceAgent error: {e}")

    return context

if __name__ == "__main__":
    import asyncio
    async def test():
        ctx = ComparisonContext(query="test", option_a="Firebase", option_b="Supabase")
        result = await run(ctx)
        print("Performance Data:")
        print(json.dumps(result.performance, indent=2))
    asyncio.run(test())
