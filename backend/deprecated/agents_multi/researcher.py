import json
from typing import Any, Dict

from .llm_client import call_gemini

PROMPT_TEMPLATE = (
    "SYSTEM: Researcher Agent.\n"
    "USER: Options: A=\"{A}\", B=\"{B}\". Scenario: {scenario}.\n"
    "Return JSON with an 'evidence' array."
)


def run(A: str, B: str, scenario: Dict[str, Any], task_id: str) -> Dict[str, Any]:
    prompt = PROMPT_TEMPLATE.format(A=A, B=B, scenario=json.dumps(scenario))
    raw = call_gemini(system_prompt="Researcher Agent", user_prompt=prompt)
    try:
        data = json.loads(raw)
        return {"task_id": task_id, "agent": "researcher", "status": "ok", "payload": data}
    except Exception:
        return {
            "task_id": task_id,
            "agent": "researcher",
            "status": "error",
            "payload": {"evidence": [], "notes": ["parse_error"]},
        }


