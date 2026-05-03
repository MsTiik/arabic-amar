import type { Surah } from "../types";

/**
 * Surah 114 — An-Nās (Mankind).
 *
 * Sources: Tanzil simple-clean, QAC morphology, Sahih International translation.
 */
export const SURAH_AN_NAS: Surah = {
  number: 114,
  name: "An-Nās",
  nameArabic: "ٱلنَّاس",
  meaning: "Mankind",
  revelation: "Meccan",
  intro:
    "The final surah of the Qurʾān, paired with Al-Falaq as the muʿawwidhāt — verses sought as protection. Asks Allah for refuge from the whisperer who slips into the chests of mankind.",
  ayahs: [
    {
      number: 1,
      translation: 'Say, "I seek refuge in the Lord of mankind,',
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
          english: "in (the) Lord (of)",
          root: "ر-ب-ب",
          pos: "noun",
          note: "preposition بِ + noun رَبّ",
        },
        {
          arabic: "ٱلنَّاسِ",
          translit: "an-nāsi",
          english: "mankind",
          root: "ن-و-س",
          pos: "noun",
        },
      ],
    },
    {
      number: 2,
      translation: "the King of mankind,",
      words: [
        {
          arabic: "مَلِكِ",
          translit: "maliki",
          english: "(the) King (of)",
          root: "م-ل-ك",
          pos: "noun",
        },
        {
          arabic: "ٱلنَّاسِ",
          translit: "an-nāsi",
          english: "mankind",
          root: "ن-و-س",
          pos: "noun",
        },
      ],
    },
    {
      number: 3,
      translation: "the God of mankind,",
      words: [
        {
          arabic: "إِلَٰهِ",
          translit: "ilāhi",
          english: "(the) God (of)",
          root: "أ-ل-ه",
          pos: "noun",
        },
        {
          arabic: "ٱلنَّاسِ",
          translit: "an-nāsi",
          english: "mankind",
          root: "ن-و-س",
          pos: "noun",
        },
      ],
    },
    {
      number: 4,
      translation:
        "from the evil of the retreating whisperer,",
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
          english: "(the) evil (of)",
          root: "ش-ر-ر",
          pos: "noun",
        },
        {
          arabic: "ٱلْوَسْوَاسِ",
          translit: "al-waswāsi",
          english: "the whisperer",
          root: "و-س-و-س",
          pos: "noun",
        },
        {
          arabic: "ٱلْخَنَّاسِ",
          translit: "al-khannāsi",
          english: "the retreating one",
          root: "خ-ن-س",
          pos: "noun",
          note: "intensive form فَعَّال",
        },
      ],
    },
    {
      number: 5,
      translation: "who whispers into the chests of mankind —",
      words: [
        {
          arabic: "ٱلَّذِى",
          translit: "alladhī",
          english: "the one who",
          pos: "relative",
          note: "masculine singular relative pronoun",
        },
        {
          arabic: "يُوَسْوِسُ",
          translit: "yuwaswisu",
          english: "whispers",
          root: "و-س-و-س",
          pos: "verb",
          note: "3rd person singular present",
        },
        {
          arabic: "فِى",
          translit: "fī",
          english: "in / into",
          pos: "preposition",
        },
        {
          arabic: "صُدُورِ",
          translit: "ṣudūri",
          english: "(the) chests (of)",
          root: "ص-د-ر",
          pos: "noun",
        },
        {
          arabic: "ٱلنَّاسِ",
          translit: "an-nāsi",
          english: "mankind",
          root: "ن-و-س",
          pos: "noun",
        },
      ],
    },
    {
      number: 6,
      translation: 'whether jinn or mankind."',
      words: [
        {
          arabic: "مِنَ",
          translit: "mina",
          english: "from",
          pos: "preposition",
        },
        {
          arabic: "ٱلْجِنَّةِ",
          translit: "al-jinnati",
          english: "the jinn",
          root: "ج-ن-ن",
          pos: "noun",
        },
        {
          arabic: "وَٱلنَّاسِ",
          translit: "wa-an-nāsi",
          english: "and mankind",
          root: "ن-و-س",
          pos: "noun",
          note: "conjunction و + ٱلنَّاس",
        },
      ],
    },
  ],
};
