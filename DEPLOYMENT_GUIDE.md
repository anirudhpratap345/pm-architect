# PM Architect Deployment Guide

## 🆓 TRULY FREE OPTIONS (No Credit Card Required)

### Option 1: Replit (Recommended - No Card Needed) ⭐

**Why Replit?**
- ✅ **100% FREE** - No credit card required
- ✅ Supports FastAPI/uvicorn
- ✅ No timeout limits
- ✅ Easy GitHub integration
- ✅ Built-in terminal and editor
- ⚠️ Sleeps after 1 hour of inactivity (wakes on request)

**Setup Steps:**

1. **Sign up at [replit.com](https://replit.com)** (free, no card)

2. **Create New Repl:**
   - Click "Create Repl"
   - Choose "Python" template
   - Name: `pm-architect-backend`

3. **Connect GitHub:**
   - Click "Version Control" → "Import from GitHub"
   - Select your repo
   - Set root directory to `backend`

4. **Create `.replit` file in `backend/`:**
   ```toml
   run = ["sh", "-c", "pip install -r requirements.txt && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
   ```

5. **Set Secrets (Environment Variables):**
   - Click "Secrets" tab (🔒 icon)
   - Add: `GEMINI_API_KEY`, `GROQ_API_KEY`, `DEEPSEEK_API_KEY`, `BASE_URL`

6. **Deploy:**
   - Click "Run" button
   - Replit will start your FastAPI server
   - Get your public URL: `https://your-repl-name.your-username.repl.co`

7. **Keep-Alive (Optional):**
   - Use [UptimeRobot](https://uptimerobot.com) (free) to ping your Replit every 5 minutes
   - This prevents sleep mode

**Replit URL Format:** `https://pm-architect-backend.yourusername.repl.co`

---

### Option 2: Koyeb (No Card for Free Tier)

**Why Koyeb?**
- ✅ Free tier available
- ✅ No timeout limits
- ✅ Docker support
- ⚠️ May require card for verification (but won't charge)

**Setup:**
1. Sign up at [koyeb.com](https://koyeb.com)
2. Create app → Deploy from GitHub
3. Root: `backend`
4. Build: `pip install -r requirements.txt`
5. Run: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

---

### Option 3: PythonAnywhere (Free Tier)

**Why PythonAnywhere?**
- ✅ Free tier (limited but works)
- ✅ No credit card needed
- ✅ Supports FastAPI
- ⚠️ Limited to 1 web app, 512MB storage
- ⚠️ Custom domain requires paid tier

**Setup:**
1. Sign up at [pythonanywhere.com](https://www.pythonanywhere.com)
2. Upload your `backend/` folder
3. Install dependencies in Bash console
4. Configure web app to run FastAPI
5. Get URL: `yourusername.pythonanywhere.com`

---

## 💳 Options Requiring Credit Card (For Reference)

### Railway (Free Tier)

**Why Railway?**
- ✅ $5/month free credit (enough for small apps)
- ✅ No timeout limits (perfect for multi-agent LLM calls)
- ✅ Native FastAPI support
- ✅ Easy deployment from GitHub
- ✅ Auto-scales with usage

### Setup Steps:

1. **Sign up at [railway.app](https://railway.app)** (free tier)

2. **Create New Project** → "Deploy from GitHub repo"

3. **Configure Backend:**
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables:**
   ```
   GEMINI_API_KEY=your_key
   GROQ_API_KEY=your_key
   DEEPSEEK_API_KEY=your_key
   BASE_URL=https://your-frontend.vercel.app
   ```

5. **Deploy Frontend on Vercel:**
   - Connect your GitHub repo
   - Root Directory: `/` (root)
   - Framework: Next.js (auto-detected)
   - Environment Variable: `NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app`

---

## 🚀 Alternative: Fly.io (Free Tier)

**Why Fly.io?**
- ✅ 3 shared-cpu VMs free
- ✅ 3GB persistent storage
- ✅ No timeout limits
- ✅ Global edge network

### Setup Steps:

1. **Install Fly CLI:**
   ```bash
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Create `fly.toml` in `backend/`:**
   ```toml
   app = "pm-architect-backend"
   primary_region = "iad"

   [build]
     builder = "paketobuildpacks/builder:base"

   [http_service]
     internal_port = 8000
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
     processes = ["app"]

   [[services]]
     http_checks = []
     internal_port = 8000
     processes = ["app"]
     protocol = "tcp"
     script_checks = []
   ```

3. **Deploy:**
   ```bash
   cd backend
   fly launch
   fly secrets set GEMINI_API_KEY=your_key GROQ_API_KEY=your_key DEEPSEEK_API_KEY=your_key
   ```

---

## ⚠️ Why NOT Vercel for Backend?

### Timeout Issues:
- **Free tier**: 10-second timeout
- **Pro tier**: 30-second timeout
- **Your multi-agent pipeline**: 10-20 seconds (risky!)

### Architecture Mismatch:
- FastAPI with uvicorn = long-running server
- Vercel = serverless functions
- Would require complete rewrite to serverless functions

### Cold Start Penalty:
- Each request may cold-start (2-5 seconds)
- Multi-agent calls already slow → worse UX

---

## ✅ Final Recommendation (No Card Required)

**Deploy:**
- **Frontend**: Vercel (perfect for Next.js, no card needed) ✅
- **Backend**: Replit (truly free, no card needed) ✅

**Why this combo:**
1. Frontend gets Vercel's edge network (fast!)
2. Backend runs on Replit (free, no card)
3. Both are 100% free
4. Easy GitHub integration for both
5. Use UptimeRobot (free) to keep Replit awake

---

## 🔧 Quick Migration from Render

1. **Export environment variables from Render**
2. **Create Railway project** → Import from GitHub
3. **Set environment variables** in Railway dashboard
4. **Update frontend** `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app
   ```
5. **Deploy frontend** on Vercel with new API URL

**Total migration time: ~15 minutes** ⚡

---

## 📊 Cost Comparison

| Platform | Free Tier | Card Required? | Timeout | Best For |
|----------|-----------|----------------|---------|----------|
| **Replit** | ✅ Free | ❌ No | None | ✅ Backend (FastAPI) |
| **Koyeb** | ✅ Free | ⚠️ Maybe | None | Backend (alternative) |
| **PythonAnywhere** | ✅ Free | ❌ No | None | Backend (limited) |
| **Vercel** | ✅ Generous | ❌ No | 10s/30s | ✅ Frontend (Next.js) |
| **Railway** | $5/month credit | ✅ Yes | None | Backend (if card works) |
| **Fly.io** | 3 VMs | ✅ Yes | None | Backend (if card works) |
| **Render** | Expired | ✅ Yes | None | ❌ No longer free |

---

## 🎯 Action Plan

1. ✅ **Frontend**: Already configured for Vercel (keep as-is)
2. ✅ **Backend**: Deploy to Railway (use `railway.json` and `Procfile`)
3. ✅ **Update CORS**: Add Railway URL to `backend/app/config.py`
4. ✅ **Test**: Verify API calls work from Vercel frontend

**Estimated time: 20 minutes** 🚀

