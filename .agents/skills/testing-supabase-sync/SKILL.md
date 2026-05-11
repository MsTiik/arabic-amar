---
name: testing-supabase-sync
description: Test Arabic AMAR optional Supabase progress sync, magic-link sign-in, and sync UI flows. Use when verifying /sync, cross-device progress, or auth email UX changes.
---

# Testing Supabase Progress Sync

## Devin Secrets Needed

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL for the test project.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/publishable key for the test project.
- Optional: a disposable email inbox or magic-link URL if completing a signed-in cross-device sync test.

Never request or store the Supabase service-role key for frontend sync testing.

## Setup

1. Confirm the branch contains the target sync changes:
   ```bash
   git status --short --branch
   git log -1 --oneline
   ```
2. Start from a production build for mobile/tunnel testing. Next dev mode through the Devin tunnel might serve pages where mobile JavaScript does not hydrate correctly.
3. Build with the Supabase public config:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
   NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
   npm run build
   ```
4. If `npm run build` regenerates `content/content.json` or `content/content-qa.json`, restore those generated files before committing or final status checks unless the content changes are intentionally part of the task:
   ```bash
   git show HEAD:content/content.json > content/content.json
   git show HEAD:content/content-qa.json > content/content-qa.json
   ```
5. Stop any stale `next start` process on port 3000, then start the fresh production server:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
   NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
   npm run start -- --hostname 0.0.0.0 --port 3000
   ```
6. Verify `/sync` is configured before browser testing:
   ```bash
   curl -I http://localhost:3000/sync
   ```

## Runtime Tests

### Magic-link request cooldown

Use a unique disposable test email to avoid confusing old Supabase emails with fresh ones.

1. Open `/sync` in the browser.
2. Verify the page shows `Progress sync`, `Email address`, and `Send sign-in link`.
3. Enter a unique email and click `Send sign-in link` once.
4. Expected success state:
   - Success copy includes `Check your email`.
   - Success copy warns not to request another link unless the current one expires.
   - Button is disabled and reads `Try again in Ns`.
   - Countdown decreases while remaining disabled.
5. If Supabase returns a rate-limit error instead:
   - No success message should appear.
   - Error copy should tell the user to wait before trying again.

### Signed-in cross-device sync

Only run this when a disposable inbox or magic-link URL is available.

1. Sign in on device/browser A and verify `/sync` shows `Signed in as <email>`, `Sync now`, and `Sign out`.
2. Practice one card and return to `/sync`.
3. Confirm `Practiced words` and `Today` increased.
4. Sign in with the same email on device/browser B.
5. Confirm the same progress appears after automatic sync or after pressing `Sync now` once.

## Notes

- If a browser test shows old copy or missing UI after a code change, suspect a stale production preview. Rebuild and restart `next start`, then reload with a cache-busting query string.
- The Devin preview tunnel may prompt for username/password on phones. That is tunnel auth, not Arabic AMAR auth.
- For user-facing proof, record browser interactions and annotate key states: configured form visible, request submitted, cooldown shown, countdown decreased, or rate-limit message shown.
