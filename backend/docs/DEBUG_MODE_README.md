# Debug Compare Endpoint — Developer Guide

**Path:** `/api/debug/compare`  
**Purpose:** Quick validation of backend orchestration and Gemini health.

## Overview
This endpoint provides a developer-only route to test the orchestrator and Gemini integration without requiring frontend inputs. It works in both stub mode (no API key) and real mode (with Gemini API key).

## Scenarios

| Mode | Description | Behavior |
|------|-------------|----------|
| **Stub** | No `GEMINI_API_KEY` found | Uses internal deterministic mock response |
| **Real** | `GEMINI_API_KEY` configured | Calls actual Gemini model via google-generativeai SDK |

## Response Format

### Success Response
```json
{
  "status": "ok",
  "mode": "stub|real",
  "duration_sec": 0.3,
  "example_query": "Redis vs MongoDB",
  "result": {
    "left": "Redis",
    "right": "MongoDB", 
    "metrics": [...],
    "summary": "...",
    "confidence": "high"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "error": "Error message",
  "mode": "stub|real",
  "duration_sec": 0.1
}
```

## Testing Instructions

### Local Development
```bash
# Start backend
uvicorn app.main:app --reload --port 8000

# Test endpoint
curl http://localhost:8000/api/debug/compare
```

### Production (Render)
```bash
curl https://pm-architect-backend.onrender.com/api/debug/compare
```

## Expected Behavior

- **Stub Mode**: Returns deterministic JSON instantly (~0.1s)
- **Real Mode**: Calls Gemini API and returns AI-generated comparison (~2-5s)
- **Error Handling**: Returns structured error with mode info

## Use Cases

1. **Pre-deployment validation**: Verify orchestrator works before frontend integration
2. **API key testing**: Confirm Gemini integration without frontend
3. **Performance monitoring**: Check response times and error rates
4. **Development debugging**: Isolate backend issues from frontend problems

## Integration Notes

- This endpoint does NOT save to `decisions.json` (unlike `/orchestrator/compare`)
- It uses a fixed example query ("Redis vs MongoDB") for consistency
- Response format matches the main orchestrator for easy comparison
- Safe to call frequently during development (no side effects)

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `mode: "stub"` | Missing API key | Set `GEMINI_API_KEY` environment variable |
| `status: "error"` | API/network issue | Check Gemini API key validity and network |
| Slow response | Real mode + network | Normal for Gemini API calls (2-5s) |
| JSON parse error | LLM response format | Check Gemini model output format |
