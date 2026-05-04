---
name: testing-arabic-amar
description: Test Arabic AMAR content-health and vocabulary search flows end-to-end. Use when validating parser/content QA, generated vocabulary, or Arabic search behavior.
---

# Arabic AMAR Runtime Testing

## Devin Secrets Needed

None for local runtime testing of public routes. The content-health page at `/admin/content-health`, About page, and Vocabulary page are public local Next.js routes.

## Local setup

1. From the repo root, install dependencies if needed:
   ```bash
   npm install
   ```
2. Regenerate content when validating parser/content changes:
   ```bash
   npm run content:build
   ```
3. Run validation checks before browser testing:
   ```bash
   npm run lint
   npm run typecheck
   npm test -- --run
   npm run build
   ```
4. Start the app locally:
   ```bash
   npm run dev
   ```
   The app is normally reachable at `http://localhost:3000`. If port 3000 is already in use, Next may choose another port; verify the actual printed URL.

## Content-health UI flow

Use this when validating parser cleanup or generated content QA changes.

1. Open `http://localhost:3000/about`.
2. Verify the page heading is `About this site`.
3. Click the `latest build report` link next to `Content QA:`.
4. Verify `/admin/content-health` shows heading `Content health`.
5. Check exact metric values from `content/content-qa.json` rather than hard-coding stale expectations. For PR #25-era content these were:
   - `Lessons 8`
   - `Topics 8`
   - `Words 348`
   - `Rules 15`
   - `Parser warnings 0`
   - `QA issues 2`
6. Check issue panel headers and counts. For PR #25-era content these were:
   - `warning · empty-vocab-english` count `12`
   - `info · missing-audio` count `103`

## Vocabulary search UI flow

Use this when validating Arabic search, parser-extracted classroom terms, or demonstratives.

1. Open `http://localhost:3000/vocabulary`.
2. Verify heading `Vocabulary bank` and the initial count equals the total generated vocabulary count.
3. Test exact Arabic queries that distinguish broken behavior from working behavior:
   - `حجرة` should return both the room card and study-room card.
   - `حجرة الدراسة` should return only the study-room card.
   - `حجرة / حجر` should return only the room card and proves pasted paired forms work.
   - `هذ` should return `هَذَا`, `هَذِهِ`, and `هَذَانِ`, proving partial Arabic typing works.
   - `هذا` should return only `هَذَا` and must not show `هَذَانِ`, proving complete Arabic terms are exact.

## Reliable Arabic input during browser testing

The VM/browser input method might drop Arabic letters, especially for multi-word strings. If manual typing is unreliable, keep the live browser UI visible and set the actual React input value from the same page context, then visually verify the rendered UI.

Run this in the browser page context with the desired query:

```js
(() => {
  const input = document.querySelector('input[aria-label="Search vocabulary"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'حجرة الدراسة');
  input.dispatchEvent(new Event('input', { bubbles: true }));
})();
```

This should only be used to overcome test-environment input issues; the assertion still comes from the visible UI count/cards.

## Recording guidance

When testing UI flows, maximize the browser and make one focused recording. Add annotations for:

- setup/navigation
- content-health metric assertion
- content-health issue-count assertion
- vocabulary initial-count assertion
- key search assertions, especially prefix `هذ` and exact `هذا`

Attach the recording and a markdown report with inline screenshots to the final test result.
