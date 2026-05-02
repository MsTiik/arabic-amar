/**
 * Harakat (short vowel marks) and related tashkīl, plus the tanwīn endings
 * and the shadda / sukūn signs. These are the marks that sit above or below
 * consonants and control how they are vocalized.
 */

export interface HarakahEntry {
  slug: string;
  /** Display name in Arabic. */
  nameArabic: string;
  /** Transliterated name (e.g. "fatḥa"). */
  name: string;
  /** The combining mark itself (rendered on a carrier in the UI). */
  mark: string;
  /** A short, beginner-readable description. */
  description: string;
  /** How it changes pronunciation. */
  soundEffect: string;
  /** Example syllable on letter ب (the carrier convention in Noorani Qaida). */
  carrier: {
    syllable: string;
    translit: string;
  };
  /** A Qur'ānic word that prominently uses this mark. */
  example: {
    arabic: string;
    translit: string;
    gloss: string;
    citation?: string;
  };
}

/** The three short vowels — the core of Arabic vocalization. */
export const SHORT_VOWELS: HarakahEntry[] = [
  {
    slug: "fatha",
    nameArabic: "فَتْحَة",
    name: "fatḥa",
    mark: "َ",
    description:
      "A small diagonal stroke placed above a letter.",
    soundEffect:
      "Adds a short 'a' sound — like the 'a' in English 'cat' (but usually a bit more open).",
    carrier: { syllable: "بَ", translit: "ba" },
    example: {
      arabic: "كَتَبَ",
      translit: "kataba",
      gloss: "he wrote",
    },
  },
  {
    slug: "kasra",
    nameArabic: "كَسْرَة",
    name: "kasra",
    mark: "ِ",
    description:
      "A small diagonal stroke placed below a letter.",
    soundEffect: "Adds a short 'i' sound — like the 'i' in English 'bit'.",
    carrier: { syllable: "بِ", translit: "bi" },
    example: {
      arabic: "بِسْمِ",
      translit: "bismi",
      gloss: "in the name of",
      citation: "Qur'ān 1:1",
    },
  },
  {
    slug: "damma",
    nameArabic: "ضَمَّة",
    name: "ḍamma",
    mark: "ُ",
    description:
      "A tiny wāw-shaped mark placed above a letter.",
    soundEffect: "Adds a short 'u' sound — like the 'u' in English 'put'.",
    carrier: { syllable: "بُ", translit: "bu" },
    example: {
      arabic: "رَسُولُ",
      translit: "rasūlu",
      gloss: "messenger",
    },
  },
];

/** Sukūn — the "no vowel" sign. Stops the consonant. */
export const SUKUN: HarakahEntry = {
  slug: "sukun",
  nameArabic: "سُكُون",
  name: "sukūn",
  mark: "ْ",
  description:
    "A small circle above a letter. Marks the letter as vowel-less — just the bare consonant.",
  soundEffect:
    "Stops the sound on that consonant; no vowel follows. The letter becomes the end of a closed syllable.",
  carrier: { syllable: "بْ", translit: "b" },
  example: {
    arabic: "قُلْ",
    translit: "qul",
    gloss: "say!",
    citation: "Qur'ān 112:1",
  },
};

/** Shadda — the doubling mark. */
export const SHADDA: HarakahEntry = {
  slug: "shadda",
  nameArabic: "شَدَّة",
  name: "shadda",
  mark: "ّ",
  description:
    "A small letter-shaped mark (like a tiny 'w') placed above a letter. Means the letter is doubled.",
  soundEffect:
    "The consonant is pronounced twice — held longer, with emphasis. Treat it as a sukūn on the first instance immediately followed by a vocalized second instance.",
  carrier: { syllable: "بَّ", translit: "bba" },
  example: {
    arabic: "رَبِّ",
    translit: "rabbi",
    gloss: "(my) Lord",
    citation: "Qur'ān 1:2",
  },
};

/** Tanwīn — the three "nunation" endings on indefinite nouns. */
export const TANWIN: HarakahEntry[] = [
  {
    slug: "fathatan",
    nameArabic: "فَتْحَتَان",
    name: "fatḥatān",
    mark: "ً",
    description: "Two fatḥas stacked. Appears on the final letter of indefinite accusative nouns.",
    soundEffect:
      "Pronounced '-an' — the vowel 'a' followed by an 'n' sound that's not written as a letter.",
    carrier: { syllable: "بًا", translit: "ban" },
    example: {
      arabic: "كِتَابًا",
      translit: "kitāban",
      gloss: "a book",
    },
  },
  {
    slug: "kasratan",
    nameArabic: "كَسْرَتَان",
    name: "kasratān",
    mark: "ٍ",
    description: "Two kasras stacked below. Appears on the final letter of indefinite genitive nouns.",
    soundEffect: "Pronounced '-in' — vowel 'i' followed by an unwritten 'n'.",
    carrier: { syllable: "بٍ", translit: "bin" },
    example: {
      arabic: "كِتَابٍ",
      translit: "kitābin",
      gloss: "of a book",
    },
  },
  {
    slug: "dammatan",
    nameArabic: "ضَمَّتَان",
    name: "ḍammatān",
    mark: "ٌ",
    description: "Two ḍammas stacked. Appears on the final letter of indefinite nominative nouns.",
    soundEffect: "Pronounced '-un' — vowel 'u' followed by an unwritten 'n'.",
    carrier: { syllable: "بٌ", translit: "bun" },
    example: {
      arabic: "كِتَابٌ",
      translit: "kitābun",
      gloss: "a book (subject)",
    },
  },
];

export const ALL_HARAKAT = [
  ...SHORT_VOWELS,
  SUKUN,
  SHADDA,
  ...TANWIN,
];
