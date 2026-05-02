/**
 * Madd — the three long vowels (elongation letters) in Arabic.
 *
 * A madd letter is a sukūn-carrying alif / wāw / yā' preceded by the matching
 * short vowel. It elongates the vowel for 2 counts (more in specific tajwīd
 * contexts). These three letters are the three "basic" madd letters — there
 * are more advanced madd types (badal, muttasil, munfasil, etc.) that are
 * beyond a beginner page.
 */

export interface MaddLetter {
  slug: string;
  nameArabic: string;
  name: string;
  /** The letter itself (for display). */
  letter: string;
  /** The short vowel that must precede it. */
  precededBy: string;
  /** Minimal before/after syllable pair. */
  shortForm: string;
  longForm: string;
  /** Transliterated sound. */
  shortTranslit: string;
  longTranslit: string;
  /** Human description. */
  description: string;
  /** Example Qur'ānic word. */
  example: {
    arabic: string;
    translit: string;
    gloss: string;
    citation?: string;
  };
}

export const MADD_LETTERS: MaddLetter[] = [
  {
    slug: "alif",
    nameArabic: "ألف مَدِّيَّة",
    name: "Alif al-madd",
    letter: "ا",
    precededBy: "فتحة (fatḥa)",
    shortForm: "بَ",
    longForm: "بَا",
    shortTranslit: "ba",
    longTranslit: "bā",
    description:
      "A sukūn-carrying alif preceded by a fatḥa. Elongates the 'a' sound for 2 counts.",
    example: {
      arabic: "قَالَ",
      translit: "qāla",
      gloss: "he said",
      citation: "Qur'ān 2:30",
    },
  },
  {
    slug: "waw",
    nameArabic: "واو مَدِّيَّة",
    name: "Wāw al-madd",
    letter: "و",
    precededBy: "ضمة (ḍamma)",
    shortForm: "بُ",
    longForm: "بُو",
    shortTranslit: "bu",
    longTranslit: "bū",
    description:
      "A sukūn-carrying wāw preceded by a ḍamma. Elongates the 'u' sound for 2 counts.",
    example: {
      arabic: "يَقُولُ",
      translit: "yaqūlu",
      gloss: "he says",
    },
  },
  {
    slug: "ya",
    nameArabic: "ياء مَدِّيَّة",
    name: "Yā' al-madd",
    letter: "ي",
    precededBy: "كسرة (kasra)",
    shortForm: "بِ",
    longForm: "بِي",
    shortTranslit: "bi",
    longTranslit: "bī",
    description:
      "A sukūn-carrying yā' preceded by a kasra. Elongates the 'i' sound for 2 counts.",
    example: {
      arabic: "الرَّحِيم",
      translit: "ar-raḥīm",
      gloss: "the Most Merciful",
      citation: "Qur'ān 1:1",
    },
  },
];
