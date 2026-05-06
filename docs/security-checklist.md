# Security Checklist

## 1. XSS Prevention

- [ ] No `innerHTML` with user-supplied or AI-generated content — use `textContent` or a sanitiser
- [ ] If rich text rendering is needed, use `DOMPurify` with a strict allowlist
- [ ] All React JSX rendered as JSX (not `dangerouslySetInnerHTML`) unless explicitly sanitised
- [ ] AI responses displayed using `marked` + `DOMPurify` pipeline:
  ```ts
  import DOMPurify from 'dompurify'
  import { marked } from 'marked'
  const safe = DOMPurify.sanitize(marked.parse(aiText))
  ```
- [ ] Content-Security-Policy header set on the CDN/edge:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data: *.strava.com; connect-src 'self' *.supabase.co
  ```

## 2. CSRF

- [ ] Supabase JWT is sent as `Authorization: Bearer` header (not cookies in SPA mode) — immune to CSRF
- [ ] If cookie-based sessions are adopted: enable `SameSite=Strict` and verify `Origin` header in Edge Functions
- [ ] Edge Functions validate `Authorization` header on every state-mutating request

## 3. Token Storage Strategy

| Token                | Storage                                                                                   | Rationale                                                             |
| -------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Supabase session JWT | `supabase-js` default (localStorage)                                                      | Acceptable for SPA; upgrade to httpOnly cookie for higher sensitivity |
| Strava access token  | **Never in client** — stored in `strava_tokens` DB table, accessed only by Edge Functions | Prevents token theft via XSS                                          |
| Strava refresh token | Same as access token                                                                      |                                                                       |
| Anthropic API key    | Supabase Vault / environment secret                                                       | Never in source or client                                             |

**Upgrade path to httpOnly cookies:**

```ts
// apps/web/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { CookieStorage } from '@supabase/auth-helpers-shared'

export const supabase = createClient(url, anonKey, {
  auth: { storage: new CookieStorage() }, // httpOnly via server proxy
})
```

## 4. Secrets Management

- [ ] Zero secrets committed to git (enforced by `.gitignore` + pre-commit hook)
- [ ] Supabase project secrets set via: `supabase secrets set KEY=value`
- [ ] Local dev uses `.env.local` (gitignored)
- [ ] CI secrets stored in GitHub Actions Secrets (never in YAML)
- [ ] Rotate all keys if a secret is ever accidentally committed:
  1. Revoke immediately in the provider dashboard
  2. `git filter-repo` to scrub history
  3. Force-push and notify all contributors

## 5. Row-Level Security

- [ ] RLS enabled on all user-data tables (`profiles`, `activities_history`, `race_calendar`, `strava_tokens`)
- [ ] Every table has explicit `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies
- [ ] All policies scoped to `TO authenticated`
- [ ] `strava_tokens` additionally restricted: client never reads this table — only Edge Functions (via service role)
- [ ] Verify policies with integration tests (user A cannot read user B's data)

## 6. Input Validation

- [ ] All Edge Function inputs validated with Zod before processing
- [ ] Strava webhook payloads verified with HMAC signature
- [ ] Race calendar form inputs validated client-side (Zod) and server-side (DB constraints)
- [ ] GPX file uploads: validate file type, size limit (10 MB), XML structure

## 7. Backup & Restore

- [ ] Supabase automatic backups enabled (Pro plan)
- [ ] Manual backup before major migrations: `supabase db dump -f backup-$(date +%Y%m%d).sql`
- [ ] Test restore procedure quarterly in a staging project
- [ ] Point-in-time recovery (PITR) configured for production

## 8. Incident Response Basics

### Detection

- Supabase logs → Auth logs for anomalous login patterns
- Edge Function logs → Sentry or structured logging for 5xx rates
- Vercel/Cloudflare analytics → Traffic spikes

### Containment

1. Immediately revoke the compromised credential in the relevant dashboard
2. If DB compromise suspected: enable IP allowlist on Supabase project
3. Force-sign-out all sessions: `supabase auth admin sign-out --all` (via service role)

### Recovery

1. Restore from latest backup if data was corrupted
2. Audit auth logs to identify affected users
3. Notify affected users if personal data may have been accessed (GDPR obligation)

### Post-incident

- Write incident report within 48 hours
- Update this checklist with new controls

## 9. Dependency Security

- [ ] `pnpm audit` runs in CI and fails on high/critical
- [ ] Dependabot enabled for npm and GitHub Actions
- [ ] Lock file committed (`pnpm-lock.yaml`)
- [ ] No dependencies loaded from CDN in production (all bundled)

## 10. CORS Policy (Edge Functions)

```ts
// supabase/functions/_shared/cors.ts
const ALLOWED_ORIGINS = [
  'https://runner-os.com',
  'https://www.runner-os.com',
  ...(Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').filter(Boolean),
]
```

Never use `Access-Control-Allow-Origin: *` for authenticated endpoints.
