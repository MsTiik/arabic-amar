---
name: testing-content
description: Test Arabic AMAR content refreshes, vocabulary search, topic pages, and content-health QA end-to-end. Use when verifying parser/content pipeline, generated vocabulary, or lesson page changes.
---

# Testing content & vocabulary (Arabic AMAR)

Use when a PR touches `scripts/build-content.ts`, `content/content.json`, topic/lesson pages, vocabulary search, or `/admin/content-health`.

## Setup
- `npm run content:build` regenerates content from the public Google Doc; `npm run build` runs it via `prebuild` (also regenerates the audio manifest). **Do not commit timestamp-only generated changes** — restore with `git checkout -- content/content.json content/content-qa.json` if the PR is unrelated.
- Standard checks: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.
- Parser warnings from `content:build` are high-signal for content PRs; report any non-zero count. Check current baseline on `main` before attributing warnings to a PR.

## Useful routes
- Topic page: `/topics/<topic-slug>`; practice decks: `/practice?topic=<slug>&kind=flashcard|mc|fill|gender|ordering`
- Vocabulary bank: `/vocabulary`; content health: `/admin/content-health` (public route, linked from `/about` → "latest build report")

## Content-refresh assertions
- Verify topic title, Arabic title, vocab count, and rules count against the generated JSON — don't hard-code stale expectations; read `content/content-qa.json` for current metrics (`Words`, `Parser warnings`, `QA issues`, issue codes like `missing-audio`, `empty-vocab-english`).
- Paired vocabulary (singular/plural, masc/fem) should render as ONE card with slash-separated Arabic and combined English, not duplicate cards.
- Flashcard deck count should match the topic's generated vocab count; typed-transliteration decks include only entries with non-empty `pronunciation`, so their count may be lower.

## Vocabulary search assertions
- Search supports Arabic, transliteration, English, and folded Arabic. Good adversarial queries: partial `هذ` returns هَذَا/هَذِهِ/هَذَانِ; exact `هذا` returns only هَذَا; paired form `حجرة / حجر` matches the paired card; `rasun` → رَأْسٌ.
- Verify the exact count text (e.g. `1 / 323 words`) plus card contents (Arabic + translit + gloss together).

## Arabic input workaround
The VM input method may drop Arabic characters when typing. If manual typing is unreliable, set the React input value from the page context, then assert on the visible UI:
```js
const input = document.querySelector('input[aria-label="Search vocabulary"]');
Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, 'حجرة الدراسة');
input.dispatchEvent(new Event('input', { bubbles: true }));
```

## Vercel previews
PR preview URLs (`https://arabic-amar-git-<branch>-rene-pupalas-projects.vercel.app`) may be protected and return 401 from the VM. Test the PR branch locally instead and state that caveat. Production `https://arabic-amar.vercel.app/` is public for smoke checks.

## Devin Secrets Needed
None — content is generated from a public Google Doc; all routes are public.
