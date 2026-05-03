import type { Surah } from "../types";

/**
 * Surah 108 — Al-Kawthar (Abundance).
 *
 * Sources: Tanzil simple-clean, QAC morphology, Sahih International translation.
 */
export const SURAH_AL_KAWTHAR: Surah = {
  number: 108,
  name: "Al-Kawthar",
  nameArabic: "ٱلْكَوْثَر",
  meaning: "Abundance",
  revelation: "Meccan",
  intro:
    "The shortest surah in the Qurʾān — three verses of consolation: Allah has given the Prophet immense good (al-kawthar), commanded prayer and sacrifice, and promised that his enemies are the truly cut off.",
  ayahs: [
    {
      number: 1,
      translation: "Indeed, We have granted you al-Kawthar.",
      words: [
        {
          arabic: "إِنَّآ",
          translit: "innā",
          english: "indeed, We",
          pos: "particle",
          note: "إِنَّ + 1st person plural pronoun",
        },
        {
          arabic: "أَعْطَيْنَٰكَ",
          translit: "aʿṭaynāka",
          english: "We granted you",
          root: "ع-ط-و",
          pos: "verb",
          note: "form IV past, 1st person plural + 2nd person masc. object",
        },
        {
          arabic: "ٱلْكَوْثَرَ",
          translit: "al-kawthara",
          english: "al-Kawthar (abundance)",
          root: "ك-ث-ر",
          pos: "proper-noun",
          note: "intensive form on the pattern فَوْعَل",
        },
      ],
    },
    {
      number: 2,
      translation: "So pray to your Lord and sacrifice.",
      words: [
        {
          arabic: "فَصَلِّ",
          translit: "fa-ṣalli",
          english: "so pray",
          root: "ص-ل-و",
          pos: "verb",
          note: "particle فَ + form II imperative",
        },
        {
          arabic: "لِرَبِّكَ",
          translit: "li-rabbika",
          english: "to your Lord",
          root: "ر-ب-ب",
          pos: "noun",
          note: "preposition لِ + noun + 2nd person pronoun",
        },
        {
          arabic: "وَٱنْحَرْ",
          translit: "wa-nḥar",
          english: "and sacrifice",
          root: "ن-ح-ر",
          pos: "verb",
          note: "conjunction + imperative",
        },
      ],
    },
    {
      number: 3,
      translation: "Indeed, your enemy is the one cut off.",
      words: [
        {
          arabic: "إِنَّ",
          translit: "inna",
          english: "indeed",
          pos: "particle",
        },
        {
          arabic: "شَانِئَكَ",
          translit: "shāni'aka",
          english: "your enemy / hater",
          root: "ش-ن-أ",
          pos: "noun",
          note: "active participle + 2nd person pronoun",
        },
        {
          arabic: "هُوَ",
          translit: "huwa",
          english: "(is) he",
          pos: "pronoun",
          note: "3rd person masculine singular",
        },
        {
          arabic: "ٱلْأَبْتَرُ",
          translit: "al-abtaru",
          english: "the cut off (one)",
          root: "ب-ت-ر",
          pos: "noun",
          note: "definite — without progeny or legacy",
        },
      ],
    },
  ],
};
