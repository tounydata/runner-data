# ADR-001 — Foundation Architecture

**Status:** Accepted  
**Date:** 2026-05-06  
**Authors:** Engineering lead

---

## Context

Runner OS started as a single-file monolith (`index.html`, ~3 400 lines of mixed HTML/CSS/JS). The app uses Supabase (Auth, Postgres, Edge Functions), Strava OAuth, and Claude AI. It is being opened to its first external users and needs to be maintainable, secure, and scalable.

Pain points identified in the monolith:
- Tokens stored in `localStorage` (XSS exposure)
- `innerHTML` with unsanitised AI responses (XSS vector)
- `</body>` closed mid-file, DOM nodes appended after
- No type safety, no tests, no CI
- All business logic, UI, and API calls mixed in global scope
- Secrets inlined (Supabase URL/key hard-coded)

---

## Decision: React + Vite (not Next.js)

### Chosen: React 19 + Vite 6

**Why not Next.js:**
- The app is entirely behind authentication — SSR provides zero SEO value for user-specific dashboards
- No public pages require server rendering or static generation
- The deployment target is a static CDN (Cloudflare Pages / Vercel static) — no Node server needed
- Next.js App Router would add significant complexity (RSC, streaming, layouts) without any benefit for this use case
- Strava OAuth flow is handled by Supabase Edge Functions, not the Next.js server

**Why React + Vite:**
- Fast HMR, minimal config
- Full TypeScript support out of the box
- `@vitejs/plugin-react` with SWC for production builds
- Dead-simple deployment as static files
- Tree-shaking keeps bundle lean
- Supabase JS client is designed for client-side usage

**Trade-off:** If the product needs public marketing pages, SEO-optimised race results, or server-side personalisation in future, migrating to Next.js is a realistic Phase 3 option without rewriting business logic (features are already isolated).

---

## Decision: Zustand (not Redux Toolkit)

**Why Zustand:**
- Minimal boilerplate — store definition is one function call
- First-class TypeScript inference without extra setup
- Atomic slices map directly to features (auth, activities, race-calendar, profile)
- No `Provider` wrapper required
- Devtools available via `zustand/middleware`

**Why not Redux Toolkit:**
- RTK Query solves server-cache problems that `@tanstack/react-query` solves more elegantly
- Overkill for the current feature surface
- Heavier bundle (~15 KB gzip vs ~1 KB for Zustand)

**Trade-off:** If the team grows to 5+ engineers with complex shared server state, migrating hot paths to React Query + Zustand is the recommended path (not RTK).

---

## Monorepo Structure

```
runner-os/
├── apps/
│   └── web/                  # React + Vite SPA
├── packages/
│   └── shared/               # Types, Zod schemas, pure utilities
├── supabase/
│   ├── functions/            # Edge Functions (Deno)
│   └── migrations/           # SQL migrations (sequential)
├── docs/
│   ├── architecture/
│   └── runbooks/
└── .github/
    └── workflows/
```

**Why a monorepo:**
- `packages/shared` types are consumed by both the frontend and Edge Functions
- A single `pnpm` workspace keeps dependency versions in sync
- Turbo enables parallel builds and caching across packages
- `supabase/` lives at root to align with Supabase CLI conventions

---

## API Boundaries

```
Browser (React)
  │
  ├─ Supabase JS client (@supabase/supabase-js)
  │    ├─ Auth (email/password, session refresh)
  │    └─ Postgres (RLS-protected queries)
  │
  └─ Supabase Edge Functions (via fetch / supabase.functions.invoke)
       ├─ strava-oauth      — exchange code → tokens, store encrypted
       ├─ strava-refresh    — refresh Strava token on expiry
       └─ ai-analysis       — proxy Claude API (server-side key)
```

**No direct API calls from the browser to:**
- Strava API (tokens stay server-side in Edge Functions)
- Anthropic API (key never exposed to client)

---

## Security Model

| Concern | Decision |
|---|---|
| Strava tokens | Stored in `strava_tokens` table (server-side only, never sent to client); access via Edge Functions only |
| Supabase session | httpOnly cookies via `supabase.auth.setSession` + `storage: cookieStorage` in production |
| AI output rendering | `textContent` or `marked` with strict sanitisation — never raw `innerHTML` |
| RLS | Explicit policies on every table; `TO authenticated` minimum |
| Secrets | All in `.env` / Supabase Vault; zero secrets in source |
| CORS | Edge Functions enforce `Access-Control-Allow-Origin` allowlist |

---

## Data Contracts

All TypeScript types are defined in `packages/shared/src/types/` and published as `@runner-os/shared`. Zod schemas in `packages/shared/src/schemas/` provide runtime validation at system boundaries (Edge Function ingress, AI response parsing).

---

## Migration Steps

See [docs/architecture/migration-plan.md](./migration-plan.md) for the phased approach.

---

## Consequences

- Frontend is a static SPA — Cloudflare Pages or Vercel free tier will host it
- Edge Functions handle all sensitive server logic
- Shared types enforce a contract between frontend and backend at compile time
- The monolith `index.html` is kept as-is during Phase A and removed in Phase C
