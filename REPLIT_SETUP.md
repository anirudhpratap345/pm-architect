# Replit Deployment Guide (No Credit Card Required)

## 🎯 Quick Setup (15 minutes)

### Step 1: Create Replit Account
1. Go to [replit.com](https://replit.com)
2. Sign up with GitHub (easiest)
3. **No credit card needed!**

### Step 2: Create New Repl
1. Click **"Create Repl"** (top right)
2. Choose **"Python"** template
3. Name it: `pm-architect-backend`
4. Click **"Create Repl"**

### Step 3: Import from GitHub
1. In your Repl, click **"Version Control"** (left sidebar)
2. Click **"Import from GitHub"**
3. Select your repository: `pm-architect`
4. Set **Root Directory**: `backend`
5. Click **"Import"**

### Step 4: Configure Environment Variables
1. Click the **🔒 Secrets** tab (left sidebar)
2. Add these secrets:
   ```
   GEMINI_API_KEY=your_gemini_key
   GROQ_API_KEY=your_groq_key
   DEEPSEEK_API_KEY=your_deepseek_key
   BASE_URL=https://your-frontend.vercel.app
   ```

### Step 5: Install Dependencies
1. Open the **Shell** tab (bottom)
2. Run:
   ```bash
   pip install -r requirements.txt
   ```

### Step 6: Start the Server
1. Click the **"Run"** button (top center)
2. Wait for: `Application startup complete`
3. Your backend is now live!

### Step 7: Get Your Public URL
1. Look at the **Webview** tab (right side)
2. Your URL is: `https://pm-architect-backend.yourusername.repl.co`
3. Test it: `https://pm-architect-backend.yourusername.repl.co/health`

---

## 🔧 Keep Replit Awake (Prevent Sleep)

Replit sleeps after 1 hour of inactivity. Keep it awake with:

### Option 1: UptimeRobot (Free, Recommended)
1. Sign up at [uptimerobot.com](https://uptimerobot.com) (free)
2. Add new monitor:
   - Type: HTTP(s)
   - URL: `https://pm-architect-backend.yourusername.repl.co/health`
   - Interval: 5 minutes
3. This pings your Repl every 5 minutes → keeps it awake

### Option 2: Always-On (Paid)
- Replit offers "Always-On" for $7/month
- Not needed if using UptimeRobot

---

## 🔗 Connect Frontend to Replit Backend

1. **Update Frontend `.env.local`:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://pm-architect-backend.yourusername.repl.co
   ```

2. **Update CORS in Backend:**
   - Your Replit URL is automatically allowed
   - Vercel frontend URL is already in `config.py`

3. **Deploy Frontend on Vercel:**
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_BASE_URL=https://pm-architect-backend.yourusername.repl.co
     ```

---

## ✅ Testing

Test your backend:
```bash
curl https://pm-architect-backend.yourusername.repl.co/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "2.0-multi-agent",
  "vision": "technical co-founder in your pocket"
}
```

---

## 🚨 Troubleshooting

### "Module not found" errors
- Run `pip install -r requirements.txt` in Shell

### "Port already in use"
- Replit auto-assigns port, use `$PORT` environment variable
- Our config already handles this

### "CORS errors"
- Make sure your Vercel URL is in `backend/app/config.py`
- Replit URL is auto-allowed

### "Repl keeps sleeping"
- Set up UptimeRobot (see above)
- Or upgrade to Always-On ($7/month)

---

## 💰 Cost: $0/month

- **Replit**: Free (with UptimeRobot)
- **Vercel**: Free
- **UptimeRobot**: Free
- **Total**: $0/month ✅

---

## 🎉 You're Done!

Your backend is now live on Replit, frontend on Vercel, both 100% free!

