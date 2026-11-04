import type { ContentReviewStatus } from "@/data/level-two-lessons";
import { LEVEL_TWO_LESSON_13 } from "@/data/level-two-lesson-13";

/** An Arabic word, phrase or sentence with its transliteration and English. */
export interface NoteItem {
  arabic: string;
  transliteration: string;
  english: string;
}

export interface NoteDialogueLine extends NoteItem {
  speaker?: string;
  /** In a complete-the-dialogue exercise, a line the learner has to supply. */
  gap?: boolean;
}

/** A table cell is either English text or an Arabic item. */
export type NoteCell = string | NoteItem;

/**
 * Prose may include Arabic inline (e.g. "add ـَانِ to the end"); the page
 * sets each Arabic run in the Arabic font automatically.
 */
export type NoteBlock =
  | { kind: "dialogue"; id: string; title?: string; lines: readonly NoteDialogueLine[]; numbered?: boolean }
  | { kind: "table"; id: string; title?: string; columns: readonly string[]; rows: readonly (readonly NoteCell[])[] }
  | { kind: "bullets"; id: string; title?: string; items: readonly string[]; ordered?: boolean }
  | { kind: "examples"; id: string; title?: string; items: readonly NoteItem[] }
  | {
      kind: "quiz";
      id: string;
      title?: string;
      items: readonly { id: string; question: string; answer: NoteItem | string; note?: string }[];
    };

export interface NoteSection {
  id: string;
  /** Short label for the jump menu. */
  label: string;
  part: number;
  title: string;
  /** The sheet's own Arabic heading, glossed for the vocabulary bank. */
  heading?: NoteItem;
  intro?: string;
  blocks: readonly NoteBlock[];
}

export interface LevelTwoLessonNotes {
  slug: string;
  lesson: number;
  title: string;
  shortTitle: string;
  titleArabic: string;
  description: string;
  source: string;
  reviewStatus: ContentReviewStatus;
  sections: readonly NoteSection[];
  /**
   * Other words used inside the lesson's phrases and sentences, glossed on
   * their own so every word can be looked up in the vocabulary bank.
   */
  sentenceWords: readonly NoteItem[];
}

export const LEVEL_TWO_LESSON_NOTES: readonly LevelTwoLessonNotes[] = [LEVEL_TWO_LESSON_13];

export function getLevelTwoLessonNotes(slug: string): LevelTwoLessonNotes | undefined {
  return LEVEL_TWO_LESSON_NOTES.find((notes) => notes.slug === slug);
}

export function isNoteItem(cell: NoteCell | undefined): cell is NoteItem {
  return typeof cell === "object" && cell !== null;
}

/** Every Arabic item the notes show, labelled by where it appears. */
export function lessonNoteItems(notes: LevelTwoLessonNotes): { item: NoteItem; where: string }[] {
  const items: { item: NoteItem; where: string }[] = [];
  for (const section of notes.sections) {
    if (section.heading) items.push({ item: section.heading, where: section.label });
    for (const block of section.blocks) {
      const where = block.title ? `${section.label} · ${block.title}` : section.label;
      if (block.kind === "dialogue") for (const line of block.lines) items.push({ item: line, where });
      if (block.kind === "examples") for (const item of block.items) items.push({ item, where });
      if (block.kind === "table") {
        for (const row of block.rows) for (const cell of row) if (isNoteItem(cell)) items.push({ item: cell, where });
      }
      if (block.kind === "quiz") {
        for (const question of block.items) if (isNoteItem(question.answer)) items.push({ item: question.answer, where });
      }
    }
  }
  for (const item of notes.sentenceWords) items.push({ item, where: "Words in the sentences" });
  return items;
}

/** Every piece of English prose in the notes, which may carry inline Arabic. */
export function lessonNoteProse(notes: LevelTwoLessonNotes): string[] {
  const prose = [notes.description];
  for (const section of notes.sections) {
    if (section.intro) prose.push(section.intro);
    for (const block of section.blocks) {
      if (block.title) prose.push(block.title);
      if (block.kind === "bullets") prose.push(...block.items);
      if (block.kind === "table") {
        prose.push(...block.columns);
        for (const row of block.rows) for (const cell of row) if (typeof cell === "string") prose.push(cell);
      }
      if (block.kind === "quiz") {
        for (const question of block.items) {
          prose.push(question.question);
          if (question.note) prose.push(question.note);
          if (typeof question.answer === "string") prose.push(question.answer);
        }
      }
    }
  }
  return prose;
}

const ARABIC_WORD = /[ء-ي٠-٩ٱ-ۓـً-ٰٟ]+/g;

/** The distinct Arabic words in a string, without punctuation. */
export function arabicWords(text: string): string[] {
  return (text.match(ARABIC_WORD) ?? []).filter((word) => /[ء-يٱ-ۓ]/.test(word));
}
