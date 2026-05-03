import type { Surah } from "../types";

/**
 * Surah 113 — Al-Falaq (The Daybreak).
 *
 * Sources: Tanzil simple-clean, QAC morphology, Sahih International translation.
 */
export const SURAH_AL_FALAQ: Surah = {
  number: 113,
  name: "Al-Falaq",
  nameArabic: "ٱلْفَلَق",
  meaning: "The Daybreak",
  revelation: "Meccan",
  intro:
    "A short prayer of refuge: the believer is taught to seek protection in the Lord of the dawn from four kinds of evil — created harm, the encroaching night, occult practice, and envy.",
  ayahs: [
    {
      number: 1,
      translation: 'Say, "I seek refuge in the Lord of the daybreak,',
      words: [
        {
          arabic: "قُلْ",
          translit: "qul",
          english: "say",
          root: "ق-و-ل",
          pos: "verb",
          note: "imperative, 2nd person singular",
        },
        {
          arabic: "أَعُوذُ",
          translit: "aʿūdhu",
          english: "I seek refuge",
          root: "ع-و-ذ",
          pos: "verb",
          note: "1st person singular present",
        },
        {
          arabic: "بِرَبِّ",
          translit: "bi-rabbi",
          english: "in (the) Lord",
          root: "ر-ب-ب",
          pos: "noun",
          note: "preposition بِ + noun in genitive",
        },
        {
          arabic: "ٱلْفَلَقِ",
          translit: "al-falaqi",
          english: "of the daybreak",
          root: "ف-ل-ق",
          pos: "noun",
        },
      ],
    },
    {
      number: 2,
      translation: "from the evil of that which He created,",
      words: [
        {
          arabic: "مِن",
          translit: "min",
          english: "from",
          pos: "preposition",
        },
        {
          arabic: "شَرِّ",
          translit: "sharri",
          english: "evil (of)",
          root: "ش-ر-ر",
          pos: "noun",
        },
        {
          arabic: "مَا",
          translit: "mā",
          english: "what / that which",
          pos: "relative",
        },
        {
          arabic: "خَلَقَ",
          translit: "khalaqa",
          english: "He created",
          root: "خ-ل-ق",
          pos: "verb",
          note: "3rd person masculine singular past",
        },
      ],
    },
    {
      number: 3,
      translation: "and from the evil of darkness when it settles,",
      words: [
        {
          arabic: "وَمِن",
          translit: "wa-min",
          english: "and from",
          pos: "preposition",
          note: "conjunction وَ + preposition مِن",
        },
        {
          arabic: "شَرِّ",
          translit: "sharri",
          english: "evil (of)",
          root: "ش-ر-ر",
          pos: "noun",
        },
        {
          arabic: "غَاسِقٍ",
          translit: "ghāsiqin",
          english: "darkness",
          root: "غ-س-ق",
          pos: "noun",
          note: "indefinite — encroaching night",
        },
        {
          arabic: "إِذَا",
          translit: "idhā",
          english: "when",
          pos: "conjunction",
        },
        {
          arabic: "وَقَبَ",
          translit: "waqaba",
          english: "it settles",
          root: "و-ق-ب",
          pos: "verb",
          note: "3rd person masculine singular past",
        },
      ],
    },
    {
      number: 4,
      translation: "and from the evil of the blowers in knots,",
      words: [
        {
          arabic: "وَمِن",
          translit: "wa-min",
          english: "and from",
          pos: "preposition",
        },
        {
          arabic: "شَرِّ",
          translit: "sharri",
          english: "evil (of)",
          root: "ش-ر-ر",
          pos: "noun",
        },
        {
          arabic: "ٱلنَّفَّٰثَٰتِ",
          translit: "an-naffāthāti",
          english: "the (women) who blow",
          root: "ن-ف-ث",
          pos: "noun",
          note: "feminine plural active participle, intensive form",
        },
        {
          arabic: "فِى",
          translit: "fī",
          english: "in / on",
          pos: "preposition",
        },
        {
          arabic: "ٱلْعُقَدِ",
          translit: "al-ʿuqadi",
          english: "the knots",
          root: "ع-ق-د",
          pos: "noun",
          note: "plural",
        },
      ],
    },
    {
      number: 5,
      translation: 'and from the evil of an envier when he envies."',
      words: [
        {
          arabic: "وَمِن",
          translit: "wa-min",
          english: "and from",
          pos: "preposition",
        },
        {
          arabic: "شَرِّ",
          translit: "sharri",
          english: "evil (of)",
          root: "ش-ر-ر",
          pos: "noun",
        },
        {
          arabic: "حَاسِدٍ",
          translit: "ḥāsidin",
          english: "an envier",
          root: "ح-س-د",
          pos: "noun",
          note: "indefinite active participle",
        },
        {
          arabic: "إِذَا",
          translit: "idhā",
          english: "when",
          pos: "conjunction",
        },
        {
          arabic: "حَسَدَ",
          translit: "ḥasada",
          english: "he envies",
          root: "ح-س-د",
          pos: "verb",
          note: "3rd person masculine singular past",
        },
      ],
    },
  ],
};
