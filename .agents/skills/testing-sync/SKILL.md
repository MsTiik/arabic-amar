---
name: testing-sync
description: Test Arabic AMAR's optional Supabase progress sync (magic link + email OTP code, guest fallback, cross-device merge). Use when verifying /sync, auth UI, or progress-sync changes.
---

# Testing Supabase progress sync (Arabic AMAR)

Use when verifying `/sync`, `src/components/progress-sync-panel.tsx`, `progress-sync-provider.tsx`, or `src/lib/supabase-progress.ts`.

## Devin Secrets Needed
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for a test project (never the service-role key).
- Full sign-in testing needs access to a test email inbox; otherwise report signed-in flows as untested.

## Setup
- Build/start with the env vars set; sync needs a **production** server for realistic testing:
  `NEXT_PUBLIC_SUPABASE_URL=… NEXT_PUBLIC_SUPABASE_ANON_KEY=… npm run build && npm run start`
- Without env vars, `/sync` shows "Sync is not configured on this deployment yet" — that state itself is testable.
- Supabase side: `public.user_progress` table with RLS restricting to the user's own row; auth redirect URLs must include the tested origin.

## Auth flows
- **Magic link**: `/sync` → email → "Send sign-in link" → open the link in the SAME browser.
- **Email OTP code** (for installed PWAs, where email links open the default browser instead): after sending, a 6-digit code box appears. Requires the Supabase Magic Link email template to include `{{ .Token }}`. Only the newest email's code is valid — requesting a new link kills earlier codes, and opening the link consumes the code.
- Rate limits: Supabase free tier allows only a few auth emails/hour; repeated sends trigger a 15-60 min cooldown. The UI should show the error only, never error + success simultaneously.

## Core assertions
- `/sync` (configured): shows sync heading, stats (`Practiced words`, `Mastered`, `Today`), email field + send button; topbar shows the sync chip (`guest` when signed out).
- Guest fallback: practice one card → deck advances, topbar goal increments, `/sync` stats reflect it — all without sign-in.
- Cross-device (needs inbox): sign in on browser A, practice, sign in with the same email on a clean browser B → progress merges (not replaced).

## Gotchas
- Stale prod preview: if the UI shows old copy after a code change, rebuild + restart `next start` and reload with a cache-busting query.
- Installed-PWA caching: the standalone app can serve an old page version until fully closed and reopened.
- The Devin preview tunnel may show its own username/password prompt on phones — that's tunnel auth, not app auth.
