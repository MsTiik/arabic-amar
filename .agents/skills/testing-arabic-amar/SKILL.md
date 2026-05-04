---
name: testing-arabic-amar
description: Test Arabic AMAR UI/content changes end-to-end. Use when verifying lesson pages, vocabulary cards/search, practice decks, or content-health output.
---

# Arabic AMAR Runtime Testing

## Devin Secrets Needed

- None for local runtime testing of public app routes.
- No Vercel/GitHub/browser login is normally required to verify local lesson, vocabulary, practice, or content-health flows.

## Local Setup

1. Confirm dependencies are installed with `npm install` if `node_modules` is missing.
2. Start the dev server from the repo root:
   ```bash
   npm run dev
   ```
   If running from outside the repo, use:
   ```bash
   npm --prefix /home/ubuntu/repos/arabic-amar run dev
   ```
3. Open `http://localhost:3000` in Chrome. Use the GUI for navigation when recording.

## Useful Verification Routes

- Lesson/topic page: `http://localhost:3000/topics/<topic-slug>`
- Vocabulary bank: `http://localhost:3000/vocabulary`
- Practice deck by topic/kind: `http://localhost:3000/practice?topic=<topic-slug>&kind=<kind>`
- Content health report: `http://localhost:3000/admin/content-health`
- About page link to content QA: `http://localhost:3000/about` → `latest build report`

For the months lesson specifically:
- Topic route: `/topics/islamic-and-gregorian-months`
- Ordering deck route: `/practice?topic=islamic-and-gregorian-months&kind=ordering`

## Content QA Checks

Content QA is generated into `content/content-qa.json` and rendered at `/admin/content-health`. When testing content-pipeline changes, verify both the JSON expectations and the rendered UI. Useful metrics include:
- `Words`
- `Parser warnings`
- `QA issues`
- issue codes such as `missing-audio` and `empty-vocab-english`

## Browser Recording Guidance

- Maximize Chrome before recording:
  ```bash
  sudo apt-get install -y wmctrl 2>/dev/null; wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz
  ```
- Record only browser-visible interactions and annotate each major assertion.
- For Arabic text entry, the VM input method may drop characters during manual typing. Prefer clicking/navigating normally, and if exact Arabic input is required, validate the live UI state carefully and document any workaround in the test report.

## Commands Commonly Used Before Runtime Testing

```bash
npm run content:build
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

## Notes

- `npm run build` runs `prebuild`, which regenerates content and audio manifests.
- The Content health page is an admin-style public route in local/dev testing; it does not require auth.
- When testing ordering decks, open the actual deck route and inspect the rendered prompt/options. The presence of an Ordering card alone does not prove the deck is built from corrected ordering metadata.
