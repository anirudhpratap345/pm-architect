## PMArchitect.ai — Architecture and Codebase Review

Date: 2025-10-14

### Overview
PMArchitect.ai is an AI-driven decision intelligence platform built with Next.js (App Router), React, TypeScript, Prisma, PostgreSQL, NextAuth, and Tailwind CSS. The codebase is cleanly organized and feature-complete for an MVP, but there are critical schema–integration misalignments and missing best practices that should be addressed before production.

---

### 1) Project structure

- **App Router**: `src/app` has domain-based pages and API routes (`auth`, `dashboard`, `decision`, `teams`, `templates`, `notifications`). Clear separation of concerns.
- **APIs**: `src/app/api/*` organized by resources (`decisions`, `teams`, `templates`, `notifications`, `auth`).
- **Libs & Types**: `src/lib/*` contains auth, api utilities, tradeoffs and helpers; `src/types/decision.ts` is comprehensive.
- **Prisma**: Rich schema under `prisma/schema.prisma` with domain models and relations.

Verdict: Good module grouping and discoverability.

---

### 2) Development progress

- **Auth**: NextAuth with credentials demo login, optional Google/GitHub. Missing Prisma Adapter; Slack shown in UI but not configured.
- **Decisions**: Endpoints for list/create/get/update/delete exist; dashboard, list, detail, create, edit UIs implemented; basic tradeoff suggestions.
- **Comments**: Threading (via `parentId`), mentions, and mention notifications implemented.
- **Teams**: List and create implemented; invite API present. No full team management UI beyond list/create.
- **Templates**: List/create implemented; “Use Template” flow navigates to decision creation.
- **Notifications**: Fetch and mark read implemented; UI dropdown exists.

Verdict: MVP is ~60–70% complete with working vertical slices; several integration gaps remain.

---

### 3) Architecture & code quality

- **API handlers**: Consistent shape and error handling; missing runtime validation (Zod), frequent `any`, and per-route `new PrismaClient()`.
- **Naming & paths**: Generally clear; one inconsistency: duplicate routes `api/decision/[id]/comments` vs `api/decisions/[id]/comments`.
- **Type safety**: Client code often assumes Date objects from API (calls `.toISOString()`); APIs return JSON strings; risks runtime errors.
- **Best practices**: No Prisma Adapter in NextAuth; verbose console logging in auth callbacks; no centralized Prisma client.

Verdict: Solid foundation; needs validation, Prisma client singleton, and stricter typing at API boundaries.

---

### 4) Integration depth (Prisma, NextAuth, DB)

- **Prisma**: Schema covers core entities and relations; APIs leverage Prisma effectively. However, creating a new client per route can cause dev connection churn.
- **NextAuth**: Providers configured with JWT sessions. Missing Prisma Adapter → user/account/session tables won’t be populated. Schema references `User` by `id`, but code stores and filters by `email` (mismatch).
- **Referential integrity**: Many fields (e.g., `Decision.createdBy`, `Comment.userId`, `Team.ownerId`, `Notification.userId`) are used as emails in code while schema expects `User.id`.

Verdict: Critical auth–DB misalignment must be fixed before production.

---

### 5) Potential technical debt

- **Auth–DB mismatch**: Using `email` in code vs `id` in schema; no NextAuth Prisma Adapter.
- **Decision options data model**: UI expects rich option objects (pros/cons/estimates/risk), but schema uses `String[]`. Store as JSONB or a related table.
- **API consistency**: Duplicate comments routes; notifications client API doesn’t match server route shape.
- **Prisma client lifecycle**: Multiple `new PrismaClient()` — add a singleton.
- **Validation**: No Zod schemas for inputs; risk of invalid writes.
- **Dates & serialization**: Mixed Date/string usage; standardize.
- **Authorization**: Ownership checks exist but no centralized policy; `DecisionShare` table unused.
- **Logging**: Verbose console logs in auth callbacks; add structured logging.
- **Dead/legacy code**: Mock helpers and duplicate routes should be removed.

---

### 6) UI/UX implementation

- **Modern stack**: Tailwind v4, Next.js 15, React 19, componentized UI.
- **Client-heavy pages**: Many top-level pages are client components with client-side data fetching → spinners and SEO downsides. Prefer server components that fetch on the server and hydrate clients.
- **State**: Local state is OK for MVP; consider SWR/React Query for caching and optimistic updates.
- **Navigation/layout**: `SessionProvider` in client layout is correct; header with notifications and user menu is ergonomic.

Verdict: Pleasant UI; consider SSR data fetching and caching for UX and performance.

---

### 7) Gaps for next phase

- **NextAuth Prisma Adapter** and user model alignment (use `user.id` everywhere, or intentionally key on `email` and update relations accordingly).
- **Decision options schema**: JSONB or normalized `DecisionOption` table to match UI expectations.
- **Notifications model**: Avoid forcing `decisionId` when notifying on team invites; make it optional or polymorphic (`resourceType/resourceId`).
- **API hardening**: Zod validation, consistent route shapes, better error codes, rate limiting.
- **Prisma singleton** and connection management.
- **Server Components**: SSR for dashboard/detail/templates/teams.
- **Authorization layer**: Implement `DecisionShare` and centralize permission checks.
- **Observability & ops**: CI/CD, tests, logging, metrics.

---

### 8) Short summary (5 bullets)

- **~60–70% MVP complete** with core flows implemented.
- **Critical auth/schema mismatch**: user identity used as email in code vs `id` in DB; missing NextAuth Prisma Adapter.
- **Data-model gap**: `Decision.options` needs JSONB or normalized table to match UI.
- **Scalability limited** by per-request Prisma client and client-only data fetching.
- **Needs validation, authorization, and API consistency** before production.

---

### 9) Action roadmap (prioritized)

1. **Data & Auth integration**
   - Add NextAuth Prisma Adapter; persist users/accounts/sessions.
   - Expose `user.id` in session; migrate all code and relations to use `id` (or change FKs to `email` intentionally and consistently).

2. **Decision options model**
   - Change `Decision.options` to `Json` (Postgres JSONB) or create `DecisionOption` table (`name`, `description`, `pros[]`, `cons[]`, `estimatedCost`, `estimatedTime`, `riskLevel`).
   - Update API payloads and UI mapping; add migrations.

3. **API consistency & validation**
   - Remove `api/decision/[id]/comments`; keep `api/decisions/[id]/comments`.
   - Align notifications client with server (`PATCH /api/notifications` with body), or add `PUT /api/notifications/:id`.
   - Add Zod schemas for all requests; return structured errors.

4. **Prisma client & performance**
   - Introduce `src/lib/prisma.ts` singleton (globalThis cache) and reuse across handlers.
   - Add indexes for frequent lookups (`Decision.createdBy`, `Notification.userId`).

5. **Server components & data fetching**
   - Convert dashboard, decision detail, templates, and teams pages to server components with server-side data fetching; hydrate client subcomponents.
   - Consider SWR/React Query for client caching.

6. **Authorization and sharing**
   - Implement `DecisionShare` usage with policy checks for view/edit/comment; centralize authorization helpers.
   - Enforce team-based access across decisions/comments.

7. **Notifications model refinement**
   - Make `decisionId` optional and add `resourceType/resourceId` or separate notification tables to avoid FK violations (e.g., team invites).

8. **Cleanup & polish**
   - Remove mocks/duplicate routes; reduce console noise; add structured logging.
   - Fix Slack provider button (disable or configure provider).

9. **Ops & reliability**
   - CI: lint, type-check, test, build on PRs; Prettier/ESLint consistent.
   - Tests: API unit tests (Vitest/Jest), e2e smoke (Playwright).
   - Docker: healthchecks, production start parity, basic rate limiting (e.g., Upstash Ratelimit).

---

If desired, next I can implement the Prisma Adapter integration and the `Decision.options` schema redesign (JSONB) with minimal, safe migrations and code edits.


