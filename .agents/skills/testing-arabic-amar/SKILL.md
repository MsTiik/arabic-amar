---
name: testing-arabic-amar
description: Test Arabic AMAR learner and maintainer flows end-to-end. Use when verifying dashboard, practice, vocabulary, content-health, or progress/localStorage changes.
---

# Testing Arabic AMAR

## Devin Secrets Needed

- None for normal learner flows; progress is stored in browser `localStorage`.
- `ADMIN_REFRESH_TOKEN` only if testing the admin content refresh flow.

## Local setup and validation

1. Work from the repo root, usually `/home/ubuntu/repos/arabic-amar`.
2. Install dependencies with `npm install` if needed.
3. Run the standard checks before runtime testing when code changed:
   - `npm run lint`
   - `npm run typecheck`
   - `npm test -- --run`
   - `npm run build`
4. Start the app locally with `npm run dev`. Prefer port `3000` for browser tests when available.
5. If Vercel previews require auth or return 401, test the PR branch locally and optionally expose the local port with Devin preview.

## Browser testing expectations

- Use Chrome on the shared desktop for UI flows.
- Maximize the browser before recording: `sudo apt-get install -y wmctrl 2>/dev/null; wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`.
- Use screen recording for browser tests and annotate setup, test starts, and assertions.
- Collect screenshots for each key pass/fail state and include them inline in the test report.
- Prefer native UI clicks/navigation for user-facing behavior. Use the browser console only for setup tasks like seeding `localStorage` or inspecting logs.

## Progress/localStorage testing

Arabic AMAR progress is stored under:

```js
"arabic-amar:progress:v1"
```

To test fresh-learner behavior, clear progress and reload:

```js
localStorage.removeItem("arabic-amar:progress:v1");
location.href = "/";
```

To test due/weak guided-path states, seed a versioned progress object with attempted low-mastery words and past `nextDue` dates. Body Parts seed IDs that have been useful for stable tests:

```js
(() => {
  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  localStorage.setItem("arabic-amar:progress:v1", JSON.stringify({
    version: 1,
    startedAt: now,
    streak: {
      count: 0,
      lastDay: "",
      freezesAvailable: 2,
      lastFreezeRegenAt: today
    },
    daily: {
      goalCards: 20,
      today: { date: today, cardsSeen: 0, correct: 0 }
    },
    words: {
      "lesson-body-parts__head": {
        attempts: 1,
        correct: 0,
        streak: 0,
        mastery: 0,
        lastSeen: "2000-01-01T00:00:00.000Z",
        nextDue: "2000-01-01T00:00:00.000Z"
      },
      "lesson-body-parts__head-2": {
        attempts: 1,
        correct: 0,
        streak: 0,
        mastery: 0,
        lastSeen: "2000-01-01T00:00:00.000Z",
        nextDue: "2000-01-01T00:00:00.000Z"
      }
    },
    topics: {}
  }));
  location.href = "/";
})();
```

## Guided-path smoke checks

For a seeded two-word due/weak state, verify:

- Dashboard top shortcut shows `Fix weak words (2)`.
- Today’s Path helper text mentions due reviews, weak words, new vocabulary, and the next lesson.
- Today’s Path shows due `2`, weak `2`, new words reduced by the seeded words, and the next unfinished lesson.
- The weak shortcut opens `/practice?deck=weak` and shows `Fix weak words`, `Card 1 of 2`.
- The primary path CTA opens `/practice?deck=due` and shows `Review due cards`, `Card 1 of 2`.

For fresh learner guided-path testing, clear progress first and verify:

- Due and weak steps are complete/zero.
- New vocabulary is ready.
- Primary CTA opens `/practice?deck=new`.
- The new-word deck stays fixed during the session and does not shrink as answers update progress.

## Content and vocabulary flow tips

- Content Health lives under About and is useful for verifying parser/content/audio metrics.
- Vocabulary search supports Arabic, transliteration, English, and normalized Arabic forms. If the VM input method drops Arabic characters while typing, set the input value in the live page as a testing workaround, then visually verify the rendered UI.
- When testing unavailable audio, compare one missing-audio word with one known-audio word so the disabled and enabled states are both visible.
