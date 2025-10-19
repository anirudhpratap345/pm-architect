import json
from typing import Any, Dict

from .llm_client import call_gemini

PROMPT_TEMPLATE = (
    "SYSTEM: Validator\n"
    "USER: Validate coherence and identify issues. Context: {context}.\n"
    "Return JSON with 'issues' and 'confidence'."
)


def run(context: Dict[str, Any], task_id: str) -> Dict[str, Any]:
    prompt = PROMPT_TEMPLATE.format(context=json.dumps(context or {}))
    raw = call_gemini(system_prompt="Validator", user_prompt=prompt)
    try:
        data = json.loads(raw)
        return {"task_id": task_id, "agent": "validator", "status": "ok", "payload": data.get("payload", data)}
    except Exception:
        return {
            "task_id": task_id,
            "agent": "validator",
            "status": "error",
            "payload": {"issues": ["parse_error"], "confidence": 0.0},
        }


