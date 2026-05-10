# Arabic AMAR

Arabic AMAR is a gamified Qur'anic-Arabic study site built around the AMAR Arabic Programme curriculum. It combines lesson vocabulary, grammar references, reading foundations, a word-by-word short-surah reader, pronunciation audio, daily goals, and browser-local practice progress.

Live site: https://arabic-amar.vercel.app

## Product overview

| Area | Route | Purpose |
| --- | --- | --- |
| Home | `/` | Daily practice dashboard, streak/progress summary, lessons, and hidden admin refresh controls. |
| Progress sync | `/sync` | Optional Supabase sign-in for syncing browser progress across devices. Guest mode still works without it. |
| Lessons | `/topics` and `/topics/[slug]` | Topic-by-topic curriculum vocabulary, grammar rules, and practice entry points. |
| Vocabulary bank | `/vocabulary` | Searchable curriculum vocabulary plus built-in Top Qur'ānic words. Arabic search is diacritic-insensitive. |
| Grammar | `/grammar` | Pronouns, conjugations, plurals, demonstratives, and lesson-linked grammar tables. |
| Practice | `/practice` | Flashcards, multiple choice, ordering, matching, letter, connecting-letter, and cloze drills. |
| Foundations | `/read` | Alphabet, harakāt, madd, sun/moon letters, makhārij, tajweed, and surah reading routes. |
| Content health | `/admin/content-health` | Build-generated parser, QA, and audio coverage report for maintainers. |

Learner progress is stored in `localStorage` by default. Optional Supabase sync can copy that progress between devices when deployment environment variables are configured.

## Tech stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4 with custom OKLCH design tokens
- Vitest for unit tests
- Mammoth + node-html-parser for `.docx` curriculum ingestion
- Wikimedia Commons / Lingua Libre / Quran.com audio discovery at build time
- Vercel hosting and preview deployments

Next.js 16 has breaking changes. Before changing framework-specific code, read the relevant guide in `node_modules/next/dist/docs/`.

## Local development

Prerequisites:

- Node 20+
- npm

Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Optional cloud sync environment:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

Without these values, `/sync` explains that sync is disabled and the app remains fully usable in guest/local-progress mode.

Useful clean-browser-state reset for progress/admin UI testing:

```js
localStorage.removeItem("arabic-amar:progress:v1");
localStorage.removeItem("arabic-amar:admin-refresh-token");
location.href = "http://localhost:3000/";
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Next.js dev server. |
| `npm run build` | Runs `prebuild`, then creates the production Next.js build. |
| `npm run start` | Serves the production build. |
| `npm run lint` | Runs ESLint. |
| `npm run typecheck` | Runs `tsc --noEmit`. |
| `npm test` | Runs Vitest once. |
| `npm run content:build` | Rebuilds `content/content.json` and `content/content-qa.json`. |
| `npm run audio:build` | Rebuilds `content/audio-manifest.json`. |
| `npm run prebuild` | Runs content build, then audio manifest build. This runs automatically before `npm run build`. |

Recommended pre-PR validation:

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

`npm run build` can emit a workspace-root warning when multiple lockfiles exist above the repo checkout. The warning is environmental; the build is still valid if it exits successfully.

## Optional Supabase progress sync

The sync feature is intentionally optional: no environment variables means no sign-in UI in the main dashboard/topbar, and all progress remains local.

Create this table in Supabase:

```sql
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "Users can read their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

Recommended Supabase Auth settings:

- Enable Email OTP / magic-link sign-in.
- Add the production URL and preview URL patterns to the allowed redirect URLs.
- Use the public anon key only in `NEXT_PUBLIC_SUPABASE_ANON_KEY`; never commit service-role keys.

Sync behavior:

- Guest mode writes to `localStorage`.
- Signing in pulls the cloud copy, merges it with local progress, then saves the merged copy back to Supabase.
- Later practice updates save locally immediately, then sync to Supabase in the background.
- If two devices changed the same word, the record with the newest `lastSeen` wins; equal timestamps keep stronger mastery.

## Content pipeline

The curriculum source is a public Google Doc exported as `.docx`, then parsed into committed JSON.

Default source document:

```text
https://docs.google.com/document/d/1wqbU7rsLUm0wqCjQPS2PbtCTThZOxnE2CnClxa8DETc/edit
```

Generated files:

| File | Generated by | Purpose |
| --- | --- | --- |
| `content/content.json` | `npm run content:build` | Lessons, topics, vocabulary, rules, and source metadata consumed by the app. |
| `content/content-qa.json` | `npm run content:build` | Parser warnings, QA issues, and audio coverage metrics rendered at `/admin/content-health`. |
| `content/audio-manifest.json` | `npm run audio:build` | Pronunciation and Qur'ān recitation URLs used by speaker buttons and the surah reader. |

### Rebuilding from the live Google Doc

```bash
npm run content:build
```

The parser uses `GOOGLE_DOC_ID` when set; otherwise it uses the default AMAR source document.

```bash
GOOGLE_DOC_ID="..." npm run content:build
```

The Google Doc must be public or shared as "Anyone with the link", because the parser uses the public `.docx` export endpoint and no Google API credentials.

### Rebuilding from a local `.docx`

Use this for parser development or offline fixture testing:

```bash
LOCAL_DOCX_PATH=tests/fixtures/sample.docx npm run content:build
```

### Content QA report

After every content build, inspect:

```text
/admin/content-health
```

The report is intentionally maintainer-facing. It catches silent source-data regressions such as parser warnings, duplicate/collapsed rows, empty English glosses, missing audio coverage, and topic-level coverage gaps.

## Audio pipeline

`npm run audio:build` reads `content/content.json`, extracts Arabic forms, and resolves public audio URLs.

Sources:

- Lingua Libre / Wikimedia Commons for word pronunciations
- Quran.com audio for Mishary Rashid Alafasy ayah recitations

The manifest is committed so production does not perform audio discovery at runtime. Missing vocabulary audio is also surfaced in `content/content-qa.json` and rendered as unavailable audio state in the learner UI.

## Admin refresh

The homepage includes a hidden admin panel that appears when the URL hash is `#admin` or an admin token is already stored in the browser:

```text
https://arabic-amar.vercel.app/#admin
```

Clicking the refresh button calls:

```text
POST /api/refresh
```

Required server-side environment variables:

| Variable | Required where | Purpose |
| --- | --- | --- |
| `ADMIN_REFRESH_TOKEN` | Vercel server/runtime env | Shared secret checked against the `x-admin-token` request header. |
| `VERCEL_DEPLOY_HOOK_URL` | Vercel server/runtime env | Vercel deploy hook URL that triggers a rebuild. Keep server-side only. |
| `GOOGLE_DOC_ID` | Build env, optional | Overrides the default public AMAR Google Doc ID during content builds. |

The admin token entered in the UI is stored only in that browser's `localStorage` under `arabic-amar:admin-refresh-token`.

## Deployment notes

Vercel should run:

```bash
npm run build
```

That automatically executes:

```bash
tsx scripts/build-content.ts && tsx scripts/build-audio-manifest.ts
```

So each deploy refreshes the generated content from the current source document and audio manifest logic.

For on-demand refreshes, configure a Vercel deploy hook and set `VERCEL_DEPLOY_HOOK_URL` plus `ADMIN_REFRESH_TOKEN`.

## Testing guidance

Use command-line checks for code/content changes:

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

Use browser testing for learner/admin UI flows. High-value smoke checks:

- `/` shows the daily dashboard and lesson cards.
- `/vocabulary` can search Arabic without diacritics, e.g. `هذا`.
- `/admin/content-health` shows expected content totals, QA issues, and audio coverage.
- `/#admin` opens the token-entry dialog without requiring a real token unless testing the refresh API itself.

## Repository layout

```text
content/
  audio-manifest.json       Generated audio lookup map.
  content.json              Generated curriculum data.
  content-qa.json           Generated content health report.
scripts/
  build-audio-manifest.ts   Audio discovery/build script.
  build-content.ts          Google Doc/local docx parser entrypoint.
  build-quran-extras.ts     Qur'ān support-data helper.
  verify-quran.ts           Qur'ān word-by-word verification helper.
src/
  app/                      Next.js routes and route handlers.
  components/               Reusable UI components.
  data/                     Hand-authored foundations and surah data.
  lib/                      Parser, content access, progress, audio, and utilities.
tests/
  lib/                      Vitest coverage for parser/content/audio/exercise logic.
```

## Credits

- Curriculum: AMAR Arabic Programme study notes.
- Pronunciations: [Lingua Libre](https://lingualibre.org/) and [Wikimedia Commons](https://commons.wikimedia.org/) (CC-BY-SA).
- Qur'ān recitation: Mishary Rashid Alafasy via [Quran.com](https://quran.com/).
- Word-by-word morphology: [Quranic Arabic Corpus](https://corpus.quran.com/) (CC BY-SA 3.0, Dukes 2009).
- Arabic text: [Tanzil](https://tanzil.net/) simple-clean text.
