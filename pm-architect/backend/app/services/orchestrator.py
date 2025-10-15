from typing import Any, Dict, List, Optional

from .gemini_client import GeminiClient
from .agents import MetricAnalystAgent, SynthesizerAgent, _default_metrics
from ..config import settings


async def run_comparison(
  query: str,
  options: Optional[List[str]] = None,
  metrics: Optional[List[str]] = None,
  context: Optional[str] = None,
) -> Dict[str, Any]:
  # Very small orchestrator: fill defaults, call agents sequentially
  task = query.strip()
  opts = options or []
  if not opts:
    # naive option extraction: look for 'X vs Y' style
    lowered = task.lower()
    if " vs " in lowered:
      lhs, rhs = task.split(" vs ", 1)
      opts = [lhs.strip(), rhs.strip()]
  if len(opts) < 2:
    # fallback to generic placeholders
    opts = ["OptionA", "OptionB"]

  mets = metrics or _default_metrics()

  client = GeminiClient(model=settings.model_name)
  metric_agent = MetricAnalystAgent(client)
  synth_agent = SynthesizerAgent(client)

  analysis = await metric_agent.analyze(task=task, options=opts, metrics=mets, context=context)
  synthesis = await synth_agent.synthesize(task=task, options=opts, metrics=mets, analysis=analysis)

  # naive cost estimate: 2 calls to flash
  cost_estimate = {"calls": 2, "model": settings.model_name}

  return {
    "task": task,
    "options": opts,
    "metrics": mets,
    "analysis": analysis,
    "synthesis": synthesis,
    "model": settings.model_name,
    "cost_estimate": cost_estimate,
  }


