import type { Surah } from "../types";

/**
 * Surah 106 — Quraysh.
 *
 * Sources: Tanzil simple-clean, QAC morphology, Sahih International translation.
 */
export const SURAH_QURAYSH: Surah = {
  number: 106,
  name: "Quraysh",
  nameArabic: "قُرَيْش",
  meaning: "Quraysh (the tribe)",
  revelation: "Meccan",
  intro:
    "A short reminder to the tribe of Quraysh — guardians of the Kaʿbah — to worship the Lord of the House that gave them safety, prosperity, and the famous winter and summer trade caravans.",
  ayahs: [
    {
      number: 1,
      translation: "For the protection of the Quraysh —",
      words: [
        {
          arabic: "لِإِيلَٰفِ",
          translit: "li-īlāfi",
          english: "for (the) familiarity / accustoming (of)",
          root: "أ-ل-ف",
          pos: "noun",
          note: "preposition لِ + form IV verbal noun",
        },
        {
          arabic: "قُرَيْشٍ",
          translit: "Qurayshin",
          english: "Quraysh",
          pos: "proper-noun",
          note: "the tribe of Mecca",
        },
      ],
    },
    {
      number: 2,
      translation: "their accustomed security in the caravan of winter and summer —",
      words: [
        {
          arabic: "إِۦلَٰفِهِمْ",
          translit: "īlāfihim",
          english: "their familiarity",
          root: "أ-ل-ف",
          pos: "noun",
          note: "verbal noun + 3rd person masc. plural pronoun",
        },
        {
          arabic: "رِحْلَةَ",
          translit: "riḥlata",
          english: "(the) journey (of)",
          root: "ر-ح-ل",
          pos: "noun",
        },
        {
          arabic: "ٱلشِّتَآءِ",
          translit: "ash-shitā'i",
          english: "the winter",
          root: "ش-ت-و",
          pos: "noun",
        },
        {
          arabic: "وَٱلصَّيْفِ",
          translit: "wa-ṣ-ṣayfi",
          english: "and the summer",
          root: "ص-ي-ف",
          pos: "noun",
          note: "conjunction + definite noun",
        },
      ],
    },
    {
      number: 3,
      translation: "let them worship the Lord of this House,",
      words: [
        {
          arabic: "فَلْيَعْبُدُوا۟",
          translit: "fa-l-yaʿbudū",
          english: "so let them worship",
          root: "ع-ب-د",
          pos: "verb",
          note: "particle فَ + jussive prefix لِ + 3rd person masc. plural",
        },
        {
          arabic: "رَبَّ",
          translit: "rabba",
          english: "(the) Lord (of)",
          root: "ر-ب-ب",
          pos: "noun",
        },
        {
          arabic: "هَٰذَا",
          translit: "hādhā",
          english: "this",
          pos: "demonstrative",
          note: "masculine singular near demonstrative",
        },
        {
          arabic: "ٱلْبَيْتِ",
          translit: "al-bayti",
          english: "the House",
          root: "ب-ي-ت",
          pos: "noun",
          note: "the Kaʿbah",
        },
      ],
    },
    {
      number: 4,
      translation: "who has fed them, sparing them hunger, and made them safe from fear.",
      words: [
        {
          arabic: "ٱلَّذِىٓ",
          translit: "alladhī",
          english: "the One who",
          pos: "relative",
        },
        {
          arabic: "أَطْعَمَهُم",
          translit: "aṭʿamahum",
          english: "fed them",
          root: "ط-ع-م",
          pos: "verb",
          note: "form IV past + 3rd person masc. plural object",
        },
        {
          arabic: "مِّن",
          translit: "min",
          english: "from",
          pos: "preposition",
        },
        {
          arabic: "جُوعٍ",
          translit: "jūʿin",
          english: "hunger",
          root: "ج-و-ع",
          pos: "noun",
          note: "indefinite",
        },
        {
          arabic: "وَءَامَنَهُم",
          translit: "wa-āmanahum",
          english: "and made them secure",
          root: "أ-م-ن",
          pos: "verb",
          note: "form IV past + 3rd person masc. plural object",
        },
        {
          arabic: "مِّنْ",
          translit: "min",
          english: "from",
          pos: "preposition",
        },
        {
          arabic: "خَوْفٍۭ",
          translit: "khawfin",
          english: "fear",
          root: "خ-و-ف",
          pos: "noun",
        },
      ],
    },
  ],
};
