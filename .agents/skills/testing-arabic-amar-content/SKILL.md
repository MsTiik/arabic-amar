---
name: testing-arabic-amar-content
description: Test Arabic AMAR generated lesson content, topic pages, paired vocabulary cards, and practice decks end-to-end.
---

# Arabic AMAR Content Testing

Use this when verifying Google Doc content refreshes, parser changes, topic splits, generated vocabulary counts, or flashcard deck behavior.

## Devin Secrets Needed

- None for public topic pages, generated content checks, or practice decks.
- Vercel preview access may require the user's Vercel login in some sessions. If the preview redirects to Vercel login, test the same checked-out PR branch locally with a production build instead of blocking on credentials.

## Setup

1. Confirm dependencies are installed:
   ```bash
   npm install
   ```
2. For content/parser PRs, confirm generated content is current:
   ```bash
   npm run content:build
   ```
3. Run validation before runtime testing:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```
4. Start local production server:
   ```bash
   npm start
   ```
   The app should be available at `http://localhost:3000`.

## Route Patterns

- Topic page: `/topics/<topic-slug>`
- Topic flashcards: `/practice?topic=<topic-slug>&kind=flashcard`
- Topic multiple choice: `/practice?topic=<topic-slug>&kind=mc`
- Topic typed transliteration: `/practice?topic=<topic-slug>&kind=fill`

## What to Verify

For generated content changes:

1. Open the changed topic page and verify the title, word count, rule count, and vocabulary tab count.
2. Verify the generated category jump list and section headings/counts match the expected content.
3. For paired vocabulary tables, verify each pair is one visible card with slash-separated Arabic forms and combined English, not duplicate singular/plural or masculine/feminine cards.
4. Open flashcards for the topic and verify the deck count matches the reduced generated vocabulary count.
5. On a flashcard with pronunciation:
   - Click `Show pronunciation` and verify the card remains on the Arabic side.
   - Click/tap the card surface and verify it flips to the English side.
   - Confirm the back still shows the same pronunciation for the paired card.

## Evidence Expectations

- Record one focused UI walkthrough when testing via browser.
- Annotate the recording at topic count checks, paired-card checks, deck count checks, and flashcard interaction checks.
- Capture screenshots for the topic count/sample card and flashcard deck count/sample card.
- If Vercel preview requires login, explicitly report that limitation and state that local production was tested from the checked-out PR branch.

## Notes

- Use clipboard-based navigation if Chrome's address bar input behaves unexpectedly: copy the URL into the clipboard, then use Ctrl+L, Ctrl+V, Enter.
- The old merged Lesson 11 route may intentionally 404 after a split; test the new topic slugs instead of relying on old URLs.
