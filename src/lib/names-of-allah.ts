import { NAMES_OF_ALLAH, type NameOfAllah } from "@/data/names-of-allah";
import { foldForSearch } from "@/lib/diacritics";
import type { ExerciseDeck, ExerciseQuestion, UserProgress, VocabEntry } from "@/lib/types";

export const NAMES_OF_ALLAH_TOPIC_SLUG = "names-of-allah";
export const NAMES_OF_ALLAH_LESSON_ID = "names-of-allah";

export function nameOfAllahWordId(name: Pick<NameOfAllah, "id">): string {
  return `names-of-allah__${name.id}`;
}

export function nameOfAllahSourceLabel(name: NameOfAllah): string {
  return name.sources.map((source) => source.reference).join("; ");
}

export const NAMES_OF_ALLAH_WORD_IDS = NAMES_OF_ALLAH.map(nameOfAllahWordId);

export const NAMES_OF_ALLAH_VOCAB: VocabEntry[] = NAMES_OF_ALLAH.map((name) => ({
  id: nameOfAllahWordId(name),
  arabic: name.arabic,
  arabicFolded: foldForSearch(name.arabic),
  pronunciation: name.transliteration,
  english: name.shortMeaning,
  category: "Names of Allah",
  subCategory: "Divine names",
  isExtra: false,
  topicSlugs: [NAMES_OF_ALLAH_TOPIC_SLUG],
  lessonId: NAMES_OF_ALLAH_LESSON_ID,
}));

export function buildNamesOfAllahFlashcardDeck(): ExerciseDeck {
  const questions: ExerciseQuestion[] = NAMES_OF_ALLAH.map((name, index) => ({
    id: `${nameOfAllahWordId(name)}__flash_${index}`,
    kind: "flashcard",
    wordId: nameOfAllahWordId(name),
    prompt: name.shortMeaning,
    promptArabic: name.arabic,
    promptHint: name.transliteration,
    answerDetail: name.explanation,
    sourceLabel: nameOfAllahSourceLabel(name),
    showAudio: false,
  }));
  return {
    id: "deck-names-of-allah",
    title: "Names of Allah",
    topicSlug: NAMES_OF_ALLAH_TOPIC_SLUG,
    questions,
  };
}

export function summarizeNamesOfAllahProgress(progress: UserProgress): {
  total: number;
  known: number;
  mastered: number;
  familiar: number;
  learning: number;
  new: number;
} {
  let mastered = 0;
  let familiar = 0;
  let learning = 0;
  for (const id of NAMES_OF_ALLAH_WORD_IDS) {
    const mastery = progress.words[id]?.mastery ?? 0;
    if (mastery >= 3) mastered += 1;
    else if (mastery >= 2) familiar += 1;
    else if (mastery >= 1) learning += 1;
  }
  const total = NAMES_OF_ALLAH_WORD_IDS.length;
  return {
    total,
    known: mastered + familiar,
    mastered,
    familiar,
    learning,
    new: total - mastered - familiar - learning,
  };
}
