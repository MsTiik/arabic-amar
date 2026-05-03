"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Mastery, UserProgress, WordProgress } from "./types";

const STORAGE_KEY = "arabic-amar:progress:v1";
const DEFAULT_DAILY_GOAL = 20;

/** Max number of streak freezes the user can have banked at once. */
export const MAX_FREEZES = 2;
/** Freeze refills every N days of activity (capped at MAX_FREEZES). */
const FREEZE_REGEN_DAYS = 7;

function isoDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function todayIso(): string {
  return isoDate(new Date());
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function defaultProgress(): UserProgress {
  const now = new Date().toISOString();
  const today = todayIso();
  return {
    version: 1,
    startedAt: now,
    streak: {
      count: 0,
      lastDay: "",
      freezesAvailable: MAX_FREEZES,
      lastFreezeRegenAt: today,
    },
    daily: {
      goalCards: DEFAULT_DAILY_GOAL,
      today: { date: today, cardsSeen: 0, correct: 0 },
    },
    words: {},
    topics: {},
  };
}

function loadFromStorage(): UserProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as UserProgress;
    if (parsed.version !== 1) return defaultProgress();
    // Roll over the per-day counter when a new day begins
    if (parsed.daily.today.date !== todayIso()) {
      parsed.daily.today = { date: todayIso(), cardsSeen: 0, correct: 0 };
    }
    // Migrate older v1 records that pre-date the streak-freeze fields.
    if (parsed.streak.freezesAvailable === undefined) {
      parsed.streak.freezesAvailable = MAX_FREEZES;
    }
    if (!parsed.streak.lastFreezeRegenAt) {
      parsed.streak.lastFreezeRegenAt = todayIso();
    }
    return parsed;
  } catch {
    return defaultProgress();
  }
}

function saveToStorage(p: UserProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

type Listener = () => void;
const listeners = new Set<Listener>();
let cached: UserProgress | null = null;

function getSnapshot(): UserProgress {
  if (cached) return cached;
  cached = loadFromStorage();
  return cached;
}

// `useSyncExternalStore` requires `getServerSnapshot` to return a stable
// reference; returning a fresh object each call triggers the
// "getServerSnapshot should be cached" infinite-loop warning and causes
// React to re-render forever during hydration.
let serverSnapshot: UserProgress | null = null;
function getServerSnapshot(): UserProgress {
  if (!serverSnapshot) serverSnapshot = defaultProgress();
  return serverSnapshot;
}

function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function update(mutator: (p: UserProgress) => UserProgress | void): void {
  const current = getSnapshot();
  const draft: UserProgress = JSON.parse(JSON.stringify(current));
  const result = mutator(draft);
  const next = result ?? draft;
  cached = next;
  saveToStorage(next);
  for (const l of listeners) l();
}

export function useProgress(): UserProgress {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Listen to cross-tab `storage` events so two open tabs stay in sync.
 * Mounted from the root layout; safe to be a no-op on the server.
 */
export function useProgressStorageSync(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      cached = loadFromStorage();
      for (const l of listeners) l();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
}

function masteryFromProgress(streak: number, attempts: number): Mastery {
  if (attempts === 0) return 0;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  if (streak >= 1) return 1;
  return 0;
}

function defaultWord(): WordProgress {
  return {
    attempts: 0,
    correct: 0,
    streak: 0,
    mastery: 0,
    lastSeen: new Date(0).toISOString(),
    nextDue: new Date().toISOString(),
  };
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return isoDate(d);
}

/** Refill freeze budget by 1 for every FREEZE_REGEN_DAYS that have elapsed
 *  since `lastFreezeRegenAt`, capped at MAX_FREEZES. The regen clock always
 *  advances by `grants * FREEZE_REGEN_DAYS` days even if the budget was
 *  full and no freezes were actually added — otherwise a user at MAX_FREEZES
 *  would build up "hidden" credit and instantly refill the moment they
 *  consumed a freeze, defeating the 7-day cooldown.
 *
 *  Exported for unit tests; callers in this module use `recordStreakOn`. */
export function regenFreezesOn(p: UserProgress, today: string): void {
  const last = p.streak.lastFreezeRegenAt || today;
  const elapsed = Math.max(0, daysBetween(last, today));
  if (elapsed < FREEZE_REGEN_DAYS) return;
  const grants = Math.floor(elapsed / FREEZE_REGEN_DAYS);
  const current = p.streak.freezesAvailable ?? 0;
  const next = Math.min(MAX_FREEZES, current + grants);
  p.streak.freezesAvailable = next;
  p.streak.lastFreezeRegenAt = addDaysIso(last, grants * FREEZE_REGEN_DAYS);
}

/** Pure (modulo mutation of `p`) streak update for an arbitrary "today".
 *  Exported for unit tests. The runtime caller passes `todayIso()`. */
export function recordStreakOn(p: UserProgress, today: string): void {
  if (p.streak.lastDay === today) return;

  regenFreezesOn(p, today);

  if (!p.streak.lastDay) {
    p.streak.count = 1;
    p.streak.lastDay = today;
    return;
  }
  const gap = daysBetween(p.streak.lastDay, today);
  if (gap === 1) {
    p.streak.count += 1;
    p.streak.lastDay = today;
    return;
  }
  if (gap > 1) {
    // A freeze rescues a single missed day. We don't auto-burn multiple
    // freezes for longer absences — that defeats the "you need to keep
    // showing up" intent of streaks.
    const haveFreeze = (p.streak.freezesAvailable ?? 0) > 0;
    if (gap === 2 && haveFreeze) {
      p.streak.freezesAvailable = (p.streak.freezesAvailable ?? 0) - 1;
      p.streak.lastFreezeConsumedAt = today;
      p.streak.count += 1;
      p.streak.lastDay = today;
      return;
    }
    p.streak.count = 1;
    p.streak.lastDay = today;
  }
}

function recordStreak(p: UserProgress): void {
  recordStreakOn(p, todayIso());
}

export const progressActions = {
  /** Mark that the user attempted a card. Pass `correct=true` for a correct answer. */
  recordAttempt(wordId: string, correct: boolean): void {
    update((p) => {
      const today = todayIso();
      if (p.daily.today.date !== today) {
        p.daily.today = { date: today, cardsSeen: 0, correct: 0 };
      }
      p.daily.today.cardsSeen += 1;
      if (correct) p.daily.today.correct += 1;

      const word = p.words[wordId] ?? defaultWord();
      word.attempts += 1;
      if (correct) {
        word.correct += 1;
        word.streak += 1;
      } else {
        word.streak = 0;
      }
      word.lastSeen = new Date().toISOString();
      // Lightweight SRS-shaped scheduling: 0 = today, 1 = +1 day, 2 = +3 days, 3 = +7 days.
      const masteryNext = masteryFromProgress(word.streak, word.attempts);
      word.mastery = masteryNext;
      const dueOffsetDays = correct ? [0, 1, 3, 7][masteryNext] : 0;
      word.nextDue = new Date(Date.now() + dueOffsetDays * 86400000).toISOString();
      p.words[wordId] = word;

      // Streak counter only ticks once per day, when at least one attempt is made.
      recordStreak(p);
    });
  },

  setDailyGoal(goal: number): void {
    update((p) => {
      p.daily.goalCards = Math.max(1, Math.min(200, Math.round(goal)));
    });
  },

  visitTopic(slug: string): void {
    update((p) => {
      p.topics[slug] = { lastVisited: new Date().toISOString() };
    });
  },

  reset(): void {
    update(() => defaultProgress());
  },
};

/** Compute the mastery distribution for a set of words. */
export function summarizeMastery(
  progress: UserProgress,
  wordIds: string[],
): { total: number; mastered: number; familiar: number; learning: number; new: number } {
  let mastered = 0,
    familiar = 0,
    learning = 0,
    fresh = 0;
  for (const id of wordIds) {
    const m = progress.words[id]?.mastery ?? 0;
    if (m === 3) mastered++;
    else if (m === 2) familiar++;
    else if (m === 1) learning++;
    else fresh++;
  }
  return { total: wordIds.length, mastered, familiar, learning, new: fresh };
}

export function topicProgressFraction(
  progress: UserProgress,
  wordIds: string[],
): number {
  if (wordIds.length === 0) return 0;
  let score = 0;
  for (const id of wordIds) {
    const m = progress.words[id]?.mastery ?? 0;
    score += m / 3;
  }
  return Math.min(1, score / wordIds.length);
}

/** Words whose `nextDue` is at or before now, plus any words ever answered incorrectly more than corrected. */
export function getDueWords(
  progress: UserProgress,
  allWordIds: string[],
): string[] {
  const now = Date.now();
  return allWordIds.filter((id) => {
    const w = progress.words[id];
    if (!w) return true; // never seen → always due
    if (new Date(w.nextDue).getTime() <= now) return true;
    return false;
  });
}

export function getMistakeWords(progress: UserProgress, allWordIds: string[]): string[] {
  return allWordIds.filter((id) => {
    const w = progress.words[id];
    if (!w) return false;
    return w.attempts > 0 && w.streak === 0 && w.mastery < 2;
  });
}
