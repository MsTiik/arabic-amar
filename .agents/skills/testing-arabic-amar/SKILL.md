---
name: testing-arabic-amar
description: Test Arabic AMAR browser flows locally with controlled progress state. Use when verifying dashboard, practice, vocabulary, topic, or progress-related UI changes.
---

# Arabic AMAR Runtime Testing

## Devin Secrets Needed

- None for local runtime testing. The app stores learner progress in browser `localStorage` and does not require login for normal learner flows.

## Local App Setup

1. Use the repo checkout, usually `/home/ubuntu/repos/arabic-amar`.
2. Start the dev server with `npm run dev`. If port `3000` is unavailable, Next.js may choose another port; use the URL shown in the terminal.
3. Open the app in Chrome through the shared Desktop. For recordings, maximize Chrome first:
   ```bash
   sudo apt-get install -y wmctrl 2>/dev/null; wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz
   ```
4. Start recordings only after the app is loaded and setup data is ready.

## Progress State Control

Learner progress is stored under:

```js
localStorage.getItem("arabic-amar:progress:v1")
```

For fresh-learner tests, clear progress and reload:

```js
localStorage.removeItem("arabic-amar:progress:v1");
location.href = "/";
```

For practice/daily-path tests, seed progress with realistic word IDs from `content/content.json` or the relevant source fixture. Keep seeds small and deterministic so counts are easy to verify visually.

Example shape:

```js
const now = new Date().toISOString();
const today = now.slice(0, 10);
localStorage.setItem("arabic-amar:progress:v1", JSON.stringify({
  version: 1,
  startedAt: now,
  streak: { count: 0, lastDay: "", freezesAvailable: 2, lastFreezeRegenAt: today },
  daily: { goalCards: 20, today: { date: today, cardsSeen: 0, correct: 0 } },
  words: {
    "lesson-body-parts__head": {
      attempts: 1,
      correct: 0,
      streak: 0,
      mastery: 0,
      lastSeen: now,
      nextDue: "2000-01-01T00:00:00.000Z"
    }
  },
  topics: {}
}));
location.href = "/";
```

## Practice Flow Testing Tips

- Verify exact card headers such as `Card 1 of 10`; this catches decks shrinking or rebuilding mid-session.
- When testing URL-driven decks, reload the exact URL (`/practice?deck=due`, `/practice?deck=weak`, `/practice?deck=new`) to catch hydration or localStorage timing bugs.
- After answering a card, click the visible `Next →` button by coordinate if DOM-id clicking appears not to advance during computer-use testing.
- If answering a weak/due card changes its progress state, reseed localStorage before rerunning count-sensitive assertions.

## Console Checks

Dev mode can contain stale Next.js HMR/Fast Refresh messages. For meaningful console validation:

1. Clear the console immediately before the route/action being tested.
2. Reload or navigate through the exact tested flow.
3. Inspect fresh logs only.
4. Treat React DevTools and `[HMR] connected` as normal dev-server info, but document any uncaught exceptions, hydration errors, or repeated warnings tied to the feature.

## Evidence Expectations

- Use one focused annotated recording for GUI flows.
- Capture screenshots for every exact visual assertion: counts, labels, card headers, completion states, and console error states when applicable.
- Post one consolidated PR comment with results, recording, screenshots, and Devin session link.
