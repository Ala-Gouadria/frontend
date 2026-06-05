# NORA Frontend — Auth0 Integration Plan (XWORLDLTD-26)

**Scope:** NORA-FRONTEND only (this repo) + a written contract for the NORA backend team.
**Model:** Auth0 Universal Login as the **primary** login path (same decision as xworldltd.com), using the
**hybrid token-exchange** pattern: Auth0 authenticates the user (SPA, Authorization Code + PKCE), then the
**existing NORA backend mints its own JWT** — so the custom-JWT layer already built (`api/client.js`,
`api/tokenStore.js`, refresh-on-401) is **reused unchanged**.

---

## Why hybrid (not "pure Auth0")
The frontend already has a working backend-JWT layer (`tokenStore` access+refresh, `/api/v1/auth/refresh`,
envelope unwrap, tenant via the backend's `tid` claim). Hybrid keeps all of that: Auth0 becomes the front
door, the backend stays the session authority. This mirrors what we did on xworldltd.com (Auth0 logs you in →
the app issues its own session + provisions the local user + enforces `email_verified`), and it avoids
rewriting the backend's tenant/refresh model right now.

## Current state (verified on branch `auth0-nora`)
- **No Auth0 yet.** Auth is email/password via `src/api/auth.js` → `/api/v1/auth/login`; gating is the
  `nora:isAuthenticated` localStorage flag in [src/app/App.jsx](src/app/App.jsx).
- `src/pages/auth/Login.jsx` Google/Apple buttons are **placeholders** (no `onClick`).
- `src/components/layout/ProjectList.jsx` `handleLogout` just clears localStorage + reloads.
- Reusable as-is: [src/api/client.js](src/api/client.js), [src/api/tokenStore.js](src/api/tokenStore.js).

---

## Flow (target)
```
Login screen (primary button)  ──loginWithRedirect()──▶  auth.xworldltd.com (Universal Login, branded)
        │                                                  Google + email/pw + email verification
        ▼ (redirect back to nora.xworldltd.com)
@auth0/auth0-react parses callback ──getAccessTokenSilently()/getIdTokenClaims()──▶ Auth0 token
        │
        ▼  POST /api/v1/auth/auth0-exchange  { auth0Token }
NORA backend: verify Auth0 token (JWKS) ▶ enforce email_verified ▶ find/create local user + tenant
        │                                  ▶ issue EXISTING NORA { accessToken, refreshToken }
        ▼
tokenStore.setTokens(...)  ─────▶  app runs exactly as today (client.js Bearer + refresh unchanged)
```

---

## Frontend changes (this repo)

### 1. Dependency
`npm i @auth0/auth0-react` (axios already present).

### 2. [src/main.jsx](src/main.jsx) — wrap app in `Auth0Provider`
```jsx
import { Auth0Provider } from '@auth0/auth0-react'
// ...
<Auth0Provider
  domain={import.meta.env.VITE_AUTH0_DOMAIN}            // auth.xworldltd.com
  clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}       // Nora SPA: ggkgp4wnPryWiF3Pqu2tYhLYrIxzYvhf
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,      // NORA API identifier (optional but recommended)
  }}
  cacheLocation="localstorage"
>
  <App />
</Auth0Provider>
```

### 3. [src/api/auth.js](src/api/auth.js) — add the exchange call
```js
export async function exchangeAuth0Token(auth0Token) {
  const data = await post('/api/v1/auth/auth0-exchange', { auth0Token });
  tokenStore.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data;
}
```
Keep `login`/`register`/etc. for the local fallback.

### 4. [src/app/App.jsx](src/app/App.jsx) — Auth0 bootstrap + primary gating
- Use `useAuth0()` (`isAuthenticated`, `getAccessTokenSilently`, `isLoading`).
- On mount, if Auth0 says authenticated **and** `tokenStore` has no NORA access token → call
  `getAccessTokenSilently()` → `authApi.exchangeAuth0Token(...)` → on success `enterApp()`.
- Replace the `nora:isAuthenticated` flag check with "has NORA access token (post-exchange)". Keep a small
  derived flag if convenient, but the source of truth becomes `tokenStore`.
- Show a lightweight loading state while `isLoading` / exchange is in flight.

### 5. Auth screens — make Auth0 primary, keep local as fallback
- [src/pages/auth/Login.jsx](src/pages/auth/Login.jsx): primary button → `loginWithRedirect()`. Wire the
  existing **Google** button → `loginWithRedirect({ authorizationParams: { connection: 'google-oauth2' } })`.
  Keep the email/password form behind a `?local=1` toggle (calls existing `authApi.login`) — same fallback
  convention as xworldltd.com. (Apple was dropped per team decision — hide or leave inert.)
- [src/pages/auth/Signup.jsx](src/pages/auth/Signup.jsx): primary → `loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })`.
- `restPassword.jsx`: with Auth0 primary, password reset is handled in Universal Login; keep local form only for `?local=1`.

### 6. [src/components/layout/ProjectList.jsx](src/components/layout/ProjectList.jsx) — logout
```js
const { logout } = useAuth0()
const handleLogout = async () => {
  handleClose()
  try { await authApi.logout() } catch {}          // backend revoke + tokenStore.clear()
  logout({ logoutParams: { returnTo: window.location.origin } })  // clears Auth0 SSO
}
```

### 7. [.env.example](.env.example) — add
```
VITE_API_BASE_URL=http://localhost:3000
VITE_AUTH0_DOMAIN=auth.xworldltd.com
VITE_AUTH0_CLIENT_ID=ggkgp4wnPryWiF3Pqu2tYhLYrIxzYvhf
VITE_AUTH0_AUDIENCE=https://api.nora.xworldltd.com    # the NORA API identifier registered in Auth0
```

---

## Backend contract (spec — for whoever owns NORA-BACKEND)

### New endpoint: `POST /api/v1/auth/auth0-exchange`
- **Body:** `{ auth0Token }` (Auth0 access token; or accept the id token).
- **Verify:** signature via JWKS `https://auth.xworldltd.com/.well-known/jwks.json`, `iss = https://auth.xworldltd.com/`, `aud = VITE_AUTH0_AUDIENCE`, exp.
- **Enforce email verification:** reject if `email_verified !== true` → `403 { code: 'EMAIL_NOT_VERIFIED' }`.
- **Provision/link user:** find local `User` by Auth0 `sub` (store as `auth0Id`) or by `email`; create if absent.
- **Tenant resolution:** read tenant from Auth0 `app_metadata.tid` (set via an Auth0 Action/Management API);
  create-on-first-login if needed. Embed it in the NORA JWT exactly as the current `tid` claim — **no change
  to downstream tenant logic.**
- **Return:** the existing envelope `{ data: { accessToken, refreshToken, user } }` (access 15m + opaque
  refresh 7d), identical shape to `/api/v1/auth/login` so the frontend is agnostic.

### Auth0 side (Management API / dashboard)
- Add `app_metadata.tid` to users (Action or Management API) so the token carries tenant.
- Optional defense-in-depth: a Post-Login Action that also blocks unverified emails.
- Register a **NORA API** (resource server) with identifier = `VITE_AUTH0_AUDIENCE` if using access tokens.

### Auth0 dashboard prereqs (Nora SPA app `ggkgp4wn…Zvhf`)
- **Allowed Callback URLs:** `https://nora.xworldltd.com`, `http://localhost:5173`
- **Allowed Logout URLs:** `https://nora.xworldltd.com`, `http://localhost:5173`
- **Allowed Web Origins:** `https://nora.xworldltd.com`, `http://localhost:5173`
- Keep app type **SPA** (PKCE / `token_endpoint_auth_method: none`) — correct for a browser client; **no client secret in the frontend.**

---

## Verification
1. `npm i` + fill `.env` (`VITE_AUTH0_*`), `npm run dev`.
2. Visit app → Login's primary button redirects to `auth.xworldltd.com` (branded Nora Universal Login).
3. Sign in (Google or email/pw) → returns to `nora.xworldltd.com`; Network shows
   `POST /api/v1/auth/auth0-exchange` → NORA `{accessToken, refreshToken}` stored in `tokenStore`.
4. App proceeds to setup/map exactly as today; subsequent `/api/v1/*` calls carry the NORA Bearer token;
   401 still refreshes via `/api/v1/auth/refresh`.
5. Unverified email → exchange returns `403 EMAIL_NOT_VERIFIED`; UI shows "verify your email".
6. Logout → `tokenStore` cleared + backend revoke + Auth0 SSO cleared (no silent re-login).
7. `?local=1` → legacy email/password form still works (fallback).

**Blocking dependency:** step 3 needs the backend `/api/v1/auth/auth0-exchange` endpoint. Frontend can be
built and unit-verified before then, but full E2E requires the backend half.
```
