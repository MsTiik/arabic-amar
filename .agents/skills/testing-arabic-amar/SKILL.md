---
name: testing-arabic-amar
description: Test Arabic AMAR end-to-end — local production preview, Supabase sync, mobile nav, and practice flows. Use when verifying UI or sync changes.
---

# Testing Arabic AMAR

## Local Production Preview

1. Build the app with Supabase env vars if testing sync:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL='$SUPABASE_URL' \
   NEXT_PUBLIC_SUPABASE_ANON_KEY='$SUPABASE_ANON_KEY' \
   npm run build
   ```
2. Restore generated content files after build (prebuild regenerates them from the live Google Doc):
   ```bash
   git checkout -- content/content.json content/content-qa.json
   ```
3. Start the production server:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL='$SUPABASE_URL' \
   NEXT_PUBLIC_SUPABASE_ANON_KEY='$SUPABASE_ANON_KEY' \
   npm run start -- --hostname 0.0.0.0 --port 3000
   ```
4. Expose via Devin tunnel if the user needs to test on their phone.

**Important**: Use `npm run start` (production), not `npm run dev`. The dev server may have JS hydration issues through the Devin tunnel on mobile devices — buttons render but don't respond to clicks.

## Mobile Viewport Testing

Use Chrome CDP at `http://localhost:29229` to set mobile emulation:
```js
await send('Emulation.setDeviceMetricsOverride', {
  width: 390, height: 844, deviceScaleFactor: 2, mobile: true,
  screenWidth: 390, screenHeight: 844,
});
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
```
Reset to desktop afterward with `Emulation.clearDeviceMetricsOverride`.

## Supabase Sync Testing

- Without env vars: `/sync` shows a disabled state explaining sync is not configured.
- With env vars: `/sync` shows an email form with `Send sign-in link` button.
- Magic-link sign-in requires actual email access. Mark full signed-in sync as **untested** if you cannot open the magic-link email.
- Invalid email submission should show ONLY an error message, not both success and error.
- Dashboard shows `Sign in to sync` CTA when Supabase is configured but user is not signed in.
- Topbar shows a `guest` sync chip on `sm:` screens and above when configured.

## Key Pages and Flows

| Page | What to verify |
|---|---|
| `/` (homepage) | Dashboard, daily path, `Sign in to sync` button, streak/freezes/goal chips |
| `/sync` | Email form or signed-in state, progress stats, manual Sync now |
| `/practice?deck=new` | Flashcard deck, card advancement, progress update |
| `/vocabulary/names-of-allah` | 99-name collection, 3-column grid, pronunciation reveal |
| `/read` (Foundations) | Alphabet, harakāt, tajweed sub-pages |

## Common Gotchas

- `npm run build` runs `prebuild` which fetches a live Google Doc and regenerates `content/content.json`. This may change the content file. Always `git checkout -- content/content.json content/content-qa.json` before committing to avoid unrelated diffs.
- Tests depend on the committed content fixture. If the live Google Doc has changed since the last content commit, one test (`includes demonstratives in the searchable vocabulary`) may fail. Restoring the committed content files fixes this.
- Supabase magic-link emails have a project-level rate limit. If you hit `email rate limit exceeded`, wait 15-60 minutes or use a different test email address.
- Supabase redirect URLs must match the exact origin the user is testing from (e.g., the Devin tunnel URL without basic-auth credentials in the URL).

## Devin Secrets Needed

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (publishable, not sensitive)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key (publishable, not sensitive)

These are client-side publishable values, not service-role keys. Do NOT request or use the Supabase service-role key.
