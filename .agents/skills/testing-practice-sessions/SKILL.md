---
name: testing-practice-sessions
description: Test the practice/exercise flow (decks, answer feedback, sounds, haptics) and PWA behavior end-to-end in Arabic AMAR. Use when verifying ExerciseRunner, feedback, gamification, or PWA changes.
---

# Testing practice sessions (Arabic AMAR)

## Run locally
- `npm run dev` → http://localhost:3000 (usually ready in <10s; verify with curl for HTTP 200).
- Lint: `npm run lint`; typecheck: `npx tsc --noEmit`.
- `npx vitest run` may fail to start on Node 20 with `ERR_REQUIRE_ESM` loading `vitest.config.ts` — this can be preexisting/environmental; check it fails identically on `main` before blaming your change. CI may still run tests fine.
- Next.js dev overlay may show a dev-only eval/CSP console notice ("1 issue" badge) — usually unrelated to app code; dismiss it before recording.

## Reaching the feature
- Go to `/practice`, pick a deck (e.g. "Mixed multiple choice", 12 questions). Deck runs entirely client-side in `src/components/exercise-runner.tsx` — no navigation, so page-level instrumentation survives the whole run.
- Combo badge appears at 3 correct in a row; combo feedback fires at 3 then every 5. Completion screen appears after the last question.
- Sound/haptics preference: `localStorage` key `arabic-amar:feedback:v1` ("on"/"off"), toggled by the speaker button in the topbar and in the deck header (`src/components/feedback-toggle.tsx`, logic in `src/lib/feedback.ts`).

## Verifying sounds & haptics (no audio in screen recordings, no vibration motor on VM)
Instrument the page via Playwright over CDP (`chromium.connectOverCDP("http://localhost:29229")`, use `playwright-core`), then interact via normal UI clicks:
```js
await page.evaluate(() => {
  window.__oscStarts = 0; window.__vibrations = [];
  const s = OscillatorNode.prototype.start;
  OscillatorNode.prototype.start = function (...a) { window.__oscStarts++; return s.apply(this, a); };
  navigator.vibrate = (p) => { window.__vibrations.push(p); return true; };
});
```
Read counters after each phase and compare against the patterns/note counts in `src/lib/feedback.ts`. Note: word-pronunciation audio (`SpeakerButton`) uses `<audio>` files, not oscillators, so it won't pollute the counter.

## Verifying word-pronunciation autoplay (`src/lib/autoplay.ts`)
- Preference: `localStorage` key `arabic-amar:autoplay:v1` ("on"/"off", default off), toggled by the audio-lines button in the deck header (`src/components/autoplay-toggle.tsx`). It's independent from the effects toggle.
- To prove which file played (recordings capture no sound), wrap `window.Audio` and intercept `play()`, logging into `window.__audioLog`. Render an on-screen overlay div showing the last played filename — this makes the evidence visible in screenshots/recordings, which viewers appreciate.
- CDP `context.addInitScript` may NOT re-apply after a manual page reload when attached via `connectOverCDP` — after any reload, re-run your injection script and confirm `window.__audioProbe` (or equivalent flag) before asserting "no audio played".
- Many vocab words have no recording (check the disabled/muted speaker button state); autoplay is a silent no-op for them. Pick cards showing an enabled "Play pronunciation" button for positive tests; a few flashcards may need advancing before one appears.
- Feedback-bar autoplay is delayed ~450 ms after the answer chime — screenshot immediately after answering may show "created" but not yet "PLAYED"; take a second screenshot.
- Checking `content/audio-manifest.json` URLs in bulk with HEAD requests gets Wikimedia 429 rate limits after a few requests — verify 2-3 URLs slowly (or rely on in-app playback) instead of hammering all of them.

## Testing PWA behavior (manifest, service worker, offline, iOS hint)
- The service worker only registers in **production** mode (`src/components/pwa-setup.tsx`). Use `npm run build && PORT=3001 npm run start` — `npm run dev` will never register it.
- Manifest is served at `/manifest.webmanifest` (generated from `src/app/manifest.ts`); SW is `public/sw.js` with a no-cache header from `next.config.ts`.
- Install test: open the prod URL in Chrome; the install icon appears in the omnibox only if manifest+icons+SW are valid. Installing opens a standalone window.
- Offline test: attach CDP to the page and `Network.emulateNetworkConditions {offline:true}` then reload — pass if the page renders from cache and `navigator.onLine === false`.
- iOS install hint: only shows for `iPhone|iPad|iPod` UAs AND when NOT in standalone display mode — it will not appear inside the installed app window, so test it in a normal tab with `Emulation.setUserAgentOverride`. Dismissal is stored at `localStorage arabic-amar:install-hint:v1`.
- Beware races between automated CDP checks and manual UI clicks: sample state only after the manual action is confirmed on screen.

## Deck selection & URL grammar
- Practice URLs are query-driven (`src/components/practice-client.tsx`): `/practice?topic=<slug>&kind=<kind>` with kinds `flashcard | mc | fill | gender | ordering`; state decks use `/practice?deck=due|weak|new|names-of-allah`. Slugs come from `content/content.json`.
- "Mixed multiple choice" (12 questions) is the fastest deck for testing answer feedback, progress bar, combo streaks, and the completion screen in one run.
- Correct answers are readable from the stripped DOM (option text + Arabic prompt); answer wrong once to test the miss path, then 3+ correct in a row for the combo chip (appears on the NEXT question — combo updates on Continue).
- State decks (Review due / mistakes / Add new words) only render when localStorage progress has matching words; seed by answering a card wrong, or seed `arabic-amar:progress:v1` directly with low-mastery words and past `nextDue` dates.

## Expected exercise-runner behavior
- Header: fat progress bar + "N / total" counter; bar grows per answer.
- Correct: option pops green; green feedback bar with "Correct!" + Continue (auto-focused, Enter advances). Wrong: option shakes red; red bar shows "Answer: <correct>".
- Combo chip "N in a row!" (gold flame) at 3+ consecutive correct; disappears after a miss.
- Completion: trophy pop; confetti only if accuracy ≥80%; stat tiles count up (~0.8-1.5s — wait before screenshotting final values); "Best streak" chip if best combo ≥3.
- Flashcards: after flipping, button positions shift slightly — re-screenshot before clicking Got it right/wrong.

## Progress state control
- All progress lives in `localStorage` key `arabic-amar:progress:v1` (no auth). Clear it + reload for fresh-learner tests; avoid the UI "Reset progress" during unrelated tests.
- To force goal-reached non-destructively, lower the daily goal via the "N cards" button to ≤ cards seen, then restore it.

## Mobile layout (immersive mode, tab bar)
- Simulate a phone by resizing Chrome to ~400-420px wide (Tailwind `sm`=640px), or CDP `Emulation.setDeviceMetricsOverride {width:390,height:844,mobile:true}`; re-maximize with wmctrl afterwards. This doesn't exercise touch scrolling, iOS URL-bar collapse (`100dvh`), or safe-area insets — note that limitation.
- Phone expectations: fixed 5-tab bottom bar (`src/components/tab-bar.tsx`, `md:hidden`), scrollable topbar nav, topbar auto-hides on scroll down. During a deck, `body.session-active` hides topbar/tab bar/footer; the feedback bar is a fixed bottom sheet on phones (inline in the card ≥sm).
- Fixed-positioning gotcha: an ancestor retaining a `transform` (e.g. entry animation with `fill-mode: both`) becomes the containing block for `position: fixed` and breaks the bottom sheet; `backwards` is safe.

## Design tokens & lesson identity spot-checks
- `globals.css` defines named accent hues (`--accent-rose/…/indigo` + `-soft`) with dark-mode overrides, plus `.card-flat`/`.card-raised`/`.section-label`. Always toggle dark mode (theme button left of "Foundations") when verifying token changes.
- `src/lib/lesson-identity.ts` maps topic slug → Lucide icon + OKLCH hue on 4 surfaces (Home/Topics cards, lesson header, Grammar pills, Practice by-lesson rows). Spot-checks: Body Parts = red hand, Numbers = blue hash, Time = teal clock, Colours = pink palette.
- Tailwind gotcha: color classes must be full literal strings (no template-literal hue interpolation) or styles silently won't be generated.

## Gotchas
- React Strict Mode (dev) double-invokes `useEffect`, so effect-driven sounds (feedback bar, completion fanfare) fire twice in `npm run dev` but once in production builds. Expect ×2 counts in dev; don't report as a bug unless it reproduces in `npm run build && npm run start`.
- Answering a multiple-choice question shows a feedback bar; feedback sound fires on option click (bar mount), while combo/advance logic fires on the "Continue →" click.
- Correct answers for verification: the Arabic prompt's meaning is deterministic; hover/read the DOM to identify options.

## Devin Secrets Needed
None — everything runs locally without credentials.
