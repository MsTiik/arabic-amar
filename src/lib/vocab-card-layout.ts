import type { VocabEntry } from "@/lib/types";

/**
 * "Wide" entries get `sm:col-span-2` so they take ~2x the width of a regular
 * vocab card in the responsive grid. Currently triggered for:
 *  - country entries with nationality data (extra Arabic + transliteration block)
 *  - very long English glosses (e.g. "Antarctica" + a long category badge)
 *  - very long Arabic words
 * The check is conservative — if any of these is true the card is widened
 * so a long word like Antarctica doesn't get squeezed into a tall column.
 *
 * Lives in a pure module (not vocab-card.tsx, which is a client component) so
 * that Server Components can call it during static generation without
 * tripping Next's client-boundary rules.
 */
export function vocabCardSpansTwoCols(entry: VocabEntry): boolean {
  if (entry.nationalityArabic) return true;
  if (entry.english && entry.english.length >= 14) return true;
  // Use `arabicFolded` so tashkeel (diacritic marks) — which add zero visual
  // width — don't inflate the apparent length. Counting raw `arabic.length`
  // catches short words like "أَحَدَ عَشَرَ" (Eleven, length 13 / folded 8)
  // and over-widens roughly a third of the dataset, killing grid density.
  if (entry.arabicFolded && entry.arabicFolded.length >= 12) return true;
  return false;
}
