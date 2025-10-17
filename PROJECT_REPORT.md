# PM Architect – Comprehensive Project Report

## 1. Executive Summary

PM Architect is an AI-assisted decision support platform that helps product and engineering teams make faster, higher-quality architectural and product decisions. It compares options (e.g., frameworks, databases, infra approaches), evaluates trade-offs across chosen metrics, synthesizes recommendations, and tracks decisions with context. The system uses a Next.js frontend and a FastAPI backend with Redis as the operational datastore (PostgreSQL is optional and currently disabled in production to simplify operations). The platform integrates orchestrated agents powered by Google Gemini to generate structured, auditable outputs.

## 2. What We’re Building and Why

- **Problem**: Product and engineering teams lose time debating choices without structured evaluation, leading to decision debt and knowledge loss.
- **Solution**: A tool that turns ambiguous prompts (e.g., “React vs Vue for SaaS MVP?”) into structured comparisons, evidence, and recommendations—persisted for collaboration.
- **Core Capabilities**:
  - AI-driven option comparison and synthesis
  - Configurable metrics and contexts
  - Evidence and rationale capture for auditability
  - Sharing, comments, and notifications for collaboration
- **Value (xyz)**: “xyz” refers to the platform’s core decision artifact—an explainable comparison object containing options, metrics, context, analysis, and a clear recommendation. This artifact can be shared, reviewed, and revisited to prevent decision drift.

## 3. High-Level Architecture

```
Next.js (App Router, React 18) ── UI/UX
   │
   ├─ API Routes (Edge/Node) for auth and thin server actions
   │
   ▼
FastAPI (Python) ── Core API
   ├─ OrchestratorAgent (Gemini client)
   ├─ Redis (RQ queue + cache + temporary data store)
   └─ Optional PostgreSQL (currently disabled)

Infra: Docker, Render/Heroku/Railway-ready, environment-driven configuration
```

## 4. Frontend (Next.js) – Status and Details

### 4.1 Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Componentized UI with re-usable sections

### 4.2 Pages and Routing (src/app)
- `page.tsx`: Landing/home page
- `auth/…`: Signin, signout, error pages
- `dashboard/page.tsx`: User dashboard
- `compare/page.tsx`: Compare UI entry point
- `decision/[id]/page.tsx`: View decision
- `decision/[id]/edit/page.tsx`: Edit decision
- `decision/new/page.tsx`: New decision flow
- `teams/page.tsx`: Team management
- `templates/page.tsx`: Templates library
- Global error and not-found boundaries

### 4.3 API Routes (src/app/api)
- `auth/[...nextauth]/route.ts`: Authentication endpoints
- `auth/validate|test|debug`: Diagnostic endpoints
- `decisions`, `decision/[id]`, `comments`: Decision and comments routes
- `notifications/route.ts`: Notification transport
- `teams`, `teams/[id]/invite`: Teams management endpoints
- `templates/route.ts`: Template provisioning
- `test-db/route.ts`: DB connectivity check (safe to disable in no-DB mode)

### 4.4 UI Components (src/components)
- Home sections: `Hero`, `HowItWorks`, `ValidationSection`, `UseCasesSection`, `IntelligentInsights`, `CTABanner`, `TestimonialsSection`, `FinalCTA`, `Footer`, `Header`
- Compare workflow: `CompareForm`, `MetricsChart`, `EvidenceAccordion`, `RecommendationPanel`, `HistoryPanel`, `ChartTypeSwitch`, `ThemeToggle`, `Badges`
- Dashboard: `DashboardAnalytics`, `DecisionCard`, `Notifications`
- Common: `GradientOverlay`, `ConfidenceBadge`, `AdvancedSearch`, `TagFilter`, `TradeoffCard`

### 4.5 UX and Visual Design
- Modern, clean layout with strong visual hierarchy
- Dark/light theme toggle
- Responsive design optimized for desktop-first workflows
- Chart-driven insights for comparisons
- Accessible forms with clear feedback

### 4.6 Frontend Data and Types (src/data, src/types)
- Mock data for decisions, archetypes
- Strong typing for decision entities (`types/decision.ts`)

### 4.7 Frontend Utilities (src/lib)
- API utilities for typed client-server communication
- Auth helpers (client/session utilities)
- Decision helpers (formatting, mapping)
- General utilities (formatters, guards)

### 4.8 Frontend Status
- Pages implemented and wired
- Components implemented
- Auth routes scaffolded
- Client integrates with backend endpoints for compare and (optionally) decisions

## 5. Backend (FastAPI) – Status and Details

### 5.1 Tech Stack
- FastAPI (Python)
- Redis + RQ (queue, cache, temporary persistence)
- SQLAlchemy (optional; PostgreSQL disabled in current prod profile)
- Google Gemini client

### 5.2 Key Modules (backend/app)
- `main.py`: App factory, middleware, routes, startup checks
  - Root `GET /` for liveness
  - `GET /health` aggregated status
  - Redis demo endpoints: `/save`, `/get/{key}`, `/keys`
  - Conditional router inclusion for DB-bound features
- `config.py`: Robust env configuration (CORS parsing hardened)
- `db.py`: Optional SQLAlchemy engine/session with graceful fallback
  - Exports `engine=None` and `SessionLocal=None` when `DATABASE_URL` is missing
  - No exceptions thrown on missing DB
- `redis_client.py`: Lazy Redis client, queue helpers, health checks
- `redis_store.py`: Key-value persistence and `RedisJobStore` for jobs
- `services/`:
  - `orchestrator_agent.py`: Orchestrates Gemini-driven compare
  - `gemini_client.py`: Gemini API integration
  - `agents.py`, `orchestrator.py`, `cache.py`: Agent logic, caching helpers
- `routers/`:
  - `compare.py`: `POST /api/compare` – runs orchestrator to return analysis
  - `jobs.py`: `POST/GET /api/jobs*` – guarded behind DB availability
- `tasks.py`: RQ worker tasks
  - Works with or without DB; updates RedisJobStore when DB is off

### 5.3 No-DB Operation (Current Production Mode)
- Database init and session creation wrapped in try/except with safe defaults
- Jobs router is conditionally excluded when DB unavailable
- Demo Redis endpoints ensure persistence without SQL
- Orchestrator and cache continue to function fully

### 5.4 Health and Observability
- Startup logs include service availability (DB/Redis)
- `/health` endpoint reports service connectivity
- Extensive logging for queue and orchestrator operations

## 6. API Surface (Backend)

### Public Endpoints
- `GET /` – Liveness
- `GET /health` – Status: `{ status, database, redis }`
- `GET /api/test-redis` – Redis connectivity probe
- `POST /api/compare` – Body: `{ query?, options?, metrics?, context? }` → Structured comparison response

### Redis Demo Endpoints
- `POST /save` – `{ key, message, data? }` → `{ status, key }`
- `GET /get/{key}` – `{ key, data } | { error }`
- `GET /keys?pattern=*` – `{ pattern, keys, count }`

### Conditioned (DB-Dependent)
- `POST /api/jobs` – Create a comparison job (returns 503 without DB)
- `GET /api/jobs/{job_id}` – Job status (returns 503 without DB)

## 7. Data Layer

### Redis (Active)
- General key-value via `redis_store.py`
- Namespaced cache (`compare_cache:*`)
- RQ job tracking + status via `redis_client.py`
- `RedisJobStore` for job metadata (pending, processing, completed, failed)

### PostgreSQL (Optional, Currently Disabled)
- SQLAlchemy models exist (`Comparison`, `ActivityLog`) but are bypassed
- Safe guards prevent runtime errors when `DATABASE_URL` is unset

## 8. AI/Agent Architecture

- OrchestratorAgent composes tasks: parse prompt, expand metrics, fetch context, analyze, synthesize
- Gemini client provides LLM reasoning with structured outputs
- Caching avoids redundant recomputation for identical compare inputs

## 9. Security and Auth

- NextAuth routes scaffolded on frontend
- Backend secret key and environment isolation
- CORS configurable; parser tolerates JSON and CSV strings
- Redis TLS (rediss://) supported with certificate relaxed for managed clouds

## 10. DevEx and Tooling

- Dockerfile and docker-compose for containerized runs
- Render config (`render.yaml`) and deployment guides (Render, Vercel, Railway, Heroku)
- Scripts for setup and production build (`scripts/`)
- Comprehensive READMEs and quick-starts

## 11. Testing and Validation

- `backend/tests/validate_no_postgres_simple.py` verifies no-DB mode
- `backend/tests/test_no_postgres.py` module and route checks
- Health checks and manual cURL runbooks documented
- Lint checks run clean for modified files

## 12. Deployment Profiles

### Redis-Only (Current)
- Required env: `REDIS_URL`, `GEMINI_API_KEY`
- Optional: `CORS_ORIGINS`
- `DATABASE_URL` not required; jobs endpoints disabled with helpful 503

### Full Stack (Future)
- Set `DATABASE_URL` to enable jobs persistence and history
- No code changes required—routers and models automatically activate

## 13. Current Status and Completion

- Frontend: Implemented pages, components, styles, and routes
- Backend: Implemented core API, agents, Redis persistence, no-DB mode
- APIs: Compare, health, Redis demo endpoints fully working
- Deployment: Production-safe without Postgres; docs and scripts included
- Validation: Automated tests pass; lint clean

## 14. Roadmap

- Re-enable PostgreSQL for durable decision history and analytics
- Real-time collaboration (presence, comment threads)
- Advanced templates and metric libraries per domain
- Role-based access and team audit logs
- Cost telemetry and rate-limiting for LLM usage

## 15. File Index of Key Artifacts

- Frontend: `src/app/*`, `src/components/*`, `src/lib/*`, `src/types/*`
- Backend: `backend/app/*`, routers, services, tasks, redis store
- Docs: `backend/NO_POSTGRES_DEPLOYMENT.md`, `backend/DEPLOYMENT_SUMMARY.md`, `backend/QUICK_START_NO_DB.md`
- Tests: `backend/tests/*`

## 16. Quick Usage Examples

```bash
# Liveness
curl -s https://<backend>/ | jq

# Compare (works without DB)
curl -s -X POST https://<backend>/api/compare \
  -H 'Content-Type: application/json' \
  -d '{"query":"React vs Vue","options":["React","Vue"],"metrics":["learning_curve","ecosystem"],"context":"SaaS MVP"}' | jq

# Redis demo
curl -s -X POST https://<backend>/save -H 'Content-Type: application/json' -d '{"key":"test1","message":"hello"}'
curl -s https://<backend>/get/test1 | jq
```

---

© 2025 PM Architect. All rights reserved.


