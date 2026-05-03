import type { Surah } from "../types";

/**
 * Surah 111 — Al-Lahab / Al-Masad (The Palm Fibre / The Flame).
 *
 * Sources: Tanzil simple-clean, QAC morphology, Sahih International translation.
 */
export const SURAH_AL_LAHAB: Surah = {
  number: 111,
  name: "Al-Lahab",
  nameArabic: "ٱلْمَسَد",
  meaning: "The Palm Fibre / The Flame",
  revelation: "Meccan",
  intro:
    "A short, vivid surah about Abū Lahab — the Prophet's uncle who openly opposed his message — and his wife, declaring that neither wealth nor status will save them from the Fire.",
  ayahs: [
    {
      number: 1,
      translation: "May the hands of Abū Lahab perish, and may he perish.",
      words: [
        {
          arabic: "تَبَّتْ",
          translit: "tabbat",
          english: "perished",
          root: "ت-ب-ب",
          pos: "verb",
          note: "3rd person feminine singular past",
        },
        {
          arabic: "يَدَا",
          translit: "yadā",
          english: "(the) two hands (of)",
          root: "ي-د-ي",
          pos: "noun",
          note: "dual, in construct",
        },
        {
          arabic: "أَبِى",
          translit: "abī",
          english: "(the) father (of)",
          root: "أ-ب-و",
          pos: "noun",
          note: "in construct (kunyah)",
        },
        {
          arabic: "لَهَبٍ",
          translit: "lahabin",
          english: "Lahab / flame",
          root: "ل-ه-ب",
          pos: "proper-noun",
          note: "the kunyah \"Abū Lahab\" — Father of Flame",
        },
        {
          arabic: "وَتَبَّ",
          translit: "wa-tabba",
          english: "and he perished",
          root: "ت-ب-ب",
          pos: "verb",
          note: "conjunction وَ + 3rd person masculine singular past",
        },
      ],
    },
    {
      number: 2,
      translation: "His wealth will not avail him, nor what he has earned.",
      words: [
        {
          arabic: "مَآ",
          translit: "mā",
          english: "(did) not",
          pos: "negation",
        },
        {
          arabic: "أَغْنَىٰ",
          translit: "aghnā",
          english: "avail",
          root: "غ-ن-ي",
          pos: "verb",
          note: "form IV, 3rd person masculine singular past",
        },
        {
          arabic: "عَنْهُ",
          translit: "ʿanhu",
          english: "from him",
          pos: "preposition",
          note: "عَنْ + 3rd person masculine pronoun",
        },
        {
          arabic: "مَالُهُۥ",
          translit: "māluhu",
          english: "his wealth",
          root: "م-و-ل",
          pos: "noun",
          note: "noun + 3rd person masculine singular suffix",
        },
        {
          arabic: "وَمَا",
          translit: "wa-mā",
          english: "and what",
          pos: "relative",
        },
        {
          arabic: "كَسَبَ",
          translit: "kasaba",
          english: "he earned",
          root: "ك-س-ب",
          pos: "verb",
          note: "3rd person masculine singular past",
        },
      ],
    },
    {
      number: 3,
      translation: "He will burn in a Fire of blazing flame,",
      words: [
        {
          arabic: "سَيَصْلَىٰ",
          translit: "sa-yaṣlā",
          english: "he will burn / enter",
          root: "ص-ل-ي",
          pos: "verb",
          note: "future prefix سَ + 3rd person masculine singular present",
        },
        {
          arabic: "نَارًا",
          translit: "nāran",
          english: "a fire",
          root: "ن-و-ر",
          pos: "noun",
          note: "indefinite accusative",
        },
        {
          arabic: "ذَاتَ",
          translit: "dhāta",
          english: "possessor of / having",
          pos: "noun",
          note: "feminine of ذُو — \"having / endowed with\"",
        },
        {
          arabic: "لَهَبٍ",
          translit: "lahabin",
          english: "flame",
          root: "ل-ه-ب",
          pos: "noun",
        },
      ],
    },
    {
      number: 4,
      translation: "and his wife — the carrier of firewood,",
      words: [
        {
          arabic: "وَٱمْرَأَتُهُۥ",
          translit: "wamra'atuhu",
          english: "and his wife",
          root: "م-ر-أ",
          pos: "noun",
          note: "conjunction وَ + noun + 3rd person masculine pronoun",
        },
        {
          arabic: "حَمَّالَةَ",
          translit: "ḥammālata",
          english: "carrier (of)",
          root: "ح-م-ل",
          pos: "noun",
          note: "intensive feminine active participle",
        },
        {
          arabic: "ٱلْحَطَبِ",
          translit: "al-ḥaṭabi",
          english: "the firewood",
          root: "ح-ط-ب",
          pos: "noun",
        },
      ],
    },
    {
      number: 5,
      translation: "around her neck a rope of twisted palm fibre.",
      words: [
        {
          arabic: "فِى",
          translit: "fī",
          english: "around",
          pos: "preposition",
        },
        {
          arabic: "جِيدِهَا",
          translit: "jīdihā",
          english: "her neck",
          root: "ج-ي-د",
          pos: "noun",
          note: "noun + 3rd person feminine singular suffix",
        },
        {
          arabic: "حَبْلٌ",
          translit: "ḥablun",
          english: "a rope",
          root: "ح-ب-ل",
          pos: "noun",
          note: "indefinite",
        },
        {
          arabic: "مِّن",
          translit: "min",
          english: "of",
          pos: "preposition",
        },
        {
          arabic: "مَّسَدٍ",
          translit: "masadin",
          english: "twisted palm fibre",
          root: "م-س-د",
          pos: "noun",
          note: "indefinite",
        },
      ],
    },
  ],
};
