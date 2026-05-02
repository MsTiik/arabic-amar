/**
 * Sun and moon letters — the 28 letters split 14/14 for the purpose of the
 * definite article 'al-' (الـ) assimilation rule.
 *
 * - Moon letters: the lām in 'al-' is pronounced. al-qamar → "al-qamar".
 * - Sun letters: the lām is silent; the following letter is doubled (shaddah).
 *   al-shams → "ash-shams".
 */

export const SUN_LETTERS: readonly string[] = [
  "ت",
  "ث",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ل",
  "ن",
];

export const MOON_LETTERS: readonly string[] = [
  "ا",
  "ب",
  "ج",
  "ح",
  "خ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "م",
  "ه",
  "و",
  "ي",
];

export interface SunMoonExample {
  slug: string;
  /** Bare noun (without 'al-'). */
  arabic: string;
  /** With 'al-' prefix (unvocalized version — UI will add tashkīl). */
  arabicWithAl: string;
  translit: string;
  gloss: string;
  category: "sun" | "moon";
}

export const SUN_MOON_EXAMPLES: SunMoonExample[] = [
  {
    slug: "ash-shams",
    arabic: "شَمْس",
    arabicWithAl: "الشَّمْس",
    translit: "ash-shams",
    gloss: "the sun",
    category: "sun",
  },
  {
    slug: "an-nas",
    arabic: "نَاس",
    arabicWithAl: "النَّاس",
    translit: "an-nās",
    gloss: "the people",
    category: "sun",
  },
  {
    slug: "ar-rahman",
    arabic: "رَحْمَٰن",
    arabicWithAl: "الرَّحْمَٰن",
    translit: "ar-raḥmān",
    gloss: "the Most Compassionate",
    category: "sun",
  },
  {
    slug: "at-tin",
    arabic: "تِين",
    arabicWithAl: "التِّين",
    translit: "at-tīn",
    gloss: "the fig",
    category: "sun",
  },
  {
    slug: "ad-din",
    arabic: "دِين",
    arabicWithAl: "الدِّين",
    translit: "ad-dīn",
    gloss: "the religion",
    category: "sun",
  },
  {
    slug: "as-salam",
    arabic: "سَلَام",
    arabicWithAl: "السَّلَام",
    translit: "as-salām",
    gloss: "the peace",
    category: "sun",
  },
  {
    slug: "al-qamar",
    arabic: "قَمَر",
    arabicWithAl: "الْقَمَر",
    translit: "al-qamar",
    gloss: "the moon",
    category: "moon",
  },
  {
    slug: "al-bayt",
    arabic: "بَيْت",
    arabicWithAl: "الْبَيْت",
    translit: "al-bayt",
    gloss: "the house",
    category: "moon",
  },
  {
    slug: "al-kitab",
    arabic: "كِتَاب",
    arabicWithAl: "الْكِتَاب",
    translit: "al-kitāb",
    gloss: "the book",
    category: "moon",
  },
  {
    slug: "al-malik",
    arabic: "مَلِك",
    arabicWithAl: "الْمَلِك",
    translit: "al-malik",
    gloss: "the king",
    category: "moon",
  },
  {
    slug: "al-falaq",
    arabic: "فَلَق",
    arabicWithAl: "الْفَلَق",
    translit: "al-falaq",
    gloss: "the daybreak",
    category: "moon",
  },
  {
    slug: "al-hamd",
    arabic: "حَمْد",
    arabicWithAl: "الْحَمْد",
    translit: "al-ḥamd",
    gloss: "the praise",
    category: "moon",
  },
];

/** Classify any Arabic letter as sun / moon / neither. */
export function classifySunMoon(letter: string): "sun" | "moon" | undefined {
  // Alif-with-hamza variants count as alif (moon).
  const normalized = letter.replace(/[أإآ]/g, "ا");
  if (SUN_LETTERS.includes(normalized)) return "sun";
  if (MOON_LETTERS.includes(normalized)) return "moon";
  return undefined;
}
