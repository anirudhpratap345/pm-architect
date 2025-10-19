import json
from typing import Any, Dict, List

from .llm_client import call_gemini

PROMPT_TEMPLATE = (
    "SYSTEM: Metric Analyst\n"
    "USER: Options: A=\"{A}\", B=\"{B}\". Scenario: {scenario}. Metrics: {metrics}.\n"
    "Return JSON with 'metrics' list, 'notes', and 'confidence'."
)


def run(A: str, B: str, scenario: Dict[str, Any], metrics: List[str], task_id: str) -> Dict[str, Any]:
    prompt = PROMPT_TEMPLATE.format(A=A, B=B, scenario=json.dumps(scenario), metrics=json.dumps(metrics))
    raw = call_gemini(system_prompt="Metric Analyst", user_prompt=prompt)
    try:
        data = json.loads(raw)
        return {"task_id": task_id, "agent": "metric_analyst", "status": "ok", "payload": data.get("payload", data)}
    except Exception:
        return {
            "task_id": task_id,
            "agent": "metric_analyst",
            "status": "error",
            "payload": {"metrics": [], "notes": ["parse_error"], "confidence": 0.0},
        }


