import type { Surah } from "../types";

/**
 * Surah 107 — Al-Māʿūn (Small Kindnesses / Common Aid).
 *
 * Sources: Tanzil simple-clean, QAC morphology, Sahih International translation.
 */
export const SURAH_AL_MAUN: Surah = {
  number: 107,
  name: "Al-Māʿūn",
  nameArabic: "ٱلْمَاعُون",
  meaning: "Small Kindnesses / Common Aid",
  revelation: "Meccan",
  intro:
    "A surah that links denial of the Day of Judgement to social cruelty: those who reject religion are described as the people who push away the orphan, withhold food from the poor, and pray for show.",
  ayahs: [
    {
      number: 1,
      translation: "Have you seen the one who denies the Recompense?",
      words: [
        {
          arabic: "أَرَءَيْتَ",
          translit: "a-ra'ayta",
          english: "have you seen",
          root: "ر-أ-ي",
          pos: "verb",
          note: "interrogative أ + 2nd person masc. singular past",
        },
        {
          arabic: "ٱلَّذِى",
          translit: "alladhī",
          english: "the one who",
          pos: "relative",
          note: "masculine singular",
        },
        {
          arabic: "يُكَذِّبُ",
          translit: "yukadhdhibu",
          english: "denies",
          root: "ك-ذ-ب",
          pos: "verb",
          note: "form II, 3rd person masculine singular present",
        },
        {
          arabic: "بِٱلدِّينِ",
          translit: "bi-d-dīni",
          english: "in the Recompense / religion",
          root: "د-ي-ن",
          pos: "noun",
          note: "preposition بِ + definite noun",
        },
      ],
    },
    {
      number: 2,
      translation: "For that is the one who drives away the orphan",
      words: [
        {
          arabic: "فَذَٰلِكَ",
          translit: "fa-dhālika",
          english: "for that (is)",
          pos: "demonstrative",
          note: "particle فَ + masculine singular far demonstrative",
        },
        {
          arabic: "ٱلَّذِى",
          translit: "alladhī",
          english: "the one who",
          pos: "relative",
        },
        {
          arabic: "يَدُعُّ",
          translit: "yaduʿʿu",
          english: "drives away / repels",
          root: "د-ع-ع",
          pos: "verb",
          note: "3rd person masculine singular present",
        },
        {
          arabic: "ٱلْيَتِيمَ",
          translit: "al-yatīma",
          english: "the orphan",
          root: "ي-ت-م",
          pos: "noun",
        },
      ],
    },
    {
      number: 3,
      translation: "and does not encourage the feeding of the poor.",
      words: [
        {
          arabic: "وَلَا",
          translit: "wa-lā",
          english: "and not",
          pos: "negation",
        },
        {
          arabic: "يَحُضُّ",
          translit: "yaḥuḍḍu",
          english: "encourages",
          root: "ح-ض-ض",
          pos: "verb",
          note: "3rd person masculine singular present",
        },
        {
          arabic: "عَلَىٰ",
          translit: "ʿalā",
          english: "upon",
          pos: "preposition",
        },
        {
          arabic: "طَعَامِ",
          translit: "ṭaʿāmi",
          english: "(the) feeding (of)",
          root: "ط-ع-م",
          pos: "noun",
        },
        {
          arabic: "ٱلْمِسْكِينِ",
          translit: "al-miskīni",
          english: "the poor",
          root: "س-ك-ن",
          pos: "noun",
        },
      ],
    },
    {
      number: 4,
      translation: "So woe to those who pray —",
      words: [
        {
          arabic: "فَوَيْلٌ",
          translit: "fa-waylun",
          english: "so woe",
          pos: "noun",
          note: "particle فَ + indefinite noun of warning",
        },
        {
          arabic: "لِّلْمُصَلِّينَ",
          translit: "lil-muṣallīna",
          english: "to those who pray",
          root: "ص-ل-و",
          pos: "noun",
          note: "preposition لِ + masculine plural form II active participle",
        },
      ],
    },
    {
      number: 5,
      translation: "those who are heedless of their prayer,",
      words: [
        {
          arabic: "ٱلَّذِينَ",
          translit: "alladhīna",
          english: "those who",
          pos: "relative",
          note: "masculine plural",
        },
        {
          arabic: "هُمْ",
          translit: "hum",
          english: "they (are)",
          pos: "pronoun",
          note: "3rd person masculine plural",
        },
        {
          arabic: "عَن",
          translit: "ʿan",
          english: "of / from",
          pos: "preposition",
        },
        {
          arabic: "صَلَاتِهِمْ",
          translit: "ṣalātihim",
          english: "their prayer",
          root: "ص-ل-و",
          pos: "noun",
        },
        {
          arabic: "سَاهُونَ",
          translit: "sāhūna",
          english: "heedless",
          root: "س-ه-و",
          pos: "noun",
          note: "masculine plural active participle",
        },
      ],
    },
    {
      number: 6,
      translation: "those who make a show of (their deeds)",
      words: [
        {
          arabic: "ٱلَّذِينَ",
          translit: "alladhīna",
          english: "those who",
          pos: "relative",
        },
        {
          arabic: "هُمْ",
          translit: "hum",
          english: "they",
          pos: "pronoun",
        },
        {
          arabic: "يُرَآءُونَ",
          translit: "yurā'ūna",
          english: "make a show",
          root: "ر-أ-ي",
          pos: "verb",
          note: "form III, 3rd person masculine plural present",
        },
      ],
    },
    {
      number: 7,
      translation: "and withhold (small) kindnesses.",
      words: [
        {
          arabic: "وَيَمْنَعُونَ",
          translit: "wa-yamnaʿūna",
          english: "and they withhold",
          root: "م-ن-ع",
          pos: "verb",
          note: "conjunction + 3rd person masculine plural present",
        },
        {
          arabic: "ٱلْمَاعُونَ",
          translit: "al-māʿūna",
          english: "small kindnesses / aid",
          root: "م-ع-ن",
          pos: "noun",
        },
      ],
    },
  ],
};
