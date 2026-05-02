/**
 * Word-by-word Qurʾān data for the surah reader.
 *
 * This data is hand-curated from the Tanzil simple-clean Qur'ān text (CC BY 3.0)
 * and the Quranic Arabic Corpus (Dukes 2009, CC BY-SA 3.0). Per-word glosses
 * follow the Sahih International / Mufti Taqi Usmani conventions and are
 * cross-checked against quran.com word-by-word.
 *
 * It is NOT sourced from the user's curriculum doc.
 */

/** Coarse part-of-speech tag — kept beginner-friendly. The QAC uses ~30
 *  fine-grained tags; we collapse to a small set so a learner sees
 *  "Noun", "Verb", "Pronoun", "Particle" rather than POS:N or POS:VERB:V. */
export type QuranWordPos =
  | "noun"
  | "proper-noun"
  | "verb"
  | "pronoun"
  | "particle"
  | "preposition"
  | "conjunction"
  | "demonstrative"
  | "relative"
  | "interrogative"
  | "negation"
  | "vocative";

export interface QuranWord {
  /** Arabic word with full diacritics (Tanzil simple-clean form). */
  arabic: string;
  /** ALA-LC-style transliteration (e.g. "bismi", "Allāhi", "ar-raḥmāni"). */
  translit: string;
  /** Concise English gloss for this *word in this context*. May not always
   *  match the dictionary entry — e.g. أَحَد can be "one" or "anyone"
   *  depending on usage. */
  english: string;
  /** 3-letter triliteral root (e.g. "ر-ح-م" for رحيم), if applicable.
   *  Particles, pronouns, and proper nouns commonly have no root. */
  root?: string;
  /** Part-of-speech tag. */
  pos: QuranWordPos;
  /** Optional extra grammar note (e.g. "1st person plural pronoun",
   *  "imperative", "definite article"). Kept short. */
  note?: string;
}

export interface QuranAyah {
  /** Verse number within the surah (1-indexed). */
  number: number;
  /** Words in reading order (right-to-left when rendered). */
  words: QuranWord[];
  /** Full English translation of the ayah (Sahih International). */
  translation: string;
}

export interface Surah {
  /** Surah number (1-114). */
  number: number;
  /** Transliterated name (e.g. "Al-Fātiḥah"). */
  name: string;
  /** Arabic name (e.g. "ٱلْفَاتِحَة"). */
  nameArabic: string;
  /** Short English meaning of the name (e.g. "The Opening"). */
  meaning: string;
  /** "Meccan" or "Medinan" revelation place. */
  revelation: "Meccan" | "Medinan";
  /** A 1-2 sentence beginner intro to the surah's theme — context only,
   *  not exegesis. */
  intro: string;
  ayahs: QuranAyah[];
}
