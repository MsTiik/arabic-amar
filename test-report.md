# PR #4 Test Report — Arabic font + 4-column vocab bank

**Scope:** Verify PR #4's two changes only (font swap + grid widening). Search/dedup behavior is out of scope (pre-existing main-branch bug, fixed in unmerged PR #3).

## Result summary

| # | Assertion | Result |
|---|---|---|
| 1 | Vocab bank renders 4 cards per row at xl breakpoint (≥1280px) | passed |
| 2 | Computed `font-family` on Arabic text is `Noto Sans Arabic` (not Amiri) | passed |
| 3 | Diacritics on `رَأْسٌ`, `شَعْرٌ`, `وَجْهٌ`, `جَبِينٌ` etc. visible at full opacity | passed |
| 4 | Layout collapses to 1 column at 375px mobile viewport | passed |
| — | Vocab search "هذا" returns 1 card | **skipped** (pre-existing main bug — see below) |

## Evidence

### 4-column layout @ xl (1600px viewport)

Computed CSS measured live in the running app:

```
gridTemplateColumns: "271px 271px 271px 271px"
firstRowCardCount:   4   (Head, Hair, Face, Forehead)
viewportWidth:       1600
```

![4-column desktop layout](https://app.devin.ai/attachments/e1049c73-4a3f-4a83-8028-58d7ddf33799/screenshot_1e7950a4f1054b63968a6d0ffa607cde.png)

### Font swap (Amiri serif → Noto Sans Arabic)

Computed CSS, measured live:

```
fontFamily: "Noto Sans Arabic", "Noto Sans Arabic Fallback",
            "Segoe UI", Tahoma, Arial, "Helvetica Neue",
            system-ui, sans-serif
```

The first stack entry is the loaded variable font from `next/font/google`. No trace of Amiri. Stroke style in the screenshot above visibly matches the sans-serif Arabic seen in the Google Doc (Arial substitute).

### Diacritics intact

Visible in the desktop screenshot:
- `رَأْسٌ` — fatha + hamza-on-alif + sukun + dammatan all clearly rendered
- `شَعْرٌ` — fatha + sukun + dammatan
- `جَبِينٌ` — fatha + kasra + dammatan
- `حَاجِبٌ` — fatha-alif + kasra + dammatan
- `لِسَانٌ` — kasra + alif + dammatan

No tofu boxes, no missing combining marks — Noto Sans Arabic ships full Tashkeel coverage.

### 1-column @ mobile (375px viewport)

Switched Chrome DevTools responsive mode to 375px width. Cards stack vertically (one card occupies the full row). Diacritics remain crisp at the smaller size.

![1-column mobile layout](https://app.devin.ai/attachments/9a293afd-4388-4383-9363-a5de1917ee22/screenshot_2025f35e2e2c4423af11188e17aa43c7.png)

## Skipped: vocab search

I noticed that searching `هذا` shows the counter "1 / 362 words" but renders ~245 cards. This is a **pre-existing bug on `main`**, NOT caused by PR #4. Verified by inspecting the PR #4 diff — it only touches:
- `src/app/layout.tsx` (font import)
- `src/app/globals.css` (font stack + line-height)
- `src/components/vocab-bank-client.tsx` (grid class only)

The dedup bug is fixed by [PR #3](https://github.com/MsTiik/arabic-amar/pull/3) (`fix: hydration loop, vocab id collisions, …`), which is open and ready to merge but not yet merged. Once PR #3 lands, search will filter correctly.

## Recording

[Screen recording with annotated assertions](https://app.devin.ai/attachments/da923df2-a6d4-46bd-a3e0-d6b7448d96be/rec-6b0ffd12-862e-429f-a6a9-7e2454953bfd-subtitled.mp4)

## Devin session

https://app.devin.ai/sessions/3f66fa1cbe0a4aa7b883e39fe426e2fd
