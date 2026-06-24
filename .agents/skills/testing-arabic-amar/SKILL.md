---
name: testing-arabic-amar
description: Test the Arabic AMAR website end-to-end. Use when verifying security headers, CSP policy, audio playback, theme toggle, or general UI rendering after changes.
---

# Testing Arabic AMAR

## Quick Start

```bash
cd /home/ubuntu/repos/arabic-amar
npm run dev
# Dev server runs on localhost:3000 (or next available port if 3000 is in use)
```

## Key Test Areas

### 1. Security Headers

Verify all 7 security response headers are present on every route:

```bash
curl -sI http://localhost:3000/ | grep -iE "x-content-type|x-frame|referrer-policy|permissions-policy|strict-transport|x-dns|content-security"
```

Expected headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-DNS-Prefetch-Control: on`
- `Content-Security-Policy:` (complex value, see `next.config.ts`)

Test multiple routes: `/`, `/topics`, `/read/alphabet`, `/vocabulary`, `/grammar`

### 2. CSP Compatibility

The Content-Security-Policy is configured in `next.config.ts`. Key allowances:
- `script-src 'self' 'unsafe-inline'` — required for theme bootstrap inline script in `layout.tsx`
- `style-src 'self' 'unsafe-inline'` — required for Tailwind CSS
- `media-src 'self' https://upload.wikimedia.org` — required for Arabic pronunciation audio
- `connect-src 'self' https://*.supabase.co` — required for Supabase auth/data

**What to check in browser console**: Look for "Refused to" errors which indicate CSP violations. Zero CSP errors expected on all pages.

**Dev-mode note**: React DevTools will show an `eval()` warning in dev mode — this is expected and does NOT affect production. CSP correctly blocks eval, and React only uses eval for dev debugging.

### 3. Audio Playback

Audio files are hosted on Wikimedia Commons (`upload.wikimedia.org`). Test on `/read/alphabet`:
- Click any speaker button (e.g., next to "alif" or "thumma")
- Some letters use Wikimedia recordings, others fall back to browser TTS
- Verify no CSP `media-src` violations in console

Programmatic test:
```javascript
// Run in browser console
const audio = new Audio('https://upload.wikimedia.org/wikipedia/commons/0/0b/LL-Q13955_%28ara%29-Fjmustak-%D9%85%D8%AD%D8%B1%D9%85.wav');
audio.addEventListener('canplaythrough', () => console.log('PASS: Audio loaded'));
audio.addEventListener('error', (e) => console.log('FAIL:', audio.error?.message));
audio.load();
```

### 4. Theme Toggle

- Theme button is in the header (sun/moon icon, between streak counter and "Foundations" link)
- Click to cycle: light → dark → system
- After toggling, **refresh the page** — theme must persist without flash of wrong theme
- This proves the inline bootstrap script (`layout.tsx` `dangerouslySetInnerHTML`) is not blocked by CSP

### 5. Navigation & Rendering

Key pages to verify render correctly:
- `/` — Homepage
- `/topics` — Lesson topics grid
- `/read/alphabet` — 28 Arabic letters with positional forms
- `/vocabulary` — Vocabulary lists
- `/grammar` — Grammar lessons
- `/practice` — Practice exercises
- `/about` — About page

Check: Arabic text renders with proper tashkeel (diacritics), layout is styled, no blank sections.

## Architecture Notes

- **Framework**: Next.js (check version in `package.json`)
- **Auth**: Supabase magic-link OTP (needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- **Admin**: Access via `#admin` hash on homepage, requires `ADMIN_REFRESH_TOKEN` env var
- **Audio manifest**: `content/audio-manifest.json` maps words to Wikimedia URLs
- **Build**: `npm run build` generates `content/content.json` then builds Next.js
- **Lint/typecheck**: `npm run lint` and `npm run typecheck`

## Vercel Preview Deployments

Vercel preview URLs may be behind SSO if the project has Vercel team protection enabled. If you can't access the preview URL, test locally instead — the `headers()` config in `next.config.ts` also applies in dev mode.

## Devin Secrets Needed

- None required for basic testing (dev server runs without env vars for public pages)
- For admin panel testing: `ADMIN_REFRESH_TOKEN` (server-side env var)
- For Supabase auth flows: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
