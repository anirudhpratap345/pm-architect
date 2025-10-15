import os
import sys
import json


def main() -> int:
  # Load settings (reads .env if present)
  try:
    from backend.app.config import settings
  except Exception as exc:  # noqa: BLE001
    print(f"CONFIG_IMPORT_ERROR: {exc}")
    return 1

  # Verify required envs
  required = [
    ("GEMINI_API_KEY", os.getenv("GEMINI_API_KEY") or settings.gemini_api_key),
    ("USE_DUMMY_AGENTS", os.getenv("USE_DUMMY_AGENTS") or str(settings.use_dummy_agents)),
    ("USE_RESEARCHER", os.getenv("USE_RESEARCHER") or str(settings.use_researcher)),
    ("USE_VALIDATOR", os.getenv("USE_VALIDATOR") or str(settings.use_validator)),
  ]
  # DATABASE_URL is optional in this phase; validate presence if set
  db_url = os.getenv("DATABASE_URL")

  missing = [k for (k, v) in required if not (v and str(v).strip())]
  report = {
    "python_prefix": sys.prefix,
    "model": settings.model_name,
    "env": {k: ("SET" if (v and str(v).strip()) else "MISSING") for (k, v) in required},
    "database_url_present": bool(db_url and db_url.strip()),
  }
  print(json.dumps(report, indent=2))

  if missing:
    print("MISSING_VARS:", ", ".join(missing))
    return 1
  return 0


if __name__ == "__main__":
  sys.exit(main())


