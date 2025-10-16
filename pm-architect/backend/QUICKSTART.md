# PMArchitect Backend - Quick Start Guide

## 🚀 Local Development

### Start Backend Server
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### Test Endpoints
```bash
# Health check
curl http://localhost:8000/health

# Compare
curl -X POST http://localhost:8000/api/compare \
  -H "Content-Type: application/json" \
  -d '{"options":["Redis","Memcached"],"metrics":["latency","cost"]}'
```

### Run Validation Tests
```bash
cd backend
python tests/validate_backend.py
```

## 🌐 Render Deployment

### Web Service Config
- **Build:** `pip install -r backend/requirements.txt`
- **Start:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Root:** `backend/`

### Worker Service Config
- **Build:** `pip install -r backend/requirements.txt`
- **Start:** `bash worker/start_worker.sh`
- **Root:** `backend/`

### Required Environment Variables
```
GEMINI_API_KEY=<your-key>
DATABASE_URL=<postgres-url>
REDIS_URL=<redis-cloud-url>
SECRET_KEY=<random-secret>
```

## 📊 Health Check

```json
GET /health

Response:
{
  "status": "ok",
  "database": "connected|disconnected",
  "redis": "connected|disconnected"
}
```

## ✅ Status: PRODUCTION READY
