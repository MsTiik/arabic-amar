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
  /** Source attribution displayed on About page. */
  source: {
    name: string;
    contactEmail: string;
    instagram: string;
    docUrl: string;
  };
  fetchedAt: string;
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
  | "ordering";

export interface ExerciseOption {
  id: string;
  text: string;
  isArabic?: boolean;
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
}

export interface ExerciseDeck {
  id: string;
  title: string;
  topicSlug?: string;
  lessonId?: string;
  questions: ExerciseQuestion[];
}
