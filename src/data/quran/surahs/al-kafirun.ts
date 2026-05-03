import type { Surah } from "../types";

/**
 * Surah 109 — Al-Kāfirūn (The Disbelievers).
 *
 * Sources: Tanzil simple-clean, QAC morphology, Sahih International translation.
 */
export const SURAH_AL_KAFIRUN: Surah = {
  number: 109,
  name: "Al-Kāfirūn",
  nameArabic: "ٱلْكَافِرُون",
  meaning: "The Disbelievers",
  revelation: "Meccan",
  intro:
    "A clear-cut declaration of separation between true monotheism and idolatry. Each verse hammers the same point — the believer's worship is for Allah alone, and there is no compromise of belief.",
  ayahs: [
    {
      number: 1,
      translation: 'Say, "O disbelievers!',
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
          arabic: "يَٰٓأَيُّهَا",
          translit: "yā-ayyuhā",
          english: "O",
          pos: "vocative",
          note: "vocative particle يَا + emphatic أَيُّهَا",
        },
        {
          arabic: "ٱلْكَٰفِرُونَ",
          translit: "al-kāfirūna",
          english: "the disbelievers",
          root: "ك-ف-ر",
          pos: "noun",
          note: "masculine plural active participle",
        },
      ],
    },
    {
      number: 2,
      translation: "I do not worship what you worship,",
      words: [
        {
          arabic: "لَآ",
          translit: "lā",
          english: "(do) not",
          pos: "negation",
        },
        {
          arabic: "أَعْبُدُ",
          translit: "aʿbudu",
          english: "I worship",
          root: "ع-ب-د",
          pos: "verb",
          note: "1st person singular present",
        },
        {
          arabic: "مَا",
          translit: "mā",
          english: "what",
          pos: "relative",
        },
        {
          arabic: "تَعْبُدُونَ",
          translit: "taʿbudūna",
          english: "you (all) worship",
          root: "ع-ب-د",
          pos: "verb",
          note: "2nd person masculine plural present",
        },
      ],
    },
    {
      number: 3,
      translation: "nor are you worshippers of what I worship,",
      words: [
        {
          arabic: "وَلَآ",
          translit: "wa-lā",
          english: "and not",
          pos: "negation",
        },
        {
          arabic: "أَنتُمْ",
          translit: "antum",
          english: "you (are)",
          pos: "pronoun",
          note: "2nd person masculine plural",
        },
        {
          arabic: "عَٰبِدُونَ",
          translit: "ʿābidūna",
          english: "worshippers",
          root: "ع-ب-د",
          pos: "noun",
          note: "masculine plural active participle",
        },
        {
          arabic: "مَآ",
          translit: "mā",
          english: "what",
          pos: "relative",
        },
        {
          arabic: "أَعْبُدُ",
          translit: "aʿbudu",
          english: "I worship",
          root: "ع-ب-د",
          pos: "verb",
        },
      ],
    },
    {
      number: 4,
      translation: "nor will I be a worshipper of what you have worshipped,",
      words: [
        {
          arabic: "وَلَآ",
          translit: "wa-lā",
          english: "and not",
          pos: "negation",
        },
        {
          arabic: "أَنَا۠",
          translit: "anā",
          english: "I (am)",
          pos: "pronoun",
          note: "1st person singular",
        },
        {
          arabic: "عَابِدٌ",
          translit: "ʿābidun",
          english: "a worshipper",
          root: "ع-ب-د",
          pos: "noun",
          note: "active participle, indefinite",
        },
        {
          arabic: "مَّا",
          translit: "mā",
          english: "what",
          pos: "relative",
        },
        {
          arabic: "عَبَدتُّمْ",
          translit: "ʿabadtum",
          english: "you have worshipped",
          root: "ع-ب-د",
          pos: "verb",
          note: "2nd person masculine plural past",
        },
      ],
    },
    {
      number: 5,
      translation: "nor will you be worshippers of what I worship.",
      words: [
        {
          arabic: "وَلَآ",
          translit: "wa-lā",
          english: "and not",
          pos: "negation",
        },
        {
          arabic: "أَنتُمْ",
          translit: "antum",
          english: "you (are)",
          pos: "pronoun",
        },
        {
          arabic: "عَٰبِدُونَ",
          translit: "ʿābidūna",
          english: "worshippers",
          root: "ع-ب-د",
          pos: "noun",
          note: "masculine plural active participle",
        },
        {
          arabic: "مَآ",
          translit: "mā",
          english: "what",
          pos: "relative",
        },
        {
          arabic: "أَعْبُدُ",
          translit: "aʿbudu",
          english: "I worship",
          root: "ع-ب-د",
          pos: "verb",
        },
      ],
    },
    {
      number: 6,
      translation: 'For you is your religion, and for me is my religion."',
      words: [
        {
          arabic: "لَكُمْ",
          translit: "lakum",
          english: "for you",
          pos: "preposition",
          note: "لِ + 2nd person masculine plural pronoun",
        },
        {
          arabic: "دِينُكُمْ",
          translit: "dīnukum",
          english: "your religion",
          root: "د-ي-ن",
          pos: "noun",
        },
        {
          arabic: "وَلِىَ",
          translit: "wa-liya",
          english: "and for me",
          pos: "preposition",
          note: "وَ + لِ + 1st person pronoun",
        },
        {
          arabic: "دِينِ",
          translit: "dīni",
          english: "my religion",
          root: "د-ي-ن",
          pos: "noun",
        },
      ],
    },
  ],
};
