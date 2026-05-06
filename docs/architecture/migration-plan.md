# Migration Plan — Monolith to Modular Architecture

## Overview

The migration follows three phases. Each phase keeps the app live and the existing `index.html` reachable until Phase C removes it.

---

## Phase A — Parallel Infrastructure (Week 1–2)

**Goal:** New architecture exists alongside the monolith; no user-visible change.

### Steps

1. **Introduce monorepo structure** (this PR)
   - Root `pnpm-workspace.yaml` + `turbo.json`
   - `packages/shared` with types and schemas
   - `apps/web` scaffold (not served yet)

2. **Harden database**
   - Apply RLS policies migration (`20260506000000_add_rls_policies.sql`)
   - Add `NOT NULL` constraints on `user_id` columns
   - Add `strava_tokens` RLS policies
   - Add indexes migration

3. **Move secrets out of source**
   - Replace hard-coded Supabase URL/key in `index.html` with `window.__ENV__` injection at build time
   - Rotate any keys that were committed

4. **Deploy Edge Functions**
   - `strava-oauth` — replaces the inline Strava OAuth flow
   - `strava-refresh` — replaces client-side token refresh
   - `ai-analysis` — moves Anthropic key server-side

5. **Update `index.html`** to call Edge Functions instead of direct Strava/Anthropic APIs

**Rollback:** No structural change to the app. If Edge Functions fail, revert the function deploys.

---

## Phase B — Feature-by-Feature Migration (Week 3–8)

**Goal:** Migrate features one by one to `apps/web`. Each feature is toggled via a feature flag.

### Order (lowest risk first)

| #   | Feature              | Risk   | Notes                       |
| --- | -------------------- | ------ | --------------------------- |
| 1   | Profile              | Low    | Pure CRUD, no external APIs |
| 2   | Race Calendar        | Low    | Pure CRUD                   |
| 3   | Auth                 | Medium | Session handling change     |
| 4   | Activities           | Medium | Strava integration          |
| 5   | Analysis (AI)        | High   | AI rendering, complex state |
| 6   | Strategy / Dashboard | High   | Most complex UI             |

### Per-feature process

1. Implement feature in `apps/web/src/features/<name>`
2. Add feature flag: `VITE_FF_<FEATURE>=true`
3. Deploy `apps/web` to staging subdomain
4. QA the new feature vs monolith
5. Flip feature flag in production
6. Monitor for regressions (1 week)
7. Remove old code path from `index.html`

**Rollback:** Flip feature flag to `false`. Old code path in `index.html` is still live.

---

## Phase C — Remove Legacy Monolith (Week 9–12)

**Goal:** `index.html` monolith deleted; `apps/web` is the sole frontend.

### Steps

1. All features confirmed stable for ≥1 week in production
2. Redirect legacy URL to new app
3. Delete `index.html`
4. Remove feature flag infrastructure
5. Archive old code in a `legacy/` tag: `git tag legacy-monolith`

**Rollback:** `git checkout legacy-monolith -- index.html` + redeploy. This is the last resort.

---

## Rollback Summary Per Phase

| Phase | Rollback mechanism                        | Time to restore |
| ----- | ----------------------------------------- | --------------- |
| A     | Revert Edge Function deploy               | < 2 min         |
| B     | Flip feature flag to false                | < 1 min         |
| C     | `git checkout legacy-monolith` + redeploy | < 5 min         |

---

## Definition of Done

- [ ] All 7 features migrated and running in production
- [ ] Zero regressions in E2E smoke tests
- [ ] `index.html` deleted
- [ ] `strava_tokens` never returned to client
- [ ] No `innerHTML` with unescaped data anywhere in new code
- [ ] All secrets in `.env` / Supabase Vault
- [ ] CI green on main for 2 consecutive weeks
