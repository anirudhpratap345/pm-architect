import os
import json
import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

# Handle imports for value calculator
try:
    from ..utils.value_calculator import calculate_value_delivered
except ImportError:
    # Fallback for standalone execution
    import sys
    backend_path = Path(__file__).resolve().parent.parent.parent
    if str(backend_path) not in sys.path:
        sys.path.insert(0, str(backend_path))
    from app.utils.value_calculator import calculate_value_delivered

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

# Gemini setup
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Groq fallback client
groq_client = None

def get_groq_client():
    global groq_client
    if groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        groq_client = Groq(api_key=api_key)
    return groq_client


def generate_category_specific_steps(winner: str, category: str, context: ComparisonContext) -> str:
    """
    Generate getting started steps based on tech category.
    No code snippets, just actionable steps.
    """
    winner_lower = winner.lower()
    winner_clean = winner_lower.replace(' ', '-').replace('.', '').replace('js', '')
    
    if category == 'database':
        # Try to construct official docs URL for common databases
        docs_url = f"https://{winner_lower}.com/docs"
        if 'postgres' in winner_lower:
            docs_url = "https://www.postgresql.org/docs/current/tutorial-start.html"
        elif 'mongodb' in winner_lower:
            docs_url = "https://www.mongodb.com/docs/manual/tutorial/getting-started/"
        elif 'supabase' in winner_lower:
            docs_url = "https://supabase.com/docs/guides/getting-started"
        elif 'firebase' in winner_lower:
            docs_url = "https://firebase.google.com/docs/web/setup"
        elif 'redis' in winner_lower:
            docs_url = "https://redis.io/docs/getting-started/"
        
        return f"""Start right now:
1. Go to {winner_lower}.com and sign up for free tier (or download installer if self-hosted)
2. Follow the official quickstart: {docs_url}
3. Connect from your app using their official client library
4. Run a test query to verify it works

Setup time: 15-30 minutes. Everything's in the docs."""

    elif category == 'web_framework':
        return f"""Start right now:
1. Run: npx create-{winner_clean}@latest my-app
2. cd my-app && npm install
3. npm run dev
4. Open localhost in browser
5. Official guide: {winner_lower}.org/docs/getting-started

You'll have a working app in 5 minutes."""

    elif category == 'language':
        return f"""Start right now:
1. Install {winner}: visit {winner_lower}.org (or official site) and follow installation guide for your OS
2. Verify: {winner_lower} --version (or equivalent command)
3. Try the official tutorial from their docs
4. Write a "Hello World" to test
5. Pick an IDE: VS Code works for everything

Setup time: 20-30 minutes for a working environment."""

    elif category == 'ml_framework':
        return f"""Start right now:
1. Install: pip install {winner_lower}
2. Verify: python -c "import {winner_lower}; print({winner_lower}.__version__)"
3. Try official tutorial: {winner_lower}.org/tutorials
4. Run a simple example (MNIST is standard)
5. Join their community: Reddit r/{winner_lower} or Discord

Setup time: 15 minutes. GPU setup takes longer (follow their CUDA guide)."""

    elif category in ['infrastructure', 'message_queue']:
        return f"""Start right now:
1. Local setup: docker run {winner_lower} (easiest for testing)
2. Or follow official installation: {winner_lower}.io/docs/quickstart
3. Verify it's running: check the admin UI or CLI
4. Try a test message/deployment
5. Production setup: use their cloud offering or self-host guide

Local testing: 10 minutes. Production setup: 1-2 hours."""

    elif category == 'cloud_service':
        return f"""Start right now:
1. Create account: {winner_lower}.amazon.com or equivalent cloud provider
2. Get API credentials (Access Key + Secret) from the dashboard
3. Install CLI: follow their official CLI installation guide
4. Verify: {winner_lower} --version
5. Try a test operation (upload a file, etc.)

Setup time: 15 minutes. Official docs have everything."""

    elif category == 'auth':
        return f"""Start right now:
1. Sign up at {winner_lower}.com
2. Create a new application in their dashboard
3. Copy your API keys
4. Install SDK: npm install @{winner_clean}/sdk (or equivalent)
5. Follow their quickstart: {winner_lower}.com/docs/quickstart

You'll have login working in 20 minutes."""

    elif category == 'payment':
        return f"""Start right now:
1. Sign up at {winner_lower}.com
2. Get API keys (test mode for development)
3. Install SDK for your language
4. Follow their checkout tutorial
5. Test with their test card numbers

Setup time: 30 minutes. Compliance/legal review takes longer."""

    elif category == 'css_framework':
        return f"""Start right now:
1. Install: npm install {winner_lower}
2. Add to your config (follow their setup guide)
3. Import in your main CSS/JS file
4. Try a test component with their classes
5. Docs: {winner_lower}.com/docs

Working in 5 minutes. Customization takes longer."""

    elif category == 'graphics':
        return f"""Start right now:
1. Install: npm install {winner_lower}
2. Create a canvas element in your HTML
3. Follow their "Hello World" example
4. Run and verify you see a 3D scene
5. Docs: {winner_lower}.org/docs/getting-started

Simple scene in 10 minutes. Complex stuff takes practice."""

    elif category == 'hosting':
        return f"""Start right now:
1. Push your code to GitHub
2. Connect {winner} to your repo
3. Configure build settings (usually auto-detected)
4. Deploy (usually one-click)
5. Get your live URL

Deploy time: 5-15 minutes for first deployment."""

    elif category == 'backend_framework':
        return f"""Start right now:
1. Install {winner}: pip install {winner_lower} or npm install {winner_lower}
2. Create a project: {winner_lower} init my-app (or equivalent)
3. Run dev server
4. Hit localhost in browser/Postman
5. Follow official tutorial: {winner_lower}.io/tutorial

"Hello World" API in 10 minutes."""

    else:  # 'other' or unknown
        return f"""Start right now:
1. Visit {winner}'s official website
2. Follow their "Getting Started" or "Quickstart" guide
3. Check YouTube for "{winner} tutorial" if you prefer visual walkthroughs
4. Join their community (Discord/Reddit) for help
5. Official docs: visit their documentation site

Most tools have a quickstart that takes 15-30 minutes."""


def determine_winner(context: ComparisonContext, cost_data: dict, perf_data: dict, risk_data: dict) -> str:
    """
    Determines the winner based on user constraints and data.
    Returns either context.option_a or context.option_b.
    """
    constraints_lower = [c.lower() for c in context.constraints]
    query_lower = context.query.lower()
    
    # Cost-focused: pick cheaper option
    cost_keywords = ["low-cost", "low cost", "cheap", "budget", "bootstrapped", "free", "affordable", "cost-sensitive"]
    if any(kw in query_lower or any(kw in c for c in constraints_lower) for kw in cost_keywords):
        cost_a = cost_data.get("year1_tco", {}).get("a", float('inf'))
        cost_b = cost_data.get("year1_tco", {}).get("b", float('inf'))
        if isinstance(cost_a, (int, float)) and isinstance(cost_b, (int, float)):
            return context.option_b if cost_b < cost_a else context.option_a
    
    # Performance/scale-focused: pick faster/more scalable option
    perf_keywords = ["performance", "scale", "scalability", "fast", "speed", "latency", "high-traffic", "high traffic"]
    if any(kw in query_lower or any(kw in c for c in constraints_lower) for kw in perf_keywords):
        # Check performance data for winner
        benchmarks = perf_data.get("benchmarks", {})
        if benchmarks:
            # If we have latency data, pick lower latency
            latency = benchmarks.get("latency_ms", {})
            if latency:
                lat_a = latency.get(context.option_a, float('inf'))
                lat_b = latency.get(context.option_b, float('inf'))
                if isinstance(lat_a, (int, float)) and isinstance(lat_b, (int, float)):
                    return context.option_b if lat_b < lat_a else context.option_a
    
    # Quick MVP/simplicity-focused: pick option with fewer gotchas
    mvp_keywords = ["quick", "mvp", "fast", "simple", "easy", "prototype", "rapid"]
    if any(kw in query_lower or any(kw in c for c in constraints_lower) for kw in mvp_keywords):
        gotchas_a = len(risk_data.get("gotchas_a", []))
        gotchas_b = len(risk_data.get("gotchas_b", []))
        return context.option_b if gotchas_b < gotchas_a else context.option_a
    
    # Default: pick option with fewer gotchas
    gotchas_a = len(risk_data.get("gotchas_a", []))
    gotchas_b = len(risk_data.get("gotchas_b", []))
    if gotchas_b < gotchas_a:
        return context.option_b
    elif gotchas_a < gotchas_b:
        return context.option_a
    
    # Final fallback: pick option_b (arbitrary but consistent)
    return context.option_b


async def run(context: ComparisonContext) -> ComparisonContext:
    """
    NarrativeAgent: Synthesizes everything into a conversational Decision Brief.
    Primary: Gemini 1.5 Flash for conversational voice.
    Fallback: Groq Llama 3.3 70B if Gemini rate-limited.
    """
    # Extract data
    cost_data = context.cost_breakdown
    perf_data = context.performance
    risk_data = context.risks
    
    # Determine winner
    winner = determine_winner(context, cost_data, perf_data, risk_data)
    
    # Extract key metrics
    cost_a = cost_data.get("year1_tco", {}).get("a", 0)
    cost_b = cost_data.get("year1_tco", {}).get("b", 0)
    cost_savings = abs(cost_a - cost_b) if isinstance(cost_a, (int, float)) and isinstance(cost_b, (int, float)) else 0
    cheaper_cost = min(cost_a, cost_b) if isinstance(cost_a, (int, float)) and isinstance(cost_b, (int, float)) else "N/A"
    expensive_cost = max(cost_a, cost_b) if isinstance(cost_a, (int, float)) and isinstance(cost_b, (int, float)) else "N/A"
    breakeven = cost_data.get("breakeven_users", "N/A")
    
    gotchas_a = risk_data.get("gotchas_a", [])
    gotchas_b = risk_data.get("gotchas_b", [])
    gotcha_a = gotchas_a[0] if gotchas_a else "None"
    gotcha_b = gotchas_b[0] if gotchas_b else "None"
    
    migration_a_to_b = risk_data.get("migration_effort", {}).get("a_to_b", "Unknown")
    migration_b_to_a = risk_data.get("migration_effort", {}).get("b_to_a", "Unknown")
    
    # Get war story if available
    war_stories = perf_data.get("war_stories", [])
    war_story = war_stories[0] if war_stories else None
    
    # Build constraints string
    constraints_str = ", ".join(context.constraints) if context.constraints else "general use"
    
    # Generate category-specific getting started steps
    getting_started = generate_category_specific_steps(winner, context.tech_category, context)
    
    prompt = f"""You are a technical advisor with 15 years of experience helping founders make tech decisions. A founder just asked you: "{context.query}"

You've analyzed the data. Now write your recommendation like you're messaging them on Slack.

CRITICAL FORMATTING RULES:
1. NO markdown headers (#, ##, ###) anywhere—write in natural paragraphs
2. Use "you" language throughout (you said, your situation, you'll save)
3. Start with: "Pick {winner}. Here's why."
4. Write in 2-3 sentence paragraphs, not walls of text
5. Be opinionated—say "{winner} wins" not "both are good"
6. End with the EXACT getting started steps provided below (don't modify them)
7. 400-600 words MAXIMUM

CONTEXT YOU HAVE:
- Winner: {winner}
- Tech Category: {context.tech_category}
- Their situation: {context.use_case or 'general use'}, {context.team_size or 'unspecified team size'}, {context.budget or 'unspecified budget'}
- Key constraint: {constraints_str}
- Cost difference: ${cost_savings:,.0f} saved in Year 1 (if applicable)
- Cheaper option costs: ${cheaper_cost:,.0f} (if applicable)
- More expensive option costs: ${expensive_cost:,.0f} (if applicable)
- Breakeven point: {breakeven} users

KEY GOTCHAS:
- {context.option_a}: {gotcha_a}
- {context.option_b}: {gotcha_b}

MIGRATION EFFORT:
{migration_a_to_b} to switch from {context.option_a} to {context.option_b}
{migration_b_to_a} to switch from {context.option_b} to {context.option_a}

{f"WAR STORY: {war_story}" if war_story else ""}

TONE EXAMPLES (follow these):

✅ GOOD:
"You said bootstrapped MVP. That screams {winner}. You'll save ${cost_savings:,.0f} in Year 1 and ship 3 days faster."
"The catch? {context.option_a} has better mobile SDKs. But for web? {winner} wins."
"Here's the money shot: {winner} is FREE until ~8K users."

❌ BAD:
"Based on the analysis, {winner} appears to be a suitable choice."
"Both options have their merits and trade-offs to consider."
"{winner} provides advantages in cost efficiency scenarios."

GETTING STARTED SECTION:
End your brief with this EXACT text (don't modify it):

{getting_started}

That's it. Now write the brief. Remember: conversational, opinionated, under 600 words. NO markdown headers."""

    try:
        # Use the model from config or default to gemini-1.5-flash-latest
        model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash-latest")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        context.final_brief = response.text
    except Exception as e:
        print(f"Gemini failed ({e}), falling back to Groq...")
        client = get_groq_client()
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1024
        )
        context.final_brief = completion.choices[0].message.content.strip()
    
    # Calculate and append value delivered section
    value_data = calculate_value_delivered(context, cost_data, perf_data, risk_data)
    
    # Format money with comma separator
    money_str = f"${value_data['money_saved']:,}" if value_data['money_saved'] > 0 else "$0"
    confidence = value_data['confidence']
    
    value_section = f"""

---

⏱️ **This comparison just saved you:**
• {value_data['time_saved_hours']} hours of research time
• {money_str} in Year 1 (by picking the right option)
• {value_data['resources_consulted']['reddit_threads']} Reddit threads you would've read
• {value_data['resources_consulted']['youtube_videos']} YouTube videos you would've watched
• {value_data['resources_consulted']['documentation_pages']} documentation pages you would've skimmed

📊 **Confidence Level:** {confidence['level']} ({confidence['score']}/100)

*{confidence['explanation']}*

Based on:
{chr(10).join(f"• {factor}" for factor in confidence['factors'])}

🚀 **Time to decision:** {value_data['completion_time_seconds']} seconds (vs {value_data['time_saved_hours']} hours manually)

---

💬 **Want another comparison this clear?** Try comparing something else!"""
    
    context.final_brief += value_section

    return context

# Standalone test
if __name__ == "__main__":
    import asyncio
    async def test():
        ctx = ComparisonContext(query="Firebase vs Supabase for a low-cost bootstrapped MVP with React")
        ctx.option_a = "Firebase"
        ctx.option_b = "Supabase"
        ctx.tech_category = "database"  # Will be set by context_agent in real usage
        ctx.constraints = ["low cost", "bootstrapped"]
        ctx.use_case = "SaaS MVP"
        ctx.cost_breakdown = {"year1_tco": {"a": 1140, "b": 300}, "breakeven_users": 40000}
        ctx.performance = {"war_stories": ["One team got a $2K bill shock from Firebase reads"]}
        ctx.risks = {"gotchas_a": ["Read overages", "Security rules"], "gotchas_b": ["Younger ecosystem"], "migration_effort": {"a_to_b": "1-2 weeks", "b_to_a": "3-5 days"}}
        result = await run(ctx)
        print("\n=== FINAL DECISION BRIEF ===\n")
        # Handle Unicode encoding for Windows console
        import sys
        if sys.stdout.encoding != 'utf-8':
            sys.stdout.reconfigure(encoding='utf-8')
        print(result.final_brief)
    asyncio.run(test())
