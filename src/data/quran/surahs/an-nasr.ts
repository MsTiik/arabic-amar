import type { Surah } from "../types";

/**
 * Surah 110 — An-Naṣr (Divine Help / The Help).
 *
 * Sources: Tanzil simple-clean, QAC morphology, Sahih International translation.
 */
export const SURAH_AN_NASR: Surah = {
  number: 110,
  name: "An-Naṣr",
  nameArabic: "ٱلنَّصْر",
  meaning: "The Help / Divine Victory",
  revelation: "Medinan",
  intro:
    "A 3-verse surah revealed near the end of the Prophet's life, marking the victory of Islam and instructing him to respond to triumph with praise and seeking forgiveness.",
  ayahs: [
    {
      number: 1,
      translation: "When the help of Allah and the conquest comes,",
      words: [
        {
          arabic: "إِذَا",
          translit: "idhā",
          english: "when",
          pos: "conjunction",
        },
        {
          arabic: "جَآءَ",
          translit: "jā'a",
          english: "comes",
          root: "ج-ي-أ",
          pos: "verb",
          note: "3rd person masculine singular past",
        },
        {
          arabic: "نَصْرُ",
          translit: "naṣru",
          english: "(the) help (of)",
          root: "ن-ص-ر",
          pos: "noun",
        },
        {
          arabic: "ٱللَّهِ",
          translit: "Allāhi",
          english: "Allah",
          pos: "proper-noun",
        },
        {
          arabic: "وَٱلْفَتْحُ",
          translit: "wa-l-fatḥu",
          english: "and the conquest",
          root: "ف-ت-ح",
          pos: "noun",
          note: "conjunction وَ + definite article + noun",
        },
      ],
    },
    {
      number: 2,
      translation:
        "and you see the people entering the religion of Allah in throngs,",
      words: [
        {
          arabic: "وَرَأَيْتَ",
          translit: "wa-ra'ayta",
          english: "and you see / saw",
          root: "ر-أ-ي",
          pos: "verb",
          note: "2nd person masculine singular past",
        },
        {
          arabic: "ٱلنَّاسَ",
          translit: "an-nāsa",
          english: "the people",
          root: "ن-و-س",
          pos: "noun",
        },
        {
          arabic: "يَدْخُلُونَ",
          translit: "yadkhulūna",
          english: "(they) enter",
          root: "د-خ-ل",
          pos: "verb",
          note: "3rd person masculine plural present",
        },
        {
          arabic: "فِى",
          translit: "fī",
          english: "into",
          pos: "preposition",
        },
        {
          arabic: "دِينِ",
          translit: "dīni",
          english: "(the) religion (of)",
          root: "د-ي-ن",
          pos: "noun",
        },
        {
          arabic: "ٱللَّهِ",
          translit: "Allāhi",
          english: "Allah",
          pos: "proper-noun",
        },
        {
          arabic: "أَفْوَاجًا",
          translit: "afwājan",
          english: "in throngs",
          root: "ف-و-ج",
          pos: "noun",
          note: "indefinite accusative plural",
        },
      ],
    },
    {
      number: 3,
      translation:
        "then exalt the praise of your Lord and ask His forgiveness. Indeed, He is ever Accepting of repentance.",
      words: [
        {
          arabic: "فَسَبِّحْ",
          translit: "fa-sabbiḥ",
          english: "then glorify",
          root: "س-ب-ح",
          pos: "verb",
          note: "particle فَ + form II imperative",
        },
        {
          arabic: "بِحَمْدِ",
          translit: "bi-ḥamdi",
          english: "with (the) praise (of)",
          root: "ح-م-د",
          pos: "noun",
        },
        {
          arabic: "رَبِّكَ",
          translit: "rabbika",
          english: "your Lord",
          root: "ر-ب-ب",
          pos: "noun",
          note: "noun + 2nd person masculine pronoun",
        },
        {
          arabic: "وَٱسْتَغْفِرْهُ",
          translit: "wa-staghfirhu",
          english: "and ask His forgiveness",
          root: "غ-ف-ر",
          pos: "verb",
          note: "conjunction + form X imperative + object pronoun",
        },
        {
          arabic: "إِنَّهُۥ",
          translit: "innahu",
          english: "indeed He",
          pos: "particle",
          note: "إِنَّ + 3rd person masculine pronoun",
        },
        {
          arabic: "كَانَ",
          translit: "kāna",
          english: "is / was",
          root: "ك-و-ن",
          pos: "verb",
          note: "3rd person masculine singular past of \"to be\"",
        },
        {
          arabic: "تَوَّابًۢا",
          translit: "tawwāban",
          english: "ever Accepting of repentance",
          root: "ت-و-ب",
          pos: "noun",
          note: "intensive form (fa''āl)",
        },
      ],
    },
  ],
};
