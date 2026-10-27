"use client";

import { useSyncExternalStore } from "react";

export const READING_RESULTS_STORAGE_KEY = "arabic-amar:reading-results:v1";

export type ReadingAnswerMark = "right" | "wrong";

/** Self-marked exercise answers per reading: `{ [readingSlug]: { [questionId]: mark } }`. */
export type ReadingResults = Record<string, Record<string, ReadingAnswerMark>>;

const EMPTY: ReadingResults = {};

function isMark(value: unknown): value is ReadingAnswerMark {
  return value === "right" || value === "wrong";
}

export function parseReadingResults(raw: string | null): ReadingResults {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return EMPTY;
    const results: ReadingResults = {};
    for (const [slug, marks] of Object.entries(parsed)) {
      if (!marks || typeof marks !== "object" || Array.isArray(marks)) continue;
      const clean: Record<string, ReadingAnswerMark> = {};
      for (const [id, mark] of Object.entries(marks)) if (isMark(mark)) clean[id] = mark;
      results[slug] = clean;
    }
    return results;
  } catch {
    return EMPTY;
  }
}

export function scoreReading(
  marks: Record<string, ReadingAnswerMark> | undefined,
  questionIds: readonly string[],
): { right: number; answered: number; total: number } {
  let right = 0;
  let answered = 0;
  for (const id of questionIds) {
    const mark = marks?.[id];
    if (!mark) continue;
    answered++;
    if (mark === "right") right++;
  }
  return { right, answered, total: questionIds.length };
}

const listeners = new Set<() => void>();
let cached: ReadingResults | null = null;

function getSnapshot(): ReadingResults {
  if (cached) return cached;
  try {
    cached = parseReadingResults(window.localStorage.getItem(READING_RESULTS_STORAGE_KEY));
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function getServerSnapshot(): ReadingResults {
  return EMPTY;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== READING_RESULTS_STORAGE_KEY) return;
    cached = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function save(next: ReadingResults): void {
  cached = next;
  try {
    window.localStorage.setItem(READING_RESULTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* localStorage may be unavailable (private mode, etc.) */
  }
  for (const listener of listeners) listener();
}

export const readingResultsActions = {
  mark(slug: string, questionId: string, mark: ReadingAnswerMark | null): void {
    const current = getSnapshot();
    const marks = { ...current[slug] };
    if (mark) marks[questionId] = mark;
    else delete marks[questionId];
    save({ ...current, [slug]: marks });
  },
  reset(slug: string): void {
    const current = getSnapshot();
    const next = { ...current };
    delete next[slug];
    save(next);
  },
};

export function useReadingResults(): ReadingResults {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
