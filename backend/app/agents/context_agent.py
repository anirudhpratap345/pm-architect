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
    """
    ContextAgent: Parses the user's raw query and extracts structured information.
    Uses Groq + Llama 3.3 70B for speed and accuracy.
    """
    prompt = f"""
You are an expert query parser for technology comparison decisions.
Carefully analyze the following user query and extract the required information.

User query: "{context.query}"

Your task:
- Identify the two technologies/frameworks being compared (option_a and option_b).
- Extract explicit constraints (e.g., "low cost", "bootstrapped", "MVP", "mobile-first").
- Infer additional context where possible:
  - use_case (e.g., "SaaS app", "mobile app", "real-time chat")
  - team_size (e.g., "solo", "small team", "enterprise")
  - timeline (e.g., "quick MVP", "2 weeks")
  - budget (e.g., "under $100/mo", "cost-sensitive")

Respond with ONLY valid JSON in this exact format (no extra text):
{{
  "option_a": "First technology name",
  "option_b": "Second technology name",
  "constraints": ["constraint1", "constraint2"],
  "use_case": "inferred use case or null",
  "team_size": "inferred team size or null",
  "timeline": "inferred timeline or null",
  "budget": "inferred budget or null"
}}
"""

    try:
        client = get_client()
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a precise JSON extractor. Never add explanations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=512
        )
        response_text = completion.choices[0].message.content.strip()
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            response_text = "\n".join([l for l in lines if not l.startswith("```")])
        parsed = json.loads(response_text)

        # Update the context object
        context.option_a = parsed["option_a"]
        context.option_b = parsed["option_b"]
        context.constraints = parsed.get("constraints", [])
        context.use_case = parsed.get("use_case")
        context.team_size = parsed.get("team_size")
        context.timeline = parsed.get("timeline")
        context.budget = parsed.get("budget")

    except Exception as e:
        # Fallback values on error to prevent total failure
        context.option_a = "Unknown A"
        context.option_b = "Unknown B"
        print(f"ContextAgent error: {e}")

    return context


if __name__ == "__main__":
    import asyncio
    import sys
    from pathlib import Path
    
    # Add backend to path for imports when running as script
    backend_path = Path(__file__).resolve().parent.parent.parent
    if str(backend_path) not in sys.path:
        sys.path.insert(0, str(backend_path))
    
    # Import using absolute path
    from app.models import ComparisonContext

    async def test_context_agent():
        ctx = ComparisonContext(query="Firebase vs Supabase for a low-cost bootstrapped MVP with React")
        result = await run(ctx)
        print("Parsed Context:")
        print(json.dumps(result.model_dump(), indent=2))

    asyncio.run(test_context_agent())
