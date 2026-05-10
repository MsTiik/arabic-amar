---
name: testing-supabase-progress-sync
description: Test Arabic AMAR optional Supabase progress sync end-to-end. Use when verifying /sync, magic-link auth UI, and guest progress fallback behavior.
---

# Testing Supabase Progress Sync

Use this skill when testing changes to Arabic AMAR's optional account/cloud progress sync.

## Devin Secrets Needed

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Project URL for a test/staging project.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase publishable/anon key for the same project.
- Optional for full sign-in testing: access to a test email inbox or magic-link session for the email used during Supabase Auth testing.

Never request or store the Supabase service-role key for browser/runtime testing.

## Setup Checks

1. Start the app locally with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set.
2. Confirm the `public.user_progress` table exists and RLS policies allow the authenticated user's own row only.
3. If full login testing is required, confirm Supabase Auth redirect URLs include the local origin and the deployed preview origin.
4. Reset browser state before testing with `localStorage.clear(); sessionStorage.clear(); location.href = '/sync';` so progress counts start from a known baseline.

## Core Runtime Assertions

1. Open `/sync`.
   - It should show `Use the same progress on your phone`.
   - It should show stats such as `Practiced words`, `Mastered`, and `Today`.
   - It should show the `Email address` field and `Send sign-in link` button.
   - It should not show `Sync is not configured on this deployment yet` when env vars are present.

2. Open `/`.
   - Dashboard copy should mention progress can sync when signed in.
   - A `Sign in to sync` shortcut should appear.
   - The topbar should show the configured signed-out sync chip labeled `guest`.

3. Test rejected-email handling from `/sync`.
   - Submit an email Supabase rejects, such as a disposable/test-only address if the project blocks it.
   - The page should show the red Supabase error.
   - The page should not simultaneously show the success text `Check your email, then open the sign-in link on this device.`

4. Test guest progress fallback while Supabase is configured.
   - Open `/practice?deck=new`.
   - Verify the `Add new words` deck opens at `Card 1 of 10`.
   - Click `Got it right` once.
   - Verify the deck advances to `Card 2 of 10` and the topbar updates to `1/20`.
   - Return to `/sync` and verify `Practiced words 1` and `Today 1/20`.

## Full Sign-In / Cross-Device Coverage

Only claim full cloud sync is tested if you can open the magic-link email or the user clicks/provides the test login link.

When mailbox access is available:

1. Request a magic link from `/sync` using a test email.
2. Open the magic link in the same browser and confirm `/sync` shows `Signed in as ...`.
3. Practice one card and wait briefly for background sync.
4. Sign in with the same account in a second clean browser profile/session.
5. Confirm cloud progress merges into the second session instead of replacing local progress incorrectly.

If mailbox access is not available, report signed-in state, manual `Sync now`, and cross-device merge as untested.

## Recording Guidance

For UI testing, record the browser and annotate:

- `/sync` configured initial state.
- Dashboard sync entry points.
- Invalid-email error-only state.
- Practice progress update.
- `/sync` stats after returning from practice.
