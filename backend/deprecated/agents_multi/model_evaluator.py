import json
from typing import Any, Dict

from .llm_client import call_gemini

PROMPT_TEMPLATE = (
    "SYSTEM: Model Evaluator\n"
    "USER: Evaluate with rubric: {rubric}. Context: {context}.\n"
    "Return JSON with 'rubric', 'summary', 'confidence'."
)


def run(rubric: Any, context: Dict[str, Any], task_id: str) -> Dict[str, Any]:
    prompt = PROMPT_TEMPLATE.format(rubric=json.dumps(rubric or []), context=json.dumps(context or {}))
    raw = call_gemini(system_prompt="Model Evaluator", user_prompt=prompt)
    try:
        data = json.loads(raw)
        return {"task_id": task_id, "agent": "model_evaluator", "status": "ok", "payload": data.get("payload", data)}
    except Exception:
        return {
            "task_id": task_id,
            "agent": "model_evaluator",
            "status": "error",
            "payload": {"rubric": [], "summary": [], "confidence": 0.0},
        }


