import type { Surah } from "../types";

/**
 * Surah 1 — Al-Fātiḥah (The Opening).
 *
 * Arabic text: Tanzil simple-clean (CC BY 3.0).
 * Per-word morphology (root, POS): Quranic Arabic Corpus (Dukes 2009, CC BY-SA 3.0).
 * Translation (full ayah): Sahih International (public domain).
 * Word-by-word glosses: cross-checked against corpus.quran.com & quran.com.
 */
export const SURAH_AL_FATIHAH: Surah = {
  number: 1,
  name: "Al-Fātiḥah",
  nameArabic: "ٱلْفَاتِحَة",
  meaning: "The Opening",
  revelation: "Meccan",
  intro:
    "The opening chapter of the Qurʾān — recited in every unit of the daily prayer. Seven short verses that frame the entire scripture as praise, refuge, and a request for guidance.",
  ayahs: [
    {
      number: 1,
      translation:
        "In the name of Allah — the Most Compassionate, the Most Merciful.",
      words: [
        {
          arabic: "بِسْمِ",
          translit: "bismi",
          english: "in (the) name (of)",
          root: "س-م-و",
          pos: "noun",
          note: "preposition بِ + noun اسم",
        },
        {
          arabic: "ٱللَّهِ",
          translit: "Allāhi",
          english: "Allah",
          pos: "proper-noun",
        },
        {
          arabic: "ٱلرَّحْمَٰنِ",
          translit: "ar-raḥmāni",
          english: "the Most Compassionate",
          root: "ر-ح-م",
          pos: "noun",
          note: "intensive form on the pattern فَعْلَان",
        },
        {
          arabic: "ٱلرَّحِيمِ",
          translit: "ar-raḥīmi",
          english: "the Most Merciful",
          root: "ر-ح-م",
          pos: "noun",
          note: "intensive form on the pattern فَعِيل",
        },
      ],
    },
    {
      number: 2,
      translation: "All praise is for Allah — Lord of all worlds.",
      words: [
        {
          arabic: "ٱلْحَمْدُ",
          translit: "al-ḥamdu",
          english: "(all) the praise",
          root: "ح-م-د",
          pos: "noun",
        },
        {
          arabic: "لِلَّهِ",
          translit: "lillāhi",
          english: "(is) for Allah",
          pos: "proper-noun",
          note: "preposition لِ + ٱللَّه",
        },
        {
          arabic: "رَبِّ",
          translit: "rabbi",
          english: "Lord (of)",
          root: "ر-ب-ب",
          pos: "noun",
        },
        {
          arabic: "ٱلْعَٰلَمِينَ",
          translit: "al-ʿālamīna",
          english: "the worlds",
          root: "ع-ل-م",
          pos: "noun",
          note: "masculine plural",
        },
      ],
    },
    {
      number: 3,
      translation: "the Most Compassionate, the Most Merciful;",
      words: [
        {
          arabic: "ٱلرَّحْمَٰنِ",
          translit: "ar-raḥmāni",
          english: "the Most Compassionate",
          root: "ر-ح-م",
          pos: "noun",
        },
        {
          arabic: "ٱلرَّحِيمِ",
          translit: "ar-raḥīmi",
          english: "the Most Merciful",
          root: "ر-ح-م",
          pos: "noun",
        },
      ],
    },
    {
      number: 4,
      translation: "Master of the Day of Judgement.",
      words: [
        {
          arabic: "مَٰلِكِ",
          translit: "māliki",
          english: "Master (of)",
          root: "م-ل-ك",
          pos: "noun",
          note: "active participle",
        },
        {
          arabic: "يَوْمِ",
          translit: "yawmi",
          english: "(the) Day (of)",
          root: "ي-و-م",
          pos: "noun",
        },
        {
          arabic: "ٱلدِّينِ",
          translit: "ad-dīni",
          english: "the Judgement",
          root: "د-ي-ن",
          pos: "noun",
        },
      ],
    },
    {
      number: 5,
      translation:
        "You alone we worship and You alone we ask for help.",
      words: [
        {
          arabic: "إِيَّاكَ",
          translit: "iyyāka",
          english: "You (alone)",
          pos: "pronoun",
          note: "object pronoun, emphatic 2nd-person",
        },
        {
          arabic: "نَعْبُدُ",
          translit: "naʿbudu",
          english: "we worship",
          root: "ع-ب-د",
          pos: "verb",
          note: "1st person plural, present-tense",
        },
        {
          arabic: "وَإِيَّاكَ",
          translit: "wa-iyyāka",
          english: "and You (alone)",
          pos: "pronoun",
          note: "conjunction و + emphatic pronoun",
        },
        {
          arabic: "نَسْتَعِينُ",
          translit: "nastaʿīnu",
          english: "we ask for help",
          root: "ع-و-ن",
          pos: "verb",
          note: "1st person plural, form X (to seek help)",
        },
      ],
    },
    {
      number: 6,
      translation: "Guide us to the Straight Path —",
      words: [
        {
          arabic: "ٱهْدِنَا",
          translit: "ihdinā",
          english: "guide us",
          root: "ه-د-ي",
          pos: "verb",
          note: "imperative + 1st person plural object",
        },
        {
          arabic: "ٱلصِّرَٰطَ",
          translit: "aṣ-ṣirāṭa",
          english: "the path",
          root: "ص-ر-ط",
          pos: "noun",
        },
        {
          arabic: "ٱلْمُسْتَقِيمَ",
          translit: "al-mustaqīma",
          english: "the straight",
          root: "ق-و-م",
          pos: "noun",
          note: "active participle, form X",
        },
      ],
    },
    {
      number: 7,
      translation:
        "the path of those You have favoured — not those who earned Your wrath, nor those who have gone astray.",
      words: [
        {
          arabic: "صِرَٰطَ",
          translit: "ṣirāṭa",
          english: "(the) path (of)",
          root: "ص-ر-ط",
          pos: "noun",
        },
        {
          arabic: "ٱلَّذِينَ",
          translit: "alladhīna",
          english: "those whom",
          pos: "relative",
          note: "masculine plural relative pronoun",
        },
        {
          arabic: "أَنْعَمْتَ",
          translit: "anʿamta",
          english: "You have favoured",
          root: "ن-ع-م",
          pos: "verb",
          note: "2nd person singular past, form IV",
        },
        {
          arabic: "عَلَيْهِمْ",
          translit: "ʿalayhim",
          english: "upon them",
          pos: "preposition",
          note: "preposition عَلَى + 3rd person plural pronoun",
        },
        {
          arabic: "غَيْرِ",
          translit: "ghayri",
          english: "not (of)",
          root: "غ-ي-ر",
          pos: "noun",
          note: "exception/negation noun",
        },
        {
          arabic: "ٱلْمَغْضُوبِ",
          translit: "al-maghḍūbi",
          english: "those who earned (Your) wrath",
          root: "غ-ض-ب",
          pos: "noun",
          note: "passive participle",
        },
        {
          arabic: "عَلَيْهِمْ",
          translit: "ʿalayhim",
          english: "upon them",
          pos: "preposition",
        },
        {
          arabic: "وَلَا",
          translit: "wa-lā",
          english: "and not",
          pos: "negation",
          note: "conjunction و + negation لا",
        },
        {
          arabic: "ٱلضَّآلِّينَ",
          translit: "aḍ-ḍāllīna",
          english: "those who have gone astray",
          root: "ض-ل-ل",
          pos: "noun",
          note: "active participle, masculine plural",
        },
      ],
    },
  ],
};
