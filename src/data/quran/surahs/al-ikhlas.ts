import type { Surah } from "../types";

/**
 * Surah 112 — Al-Ikhlāṣ (Sincerity).
 *
 * Sources: Tanzil simple-clean, QAC morphology, Sahih International translation.
 */
export const SURAH_AL_IKHLAS: Surah = {
  number: 112,
  name: "Al-Ikhlāṣ",
  nameArabic: "ٱلْإِخْلَاص",
  meaning: "Sincerity / Pure Faith",
  revelation: "Meccan",
  intro:
    "A 4-verse declaration of Allah's absolute oneness — concise, dense, and frequently described in hadith as equivalent to a third of the Qurʾān in meaning.",
  ayahs: [
    {
      number: 1,
      translation: 'Say, "He is Allah — One.',
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
          arabic: "هُوَ",
          translit: "huwa",
          english: "He (is)",
          pos: "pronoun",
          note: "3rd person masculine singular",
        },
        {
          arabic: "ٱللَّهُ",
          translit: "Allāhu",
          english: "Allah",
          pos: "proper-noun",
        },
        {
          arabic: "أَحَدٌ",
          translit: "aḥadun",
          english: "One",
          root: "أ-ح-د",
          pos: "noun",
        },
      ],
    },
    {
      number: 2,
      translation: "Allah — the Eternal Refuge.",
      words: [
        {
          arabic: "ٱللَّهُ",
          translit: "Allāhu",
          english: "Allah",
          pos: "proper-noun",
        },
        {
          arabic: "ٱلصَّمَدُ",
          translit: "aṣ-ṣamadu",
          english: "the Eternal Refuge",
          root: "ص-م-د",
          pos: "noun",
        },
      ],
    },
    {
      number: 3,
      translation: "He neither begets nor was begotten,",
      words: [
        {
          arabic: "لَمْ",
          translit: "lam",
          english: "(did) not",
          pos: "negation",
          note: "negates a past meaning with a present verb",
        },
        {
          arabic: "يَلِدْ",
          translit: "yalid",
          english: "beget",
          root: "و-ل-د",
          pos: "verb",
          note: "3rd person masculine singular jussive",
        },
        {
          arabic: "وَلَمْ",
          translit: "wa-lam",
          english: "and (was) not",
          pos: "negation",
        },
        {
          arabic: "يُولَدْ",
          translit: "yūlad",
          english: "begotten",
          root: "و-ل-د",
          pos: "verb",
          note: "passive jussive",
        },
      ],
    },
    {
      number: 4,
      translation: 'And there is none comparable to Him."',
      words: [
        {
          arabic: "وَلَمْ",
          translit: "wa-lam",
          english: "and (is) not",
          pos: "negation",
        },
        {
          arabic: "يَكُن",
          translit: "yakun",
          english: "there is",
          root: "ك-و-ن",
          pos: "verb",
          note: "3rd person singular jussive of 'to be'",
        },
        {
          arabic: "لَّهُۥ",
          translit: "lahu",
          english: "to Him",
          pos: "pronoun",
          note: "preposition لِ + 3rd person masculine pronoun",
        },
        {
          arabic: "كُفُوًا",
          translit: "kufuwan",
          english: "equal / comparable",
          root: "ك-ف-ء",
          pos: "noun",
        },
        {
          arabic: "أَحَدٌۢ",
          translit: "aḥad",
          english: "anyone",
          root: "أ-ح-د",
          pos: "noun",
        },
      ],
    },
  ],
};
