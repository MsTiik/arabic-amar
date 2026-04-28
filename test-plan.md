# Test Plan: PR #4 — Arabic font + 4-column vocab bank

## What changed
- Arabic font swapped from **Amiri** (calligraphic serif) to **Noto Sans Arabic** (clean sans-serif), to match the Google Doc which specifies "Arial".
- Vocab bank grid: was `xl:grid-cols-3`, now `lg:grid-cols-3 xl:grid-cols-4`.
- Source-of-truth for changes:
  - `src/app/layout.tsx` lines 1–18 (font import)
  - `src/app/globals.css` lines 29–37 (CSS var) + 103–120 (class)
  - `src/components/vocab-bank-client.tsx` lines 167, 179 (grid classes)

## Primary flow (one continuous recording)

### Step 1 — Vocab bank renders 4 columns at xl
1. Maximize browser window. Window is ≥1280px wide (xl breakpoint).
2. Navigate to `http://localhost:3000/vocabulary`.
3. Visually count the **first row of vocab cards** under the "Body Parts" header.
   - **PASS**: exactly **4** cards in the first row.
   - **FAIL**: 3 cards, 2 cards, or any other count.
4. Use devtools console (one-off, only because counting visually is brittle): run
   ```js
   const cards = document.querySelectorAll('.grid > article');
   const firstRowTop = cards[0].getBoundingClientRect().top;
   [...cards].filter(c => Math.abs(c.getBoundingClientRect().top - firstRowTop) < 5).length
   ```
   - **PASS**: returns **4**.
   - **FAIL**: returns 3 (regression to old layout) or any other number.

### Step 2 — Arabic uses Noto Sans Arabic, NOT Amiri
1. Still on `/vocabulary`. Right-click the Arabic word `رَأْسٌ` in the first card → Inspect.
2. In the Computed pane, read the `font-family` of the `<span class="font-arabic-display">` (or its container).
   - **PASS**: contains `Noto_Sans_Arabic` (next/font hashed prefix `__Noto_Sans_Arabic_...`) or literal `"Noto Sans Arabic"`.
   - **FAIL**: contains `Amiri` or `Amiri_Quran`.
3. Visually compare the Arabic glyph shape:
   - **PASS**: strokes are uniform-width sans (no calligraphic flourishes on tail of `س`, no contrast between thick/thin strokes).
   - **FAIL**: strokes show calligraphic contrast (Amiri's hallmark).

### Step 3 — Diacritics survive the font swap
1. Same page. Locate `رَأْسٌ` (Head).
2. Verify each diacritic is visible above/below its consonant:
   - **PASS**: fatha (◌َ) on ر, hamza-on-alef (أْ) with sukun, sukun (◌ْ) on س, dammatan (◌ٌ) on the final ـٌ. All four marks visible at full opacity.
   - **FAIL**: any mark missing, faded, replaced with a tofu box (□), or rendered as a separate glyph after the consonant.
3. Locate `هَٰذَا` (or `هذا` in search → opens the dagger-alif form `هَٰذَا`):
   - **PASS**: dagger alif (ٰ) clearly drawn above ذ.
   - **FAIL**: dagger alif missing or as tofu.

### Step 4 — Diacritic-folded search still works (regression check)
1. Click the search input. Type `هذا` (no diacritics).
2. **PASS**: result count drops from "362 / 362 words" to a small number (1–5 range expected based on prior session). Card visible: `هَٰذَا` with diacritics intact.
3. **FAIL**: 0 results (font swap broke font-arabic class causing layout regression), or 245+ cards (dedup regression).

### Step 5 — Responsive: 1-col on mobile (regression check)
1. Open devtools → device toolbar → set width to **375px** (iPhone SE).
2. Vocab bank cards should stack 1 per row.
   - **PASS**: 1 card per row.
   - **FAIL**: 2+ cards per row.

## Out of scope
- Topic detail pages (intentionally still 3-col, not changed).
- Practice page font (uses same `font-arabic` class — covered transitively by Step 2).
- Cross-browser testing — Chrome only.

## Adversarial check
For each step: **would a broken impl produce identical screenshots?**
- Step 1: a 3-col layout would visibly show 3 cards/row → distinguishable.
- Step 2: if font import was forgotten, browser would fall back to Segoe UI / Tahoma / system Arabic — visibly different glyph shapes than the previous Amiri AND than the intended Noto Sans Arabic. Inspecting `font-family` catches both regressions.
- Step 3: a font without diacritic coverage would render tofu boxes for combining marks → visibly different.
- Step 4: would only fail if the changes accidentally broke unrelated logic.
- Step 5: 4-col bleeding into mobile would be visually obvious.
