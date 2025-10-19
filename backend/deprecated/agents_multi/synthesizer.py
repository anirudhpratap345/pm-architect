import json
from typing import Any, Dict

from .llm_client import call_gemini

PROMPT_TEMPLATE = (
    "SYSTEM: Synthesizer\n"
    "USER: Combine inputs and produce recommendation, top_reasons, tradeoffs, next_steps. Context: {context}.\n"
    "Return JSON with fields above and 'confidence'."
)


def run(context: Dict[str, Any], task_id: str) -> Dict[str, Any]:
    prompt = PROMPT_TEMPLATE.format(context=json.dumps(context or {}))
    raw = call_gemini(system_prompt="Synthesizer", user_prompt=prompt)
    try:
        data = json.loads(raw)
        return {"task_id": task_id, "agent": "synthesizer", "status": "ok", "payload": data.get("payload", data)}
    except Exception:
        return {
            "task_id": task_id,
            "agent": "synthesizer",
            "status": "error",
            "payload": {"recommendation": "", "top_reasons": [], "tradeoffs": [], "next_steps": [], "confidence": 0.0},
        }


