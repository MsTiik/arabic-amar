import type { Surah } from "../types";

/**
 * Surah 105 — Al-Fīl (The Elephant).
 *
 * Sources: Tanzil simple-clean, QAC morphology, Sahih International translation.
 */
export const SURAH_AL_FIL: Surah = {
  number: 105,
  name: "Al-Fīl",
  nameArabic: "ٱلْفِيل",
  meaning: "The Elephant",
  revelation: "Meccan",
  intro:
    "A 5-verse reminder of the year the Yemeni governor Abrahah marched on Mecca with elephants to destroy the Kaʿbah — and was thwarted by flocks of birds carrying small stones, a sign of Allah's protection of His House.",
  ayahs: [
    {
      number: 1,
      translation:
        "Have you not seen how your Lord dealt with the companions of the elephant?",
      words: [
        {
          arabic: "أَلَمْ",
          translit: "a-lam",
          english: "have not",
          pos: "negation",
          note: "interrogative أ + negation لَمْ",
        },
        {
          arabic: "تَرَ",
          translit: "tara",
          english: "you seen",
          root: "ر-أ-ي",
          pos: "verb",
          note: "2nd person masculine singular jussive",
        },
        {
          arabic: "كَيْفَ",
          translit: "kayfa",
          english: "how",
          pos: "interrogative",
        },
        {
          arabic: "فَعَلَ",
          translit: "faʿala",
          english: "dealt / did",
          root: "ف-ع-ل",
          pos: "verb",
          note: "3rd person masculine singular past",
        },
        {
          arabic: "رَبُّكَ",
          translit: "rabbuka",
          english: "your Lord",
          root: "ر-ب-ب",
          pos: "noun",
          note: "noun + 2nd person masc. singular pronoun",
        },
        {
          arabic: "بِأَصْحَٰبِ",
          translit: "bi-aṣḥābi",
          english: "with (the) companions (of)",
          root: "ص-ح-ب",
          pos: "noun",
          note: "preposition بِ + plural in construct",
        },
        {
          arabic: "ٱلْفِيلِ",
          translit: "al-fīli",
          english: "the elephant",
          root: "ف-ي-ل",
          pos: "noun",
        },
      ],
    },
    {
      number: 2,
      translation: "Did He not make their plot go astray?",
      words: [
        {
          arabic: "أَلَمْ",
          translit: "a-lam",
          english: "did not",
          pos: "negation",
        },
        {
          arabic: "يَجْعَلْ",
          translit: "yajʿal",
          english: "He make",
          root: "ج-ع-ل",
          pos: "verb",
          note: "3rd person masculine singular jussive",
        },
        {
          arabic: "كَيْدَهُمْ",
          translit: "kaydahum",
          english: "their plot",
          root: "ك-ي-د",
          pos: "noun",
          note: "noun + 3rd person masc. plural pronoun",
        },
        {
          arabic: "فِى",
          translit: "fī",
          english: "in",
          pos: "preposition",
        },
        {
          arabic: "تَضْلِيلٍ",
          translit: "taḍlīlin",
          english: "loss / going astray",
          root: "ض-ل-ل",
          pos: "noun",
          note: "form II verbal noun",
        },
      ],
    },
    {
      number: 3,
      translation: "And He sent against them birds in flocks,",
      words: [
        {
          arabic: "وَأَرْسَلَ",
          translit: "wa-arsala",
          english: "and He sent",
          root: "ر-س-ل",
          pos: "verb",
          note: "conjunction + form IV past",
        },
        {
          arabic: "عَلَيْهِمْ",
          translit: "ʿalayhim",
          english: "against them",
          pos: "preposition",
          note: "عَلَى + 3rd person masc. plural pronoun",
        },
        {
          arabic: "طَيْرًا",
          translit: "ṭayran",
          english: "birds",
          root: "ط-ي-ر",
          pos: "noun",
          note: "indefinite collective",
        },
        {
          arabic: "أَبَابِيلَ",
          translit: "abābīla",
          english: "in flocks",
          root: "أ-ب-ل",
          pos: "noun",
          note: "indefinite plural — successive groups (per QAC)",
        },
      ],
    },
    {
      number: 4,
      translation: "striking them with stones of baked clay,",
      words: [
        {
          arabic: "تَرْمِيهِم",
          translit: "tarmīhim",
          english: "striking them",
          root: "ر-م-ي",
          pos: "verb",
          note: "3rd person feminine singular present + object",
        },
        {
          arabic: "بِحِجَارَةٍ",
          translit: "bi-ḥijāratin",
          english: "with stones",
          root: "ح-ج-ر",
          pos: "noun",
          note: "preposition بِ + indefinite",
        },
        {
          arabic: "مِّن",
          translit: "min",
          english: "of",
          pos: "preposition",
        },
        {
          arabic: "سِجِّيلٍ",
          translit: "sijjīlin",
          english: "baked clay",
          root: "س-ج-ل",
          pos: "noun",
          note: "indefinite — hardened clay (root س-ج-ل per QAC; some scholars treat as Persian loanword)",
        },
      ],
    },
    {
      number: 5,
      translation: "and made them like chewed-up straw.",
      words: [
        {
          arabic: "فَجَعَلَهُمْ",
          translit: "fa-jaʿalahum",
          english: "so He made them",
          root: "ج-ع-ل",
          pos: "verb",
          note: "particle فَ + 3rd masc. sing. past + masc. plural object",
        },
        {
          arabic: "كَعَصْفٍ",
          translit: "ka-ʿaṣfin",
          english: "like straw",
          root: "ع-ص-ف",
          pos: "noun",
          note: "preposition كَ (\"like\") + indefinite",
        },
        {
          arabic: "مَّأْكُولٍۭ",
          translit: "ma'kūlin",
          english: "(that is) chewed up / eaten",
          root: "أ-ك-ل",
          pos: "noun",
          note: "passive participle, indefinite",
        },
      ],
    },
  ],
};
