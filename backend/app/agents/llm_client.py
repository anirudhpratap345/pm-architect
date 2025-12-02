# backend/app/agents/llm_client.py
"""
Gemini LLM client wrapper for PM Architect Lite Orchestrator.

DEV MODE (default): Returns deterministic stub JSON for testing without API costs.
PRODUCTION MODE: Set GEMINI_API_KEY in environment to enable real Gemini API calls.
"""

import json
from typing import Optional

# Optional: import Gemini SDK if available
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

from ..config import settings


class LLMResponse:
    """Response wrapper that tracks whether data is from real API or stub."""
    def __init__(self, text: str, is_stub: bool = False, error: str = None):
        self.text = text
        self.is_stub = is_stub
        self.error = error


def call_gemini(
    system_prompt: str,
    user_prompt: str,
    max_tokens: int = 400,
    model: Optional[str] = None
) -> LLMResponse:
    """
    Call Gemini API to generate structured comparison output.
    
    Args:
        system_prompt: System instructions for the LLM
        user_prompt: User query and context
        max_tokens: Maximum response length
        model: Gemini model name (defaults to settings.gemini_model)
    
    Returns:
        LLMResponse with text and metadata about source (real API vs stub)
    """
    api_key = settings.gemini_api_key
    model_name = model or settings.gemini_model
    
    # If no API key or genai not available, use dev stub
    if not api_key or not GENAI_AVAILABLE:
        return LLMResponse(
            text=_dev_stub(user_prompt),
            is_stub=True,
            error="No API key configured" if not api_key else "google-generativeai SDK not installed"
        )
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Create model instance
        gemini_model = genai.GenerativeModel(
            model_name=model_name,
            generation_config={
                "temperature": 0.3,
                "max_output_tokens": max_tokens,
            }
        )
        
        # Combine system and user prompts
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        
        # Generate response
        response = gemini_model.generate_content(full_prompt)
        
        return LLMResponse(text=response.text, is_stub=False)
        
    except Exception as e:
        # Fallback to dev stub on error
        print(f"⚠️  Gemini API call failed: {e}. Using dev stub.")
        return LLMResponse(
            text=_dev_stub(user_prompt),
            is_stub=True,
            error=str(e)
        )


def _dev_stub(user_prompt: str) -> str:
    """
    Development stub that returns deterministic JSON for testing.
    Parses options from user_prompt if possible.
    """
    # Try to extract options from prompt
    left_option = "Option A"
    right_option = "Option B"
    
    # Look for "Options to compare: X vs Y" pattern
    import re
    options_match = re.search(r'Options to compare:\s*([^\s]+)\s+vs\s+([^\s\n]+)', user_prompt, re.IGNORECASE)
    if options_match:
        left_option = options_match.group(1).strip()
        right_option = options_match.group(2).strip()
    
    return json.dumps({
        "left": left_option,
        "right": right_option,
        "metrics": [
            {
                "name": "Performance",
                "A": 85,
                "B": 78,
                "delta": "+9%",
                "explanation": "How fast and efficient the technology handles workloads",
                "A_reason": f"{left_option} demonstrates strong performance in benchmark tests with optimized caching.",
                "B_reason": f"{right_option} shows good performance but slightly lower throughput under heavy load."
            },
            {
                "name": "Ease of Use",
                "A": 90,
                "B": 85,
                "delta": "+6%",
                "explanation": "How quickly developers can learn and become productive",
                "A_reason": f"{left_option} has intuitive APIs and excellent documentation making onboarding smooth.",
                "B_reason": f"{right_option} is developer-friendly with good docs, though slightly steeper learning curve."
            },
            {
                "name": "Community Support",
                "A": 95,
                "B": 80,
                "delta": "+19%",
                "explanation": "Size and activity of the community, available resources",
                "A_reason": f"{left_option} benefits from a large, active community with extensive third-party resources.",
                "B_reason": f"{right_option} has solid community support but smaller ecosystem compared to competitors."
            },
            {
                "name": "Cost",
                "A": 3.5,
                "B": 2.8,
                "delta": "-20%",
                "explanation": "Total cost of ownership including hosting and operational expenses",
                "A_reason": f"{left_option} has moderate pricing with some premium features requiring paid tiers.",
                "B_reason": f"{right_option} offers competitive pricing with generous free tier and lower operational costs."
            }
        ],
        "summary": f"{left_option} offers better performance and ecosystem support, while {right_option} provides lower operational costs. Consider {left_option} for high-throughput scenarios.",
        "confidence": "high",
        "evidence": [
            f"{left_option} has proven scalability in production environments",
            f"{right_option} shows consistent performance under moderate loads",
            "Both options are actively maintained with regular updates"
        ]
    })

