# NORA Frontend → Backend Integration Plan

**Author:** prior-session research/decisions
**Audience:** the developer (sonnet) executing phases 1–5 (and 6 when scheduled)
**Date authored:** 2026-05-07
**Repos:** `XWorldLLC/NORA-FRONTEND` (this repo, branch `dev`), `XWorldLLC/NORA-BACKEND` (sibling)
**VPS:** `ssh -p 2222 dev@85.137.249.238` (key auth, `dev` user)

> **Read this whole document before touching code.** Every reasonable question has been pre-decided. If something here is wrong, push back in chat — don't silently re-decide it.

---

## 1. What's actually true on the VPS today

The frontend dev reported "hosted on the VPS in `~/NORA-FRONTEND`". The source IS there (matches `origin/main` `a4ea89a`), but:

- **Not built** — no `dist/` directory.
- **Not served** — listening processes on the VPS are only `:3000 (backend)`, `:8090 (NORA-AI)`, `:5432 (postgres)`, `:6379 (redis)`, `:22 (ssh)`. Nothing else.
- **No real HTTP layer in the FE** — every `src/api/*.js` module is a pure in-memory mock with `delay()` calls. Zero `fetch`/`axios`/env config exists.
- **No auth** — `nora:isAuthenticated` is a localStorage boolean that the Login form flips on submit. No backend call.
- **No router** — manual state machine in `src/app/App.jsx`.

So this is a real integration project, not a "swap mock for real" job.

The backend is fully deployed and tested by Mazen — 16 bug rounds done as of 2026-05-06. **142 endpoints, all standard envelope, JWT auth.** Exhaustive reference: `NORA-BACKEND/docs/local/QA_HANDOVER.md` (gitignored — ask user for a copy if needed; reproduced relevant snippets below).

---

## 2. Locked architecture decisions

These are decided. Don't re-litigate.

### 2.1 Port layout
Frontend on **`:8080`** (production static build), backend stays on `:3000`, AI stays on `:8090`. **No nginx for now.** A reverse proxy + TLS comes when a domain is wired up — that is **out of scope** of this plan.

Implication: backend `ALLOWED_ORIGINS` must include the frontend origin. We update it during phase 5.

### 2.2 HTTP client
Add `axios`. Single instance in `src/api/client.js` with two interceptors:
1. **Request:** attach `Authorization: Bearer <accessToken>` from `tokenStore`.
2. **Response:** unwrap envelope (`{success, data, meta}` → return `data`); throw `ApiError` with `{code, message, statusCode, details, requestId}` on `success: false`. On 401, attempt one refresh via `/api/v1/auth/refresh`, retry the original request once; on second 401, clear tokens and redirect to login.

Don't use `fetch` — interceptors and timeout handling are too verbose without a wrapper.

### 2.3 Token storage
- `accessToken` (15-min TTL): in-memory module-scoped variable + localStorage mirror so a hard refresh survives without forcing re-login.
- `refreshToken` (7-day TTL): localStorage only.
- **Don't use cookies.** Backend doesn't set `Set-Cookie`; switching schemes is not part of this plan.

### 2.4 Envelope adapter
Unwrap in the response interceptor. Mock modules currently return raw arrays/objects, so each `src/api/*.js` module's exported function signatures stay identical after migration — only the implementation changes from "return mock data" to "return the result of `client.get(...)`". Component code does not change.

### 2.5 Role normalisation
Backend roles are lowercase: `owner | admin | member | viewer`. The mock `teamApi.js` uses Capitalized: `Owner | Admin | Member | Viewer`. **Source of truth = backend (lowercase).** Add a tiny display helper `formatRole(role)` in `src/lib/format.js` that capitalizes for UI. Don't transform on the network side.

### 2.6 Data flow for the AI workspace
The mock `noraWorkspaceApi.js` is a self-contained chat sim. The real flow is:

1. User sends a chat message → backend `POST /api/v1/chat/sessions/:id/messages` (which proxies to AI service `/ai/chat` with RAG).
2. Some intents kick off an orchestration → backend `POST /api/v1/orchestrations` (returns `workflowId`, `status`, `answer`).
3. If the workflow has a write step, status comes back as `completed_partial` and an Approval row is created. Frontend lists `/api/v1/approvals?status=pending` and shows the approval card with approve/reject.
4. After approve, the parent workflow promotes to `completed` (this was bug #13, fixed).

So the workspace's "Tasks panel" should pull `pending approvals` not `tasks`. We treat `tasks` (`/api/v1/tasks`) as a separate user-managed list.

### 2.7 Test account & tenant
Use the existing one Mazen uses for QA:

```
email: mazen@testing.com
password: TestPass@123
```

Tenant is auto-created on register. Don't create a new tenant for sonnet — keeping a single shared QA tenant means our smoke runs are visible to Mazen too.

### 2.8 Pricing page
Keep static. No Stripe. Out of scope.

### 2.9 Notifications + Events modules
**No backend equivalent yet.** Leave `notificationsApi.js` and `eventsApi.js` as mocks. Add a `// TODO(backend): no upstream endpoint` comment at the top of each. Don't try to invent a backend route.

### 2.10 Routing
React Router is **out of scope of this plan** (it's the dev's PDF item #1 but a clean separate PR). Continue using the localStorage view-state machine. Don't bundle.

---

## 3. Mock-to-real endpoint map

All paths are under `http://<api-base>/api/v1/`. All responses follow the envelope. Auth header required on everything except `/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/forgot-password`, `/auth/reset-password`, `/health*`.

### 3.1 Modules with direct backend coverage

| FE module | Real endpoints |
|---|---|
| `integrationsApi.js` | `GET/POST /integrations`, `PATCH /integrations/:id`, `DELETE /integrations/:id`, `POST /integrations/:id/sync` |
| `assetsApi.js` | `GET/POST /brand/assets`, `POST /brand/assets/upload` (multipart), `PUT /brand/assets/:id`, `DELETE /brand/assets/:id` |
| `teamApi.js` | `GET /users`, `POST /users/invite`, `PATCH /users/:id/role`, `DELETE /users/:id` (deactivate) |
| `activityLogApi.js` | `GET /audit`, `GET /audit/export` |
| `memoryApi.js` | `POST /kb/documents` (multipart upload), `GET /kb/documents`, `GET /kb/documents/:id`, `GET /kb/documents/:id/status`, `GET /kb/search?q=...`, `DELETE /kb/documents/:id` |
| `onboardingFlowApi.js` | `POST /company/onboarding/step` (8 steps), `GET /company/onboarding/status`, `POST /company/sync-to-ai` |

### 3.2 Modules that must split

| FE module | Splits into |
|---|---|
| `weekTaskApi.js` | **`tasksApi.js`** → `/tasks` CRUD + status. **`dashboardApi.js`** → `/dashboard/{summary,kpis,priorities,activity,funnel,revenue,trends,social-overview}`. The "weekly task chart" data is `/dashboard/activity` filtered to a 7-day window. |
| `noraWorkspaceApi.js` | **`chatApi.js`** → `/chat/sessions` CRUD + `/chat/sessions/:id/messages`. **`orchestrationsApi.js`** → `POST /orchestrations`, `GET /orchestrations/:id`, `GET /orchestrations`. **`approvalsApi.js`** → `GET /approvals`, `POST /approvals/:id/approve`, `POST /approvals/:id/reject`, `GET /approvals/pending/summary` |

### 3.3 Modules without backend coverage (stay mock)

| FE module | Status |
|---|---|
| `notificationsApi.js` | Stay mock. Tag with TODO. |
| `eventsApi.js` | Stay mock. Tag with TODO. |

### 3.4 New API modules with no current mock

| New module | Endpoints |
|---|---|
| `src/api/auth.js` | `POST /auth/{login,register,refresh,logout,forgot-password,reset-password}` |
| `src/api/reports.js` | `POST /reports/daily/generate`, `POST /reports/weekly/generate`, `GET /reports/daily/:date`, `GET /reports/weekly/:date`, `GET /reports`, `GET /reports/search?q=...`, `GET /reports/compare?date1=...&date2=...` |
| `src/api/leads.js` | `GET/POST /leads`, `GET/PUT/DELETE /leads/:id`, `PATCH /leads/:id/stage`, `POST /leads/:id/score`, `POST /leads/score-batch`, `GET /leads/pipeline`, `GET/POST /leads/:id/activities` |
| `src/api/social.js` | `GET/POST /social/accounts`, `PATCH/DELETE /social/accounts/:id`, `GET /social/accounts/:id/analytics`, `GET/POST /social/posts`, `GET /social/posts/:id` (added 2026-05-06), `PUT/DELETE /social/posts/:id`, `POST /social/posts/:id/publish`, `POST /social/posts/generate`, `POST /social/image/generate`, `POST /social/captions/generate`, `POST /social/content-plan/generate`, `POST /social/posts/batch`, `GET /social/calendar` |
| `src/api/competitors.js` | `GET/POST /competitors`, `GET/PUT/DELETE /competitors/:id`, `GET /competitors/:id/intel`, `POST /competitors/:id/analyze` |
| `src/api/strategy.js` | `POST /strategy/swot`, `GET /strategy/market-trends`, `GET /strategy/recommendations`, `POST /strategy/recommendations/decide` |
| `src/api/goals.js` | `GET/POST /goals`, `GET/PUT/DELETE /goals/:id`, `PATCH /goals/:id/progress`, `POST /goals/sync-to-ai` |
| `src/api/widgets.js` | `GET /widgets/catalog`, `GET /widgets`, `GET /widgets/:key`, `POST /widgets/:key/refresh` |

Most of these don't have a UI yet, but they're called by the orchestrator/AI workspace flow indirectly (e.g. competitor cards in IntelligenceMap may want `/competitors`). Wire them as needed by the consuming page; create the file with the methods even if the UI isn't ready.

---

## 4. Phases (each = one PR on `dev`)

### Phase 1 — HTTP scaffolding (no behavior change)

**Goal:** Plumbing exists, mocks still work.

**Add deps:**
```bash
npm install axios
```

**Files to create:**

- `.env.example`:
  ```
  VITE_API_BASE_URL=http://localhost:3000
  ```
- `vite.config.js` — keep existing, no proxy needed (env var is enough).

- `src/lib/apiError.js`:
  ```
  Class wrapping {code, message, statusCode, details, requestId}.
  - new ApiError(envelope, statusCode)
  - .isAuth() → code === 'UNAUTHORIZED'
  - .isValidation() → code === 'VALIDATION_ERROR'
  - .toString() readable
  ```

- `src/api/tokenStore.js`:
  ```
  In-memory accessToken + localStorage mirrors.
  Keys: 'nora:accessToken', 'nora:refreshToken'.
  Exports:
    getAccessToken(): string | null
    getRefreshToken(): string | null
    setTokens({accessToken, refreshToken}): void
    clear(): void
    hasRefresh(): boolean
  Hydrate accessToken from localStorage on module load (so a page refresh doesn't force re-login while still valid).
  ```

- `src/api/client.js`:
  ```
  axios instance:
    - baseURL: import.meta.env.VITE_API_BASE_URL
    - timeout: 30_000
    - withCredentials: false
  Request interceptor: if accessToken → Authorization header.
  Response interceptor:
    - on success: return response.data.data (envelope unwrap)
    - on error 401 + not already retried + refreshToken exists:
        call POST /auth/refresh with refreshToken
        store new tokens
        retry original (once, set config._retry = true)
        on second 401: tokenStore.clear() and emit 'auth:logout' event (CustomEvent on window)
    - on error otherwise: throw ApiError(err.response?.data, err.response?.status)
  Export: api (the instance), get/post/put/patch/del helpers that already unwrap.
  ```

- `src/api/auth.js`:
  ```
  Functions (all return parsed envelope.data):
    login({email, password}) → POST /api/v1/auth/login → {accessToken, refreshToken, user}
      side-effect: tokenStore.setTokens(...)
    register({email, password, firstName, lastName, companyName}) → POST /auth/register → same shape
      side-effect: tokenStore.setTokens(...)
    refresh() → POST /auth/refresh with current refreshToken → new tokens
      side-effect: tokenStore.setTokens(...)
    logout() → POST /auth/logout (with current accessToken)
      side-effect: tokenStore.clear()
    forgotPassword({email}) → POST /auth/forgot-password
    resetPassword({token, newPassword}) → POST /auth/reset-password
  ```

**Don't wire into any view yet.** Just verify `client.js` compiles and `npm run dev` boots clean.

**Acceptance:**
- `npm run dev` → page renders unchanged.
- In devtools console: `(await import('./api/client.js')).api.get('/health')` returns the backend's `{status: 'ok'}` (after unwrap).

**Commit message:**
```
feat(api): http scaffolding — axios client, token store, ApiError, auth module

No behavior change yet. Adds the plumbing so the per-module mock-to-real
swaps in phase 3 are mechanical rewrites of function bodies, not new
plumbing each time. Tokens persist across hard refresh; 401 triggers a
single refresh+retry cycle before logging out.
```

---

### Phase 2 — Real auth (replaces localStorage flags)

**Goal:** Login/Signup/Reset hit the backend; auth state derives from a valid access token.

**Edit:**

- `src/pages/auth/Login.jsx`:
  - On submit: `await authApi.login({email, password})`.
  - On success: `onAuthenticated()` (existing prop) which already navigates to setup/map.
  - On error: show `error.message` from `ApiError` in a banner. Specifically handle `error.code === 'UNAUTHORIZED'` with the friendlier "Email or password is wrong."

- `src/pages/auth/Signup.jsx`:
  - On submit: `await authApi.register({email, password, firstName, lastName, companyName})`.
  - On success: same as login (registration auto-logs in per the backend).
  - On `error.code === 'CONFLICT'`: "An account with this email already exists."

- `src/pages/auth/restPassword.jsx`:
  - Two-step UI (already in mock?). Step 1: `forgotPassword({email})` → "Check your email for a reset link" message (the backend logs the token; for QA, Mazen reads it from logs).
  - Step 2: `resetPassword({token, newPassword})` → success toast → return to login.

- `src/app/App.jsx`:
  - Replace `readStoredFlag(STORAGE_KEYS.authenticated)` with `tokenStore.getAccessToken() !== null`.
  - On mount, if `tokenStore.hasRefresh()` AND `getAccessToken()` is null (only refresh survived), attempt one refresh before deciding the initial view.
  - Listen for `window.addEventListener('auth:logout', ...)` (emitted by `client.js` on double-401) → set `isAuthenticated(false)`, navigate to `'login'`.
  - Add a logout handler used by the nav: `await authApi.logout(); setIsAuthenticated(false); navigateTo('login')` and ignore `logout()` errors (server-side cleanup is best-effort).

**Acceptance:**
- Login with `mazen@testing.com` / `TestPass@123` → redirects to map.
- Hard refresh after login → still authenticated.
- After 15+ minutes idle, the next API call silently refreshes the access token (verify by watching network tab for one `/auth/refresh` 200 followed by the retried call).
- Wrong password → red banner with backend message.
- Logout → tokens cleared, returned to login screen.

**Commit message:**
```
feat(auth): wire login/signup/reset/logout to backend; remove localStorage gate

Auth state now derives from tokenStore. App.jsx attempts one silent refresh
on mount when only the refresh token survives a hard reload. Bare 401s
during a session trigger refresh+retry inside client.js — the user only
sees them as a logout when the refresh itself fails.
```

---

### Phase 3 — Replace mocks one module at a time

**Order (cheapest → most coupled):**

1. `integrationsApi.js`
2. `assetsApi.js` (note: upload is multipart — use `FormData`, set `Content-Type: multipart/form-data`)
3. `teamApi.js` (lowercase roles; add `formatRole` helper for display only)
4. `activityLogApi.js`
5. `weekTaskApi.js` → split into `tasksApi.js` + `dashboardApi.js`
6. `onboardingFlowApi.js` (8 sequential POSTs — preserve the form's step IDs and field names; cross-check the backend's `step` schemas against the existing `onboardingFlowMockData.js`)
7. `memoryApi.js` (KB)
8. `noraWorkspaceApi.js` → split into `chatApi.js` + `orchestrationsApi.js` + `approvalsApi.js`

**Rules per module:**
- Keep the exported function signatures identical to the mock. Components don't change.
- Where the mock returned a synchronous shape (e.g. arrays of objects), the real call returns the same shape after envelope unwrap.
- Where pagination differs (mock returns flat arrays; backend returns `{data: [], pagination: {...}}`), prefer the page-aware shape: extend the function signature to accept `{page, pageSize}` and return `{items, page, pageSize, total, totalPages}`. Update the consuming component(s) in the same commit.
- Delete the corresponding `*MockData.js` file in the same commit if nothing else imports it.

**Per-module acceptance:**
- The page that consumes the module renders real backend data when logged in.
- Empty/error states still render (don't ship a blank screen on a 500).
- No `console.error` in normal flow.

**Commit messages (one per module):**
```
feat(api): wire integrationsApi to /api/v1/integrations
feat(api): wire assetsApi to /api/v1/brand/assets (multipart upload)
feat(api): wire teamApi to /api/v1/users; lowercase roles + display formatter
feat(api): wire activityLogApi to /api/v1/audit
feat(api): split weekTaskApi → tasksApi (/tasks) + dashboardApi (/dashboard/*)
feat(api): wire onboardingFlowApi to /api/v1/company/onboarding/step (8 steps)
feat(api): wire memoryApi to /api/v1/kb (documents + search)
feat(api): split noraWorkspaceApi → chatApi + orchestrationsApi + approvalsApi
```

---

### Phase 4 — Reports + new wirings

**Add:**
- `src/api/reports.js` (see §3.4 endpoints).
- `src/pages/reports/ReportsPage.jsx`: list, generate-daily button (admin-gated), generate-weekly button, view-by-date.

**The IntelligenceMap, NoraWorkspace, etc. pages will start consuming the new modules from §3.4 lazily** — when sonnet runs into a UI element that needs leads/social/competitors/etc. data, build the corresponding API module before wiring the UI. Don't pre-build modules the UI doesn't need yet, but DO build them as a unit (all CRUD + helpers, not piecemeal).

**Notifications + Events stay mock** — leave the TODO comments.

**Acceptance:**
- Reports page lists existing reports for the logged-in tenant.
- Daily report generation completes and appears in the list (note: this is slow — 30-60s — show a spinner).

**Commit:**
```
feat(reports): wire ReportsPage to /api/v1/reports + add reports.js api module
```

---

### Phase 5 — Deploy on VPS

**Goal:** `http://85.137.249.238:8080` serves the SPA; from inside it, login + protected pages work against `http://85.137.249.238:3000`.

**Steps:**

1. **Backend env update** (one-line):
   - SSH in, edit `/home/dev/NORA-BACKEND/.env`:
     ```
     ALLOWED_ORIGINS=http://85.137.249.238:8080,http://localhost:5173,http://localhost:8080
     ```
   - `bash scripts/deploy-nora.sh --restart` (no rebuild needed).

2. **Frontend deploy script** at `~/NORA-FRONTEND/scripts/deploy-frontend.sh`:
   - `git pull --ff-only origin dev`
   - `npm ci`
   - `cp .env.example .env` if not present, then write `VITE_API_BASE_URL=http://85.137.249.238:3000`
   - `npm run build` → `dist/`
   - `pm2 reload ecosystem.config.cjs` (or `pm2 start ...` first time)

3. **Static server** via PM2 ecosystem entry. Add `~/NORA-FRONTEND/ecosystem.config.cjs`:
   ```
   - app name: nora-frontend
   - script: npx serve -s dist -l 8080 (or use a tiny custom express-static)
   - watch: false
   - autorestart: true
   ```
   Actually safer: install `serve` globally during deploy (`npm install -g serve` once) and use `pm2 start serve -- -s dist -l 8080 --cors --no-clipboard --name nora-frontend`. Pin: `serve@14`. The `--cors` flag is irrelevant here (cross-origin happens at the API, not the static server) but harmless.

4. **First-deploy bootstrap** (manual, document inline in script):
   ```
   cd ~/NORA-FRONTEND
   npm install -g serve@14 pm2  # pm2 already there from backend
   bash scripts/deploy-frontend.sh
   pm2 save
   ```

5. **Optional: stitch into `~/NORA-BACKEND/scripts/deploy-nora.sh`**:
   - Add a `[4/4] Frontend` section (after backend reload) that calls the frontend deploy script. Keep it OPTIONAL — guarded by a flag like `--with-frontend` so the existing backend-only flow doesn't change. Don't break Mazen's testing rhythm.

6. **Confirm public reachability:**
   ```bash
   curl -I http://85.137.249.238:8080/  # 200 + text/html
   ```
   Note the existing observation that public `:3000` is hijacked by some unrelated Next.js page upstream of the VPS. **`:8080` may or may not be similarly NAT-redirected** — if `curl -I http://85.137.249.238:8080/` returns something other than the SPA, the network NAT is the problem, not our deploy. Document that as a finding and stop; don't chase it.

**Acceptance:**
- Frontend SPA loads at `:8080`.
- Login flow works end-to-end against the deployed backend at `:3000`.
- One full smoke pass: log in → onboarding (if first time) → map → reports → integrations.

**Commits:**
```
chore(deploy): frontend deploy script + PM2 ecosystem config
chore(backend): add frontend origin to ALLOWED_ORIGINS  (in NORA-BACKEND repo)
```

---

### Phase 6 — Auth0 migration (deferred, schedule before public beta)

**When to start:** AFTER phases 1–5 are merged, the FE is stable on the VPS, and Mazen has signed off on a clean QA pass against the wired-up SPA. NOT in parallel — this migration touches every file phase 2 created.

**Why later, not now:** 16 rounds of QA have hardened the existing JWT auth. Mazen's curl scripts and test account work today. Auth0 buys hosted login, MFA, social login, password-reset emails, password-leak detection — all valuable for real users, not for the in-house QA loop. Total throwaway from doing JWT first then Auth0 second is ≈1 dev-day, less than the cost of bundling two big migrations into one PR.

**What's pre-decided (don't re-litigate):**

- **Auth0 application type:** Single Page Application (SPA), Authorization Code Flow + PKCE.
- **Frontend SDK:** `@auth0/auth0-react` (hooks, plays nicely with React 19 and our existing `App.jsx`).
- **Backend SDK:** `express-oauth2-jwt-bearer` (Auth0's official Express middleware — RS256 + JWKS validation built in, less boilerplate than `express-jwt + jwks-rsa`).
- **Token transport:** access tokens still flow as `Authorization: Bearer ...`. The `client.js` request interceptor switches from `tokenStore.getAccessToken()` to `await getAccessTokenSilently()`. `tokenStore.js` is deleted.
- **Tenant + role source of truth:** still the backend `users` table. The Auth0 `sub` claim is the join key (new column `users.auth0_sub`). Backend middleware = "validate Auth0 JWT → look up user by `auth0_sub` → load `tenant_id` + `role`". No Auth0 RBAC, no custom JWT claims. One DB hit per request, same as today's local-JWT path.
- **Existing-user migration:** for our QA tenant (Mazen + a handful of test accounts), we use Auth0's "Database Connection import" with the bcrypt hashes already in `users.password`. Users keep their existing passwords; first login goes through Auth0 silently. If headcount grows before the migration, switch to the bulk-import API.
- **Rollback strategy:** dual-mode auth on both sides during the cutover.
  - Backend: env flag `AUTH0_ENABLED=true|false`. False = current HS256 local-secret path. True = `express-oauth2-jwt-bearer`. Keep both code paths alive for at least one full QA cycle.
  - Frontend: env flag `VITE_AUTH_PROVIDER=auth0|local`. Local = current forms (phase 2 code). Auth0 = SDK redirects.
- **Free tier sufficiency:** Auth0 free tier = 25,000 MAU. We're well under that. No billing.

**Auth0 dashboard config (one-time, by the developer running this phase):**

1. Create a tenant (e.g. `nora-prod.eu.auth0.com` — pick the EU region for GDPR proximity).
2. Create one **Application**, type "Single Page Web Applications", name "NORA SPA".
   - Allowed Callback URLs: `http://85.137.249.238:8080/callback,http://localhost:5173/callback`
   - Allowed Logout URLs: `http://85.137.249.238:8080,http://localhost:5173`
   - Allowed Web Origins: same two
   - Refresh Token Rotation: ENABLED. Absolute lifetime: 30d. Idle lifetime: 7d.
3. Create one **API**, name "NORA Backend API".
   - Identifier: `https://api.nora.app` (any URI; doesn't need to resolve)
   - Signing Algorithm: RS256
   - Token Expiration (Access Token Lifetime): `900` seconds (15 min — match current).
4. Note the values: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_AUDIENCE` (= the API identifier).

**Backend changes** (in `NORA-BACKEND`, separate PR):

1. `npm install express-oauth2-jwt-bearer`
2. New file `src/middleware/auth0.ts`:
   - Use `auth({ audience, issuerBaseURL, tokenSigningAlg: 'RS256' })`.
   - After token validation, look up `prisma.user.findFirst({ where: { auth0Sub: req.auth.payload.sub } })`. If no row, look up by `email` from the token's `email` claim and back-fill `auth0Sub` (one-time migration path). If still no row, throw `UnauthorizedError` with code `USER_NOT_PROVISIONED`.
   - Attach `req.user = { userId, tenantId, role, email }` so existing `tenantContext()` and `rbac()` keep working unchanged.
3. Edit `src/middleware/auth.ts`:
   - Add `if (config.AUTH0_ENABLED) { return auth0Middleware(req, res, next); }` at the top, falling through to current HS256 logic when false.
4. Schema change (Prisma):
   ```
   model User {
     ...
     auth0Sub String? @unique @map("auth0_sub") @db.VarChar(255)
     @@index([auth0Sub], map: "idx_users_auth0_sub")
   }
   ```
   Generate migration `add_users_auth0_sub`. Run `prisma migrate deploy` on the VPS during deploy.
5. New endpoint `POST /api/v1/users/sync` (Auth0-only):
   - Auth-required (validates the Auth0 token).
   - If a user row exists for the `sub`, return it.
   - If not, create a new `tenant` (default name from email domain) and a new `user` (role: `owner`, `auth0Sub`, `email`, `firstName`, `lastName` from token claims).
   - Frontend calls this exactly once after first Auth0 login.
6. Endpoints to delete (gated by the flag — they 404 when `AUTH0_ENABLED=true`):
   - `POST /auth/login`
   - `POST /auth/register`
   - `POST /auth/refresh`
   - `POST /auth/forgot-password`
   - `POST /auth/reset-password`
   Keep `POST /auth/logout` — it clears refresh-token rows (still useful for audit even though Auth0 SDK does the redirect).
7. Env additions to `.env.example` and `src/config/env.schema.ts`:
   ```
   AUTH0_ENABLED=false
   AUTH0_DOMAIN=
   AUTH0_AUDIENCE=
   ```
   When `AUTH0_ENABLED=true`, validate that `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` are non-empty.

**Frontend changes** (in `NORA-FRONTEND`):

1. `npm install @auth0/auth0-react`
2. `.env.example` additions:
   ```
   VITE_AUTH_PROVIDER=local
   VITE_AUTH0_DOMAIN=
   VITE_AUTH0_CLIENT_ID=
   VITE_AUTH0_AUDIENCE=
   ```
3. New file `src/auth/Auth0Bridge.jsx`:
   - Wraps `<Auth0Provider domain clientId authorizationParams={{audience, redirect_uri: window.location.origin + '/callback'}}>` around children when `VITE_AUTH_PROVIDER === 'auth0'`.
   - Otherwise renders children directly (local mode).
4. Edit `src/main.jsx` to wrap `<App />` in `<Auth0Bridge>`.
5. New file `src/auth/useAuth.js`:
   - Hook that returns `{isAuthenticated, user, login, logout, getToken}`.
   - In `auth0` mode: delegates to `useAuth0()`.
   - In `local` mode: reads `tokenStore` and exposes the existing form-based login.
   - Components and `App.jsx` only ever import this hook — they don't know which provider is active.
6. Edit `src/api/client.js`:
   - Request interceptor: if `auth0` mode, `await getTokenFn()` (injected at app start by `Auth0Bridge`); if `local`, current `tokenStore.getAccessToken()` path.
   - This requires a small "token getter" registry — set once at boot, read by the interceptor.
7. New page `src/pages/auth/Callback.jsx`:
   - Auth0 redirects here after login. Reads the URL hash, lets the SDK consume it, then on success calls `POST /api/v1/users/sync` (so the backend has a User row for this `sub`), then `navigateTo('map')`.
8. Rewrite `src/pages/auth/Login.jsx` and `Signup.jsx`:
   - In `auth0` mode: a single button → `loginWithRedirect({authorizationParams: {screen_hint: 'signup'}})` for signup, plain `loginWithRedirect()` for login.
   - In `local` mode: keep the existing form (for the rollback path).
9. Delete `src/pages/auth/restPassword.jsx` from the auth0 mode (Auth0 hosted page handles it). Keep the file for `local` mode.
10. Edit `App.jsx`:
    - Replace `tokenStore.getAccessToken() !== null` check with `useAuth().isAuthenticated`.
    - The `auth:logout` event listener stays — both modes emit it.

**Cutover plan (one afternoon, with Mazen on standby):**

1. Land the backend PR with `AUTH0_ENABLED=false` (no behavior change).
2. Land the frontend PR with `VITE_AUTH_PROVIDER=local` (no behavior change).
3. Run the Auth0 dashboard setup. Note the three values.
4. Bulk-import existing users via the Auth0 Management API: `POST /api/v2/users-imports` with the bcrypt hashes from `users.password` and the corresponding emails. Auth0 returns a job ID; poll for completion.
5. On the VPS, edit `~/NORA-BACKEND/.env` → `AUTH0_ENABLED=true`, `AUTH0_DOMAIN=...`, `AUTH0_AUDIENCE=...`. Restart backend.
6. On the VPS, edit `~/NORA-FRONTEND/.env` → `VITE_AUTH_PROVIDER=auth0`, `VITE_AUTH0_DOMAIN=...`, `VITE_AUTH0_CLIENT_ID=...`, `VITE_AUTH0_AUDIENCE=...`. Rebuild + restart frontend.
7. Mazen smokes: login, navigate, check that all phase-3 modules still work end-to-end. He'll be redirected to Auth0 once, log in with `mazen@testing.com` / `TestPass@123` (same password — works because we imported the bcrypt hash), redirected back, and the SPA carries on as before.
8. If anything misbehaves, flip both flags back to false, restart, rollback complete in <60s.
9. After 24h of clean operation: a follow-up PR removes the local-mode code paths in both repos (delete the form pages, delete `tokenStore.js`, delete the dual-mode middleware branch). Do this in a separate PR so the rollback option survives until everyone's confident.

**Acceptance for Phase 6:**

- Login redirects to Auth0 hosted page; submits Mazen's existing creds; lands back on map view.
- All API calls succeed with the Auth0-issued JWT (network tab shows `Authorization: Bearer eyJ...` with RS256 header).
- A new sign-up via Auth0 → backend auto-provisions tenant + user via `/users/sync` → that user can immediately use the app.
- Logout clears Auth0 session AND backend session.
- Rolling `AUTH0_ENABLED=false` + `VITE_AUTH_PROVIDER=local` recovers original behavior.

**Commit messages:**

```
feat(auth): backend dual-mode middleware (local JWT + Auth0)  [BACKEND repo]
feat(auth): frontend dual-mode auth bridge + Auth0 SDK         [FRONTEND repo]
feat(users): /users/sync endpoint for Auth0 first-login provisioning  [BACKEND]
chore(deploy): Auth0 env vars in deploy script                 [BACKEND]
chore(auth): remove local-mode code paths after 24h soak       [BOTH, follow-up]
```

---

## 5. What will probably bite you (pre-mortem)

- **CORS on first deploy:** if `ALLOWED_ORIGINS` doesn't include the exact origin the browser sends (case-sensitive, port-sensitive, no trailing slash), every request fails preflight. Browser console is loud about this.
- **Token persistence vs hard reload:** if you forget to hydrate `accessToken` from localStorage on `tokenStore` module load, a hard refresh logs the user out. Test this.
- **Onboarding step shape mismatch:** the mock's field IDs may not match the backend's `step` Zod schemas exactly. Cross-reference `onboardingFlowMockData.js` against backend `src/modules/company/company.schema.ts` BEFORE wiring. Fix at the FE side (rename + restructure form payload), not the BE side.
- **AI workspace approval loop:** the `noraWorkspaceApi.js` mock doesn't model approvals at all. Plan the UX (where to surface "1 task awaiting your approval") with the user before phase 3 step 8.
- **Long-running endpoints:** report generation (30–60s), batch lead scoring, image generation. The default 30s axios timeout will fire. Bump to 120s for those specific calls (per-request override, not the default).
- **The mystery `:3000` Next.js page upstream of the VPS:** the public IP's `:3000` returns a Next.js HTML page from somewhere we don't control. Earlier diagnosis: it's NAT-mapped to a different host. The VPS itself only has the Express backend on `:3000`. If frontend on `:8080` exhibits the same hijack, treat it as an infra problem and report back — don't try to "fix" it from inside the VPS.

---

## 6. Out of scope (explicit so nothing surprises the user)

- React Router (PDF item #1). Separate PR after phase 5.
- Code-splitting heavy pages (PDF item #4).
- `components/Cards` vs `features/` consolidation (PDF item #5).
- Design-system extraction (PDF item #6).
- Tests (PDF item #7).
- Stripe / billing.
- Domain + TLS + nginx.
- Notifications + Events backend endpoints (need backend work first).
- The `:3000` public-IP routing mystery.

**Auth0 is NOT out of scope — it's Phase 6** (above). Schedule it after phases 1–5 land and Mazen has signed off on a full QA pass.

---

## 7. Reference: backend response envelope

Every successful response:
```json
{
  "success": true,
  "data": { ... },
  "meta": { "requestId": "...", "timestamp": "..." }
}
```

Every error response:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | CONFLICT | RATE_LIMITED | AI_SERVICE_ERROR | INTERNAL_ERROR",
    "message": "Human-readable message",
    "details": { ... }
  },
  "meta": { "requestId": "...", "timestamp": "..." }
}
```

Paginated lists add `pagination: { page, pageSize, total, totalPages }` next to `data`.

The `client.js` interceptor unwraps to just `data` on success and throws an `ApiError` with the error fields on failure. Components see the unwrapped shape only.

---

## 8. Reference: backend curl recipes

Adapted from `NORA-BACKEND/docs/local/QA_HANDOVER.md`. Use these to sanity-check endpoints before wiring.

```bash
# Login
curl -X POST http://85.137.249.238:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"mazen@testing.com","password":"TestPass@123"}'

# Get current user (after extracting accessToken from above)
curl http://85.137.249.238:3000/api/v1/users/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

# List leads
curl 'http://85.137.249.238:3000/api/v1/leads?page=1&pageSize=20' \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

# Score a lead (slow — 5-10s for AI roundtrip)
curl -X POST http://85.137.249.238:3000/api/v1/leads/<LEAD_ID>/score \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

# Start an orchestration
curl -X POST http://85.137.249.238:3000/api/v1/orchestrations \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H 'Content-Type: application/json' \
  -d '{"intent":"Show me my top 5 leads and their stage distribution"}'
```

---

## 9. How to start

1. Read this whole doc.
2. Branch: `git checkout -b feat/integration dev` in `NORA-FRONTEND`. Do NOT push to `main` until the user reviews phase 5.
3. Phase 1. Open a draft PR after phase 1 against `dev`. Each subsequent phase is a commit on the same branch (or a chained PR — your call, but don't merge until phase 5 acceptance is met).
4. After each phase: post a single-message status to the user — what changed, what was verified, anything surprising.

If the plan disagrees with reality on the ground (a backend endpoint shape, a mock signature you can't preserve, etc.), **stop and message the user before re-deciding**. The whole point of pre-deciding everything was to avoid mid-flight redesign — but real surprises trump the plan.
