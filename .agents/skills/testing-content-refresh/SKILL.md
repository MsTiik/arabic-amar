---
name: testing-content-refresh
description: Test Arabic AMAR Google Doc content refresh PRs end-to-end. Use when parser/content changes add or update lessons, vocabulary sections, grammar tables, or practice decks.
---

# Arabic AMAR Content Refresh Testing

## Devin Secrets Needed

- None for public lesson/topic/practice page testing.
- If a future content import requires private Google access, request the relevant Google credential through Devin Secrets before testing. Do not paste credentials into the repo.

## Setup

1. Check the PR diff to identify the affected topic slug(s), sample entries, expected vocabulary/rule counts, and any parser/table-shape changes.
2. Run validation commands from the repo root:
   - `npm run content:build`
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
3. Prefer Vercel preview for runtime testing when accessible. If Vercel returns auth/SSO `401` from the session, test the PR branch with a local production build instead:
   - `npm run start`
   - open `http://localhost:3000`
4. Before recording, maximize Chrome with `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz` if needed.

## Runtime Test Flow

1. Open the affected topic page directly, for example `/topics/<topic-slug>`.
2. Verify the page title, Arabic title, vocabulary count, and rules count match the generated content.
3. Use category jump navigation to inspect every newly added/changed section and verify exact section counts.
4. Spot-check representative entries that prove each new parser shape is rendered correctly:
   - singular/plural pairs should appear as separate cards with correct English glosses;
   - masculine/feminine pairs should show the expected gender labels;
   - entries without pronunciation should render without blank pronunciation text.
5. Open the topic Practice tab and launch flashcards.
   - Flashcards should include all topic vocab entries with English glosses.
6. Open typed transliteration practice for the same topic.
   - Typed transliteration should include only entries that have pronunciation, so the card count may be lower than the topic vocabulary count.

## Evidence to Capture

- One focused screen recording with annotations for:
  - topic/header count;
  - new section/category coverage;
  - no-pronunciation handling, if relevant;
  - gender labels, if relevant;
  - flashcard deck count;
  - typed transliteration filtered count.
- Screenshots for the test report showing the same key assertions.
- A single PR comment with concise pass/fail bullets, screenshot table, recording link, and Devin session link.

## Notes

- Do not claim the Vercel preview was tested if a local production build was used due to preview auth. State the fallback clearly.
- If the expected typed-transliteration count is unclear, derive it from generated content by counting topic entries with non-empty `pronunciation` before writing the plan.
- Parser warnings from `npm run content:build` are high-signal for content refresh PRs; include any non-zero parser warnings as an escalation in the test report.
