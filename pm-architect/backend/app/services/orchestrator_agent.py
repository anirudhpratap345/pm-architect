import time
import uuid
import logging
from typing import Any, Dict, List, Optional, Tuple

from ..config import settings
from .gemini_client import GeminiClient
from .agents import MetricAnalystAgent, SynthesizerAgent, ResearcherAgent, ValidatorAgent, _default_metrics


logger = logging.getLogger(__name__)


def _normalize_options(options: Optional[List[str]], query: Optional[str]) -> List[str]:
  opts = [o.strip() for o in (options or []) if o and o.strip()]
  if len(opts) >= 2:
    return opts[:2]
 
  # fallback: parse from query "X vs Y"
  if query:
    q = query.strip()
    if " vs " in q:
      lhs, rhs = q.split(" vs ", 1)
      lhs = lhs.strip()
      rhs = rhs.strip()
      if lhs and rhs:
        return [lhs, rhs]

  # final fallback
  return ["OptionA", "OptionB"]


def _normalize_metrics(metrics: Optional[List[str]]) -> List[str]:
  mets = [m.strip().lower() for m in (metrics or []) if m and m.strip()]
  return mets or _default_metrics()


def _validate(options: List[str], metrics: List[str]) -> Optional[str]:
  if len(options) != 2:
    return "Provide exactly two options."
  if not metrics:
    return "Provide at least one metric."
  return None


class OrchestratorAgent:
  def __init__(self, use_dummy_agents: Optional[bool] = None, use_researcher: Optional[bool] = None, use_validator: Optional[bool] = None):
    self.use_dummy_agents = settings.use_dummy_agents if use_dummy_agents is None else use_dummy_agents
    self.use_researcher = getattr(settings, 'use_researcher', True) if use_researcher is None else use_researcher
    self.use_validator = getattr(settings, 'use_validator', True) if use_validator is None else use_validator

  async def run(
    self,
    *,
    query: Optional[str],
    options: Optional[List[str]],
    metrics: Optional[List[str]],
    context: Optional[str],
  ) -> Dict[str, Any]:
    started_at = time.perf_counter()
    task_id = str(uuid.uuid4())

    norm_options = _normalize_options(options, query)
    norm_metrics = _normalize_metrics(metrics)
    norm_context = (context or "").strip()

    error = _validate(norm_options, norm_metrics)
    if error:
      elapsed = (time.perf_counter() - started_at) * 1000
      logger.warning("orchestrator_invalid_input task_id=%s elapsed_ms=%.1f error=%s", task_id, elapsed, error)
      return {
        "task_id": task_id,
        "options": norm_options,
        "metrics": norm_metrics,
        "results": {"error": error},
        "summary": {"recommendation": "", "confidence": 0.0},
        # backward compatible keys
        "task": (query or "").strip(),
        "analysis": {},
        "synthesis": {},
        "model": settings.model_name,
        "cost_estimate": {"calls": 0, "model": settings.model_name},
      }

    if self.use_dummy_agents:
      researcher_result, metric_analyst_result, synth_result, cost = await self._run_dummy(norm_options, norm_metrics, norm_context)
      validator_result = {"validation_report": {"is_consistent": True, "issues": [], "unsupported_claims": [], "score": 0.9, "suggested_fixes": [], "verdict": "Valid"}}
    else:
      researcher_result, metric_analyst_result, synth_result, validator_result, cost = await self._run_real(norm_options, norm_metrics, norm_context, query)

    total_elapsed_ms = (time.perf_counter() - started_at) * 1000
    logger.info(
      "orchestrator_completed task_id=%s total_ms=%.1f calls=%s", task_id, total_elapsed_ms, cost.get("calls")
    )

    # derive recommendation for summary
    recommendation_text = synth_result.get("summary") or ""
    confidence = synth_result.get("confidence", 0.0)
    if not recommendation_text and isinstance(synth_result.get("ranked_options"), list) and synth_result["ranked_options"]:
      top = synth_result["ranked_options"][0]
      recommendation_text = f"Recommend {top.get('option')} — {top.get('why', '')}".strip()

    assembled: Dict[str, Any] = {
      "task_id": task_id,
      "options": norm_options,
      "metrics": norm_metrics,
      "results": {
        "researcher": researcher_result,
        "metric_analyst": metric_analyst_result,
        "synthesizer": synth_result,
        "validator": validator_result if not self.use_dummy_agents else {"validation_report": {"is_consistent": True, "issues": [], "unsupported_claims": [], "score": 0.9, "suggested_fixes": [], "verdict": "Valid"}},
      },
      "summary": {
        "recommendation": recommendation_text,
        "confidence": confidence,
      },
      # backward compatible envelope for current frontend
      "task": (query or "").strip(),
      "analysis": metric_analyst_result,
      "synthesis": synth_result,
      "model": settings.model_name,
      "cost_estimate": cost,
    }

    return assembled

  async def _run_real(
    self,
    options: List[str],
    metrics: List[str],
    context: str,
    query: Optional[str],
  ) -> Tuple[Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
    calls = 0
    client = GeminiClient(model=settings.model_name)
    metric_agent = MetricAnalystAgent(client)
    synth_agent = SynthesizerAgent(client)
    researcher_agent = ResearcherAgent(client)
    validator_agent = ValidatorAgent(client, model_override=settings.validator_model or settings.model_name)

    # Researcher (optional)
    researcher_result: Dict[str, Any] = {"evidence": [], "confidence": 0.0}
    researcher_elapsed = 0.0
    if self.use_researcher:
      # launch researcher concurrently
      researcher_started = time.perf_counter()
      gather_task = asyncio.create_task(researcher_agent.gather(options=options, metrics=metrics, context=context))
    else:
      gather_task = None

    metric_started = time.perf_counter()
    try:
      metric_analyst_result = await metric_agent.analyze(
        task=(query or "").strip(), options=options, metrics=metrics, context=context, evidence=researcher_result.get("evidence")
      )
    except Exception as exc:  # noqa: BLE001
      logger.error("metric_agent_error options=%s metrics=%s err=%s", options, metrics, exc)
      metric_analyst_result = {"error": str(exc)}
    metric_elapsed = (time.perf_counter() - metric_started) * 1000
    calls += 1

    synth_started = time.perf_counter()
    try:
      synth_result = await synth_agent.synthesize(task=(query or "").strip(), options=options, metrics=metrics, analysis=metric_analyst_result)
    except Exception as exc:  # noqa: BLE001
      logger.error("synth_agent_error options=%s metrics=%s err=%s", options, metrics, exc)
      synth_result = {"error": str(exc)}
    synth_elapsed = (time.perf_counter() - synth_started) * 1000
    calls += 1

    # Await researcher if running (bounded wait)
    if gather_task is not None:
      try:
        researcher_result = await asyncio.wait_for(gather_task, timeout=20.0)
      except Exception as exc:  # noqa: BLE001
        logger.error("researcher_timeout_or_error err=%s", exc)
        researcher_result = {"error": str(exc), "evidence": [], "confidence": 0.0}
      researcher_elapsed = (time.perf_counter() - researcher_started) * 1000
      calls += 1

    # Validator (optional)
    validator_result: Dict[str, Any] = {"validation_report": {"is_consistent": True, "issues": [], "unsupported_claims": [], "score": 0.9, "suggested_fixes": [], "verdict": "Valid"}}
    validator_elapsed = 0.0
    if self.use_validator:
      validator_started = time.perf_counter()
      try:
        validator_result = await validator_agent.validate(
          research_evidence=researcher_result,
          metric_analysis={
            "metrics": metric_analyst_result.get("table") or metric_analyst_result.get("metrics") or [],
            "summary": metric_analyst_result.get("summary", ""),
            "confidence": metric_analyst_result.get("confidence", 0.0),
          },
          synthesizer_output={
            "recommendation": synth_result.get("recommendation") or synth_result.get("summary", ""),
            "tradeoffs": synth_result.get("tradeoffs", []),
            "next_steps": synth_result.get("next_steps", []),
            "confidence": synth_result.get("confidence", 0.0),
          },
        )
      except Exception as exc:  # noqa: BLE001
        logger.error("validator_agent_error err=%s", exc)
        validator_result = {"validation_report": {"is_consistent": False, "issues": [str(exc)], "unsupported_claims": [], "score": 0.0, "suggested_fixes": [], "verdict": "Validator error"}}
      validator_elapsed = (time.perf_counter() - validator_started) * 1000
      calls += 1

    # Re-prompt synthesizer if validator score is low (< 0.7)
    try:
      score = float(validator_result.get("validation_report", {}).get("score", 0.0))
    except Exception:  # noqa: BLE001
      score = 0.0
    if self.use_validator and score < 0.7:
      retry_started = time.perf_counter()
      try:
        # Provide corrective nudge: include validator issues and ask for concise revised output
        corrective_analysis = dict(metric_analyst_result)
        corrective_analysis["validator_feedback"] = validator_result.get("validation_report", {})
        revised = await synth_agent.synthesize(task=(query or "").strip(), options=options, metrics=metrics, analysis=corrective_analysis)
        synth_result = revised
      except Exception as exc:  # noqa: BLE001
        logger.error("synth_reprompt_error err=%s", exc)
      else:
        # re-run validator quickly on revised output
        try:
          validator_started = time.perf_counter()
          validator_result = await validator_agent.validate(
            research_evidence=researcher_result,
            metric_analysis={
              "metrics": metric_analyst_result.get("table") or metric_analyst_result.get("metrics") or [],
              "summary": metric_analyst_result.get("summary", ""),
              "confidence": metric_analyst_result.get("confidence", 0.0),
            },
            synthesizer_output={
              "recommendation": synth_result.get("recommendation") or synth_result.get("summary", ""),
              "tradeoffs": synth_result.get("tradeoffs", []),
              "next_steps": synth_result.get("next_steps", []),
              "confidence": synth_result.get("confidence", 0.0),
            },
          )
          validator_elapsed += (time.perf_counter() - validator_started) * 1000
          calls += 1
        except Exception as exc:  # noqa: BLE001
          logger.error("validator_recheck_error err=%s", exc)

    cost = {
      "calls": calls,
      "model": settings.model_name,
      "latency_ms": {
        "researcher": round(researcher_elapsed, 1),
        "metric_analyst": round(metric_elapsed, 1),
        "synthesizer": round(synth_elapsed, 1),
        "validator": round(validator_elapsed, 1),
      },
    }
    return researcher_result, metric_analyst_result, synth_result, validator_result, cost

  async def _run_dummy(
    self,
    options: List[str],
    metrics: List[str],
    context: str,
  ) -> Tuple[Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any]]:
    # simple deterministic dummy payloads for UI testing
    researcher_evidence: List[Dict[str, Any]] = []
    for m in metrics:
      researcher_evidence.append({
        "metric": m,
        "summary": f"Dummy evidence: {options[0]} slightly better than {options[1]} for {m} at moderate scale.",
        "source": "internal:dummies",
      })
    researcher_result: Dict[str, Any] = {"evidence": researcher_evidence, "confidence": 0.7}
    comparisons: Dict[str, Any] = {}
    for opt in options:
      opt_metrics: Dict[str, Any] = {}
      for m in metrics:
        opt_metrics[m] = {
          "score": 6.5 if opt == options[0] else 5.5,
          "evidence": f"Dummy evidence for {opt} on {m}",
          "assumptions": "Assume typical managed service setup",
        }
      comparisons[opt] = opt_metrics

    metric_analyst_result: Dict[str, Any] = {
      "options": options,
      "metrics": metrics,
      "comparisons": comparisons,
      "notes": context,
    }

    synth_result: Dict[str, Any] = {
      "summary": f"{options[0]} is recommended given provided constraints.",
      "ranked_options": [
        {"option": options[0], "score": 7.2, "why": "Better performance headroom"},
        {"option": options[1], "score": 6.1, "why": "Sufficient for small workloads"},
      ],
      "tradeoffs": [
        {"dimension": "cost", "notes": f"{options[1]} can be cheaper at low scale"},
        {"dimension": "latency", "notes": f"{options[0]} lower p99 in managed setups"},
      ],
      "next_steps": [
        "Prototype with 1-week load test",
        "Validate cost with provider calculators",
      ],
      "confidence": 0.75,
    }

    cost = {"calls": 0, "model": settings.model_name, "latency_ms": {"researcher": 0, "metric_analyst": 0, "synthesizer": 0}}
    return researcher_result, metric_analyst_result, synth_result, cost


