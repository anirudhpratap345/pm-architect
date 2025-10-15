from typing import Any, Dict, Optional
import asyncio
import httpx

from ..config import settings


class GeminiClient:
  def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
    self.api_key = api_key or settings.gemini_api_key
    self.model = model or settings.model_name
    self.base_url = "https://generativelanguage.googleapis.com/v1beta"

  async def generate_json(self, system_prompt: str, user_payload: Dict[str, Any]) -> Dict[str, Any]:
    # Compact prompt to encourage structured JSON only
    prompt = (
      "You are a concise, structured analysis agent. "
      "Respond ONLY with minified JSON that matches the user requested schema. "
      "No prose, no markdown, no code fences."
    )

    url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
    headers = {"Content-Type": "application/json"}
    body = {
      "contents": [
        {"role": "user", "parts": [{"text": f"SYSTEM:\n{system_prompt}"}]},
        {"role": "user", "parts": [{"text": f"INPUT:\n{user_payload}"}]},
      ],
      "generationConfig": {
        "temperature": 0.3,
        "topP": 0.9,
        "maxOutputTokens": 1200,
        "responseMimeType": "application/json",
      },
    }

    # retries with exponential backoff and jitter
    max_attempts = 3
    base_delay = 0.5
    last_exc: Optional[Exception] = None
    for attempt in range(1, max_attempts + 1):
      try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:
          resp = await client.post(url, headers=headers, json=body)
          resp.raise_for_status()
          data = resp.json()
          break
      except Exception as exc:  # noqa: BLE001
        last_exc = exc
        if attempt == max_attempts:
          raise
        delay = base_delay * (2 ** (attempt - 1))
        # small jitter
        await asyncio.sleep(delay + 0.05)

    try:
      text = data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:  # noqa: BLE001
      # Fallback: return raw
      return {"raw": data}

    # Attempt to parse JSON; the model should already return JSON text
    import json

    try:
      return json.loads(text)
    except Exception:  # noqa: BLE001
      return {"raw_text": text}


