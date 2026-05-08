export interface NameOfAllahSource {
  type: "quran";
  reference: string;
  url: string;
}

export interface NameOfAllah {
  id: string;
  arabic: string;
  transliteration: string;
  shortMeaning: string;
  explanation: string;
  sources: NameOfAllahSource[];
}

export const NAMES_OF_ALLAH: NameOfAllah[] = [
  {
    id: "allah",
    arabic: "اللَّه",
    transliteration: "Allāh",
    shortMeaning: "The one true God",
    explanation:
      "The proper name of God: the only One worthy of worship, the Creator and Sustainer of everything.",
    sources: [
      { type: "quran", reference: "Qur'an 1:1", url: "https://quran.com/1/1" },
      { type: "quran", reference: "Qur'an 59:22", url: "https://quran.com/59/22" },
    ],
  },
  {
    id: "ar-rahman",
    arabic: "الرَّحْمَٰن",
    transliteration: "ar-Raḥmān",
    shortMeaning: "The Entirely Merciful",
    explanation:
      "Allah's mercy is vast, overflowing, and reaches all creation in this world.",
    sources: [
      { type: "quran", reference: "Qur'an 1:1", url: "https://quran.com/1/1" },
      { type: "quran", reference: "Qur'an 55:1", url: "https://quran.com/55/1" },
    ],
  },
  {
    id: "ar-rahim",
    arabic: "الرَّحِيم",
    transliteration: "ar-Raḥīm",
    shortMeaning: "The Especially Merciful",
    explanation:
      "Allah shows special, lasting mercy to those who turn to Him and receive His guidance.",
    sources: [
      { type: "quran", reference: "Qur'an 1:1", url: "https://quran.com/1/1" },
      { type: "quran", reference: "Qur'an 1:3", url: "https://quran.com/1/3" },
    ],
  },
  {
    id: "al-malik",
    arabic: "الْمَلِك",
    transliteration: "al-Malik",
    shortMeaning: "The King",
    explanation:
      "The absolute King and Sovereign whose authority, command, and ownership are complete.",
    sources: [
      { type: "quran", reference: "Qur'an 59:23", url: "https://quran.com/59/23" },
    ],
  },
  {
    id: "al-quddus",
    arabic: "الْقُدُّوس",
    transliteration: "al-Quddūs",
    shortMeaning: "The Most Holy",
    explanation:
      "The One completely pure and perfect, far above every flaw, weakness, or imperfection.",
    sources: [
      { type: "quran", reference: "Qur'an 59:23", url: "https://quran.com/59/23" },
    ],
  },
  {
    id: "as-salam",
    arabic: "السَّلَام",
    transliteration: "as-Salām",
    shortMeaning: "The Source of Peace",
    explanation:
      "The One free from every deficiency, from whom true safety, wholeness, and peace come.",
    sources: [
      { type: "quran", reference: "Qur'an 59:23", url: "https://quran.com/59/23" },
    ],
  },
  {
    id: "al-mumin",
    arabic: "الْمُؤْمِن",
    transliteration: "al-Muʾmin",
    shortMeaning: "The Giver of Security",
    explanation:
      "The One who grants safety, confirms the truth, and gives faith and assurance to His servants.",
    sources: [
      { type: "quran", reference: "Qur'an 59:23", url: "https://quran.com/59/23" },
    ],
  },
  {
    id: "al-muhaymin",
    arabic: "الْمُهَيْمِن",
    transliteration: "al-Muhaymin",
    shortMeaning: "The Guardian",
    explanation:
      "The One who watches over, preserves, and fully witnesses all things.",
    sources: [
      { type: "quran", reference: "Qur'an 59:23", url: "https://quran.com/59/23" },
    ],
  },
  {
    id: "al-aziz",
    arabic: "الْعَزِيز",
    transliteration: "al-ʿAzīz",
    shortMeaning: "The Almighty",
    explanation:
      "The Mighty and Honored One whose power cannot be overcome.",
    sources: [
      { type: "quran", reference: "Qur'an 59:23", url: "https://quran.com/59/23" },
    ],
  },
  {
    id: "al-jabbar",
    arabic: "الْجَبَّار",
    transliteration: "al-Jabbār",
    shortMeaning: "The Compeller",
    explanation:
      "The One whose will prevails, who compels what He wills and restores what is broken.",
    sources: [
      { type: "quran", reference: "Qur'an 59:23", url: "https://quran.com/59/23" },
    ],
  },
];
