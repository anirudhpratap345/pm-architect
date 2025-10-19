# backend/app/agents/llm_client.py
"""
Gemini LLM client wrapper for PM Architect Lite Orchestrator.

DEV MODE (default): Returns deterministic stub JSON for testing without API costs.
PRODUCTION MODE: Set GEMINI_API_KEY in environment to enable real Gemini API calls.
"""

import json
import os
from typing import Optional

# Optional: import Gemini SDK if available
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False


def call_gemini(
    system_prompt: str,
    user_prompt: str,
    max_tokens: int = 400,
    model: str = "gemini-2.0-flash-exp"
) -> str:
    """
    Call Gemini API to generate structured comparison output.
    
    Args:
        system_prompt: System instructions for the LLM
        user_prompt: User query and context
        max_tokens: Maximum response length
        model: Gemini model name
    
    Returns:
        JSON string with comparison structure
    """
    api_key = os.getenv("GEMINI_API_KEY", "")
    
    # If no API key or genai not available, use dev stub
    if not api_key or not GENAI_AVAILABLE:
        return _dev_stub(user_prompt)
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Create model instance
        gemini_model = genai.GenerativeModel(
            model_name=model,
            generation_config={
                "temperature": 0.3,
                "max_output_tokens": max_tokens,
            }
        )
        
        # Combine system and user prompts
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        
        # Generate response
        response = gemini_model.generate_content(full_prompt)
        
        return response.text
        
    except Exception as e:
        # Fallback to dev stub on error
        print(f"⚠️  Gemini API call failed: {e}. Using dev stub.")
        return _dev_stub(user_prompt)


def _dev_stub(user_prompt: str) -> str:
    """
    Development stub that returns deterministic JSON for testing.
    Parses options from user_prompt if possible.
    """
    # Try to extract options from prompt
    left_option = "Redis"
    right_option = "Memcached"
    
    if "options" in user_prompt.lower() or "vs" in user_prompt.lower():
        # Simple heuristic: look for common patterns
        if "react" in user_prompt.lower():
            left_option = "React"
            right_option = "Vue" if "vue" in user_prompt.lower() else "Angular"
        elif "gpt" in user_prompt.lower():
            left_option = "GPT-4o"
            right_option = "Gemini 2.5" if "gemini" in user_prompt.lower() else "Claude 3.5"
        elif "python" in user_prompt.lower():
            left_option = "Python"
            right_option = "JavaScript" if "javascript" in user_prompt.lower() else "Go"
    
    return json.dumps({
        "left": left_option,
        "right": right_option,
        "metrics": [
            {"name": "Performance", "A": 85, "B": 78, "delta": "+9%"},
            {"name": "Ease of Use", "A": 90, "B": 85, "delta": "+6%"},
            {"name": "Community Support", "A": 95, "B": 80, "delta": "+19%"},
            {"name": "Cost", "A": 3.5, "B": 2.8, "delta": "-20%"}
        ],
        "summary": f"{left_option} offers better performance and ecosystem support, while {right_option} provides lower operational costs. Consider {left_option} for high-throughput scenarios.",
        "confidence": "high",
        "evidence": [
            f"{left_option} has proven scalability in production environments",
            f"{right_option} shows consistent performance under moderate loads",
            "Both options are actively maintained with regular updates"
        ]
    })

