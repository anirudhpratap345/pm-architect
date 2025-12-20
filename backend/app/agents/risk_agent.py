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
Analyze risks, developer experience, vendor lock-in, and migration paths for {context.option_a} vs {context.option_b}.
Context: {context.use_case or "MVP"}, {", ".join(context.constraints)}

Output ONLY valid JSON:
{{
  "gotchas_a": ["Cryptic security rules", "Unexpected read costs"],
  "gotchas_b": ["Younger ecosystem", "Limited edge functions"],
  "migration_effort": {{
    "a_to_b": "3-5 days, ~$2K contractor",
    "b_to_a": "1-2 weeks, higher due to data model"
  }},
  "dx_notes": ["A has better mobile SDKs", "B has simpler SQL queries"]
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
        context.risks = parsed
    except Exception as e:
        print(f"RiskAgent error: {e}")

    return context

if __name__ == "__main__":
    import asyncio
    async def test():
        ctx = ComparisonContext(query="test", option_a="Firebase", option_b="Supabase")
        result = await run(ctx)
        print("Risk Data:")
        print(json.dumps(result.risks, indent=2))
    asyncio.run(test())
