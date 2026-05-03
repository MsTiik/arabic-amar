# Testing the Practice Page

This skill covers end-to-end testing of `/practice` exercises (flashcards, multiple choice, gender quiz, fill-blank, ordering) including any feature that adds UI to Arabic prompts/options.

## Where to test

- **Local dev** (recommended, fastest): `npm run dev` → http://localhost:3000. Use this for any session-bound testing.
- **Vercel preview**: each PR gets `https://arabic-amar-git-<branch>-rene-pupalas-projects.vercel.app`. The preview is gated by Vercel **deployment protection** and returns HTTP 401 to outside requests. Don't try to test against it from a curl/headless tool unless deployment protection is disabled. The production `https://arabic-amar.vercel.app/` is public and can be smoke-tested for routes that return HTTP 200.

## URL grammar

All practice URLs are query-string driven by `src/components/practice-client.tsx`:

- Per-topic deck: `/practice?topic=<slug>&kind=<kind>`
- `<kind>`: `flashcard` | `mc` | `fill` | `gender` | `ordering`
- Useful slugs: `body-parts`, `numbers`, `days-of-the-week`, `islamic-and-gregorian-months`, `entities`, `family`, `colours`, `countries`, etc. — full list comes from the docx parser in `scripts/build-content.ts`; check `content/content.json` if unsure.
- The Mixed-MC and per-topic MC decks both use direction `ar-to-en` (Arabic prompt → English options). The `en-to-ar` and `translit-to-ar` directions are exported by `makeMultipleChoiceDeck` but currently have no UI entry point.

## Adversarial assertions for translit-reveal-style features

When reviewing any change that touches `TranslitReveal` (`src/components/translit-reveal.tsx`) or its callers, the four correctness invariants Devin Review has historically flagged:

1. **Hidden by default**: assert no italic translit appears in DOM before any click. A broken impl shows it always.
2. **`stopPropagation()`**: clicking the reveal on an MC option must NOT select that option (no green/red state, no `Next →`). Clicking on an ordering row must NOT swallow the up/down arrows.
3. **`aria-label` is dynamic**: the button's `aria-label` must flip between e.g. `Show pronunciation` ↔ `Hide pronunciation`. Hardcoding `Hide pronunciation` is wrong when the hidden label is overridden (e.g. `Show meaning` for translit-to-ar prompts). Verify by reading the DOM, not just the screenshot.
4. **`lang` prop sentinel**: passing `lang={undefined}` is swallowed by JS default parameters. The component uses `lang === "" ? undefined : (lang ?? "ar-Latn")` so callers pass `lang=""` to suppress the `lang` attribute entirely (used for English meaning hints). Don't "simplify" this back to a normal default.

## Test recipe

1. Start `npm run dev` and open the URL pattern above. Confirm SSR by checking the page returns HTML on first paint.
2. Use the computer tool: click the reveal toggle, then read the returned DOM HTML. The DOM dump is the source of truth for `aria-label`, `lang`, and presence of the translit string. Screenshots alone are insufficient for these assertions.
3. After every state change, click again to verify the toggle round-trips. A toggle that hides on second click but doesn't update its own `aria-label` is still broken.
4. For ordering decks, always test the up/down arrows after a reveal — that's the most common source of click-bubbling bugs.

## Recording

The recording slows around `annotate_recording` events. For each test case use:

- `setup` to mark navigation
- `test_start` to name the case (Jest-style "It should ...")
- one `assertion` per state-change group (precondition / reveal / hide / regression)

Four annotations per case is plenty.

## Reporting

- Single PR comment with collapsible `<details>` evidence block.
- 3-column tables work well for before/revealed/regression evidence.
- Always link the recording — pass-only screenshots aren't enough for the user to trust click semantics.

## Devin Secrets Needed

None. The app is a public Next.js site with no auth, no DB, no API keys. Vocab content is bundled into `content/content.json` at build time.
