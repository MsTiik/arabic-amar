export type Gender = "M" | "F" | "Both" | "Unknown";

export interface VocabEntry {
  /** Stable id derived from arabic + lessonId; unchanged across doc edits as long as the word stays the same. */
  id: string;
  arabic: string;
  /** Diacritic-folded version of `arabic` for case/diacritic-insensitive search. */
  arabicFolded: string;
  pronunciation: string;
  english: string;
  category: string;
  subCategory?: string;
  gender?: Gender;
  /** True when the entry came from a section labelled Extra / Bonus. */
  isExtra: boolean;
  /** Numeric value when the entry is a number (Lesson 2). */
  numericValue?: number;
  /** ISO weekday index (1=Mon..7=Sun) when the entry is a day of the week. */
  weekdayIndex?: number;
  /** 1..12 month index when the entry is a Gregorian/Hijri month. */
  monthIndex?: number;
  /** "hijri" | "gregorian" — only set for month entries. */
  monthSystem?: "hijri" | "gregorian";
  /** Country/Continent extras for the Lesson 7 nationalities table. */
  continent?: string;
  country?: string;
  nationalityArabic?: string;
  nationalityPronunciation?: string;
  /** Topic slugs this vocab belongs to (one entry can belong to multiple topics). */
  topicSlugs: string[];
  /** Lesson id this vocab was extracted from. */
  lessonId: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  /** Markdown-ish plain text body. */
  body: string;
  examples: GrammarExample[];
  topicSlugs: string[];
  lessonId: string;
}

export interface GrammarExample {
  arabic: string;
  pronunciation?: string;
  english?: string;
  /** Optional structured pieces — populated when the doc breaks an example into bullet points. */
  parts?: { label: string; arabic?: string; english?: string }[];
}

export interface ConversationLine {
  speaker?: string;
  arabic: string;
  pronunciation?: string;
  english?: string;
}

export interface Conversation {
  id: string;
  title: string;
  lines: ConversationLine[];
  topicSlugs: string[];
  lessonId: string;
}

export interface Lesson {
  id: string;
  number: string;
  title: string;
  titleArabic?: string;
  topicSlugs: string[];
  vocabIds: string[];
  ruleIds: string[];
  conversationIds: string[];
}

export interface Topic {
  slug: string;
  name: string;
  nameArabic?: string;
  /** Order across the dashboard / sidebar. */
  order: number;
  lessonIds: string[];
  vocabCount: number;
  ruleCount: number;
  conversationCount: number;
  /** Section-level notes — explanations that apply to a whole category and were
   *  duplicated across many entries in the source doc (e.g. the Hijri/Gregorian
   *  calendar explanation that the Google Doc repeated for every month). */
  notes?: string[];
}

export interface SiteContent {
  lessons: Lesson[];
  topics: Topic[];
  vocab: VocabEntry[];
  rules: GrammarRule[];
  conversations: Conversation[];
  /** Pronouns reference — `/grammar/pronouns`. */
  pronouns: PronounEntry[];
  /** Verb conjugations reference — `/grammar/conjugations`. */
  conjugations: ConjugationEntry[];
  /** Plural-formation rules — `/grammar/plurals`. */
  pluralForms: PluralForm[];
  /** Long-form intro prose for grammar reference pages. */
  grammarIntros: GrammarIntro[];
  /** Source attribution displayed on About page. */
  source: {
    name: string;
    contactEmail: string;
    instagram: string;
    docUrl: string;
  };
  fetchedAt: string;
}

/** Long-form prose lifted out of vocabulary sections so it can anchor a
 *  reference page (e.g. the explanation of detached vs. attached pronouns). */
export interface GrammarIntro {
  /** Stable section key: "pronouns" | "conjugations" | "plurals". */
  section: "pronouns" | "conjugations" | "plurals";
  /** Each paragraph is rendered as its own `<p>`. */
  paragraphs: string[];
}

/** A single entry in the detached / attached pronoun reference tables. */
export interface PronounEntry {
  id: string;
  /** "detached" or "attached". */
  kind: "detached" | "attached";
  /** "1st person singular", "2nd person plural", … */
  category: string;
  arabic: string;
  arabicFolded: string;
  pronunciation: string;
  english: string;
  /** Inferred from the pronunciation suffix where possible. */
  gender?: "M" | "F" | "Both";
  /** Doc's "Usage Note" cell. */
  usageNote?: string;
  /** Doc's "Example" cell — usually a Quran or Hadith citation. */
  example?: PronounExample;
}

export interface PronounExample {
  /** Vowelled Arabic ayah / sentence. */
  arabic: string;
  /** Latin transliteration. */
  transliteration?: string;
  /** English translation. */
  english?: string;
  /** Source citation, e.g. "Qur'an 20:14" or "Hadith: Sahih al-Bukhari". */
  citation?: string;
}

/** A single conjugation row from the past-tense (Māḍī) or
 *  present/future-tense (Muḍāriʿ) tables. */
export interface ConjugationEntry {
  id: string;
  tense: "past" | "present-future";
  /** "1st person singular", "Base form", … */
  category: string;
  /** Pattern abstraction, e.g. "(root) + تُ" or "تَ + (root) + ينَ". */
  patternRule: string;
  /** Concrete example with the root + ending split, e.g. "ك‑ت‑ب + تُ". */
  patternExample: string;
  /** Final concrete Arabic form, e.g. "كَتَبْتُ". */
  arabic: string;
  arabicFolded: string;
  pronunciation: string;
  english: string;
  gender?: "M" | "F" | "Both";
}

/** One row of the "How plurals are formed" reference table. */
export interface PluralForm {
  id: string;
  /** "Sound plural (masculine)" | "Sound plural (feminine)" | "Broken plural". */
  type: string;
  /** "add ـونَ (ūna)". */
  howToForm: string;
  /** Longer rule body. */
  rule: string;
  /** Each example is `{ singular, plural }` Arabic forms with English meaning. */
  examples: Array<{ arabic: string; english?: string }>;
}

/** Per-word progress state used by the gamification layer. */
export type Mastery = 0 | 1 | 2 | 3; // new | learning | familiar | mastered

export interface WordProgress {
  attempts: number;
  correct: number;
  streak: number;
  mastery: Mastery;
  lastSeen: string; // ISO
  nextDue: string; // ISO — for SRS-lite
}

export interface UserProgress {
  version: 1;
  startedAt: string;
  streak: { count: number; lastDay: string };
  daily: {
    goalCards: number;
    today: { date: string; cardsSeen: number; correct: number };
  };
  words: Record<string, WordProgress>;
  topics: Record<string, { lastVisited: string }>;
}

export type ExerciseKind =
  | "flashcard"
  | "multiple-choice-en-to-ar"
  | "multiple-choice-ar-to-en"
  | "multiple-choice-translit-to-ar"
  | "fill-blank-translit"
  | "gender-quiz"
  | "ordering"
  | "match-pairs"
  | "which-letter"
  | "cloze";

export interface ExerciseOption {
  id: string;
  text: string;
  isArabic?: boolean;
  /** Latin transliteration of `text` when `isArabic` is true; surfaced via a
   *  click-to-reveal hint on the option button so the learner can fall back
   *  to pronunciation if they're stuck reading the Arabic. */
  translit?: string;
}

/** A pair to match in the match-pairs exercise. Each side has an id and a
 *  text label; the pairing is implicit (the i-th left matches the i-th right
 *  before shuffling). */
export interface MatchPair {
  id: string;
  leftText: string;
  leftIsArabic?: boolean;
  leftTranslit?: string;
  rightText: string;
  rightIsArabic?: boolean;
  rightTranslit?: string;
}

export interface ExerciseQuestion {
  id: string;
  kind: ExerciseKind;
  /** The vocab entry this question is about (if any). */
  wordId?: string;
  prompt: string;
  promptArabic?: string;
  promptHint?: string;
  options?: ExerciseOption[];
  correctAnswerId?: string;
  /** For fill-in-the-blank: accepted plain-text answers, all lowercased + whitespace-trimmed. */
  acceptableAnswers?: string[];
  /** For ordering: the correct sequence of option ids. */
  correctOrder?: string[];
  /** For match-pairs: the pairs the user must reconnect. */
  pairs?: MatchPair[];
  /** For cloze: the full Arabic phrase split into [before, blank, after].
   *  The renderer joins these with the correct option's text replacing the
   *  blank when revealing the answer. */
  clozeBefore?: string;
  clozeAfter?: string;
}

export interface ExerciseDeck {
  id: string;
  title: string;
  topicSlug?: string;
  lessonId?: string;
  questions: ExerciseQuestion[];
}
