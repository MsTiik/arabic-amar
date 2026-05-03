# Arabic AMAR

A gamified Quranic-Arabic study site, built around the AMAR Arabic Programme curriculum. Vocabulary, grammar references, foundations of recitation, a word-by-word surah reader, and a daily practice deck — all running entirely in the browser, no account needed.

Live: https://arabic-amar.vercel.app

## What's in it

- **Lessons** (`/topics`) — per-topic vocabulary, grammar rules, and a focused practice deck for each topic in the curriculum (Body Parts, Numbers, Time, Days, Months, Entities, Getting to know each other, …).
- **Vocabulary bank** (`/vocabulary`) — the full curriculum vocab grouped by topic, plus a collapsible **Top Qur'ānic words** deck (≈125 lemmas covering ~50 % of Qur'ān tokens).
- **Grammar** (`/grammar`) — pronoun, conjugation, plural, and demonstrative reference pages with collapsible worked examples.
- **Foundations** (`/read`) — reading-the-Qur'ān reference: alphabet, connecting letters, harakāt, madd, sun/moon letters, makhārij, and tajweed basics.
- **Surah reader** (`/read/surahs`) — Al-Fātiḥah + the last 10 short surahs of Juzʾ ʿAmma, with tap-to-reveal word popups (Arabic, transliteration, English gloss, root, POS, base form, Qur'ān-wide frequency, ★ Top-125 badge), per-ayah translit toggle, and Mishary Rashid Alafasy recitation.
- **Practice** (`/practice`) — flashcards, multiple-choice, ordering, match-pairs, "which letter?", connecting-letters drill, and fill-the-blank cloze. Mistakes feed a separate review deck.
- **Daily streak + freezes** — single-day-miss "get out of jail free" budget (max 2, refills 1 every 7 active days). Class-based **dark mode** toggle with `prefers-color-scheme` fallback.

All progress is persisted in `localStorage` — no backend, no login.

## Tech stack

- **Next.js 16** (App Router) on **React 19**, **TypeScript**
- **Tailwind CSS 4** with custom OKLCH design tokens; class-based dark variant
- **Vitest** for unit tests
- **mammoth** + **node-html-parser** for ingesting the curriculum from a `.docx` source
- **tsx** for build-time content scripts
- **Vercel** for hosting and PR previews

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The dev server hot-reloads. The `prebuild` step regenerates `content/content.json` and `content/audio-manifest.json`, so a fresh `npm run dev` after pulling new source content will pick up the latest.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build (runs `prebuild` first) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest run |
| `npm run content:build` | Rebuild `content/content.json` from the curriculum `.docx` |
| `npm run audio:build` | Rebuild `content/audio-manifest.json` (Lingua Libre / Wikimedia / Quran.com) |

## Content pipeline

The curriculum is authored in a single Google Doc and exported as `.docx`. `scripts/build-content.ts` parses that document with `mammoth`, normalises diacritics, deduplicates vocab, and emits a typed JSON tree at `content/content.json` that the app imports at build time.

`scripts/build-audio-manifest.ts` resolves per-word pronunciations from Lingua Libre + Wikimedia Commons (CC-BY-SA), and per-ayah recitation from quran.com (Mishary Rashid Alafasy). The manifest is committed so the app has zero runtime audio-discovery cost.

`scripts/verify-quran.ts` cross-checks every word in the surah reader against the [Quranic Arabic Corpus](https://corpus.quran.com) (Dukes 2009, CC BY-SA 3.0) for roots/POS, and against quran.com's word-by-word API for English glosses, surfacing any divergences.

`/api/refresh` and `.github/workflows/refresh-content.yml` re-pull the source doc on demand and on a daily cron.

## Repository layout

```
src/
  app/                Next.js routes (App Router)
  components/         React components
  data/surahs/        Hand-authored word-by-word surah data
  lib/                Shared logic (theme, progress, streaks, audio, …)
content/
  content.json        Curriculum, generated from the source .docx
  audio-manifest.json Pronunciation + recitation map, generated
scripts/              Build-time content + verification scripts
tests/                Vitest specs (lib + data)
```

## Credits

- Curriculum: AMAR Arabic Programme study notes.
- Pronunciations: [Lingua Libre](https://lingualibre.org/) and [Wikimedia Commons](https://commons.wikimedia.org/) (CC-BY-SA).
- Qur'ān recitation: Mishary Rashid Alafasy via [Quran.com](https://quran.com/).
- Word-by-word morphology: [Quranic Arabic Corpus](https://corpus.quran.com/) (CC BY-SA 3.0, Dukes 2009).
- Arabic text: [Tanzil](https://tanzil.net/) simple-clean text.
