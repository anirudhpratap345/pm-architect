# Quick Start - PM Architect Backend (No Database)

## 🚀 Deploy in 3 Steps

### 1. Set Environment Variables
```bash
REDIS_URL=rediss://your-redis-url
GEMINI_API_KEY=your-api-key
# DATABASE_URL - NOT REQUIRED!
```

### 2. Start Backend
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Test It Works
```bash
curl http://localhost:8000/
# → {"message": "PM Architect Backend is live!"}
```

---

## ✅ What's Working

- ✅ Root endpoint `/`
- ✅ Health check `/health`
- ✅ Redis demo endpoints `/save`, `/get/{key}`, `/keys`
- ✅ **AI comparison `/api/compare`** (core feature)
- ✅ Redis caching and persistence
- ✅ All agent orchestration

---

## ⚠️ What's Disabled (Without DB)

- ⚠️ Job management `/api/jobs/*` → Returns HTTP 503
  - **Alternative:** Use `/api/compare` for direct comparisons

---

## 🧪 Quick Test

```bash
# Test root
curl http://localhost:8000/

# Test health
curl http://localhost:8000/health

# Test Redis save
curl -X POST http://localhost:8000/save \
  -H "Content-Type: application/json" \
  -d '{"key": "test1", "message": "hello redis"}'

# Test Redis get
curl http://localhost:8000/get/test1

# Test AI comparison (core feature)
curl -X POST http://localhost:8000/api/compare \
  -H "Content-Type: application/json" \
  -d '{
    "query": "React vs Vue",
    "options": ["React", "Vue"],
    "metrics": ["performance", "learning_curve"]
  }'
```

---

## 📝 Expected Startup Logs

```
INFO: Starting PMArchitect Backend...
⚠️  DATABASE_URL not set; skipping database initialization
✅ Redis connected successfully
⚠️ Skipping jobs router (database unavailable)
🎉 Backend startup completed successfully
INFO: Uvicorn running on http://0.0.0.0:8000
```

---

## 🔄 Enable Database Later (Optional)

```bash
# Just add DATABASE_URL and restart:
export DATABASE_URL="postgresql://user:pass@host:5432/db"
# Restart server → Jobs router automatically enabled!
```

---

## 📚 Full Documentation

- `NO_POSTGRES_DEPLOYMENT.md` - Complete deployment guide
- `DEPLOYMENT_SUMMARY.md` - Detailed summary of changes
- Run tests: `python tests/validate_no_postgres_simple.py`

---

**Status:** ✅ Production Ready  
**No Database Required:** ✅ Works perfectly with Redis only

