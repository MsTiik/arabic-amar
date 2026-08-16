import { describe, expect, test } from "vitest";

import {
  DAILY_REVIEW_CAP,
  MAX_INTERVAL_DAYS,
  getDueStudyWordIds,
  scheduleWord,
} from "../../src/lib/progress";
import type { UserProgress, VocabEntry, WordProgress } from "../../src/lib/types";

function word(overrides: Partial<WordProgress> = {}): WordProgress {
  return {
    attempts: 0,
    correct: 0,
    streak: 0,
    mastery: 0,
    lastSeen: new Date(0).toISOString(),
    nextDue: new Date(0).toISOString(),
    intervalDays: 1,
    learningReps: 0,
    ...overrides,
  };
}

function daysUntilDue(w: WordProgress, now: Date): number {
  return Math.round((new Date(w.nextDue).getTime() - now.getTime()) / 86400000);
}

const day = (n: number) => new Date(Date.UTC(2026, 0, 1 + n, 12));

describe("scheduleWord — learning phase", () => {
  test("graduates only after correct answers on 3 distinct days", () => {
    const w = word();
    scheduleWord(w, true, day(0));
    expect(w.learningReps).toBe(1);
    expect(daysUntilDue(w, day(0))).toBe(1);

    scheduleWord(w, true, day(1));
    expect(w.learningReps).toBe(2);
    expect(daysUntilDue(w, day(1))).toBe(2);

    scheduleWord(w, true, day(3));
    expect(w.learningReps).toBe(3);
    expect(w.intervalDays).toBe(4);
    expect(daysUntilDue(w, day(3))).toBe(4);
  });

  test("repeat correct answers on the same day do not advance steps", () => {
    const w = word();
    scheduleWord(w, true, day(0));
    scheduleWord(w, true, day(0));
    scheduleWord(w, true, day(0));
    expect(w.learningReps).toBe(1);
    expect(daysUntilDue(w, day(0))).toBe(1);
  });

  test("a wrong answer makes the word due immediately", () => {
    const w = word();
    scheduleWord(w, true, day(0));
    scheduleWord(w, false, day(1));
    expect(new Date(w.nextDue).getTime()).toBeLessThanOrEqual(day(1).getTime());
    expect(w.learningReps).toBe(1);
  });
});

describe("scheduleWord — review phase", () => {
  test("interval grows ~2x while young, ~2.5x when mature, capped at 90 days", () => {
    const w = word({ learningReps: 3, intervalDays: 4, lastCorrectDay: "2025-12-01" });
    const intervals: number[] = [];
    for (let i = 0; i < 6; i++) {
      scheduleWord(w, true, day(i * 10));
      intervals.push(w.intervalDays!);
    }
    expect(intervals).toEqual([8, 16, 40, 90, 90, 90]);
    expect(Math.max(...intervals)).toBeLessThanOrEqual(MAX_INTERVAL_DAYS);
  });

  test("same-day repeats do not grow the interval", () => {
    const w = word({ learningReps: 3, intervalDays: 8, lastCorrectDay: "2025-12-01" });
    scheduleWord(w, true, day(0));
    expect(w.intervalDays).toBe(16);
    scheduleWord(w, true, day(0));
    expect(w.intervalDays).toBe(16);
  });

  test("a lapse shrinks the interval to ~25% and sends the word back to learning", () => {
    const w = word({ learningReps: 3, intervalDays: 40, lastCorrectDay: "2025-12-01" });
    scheduleWord(w, false, day(0));
    expect(w.intervalDays).toBe(10);
    expect(w.learningReps).toBe(2);
    expect(new Date(w.nextDue).getTime()).toBeLessThanOrEqual(day(0).getTime());

    // One good day re-graduates it at the reduced interval, not the old one.
    scheduleWord(w, true, day(1));
    expect(w.learningReps).toBe(3);
    expect(daysUntilDue(w, day(1))).toBe(10);
  });

  test("migrates legacy records without SRS fields from mastery", () => {
    const legacy: WordProgress = {
      attempts: 10,
      correct: 9,
      streak: 5,
      mastery: 3,
      lastSeen: day(0).toISOString(),
      nextDue: day(0).toISOString(),
    };
    scheduleWord(legacy, true, day(0));
    // mastery 3 → treated as graduated with a 7-day interval, which then grows.
    expect(legacy.learningReps).toBe(3);
    expect(legacy.intervalDays).toBe(14);
  });
});

describe("daily review cap", () => {
  function vocabFixture(id: string): VocabEntry {
    return {
      id,
      arabic: id,
      arabicFolded: id,
      english: id,
      category: "test",
      isExtra: false,
      topicSlugs: ["t"],
      lessonId: "l",
    };
  }

  function progressWith(words: UserProgress["words"], dueSeen = 0): UserProgress {
    return {
      version: 1,
      startedAt: "2026-01-01T00:00:00.000Z",
      streak: { count: 0, lastDay: "" },
      daily: {
        goalCards: 20,
        today: {
          date: new Date().toISOString().slice(0, 10),
          cardsSeen: 0,
          correct: 0,
          dueSeen,
        },
      },
      words,
      topics: {},
    };
  }

  test("caps the due list at DAILY_REVIEW_CAP", () => {
    const vocab: VocabEntry[] = [];
    const words: UserProgress["words"] = {};
    for (let i = 0; i < 150; i++) {
      const id = `w${i}`;
      vocab.push(vocabFixture(id));
      words[id] = word({ attempts: 1, nextDue: new Date(0).toISOString() });
    }
    expect(getDueStudyWordIds(progressWith(words), vocab)).toHaveLength(DAILY_REVIEW_CAP);
  });

  test("reviews done today reduce the remaining cap", () => {
    const vocab: VocabEntry[] = [];
    const words: UserProgress["words"] = {};
    for (let i = 0; i < 150; i++) {
      const id = `w${i}`;
      vocab.push(vocabFixture(id));
      words[id] = word({ attempts: 1, nextDue: new Date(0).toISOString() });
    }
    expect(getDueStudyWordIds(progressWith(words, 70), vocab)).toHaveLength(10);
    expect(getDueStudyWordIds(progressWith(words, 90), vocab)).toHaveLength(0);
  });

  test("still-learning words are served before graduated overdue words", () => {
    const vocab = [vocabFixture("mature"), vocabFixture("young")];
    const words: UserProgress["words"] = {
      mature: word({
        attempts: 9,
        learningReps: 3,
        intervalDays: 16,
        nextDue: new Date(0).toISOString(),
      }),
      young: word({
        attempts: 1,
        learningReps: 1,
        nextDue: new Date(Date.now() - 1000).toISOString(),
      }),
    };
    expect(getDueStudyWordIds(progressWith(words), vocab)).toEqual(["young", "mature"]);
  });
});
