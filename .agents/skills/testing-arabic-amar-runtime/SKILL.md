---
name: testing-arabic-amar-runtime
description: Test Arabic AMAR UI features end-to-end with local dev, browser recording, progress reset, and PR evidence. Use when verifying learner-facing pages, practice decks, progress tracking, or vocabulary/grammar feature changes.
---

# Arabic AMAR Runtime Testing

Use this skill when testing Arabic AMAR learner-facing features such as dashboard cards, vocabulary collections, practice decks, progress tracking, grammar tables, and topic pages.

## Devin Secrets Needed

- None for local runtime testing.
- Vercel preview URLs might return `401 Unauthorized` from Devin's VM. If that happens and no Vercel credentials are available, test the PR branch locally with `npm run dev` and clearly note the caveat in the test report/PR comment.

## Setup

1. Confirm the branch under test is checked out and clean enough for runtime testing:
   ```bash
   git status --short --branch
   ```
2. Start the local dev server:
   ```bash
   npm run dev
   ```
3. Verify the target route returns HTTP 200 before browser testing:
   ```bash
   curl -I --max-time 20 http://localhost:3000/<route>
   ```
4. Maximize Chrome before recording:
   ```bash
   sudo apt-get install -y wmctrl 2>/dev/null; wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz
   ```

## Progress and State Reset

Arabic AMAR stores learner progress in local storage. For a clean first-run test, clear:

```js
localStorage.removeItem('arabic-amar:progress:v1')
```

Run that from the browser context before recording when the test requires fresh progress counts. Do not clear state mid-test unless the plan explicitly calls for a fresh-start scenario.

## Recommended Test Shape

Keep the test plan small and adversarial. For progress/practice features, verify:

1. Discovery/navigation entry point loads the feature.
2. Initial progress counts have exact expected values.
3. The page shows the exact learner-facing content that changed.
4. Practice decks opened from URL params do not fall back to the generic Practice picker.
5. Answering cards advances the deck by exact card numbers.
6. Returning to the source page reflects persisted progress.
7. Browser console has no uncaught errors or hydration failures. Ignore normal local dev/HMR logs.

## Recording and Evidence

- Start recording only after setup/localStorage reset is done.
- Add annotations for each major assertion.
- Capture full-screen screenshots for:
  - initial state,
  - reveal/interaction state,
  - final persisted progress state,
  - any failure or blocked state.
- Post one consolidated PR comment with bullet results, caveats first, and a Devin session link.
- Write and attach a separate `test-report.md` with inline screenshot evidence.
