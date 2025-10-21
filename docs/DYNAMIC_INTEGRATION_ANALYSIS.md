# Dynamic Integration Analysis — PM Architect

**Date:** October 2025  
**Engineer:** Anirudh Pratap Singh  
**Version:** 1.0.0-final

## 🧭 Root Cause Summary
The compare UI was never wired to the orchestrator backend. It continued to render prebuilt JSON (`SAMPLE_JSON`) instead of fetching live Gemini-generated comparisons.

## ⚙️ Causes
1. Mock demo logic left in place post-backend deployment
2. "Run Demo" button not updated to call the backend
3. No user input plumbing into the orchestrator API
4. Backend intelligence (Gemini orchestration) unused from UI

## 🧠 Observations (User Insights)
- Static charts appeared for any query → revealed absence of live calls
- JSON block looked identical across runs → indicated mock path
- Questioned purpose of LLMs without dynamic integration → aligned with architecture intent
- Identified integration gap rather than missing backend work → systemic thinking

## 🧠 Fix Summary
- Replaced static demo handler with live `fetch` call to `/api/orchestrator/compare`
- Added form fields for query, Option A, and Option B
- Removed `SAMPLE_JSON` usage from compare page
- Reused existing visualization components to display live responses
- Ensured `NEXT_PUBLIC_API_BASE_URL` drives environment-specific backend URL

## ✅ Result
- Frontend now dynamic; any comparison prompt can be analyzed
- Orchestrator (Gemini) provides real reasoning and metrics
- Architecture goal restored: AI-powered structured comparison

## 🧪 Testing Checklist
1. Local: `npm run dev`, open `/compare`
2. Provide: "Compare Firebase vs Supabase for MVP backend"
3. Click "Run Comparison" → Expect live analysis and charts
4. Check Network tab → `POST /api/orchestrator/compare` 200 OK
5. Deploy to Vercel and repeat on public domain

## 🔧 Environment Variables (must be set)
```
NEXT_PUBLIC_API_BASE_URL=https://pm-architect-backend.onrender.com
```

## 🚀 Deploy
```
git add .
git commit -m "feat: enable dynamic backend integration + RCA documentation"
git push origin main
```
Redeploy on Vercel, then validate `/compare` end-to-end.


