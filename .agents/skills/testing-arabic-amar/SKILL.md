---
name: testing-arabic-amar
description: Test Arabic AMAR UI changes end-to-end. Use when validating vocabulary, practice, lesson, grammar, or Qur'an reader flows.
---

# Testing Arabic AMAR

## Devin Secrets Needed

- None for local public UI testing.
- If a Vercel preview is protected, request the appropriate Vercel preview access from the user rather than assuming the preview is public.

## Local setup

1. Install dependencies if needed:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open the relevant local route in Chrome, usually `http://localhost:3000/<route>`.

## Standard verification commands

Run these before creating or finalizing a PR that changes code:

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

`npm run build` regenerates `content/content.json` from the public Google Doc and may update only `fetchedAt`; do not commit timestamp-only generated changes unless they are part of the task.

## Browser testing guidance

- Prefer local testing if the Vercel preview returns HTTP 401 from the VM.
- For vocabulary-search changes, test via `/vocabulary` using the visible search input labeled `Search vocabulary`.
- Record one focused browser flow when validating UI behavior, and annotate exact assertions such as visible count text and card contents.
- Capture full screenshots of pass/fail states; do not rely only on console output.

## Useful assertions for vocabulary flows

- The count near filters should show exact values such as `1 / 323 words` or `323 / 323 words`.
- Search results should verify Arabic text, transliteration, and English gloss together.
- Include one regression query such as `rasun` → `رَأْسٌ` / `raʾsun` when changing folded search behavior.
