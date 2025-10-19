import json
from typing import Any, Dict


def call_gemini(system_prompt: str, user_prompt: str, max_tokens: int = 600, model: str = "gemini-1") -> str:
    """
    DEV STUB: return simple predictable JSON for testing.
    Replace this with your real Gemini API call (requests or httpx).
    """
    if "Researcher Agent" in system_prompt or "Researcher" in user_prompt:
        return json.dumps({
            "evidence": [
                {
                    "id": "doc1",
                    "source": "web:redis_bench",
                    "summary": "Redis faster p99 in many benchmarks."
                }
            ]
        })
    if "Metric Analyst" in system_prompt:
        return json.dumps({
            "task_id": "dev",
            "agent": "metric_analyst",
            "status": "ok",
            "payload": {
                "metrics": [
                    {"metric": "p99_latency_ms", "A": 12.0, "B": 18.0, "delta": -6.0}
                ],
                "notes": ["sample metric"],
                "confidence": 0.6
            }
        })
    if "Model Evaluator" in system_prompt:
        return json.dumps({
            "task_id": "dev",
            "agent": "model_evaluator",
            "status": "ok",
            "payload": {
                "rubric": [
                    {"metric": "developer_effort", "A_score": 3, "B_score": 2, "A_notes": "...", "B_notes": "..."}
                ],
                "summary": ["dev summary"],
                "confidence": 0.6
            }
        })
    if "Synthesizer" in system_prompt:
        return json.dumps({
            "task_id": "dev",
            "agent": "synthesizer",
            "status": "ok",
            "payload": {
                "recommendation": "Prefer A due to lower p99",
                "top_reasons": ["p99"],
                "next_steps": ["run prototype"],
                "tradeoffs": ["cost"],
                "confidence": 0.7
            }
        })
    if "Validator" in system_prompt:
        return json.dumps({
            "task_id": "dev",
            "agent": "validator",
            "status": "ok",
            "payload": {"issues": [], "confidence": 0.9}
        })
    # fallback
    return json.dumps({"message": "no-op stub"})


