from typing import Any, Dict, List, Optional

from .gemini_client import GeminiClient
from .cache import TTLCache


def _default_metrics() -> List[str]:
  return [
    "performance",
    "cost",
    "scalability",
    "developer_complexity",
    "operational_overhead",
    "reliability",
    "maintainability",
  ]


class ResearcherAgent:
  def __init__(self, client: GeminiClient):
    self.client = client
    # cache by (optionA, optionB, tuple(metrics), context)
    self._cache: TTLCache[str, Dict[str, Any]] = TTLCache(maxsize=256, ttl_seconds=3600)

  async def gather(self, options: List[str], metrics: List[str], context: Optional[str]) -> Dict[str, Any]:
    optionA, optionB = options[0], options[1]
    cache_key = f"{optionA}|{optionB}|{','.join(metrics)}|{context or ''}"
    cached = self._cache.get(cache_key)
    if cached is not None:
      return cached
    system = (
      "You are Researcher Agent — collect short factual evidence per metric for comparing two options. "
      "Rules: respond strictly as JSON, ~30 words per summary, include plausible source, avoid speculation. "
      "Output schema: { 'evidence': [ { 'metric': string, 'summary': string, 'source': string } ], 'confidence': number(0-1) }"
    )
    payload = {
      "optionA": optionA,
      "optionB": optionB,
      "metrics": metrics,
      "context": context or "",
    }
    raw = await self.client.generate_json(system, payload)
    # Normalize shape
    result = {
      "evidence": raw.get("evidence", []),
      "confidence": raw.get("confidence", 0.0),
    }
    self._cache.set(cache_key, result)
    return result


class MetricAnalystAgent:
  def __init__(self, client: GeminiClient):
    self.client = client

  async def analyze(
    self,
    task: str,
    options: List[str],
    metrics: Optional[List[str]],
    context: Optional[str],
    evidence: Optional[List[Dict[str, Any]]] = None,
  ) -> Dict[str, Any]:
    metrics = metrics or _default_metrics()

    # Prompt per Agent #2 spec, with extension to include numeric scores for each option per metric.
    system = (
      "You are MetricAnalyst Agent — an expert in analyzing and comparing technologies and models. "
      "Respond strictly in JSON. For each metric, include values, concise analysis, and numeric scores. "
      "When evidence is provided, ground your values and analysis in that evidence (briefly cite in analysis). "
      "Output schema: {\n"
      "  'metrics': [ { 'metric': string, 'optionA_value': string, 'optionB_value': string, 'analysis': string, 'scoreA': number(1-5), 'scoreB': number(1-5) } ],\n"
      "  'summary': string,\n"
      "  'confidence': number(0-1)\n"
      "}"
    )

    optionA, optionB = options[0], options[1]
    payload = {
      "task": task,
      "optionA": optionA,
      "optionB": optionB,
      "metrics": metrics,
      "context": context or "",
      "evidence": evidence or [],
    }

    raw = await self.client.generate_json(system, payload)

    # Build backward-compatible comparisons map expected by current UI and downstream.
    comparisons: Dict[str, Dict[str, Any]] = {optionA: {}, optionB: {}}
    table = raw.get("metrics") or []
    for row in table:
      metric_name = row.get("metric") or ""
      analysis_text = row.get("analysis") or ""
      score_a = row.get("scoreA")
      score_b = row.get("scoreB")

      try:
        score_a_10 = float(score_a) * 2 if score_a is not None else None
      except Exception:  # noqa: BLE001
        score_a_10 = None
      try:
        score_b_10 = float(score_b) * 2 if score_b is not None else None
      except Exception:  # noqa: BLE001
        score_b_10 = None

      comparisons[optionA][metric_name] = {
        "score": score_a_10,
        "evidence": analysis_text,
        "assumptions": "",
        "value": row.get("optionA_value"),
      }
      comparisons[optionB][metric_name] = {
        "score": score_b_10,
        "evidence": analysis_text,
        "assumptions": "",
        "value": row.get("optionB_value"),
      }

    return {
      "options": [optionA, optionB],
      "metrics": metrics,
      "table": table,
      "summary": raw.get("summary", ""),
      "confidence": raw.get("confidence", 0.0),
      "comparisons": comparisons,
    }


class SynthesizerAgent:
  def __init__(self, client: GeminiClient):
    self.client = client

  async def synthesize(self, task: str, options: List[str], metrics: List[str], analysis: Dict[str, Any]) -> Dict[str, Any]:
    system = (
      "You are Synthesizer Agent. Merge the metric analysis JSON into a concise recommendation. "
      "Rules: strictly valid JSON, no more than 5 bullets total across tradeoffs and next_steps, under ~120 words. "
      "Be factual and avoid repetition. Output schema: {\n"
      "  'recommendation': string,\n"
      "  'tradeoffs': string[],\n"
      "  'next_steps': string[],\n"
      "  'confidence': number(0-1)\n"
      "}"
    )

    payload = {
      "task": task,
      "options": options,
      "metric_analysis": {
        "metrics": analysis.get("table") or analysis.get("metrics") or [],
        "summary": analysis.get("summary", ""),
        "confidence": analysis.get("confidence", 0.0),
      },
      "context": analysis.get("notes", ""),
    }

    raw = await self.client.generate_json(system, payload)

    recommendation = raw.get("recommendation") or raw.get("summary") or ""
    tradeoffs = raw.get("tradeoffs") or []
    next_steps = raw.get("next_steps") or []
    confidence = raw.get("confidence", 0.0)

    # Backward compatibility: include 'summary' and an empty 'ranked_options' array
    return {
      "recommendation": recommendation,
      "tradeoffs": tradeoffs,
      "next_steps": next_steps,
      "confidence": confidence,
      "summary": recommendation,
      "ranked_options": [],
    }


class ValidatorAgent:
  def __init__(self, client: GeminiClient, model_override: Optional[str] = None):
    self.client = GeminiClient(api_key=client.api_key, model=model_override or client.model)

  async def validate(self, research_evidence: Dict[str, Any], metric_analysis: Dict[str, Any], synthesizer_output: Dict[str, Any]) -> Dict[str, Any]:
    system = (
      "You are Validator Agent. Verify consistency across research evidence, metric analysis, and synthesizer output. "
      "Rules: Strict JSON only. Output schema: { 'validation_report': { 'is_consistent': bool, 'issues': string[], 'unsupported_claims': string[], 'score': number(0-1), 'suggested_fixes': string[], 'verdict': string } }"
    )
    payload = {
      "research_evidence": research_evidence,
      "metric_analysis": metric_analysis,
      "synthesizer_output": synthesizer_output,
    }
    raw = await self.client.generate_json(system, payload)
    report = raw.get("validation_report") or {}
    return {
      "validation_report": {
        "is_consistent": bool(report.get("is_consistent", False)),
        "issues": report.get("issues", []),
        "unsupported_claims": report.get("unsupported_claims", []),
        "score": report.get("score", 0.0),
        "suggested_fixes": report.get("suggested_fixes", []),
        "verdict": report.get("verdict", ""),
      }
    }


