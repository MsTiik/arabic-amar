/**
 * Strip Arabic diacritics (tashkeel) so search can match `هذا` against `هٰذَا`.
 * Removes the Arabic combining marks U+064B–U+065F, the standalone tatweel U+0640,
 * the small alef U+0670, and the Quranic annotation marks U+06D6–U+06ED.
 *
 * IMPORTANT: only used for search/indexing. Never strip diacritics from displayed text.
 */
export function stripDiacritics(input: string): string {
  return input
    .normalize("NFC")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[\u0610-\u061A]/g, "");
}

/**
 * Lowercase + trim + diacritic-strip for both Arabic and Latin scripts.
 * Used for query matching across Arabic/transliteration/English.
 *
 * For Latin transliterations, also strips the half-rings ʾ/ʿ and friends
 * (and the dot-below variants ḥ ṣ ḍ ṭ ẓ) so users typing without diacritical
 * markers still match the original transliteration.
 */
export function foldForSearch(input: string): string {
  if (!input) return "";
  return stripDiacritics(input)
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[\u02B0-\u02FF]/g, "") // modifier letters incl. ʾ ʿ ʼ
    .replace(/[ʾʿʼ'`’ʔ]/g, "")
    .replace(/[ḥḤ]/gi, "h")
    .replace(/[ṣṢ]/gi, "s")
    .replace(/[ḍḌ]/gi, "d")
    .replace(/[ṭṬ]/gi, "t")
    .replace(/[ẓẒ]/gi, "z")
    .trim()
    .toLowerCase();
}

/** Quick check: does `haystack` (already folded) contain `needle` (also already folded)? */
export function foldedIncludes(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return haystack.includes(needle);
}

export function foldedSearchMatches(
  value: string,
  needle: string,
  options: { exactArabic?: boolean; allowArabicPrefix?: boolean } = {},
): boolean {
  if (!needle) return true;
  if (options.exactArabic && isArabicFolded(needle)) {
    const needleTokens = needle.split(/\s+/).filter(Boolean);
    const valueTokens = value.split(/\s+/).filter(Boolean);
    return valueTokens.some((_, index) =>
      needleTokens.every((token, offset) => {
        const valueToken = valueTokens[index + offset];
        if (!valueToken) return false;
        return options.allowArabicPrefix ? valueToken.startsWith(token) : valueToken === token;
      }),
    );
  }
  return value.includes(needle);
}

export function isArabicFolded(value: string): boolean {
  return /[\u0600-\u06FF]/u.test(value);
}
