import os
import sys
import json
import asyncio
from typing import Any, Dict


def log(title: str, data: Any) -> None:
  print(f"\n=== {title} ===")
  try:
    print(json.dumps(data, indent=2))
  except Exception:
    print(str(data))


async def run_test() -> int:
  # Ensure required envs for settings; use dummy to avoid real API calls
  os.environ.setdefault("GEMINI_API_KEY", "DUMMY")
  os.environ.setdefault("USE_DUMMY_AGENTS", "true")
  os.environ.setdefault("USE_RESEARCHER", "true")
  os.environ.setdefault("USE_VALIDATOR", "true")

  from backend.app.services.orchestrator_agent import OrchestratorAgent

  orchestrator = OrchestratorAgent(use_dummy_agents=True, use_researcher=True, use_validator=True)

  payload: Dict[str, Any] = {
    "options": ["Redis", "Memcached"],
    "metrics": ["latency", "cost", "scalability", "maintenance"],
    "context": "Used for a SaaS caching system with 2000 RPS and 50GB dataset hosted on Render.",
  }

  result = await orchestrator.run(
    query=None,
    options=payload["options"],
    metrics=payload["metrics"],
    context=payload["context"],
  )

  # Basic structure checks
  assert isinstance(result, dict), "Result must be a dict"
  assert "results" in result, "Missing results key"
  results = result["results"]
  assert "researcher" in results, "Missing researcher output"
  assert "metric_analyst" in results, "Missing metric_analyst output"
  assert "synthesizer" in results, "Missing synthesizer output"
  assert "validator" in results, "Missing validator output"
  assert "summary" in result, "Missing summary in envelope"

  # Log intermediate outputs
  log("Researcher Evidence", results["researcher"])
  log("Metric Analyst", results["metric_analyst"])
  log("Synthesizer", results["synthesizer"])
  log("Validator", results["validator"])

  # Validator acceptance
  validation_report = results["validator"].get("validation_report", {})
  is_consistent = bool(validation_report.get("is_consistent", False))
  score = float(validation_report.get("score", 0.0))
  assert is_consistent or score >= 0.7, "Validator score below threshold and inconsistent"

  # Print final combined response
  log("Final Combined Response", result)
  return 0


if __name__ == "__main__":
  try:
    exit_code = asyncio.run(run_test())
  except AssertionError as e:
    print(f"TEST FAILED: {e}")
    sys.exit(1)
  except Exception as e:  # noqa: BLE001
    print(f"TEST ERROR: {e}")
    sys.exit(1)
  sys.exit(exit_code)


