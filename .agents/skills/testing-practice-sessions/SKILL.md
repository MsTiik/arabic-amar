---
name: testing-practice-sessions
description: Test the practice/exercise flow (decks, answer feedback, sounds, haptics) end-to-end in Arabic AMAR. Use when verifying ExerciseRunner, feedback, or gamification changes.
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

## Gotchas
- React Strict Mode (dev) double-invokes `useEffect`, so effect-driven sounds (feedback bar, completion fanfare) fire twice in `npm run dev` but once in production builds. Expect ×2 counts in dev; don't report as a bug unless it reproduces in `npm run build && npm run start`.
- Answering a multiple-choice question shows a feedback bar; feedback sound fires on option click (bar mount), while combo/advance logic fires on the "Continue →" click.
- Correct answers for verification: the Arabic prompt's meaning is deterministic; hover/read the DOM to identify options.

## Devin Secrets Needed
None — everything runs locally without credentials.
