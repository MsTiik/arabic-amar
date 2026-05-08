---
name: testing-arabic-amar
description: Test Arabic AMAR learner-facing flows end-to-end in the browser. Use when verifying dashboard, vocabulary, Names of Allah, practice decks, topic pages, or progress-tracking changes.
---

# Arabic AMAR Runtime Testing

## Devin Secrets Needed

- None for public learner flows, local development, vocabulary pages, topic pages, practice decks, or progress tracking.
- If an admin/content refresh flow is being tested, use a secret named `ADMIN_REFRESH_TOKEN` rather than typing or logging the token value.

## Local Setup

1. Start the app from the repo root:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000` in the existing Chrome browser.
3. For deterministic progress tests, clear browser storage before the run:
   - Browser console: `localStorage.clear(); sessionStorage.clear(); location.reload();`
   - Or use Playwright/CDP if available in the environment.
4. Maximize the browser before recording:
   ```bash
   wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz || true
   ```

## Recording Guidance

- Record browser UI tests and annotate major steps.
- Add annotations for setup, each core test, and each pass/fail assertion.
- Before checking console errors, ignore normal development-only React DevTools and HMR messages unless the test specifically concerns dev tooling.

## Core Smoke Checks

For most learner-facing PRs:

1. Confirm the target route loads without blank screens or auth prompts.
2. Verify the exact copy/counts affected by the PR.
3. Exercise the primary CTA and at least one return/navigation path.
4. Check progress persistence by leaving and returning to the relevant page when the PR changes progress behavior.
5. Inspect browser console for uncaught exceptions and hydration errors.
6. Capture screenshots for before/after or pass/fail states, then write a markdown test report with inline screenshots.

## Names of Allah Collection Checks

Use these when testing `/vocabulary/names-of-allah` or `/practice?deck=names-of-allah`:

1. Reset local progress so collection counts start predictably.
2. Open `/vocabulary/names-of-allah`.
3. Verify the collection count, known/learning/mastered/new counters, and source-note wording.
4. On a wide screen, verify the collection grid uses three columns if that layout is expected.
5. Click `Show pronunciation` on at least one collection card and verify the transliteration appears and can be hidden again.
6. Open `/practice?deck=names-of-allah`.
7. Verify the deck title, card count, Arabic front, and front-side pronunciation reveal.
8. Flip the first flashcard and verify meaning, explanation, transliteration, and source label.
9. Mark multiple cards right/wrong and return to the collection to verify progress counters update.

## Reporting

- Post one consolidated PR comment with bullets for each assertion.
- Include links or embedded screenshots for key evidence.
- Attach the full markdown report and annotated recording to the user-facing completion message.
