import { describe, expect, test } from "vitest";

import { getCourseProgress } from "../../src/lib/course-progress";
import type { Mastery, Topic, UserProgress, VocabEntry, WordProgress } from "../../src/lib/types";

function makeProgress(words: UserProgress["words"] = {}): UserProgress {
  return {
    version: 1,
    startedAt: "2026-01-01T00:00:00.000Z",
    streak: { count: 0, lastDay: "", freezesAvailable: 2, lastFreezeRegenAt: "2026-01-01" },
    daily: { goalCards: 20, today: { date: "2026-01-01", cardsSeen: 0, correct: 0 } },
    words,
    topics: {},
  };
}

function word(mastery: Mastery): WordProgress {
  return {
    attempts: 5,
    correct: mastery,
    streak: mastery,
    mastery,
    lastSeen: "2026-01-01T00:00:00.000Z",
    nextDue: "2026-01-02T00:00:00.000Z",
  };
}

function vocab(id: string, topicSlugs: string[], isExtra = false): VocabEntry {
  return {
    id,
    arabic: id,
    arabicFolded: id,
    pronunciation: id,
    english: id,
    category: "test",
    isExtra,
    topicSlugs,
    lessonId: "lesson-test",
  };
}

function topic(slug: string, name: string, order: number): Topic {
  return { slug, name, order, lessonIds: [], vocabCount: 0, ruleCount: 0, conversationCount: 0 };
}

const topics = [topic("numbers", "Numbers", 2), topic("body-parts", "Body Parts", 1)];
const bank = [
  vocab("head", ["body-parts"]),
  vocab("hand", ["body-parts"]),
  vocab("one", ["numbers"]),
  vocab("bonus", ["numbers"], true),
];

describe("getCourseProgress", () => {
  test("fresh learner has nothing mastered and starts at the first lesson", () => {
    const c = getCourseProgress(makeProgress(), bank, topics);
    expect(c.totalWords).toBe(3);
    expect(c.masteredWords).toBe(0);
    expect(c.masteredFraction).toBe(0);
    expect(c.lessonsTotal).toBe(2);
    expect(c.lessonsCovered).toBe(0);
    expect(c.nextLesson).toEqual({ slug: "body-parts", name: "Body Parts", newCount: 2 });
  });

  test("counts mastered words and covered lessons from word progress", () => {
    const c = getCourseProgress(
      makeProgress({ head: word(3), hand: word(1), one: word(3) }),
      bank,
      topics,
    );
    expect(c.masteredWords).toBe(2);
    expect(c.masteredFraction).toBeCloseTo(2 / 3);
    expect(c.lessonsCovered).toBe(2);
    expect(c.nextLesson).toBeNull();
  });

  test("next lesson is the earliest with uncovered words and ignores extras", () => {
    const c = getCourseProgress(makeProgress({ head: word(2), hand: word(2) }), bank, topics);
    expect(c.lessonsCovered).toBe(1);
    expect(c.nextLesson).toEqual({ slug: "numbers", name: "Numbers", newCount: 1 });
  });

  test("handles an empty bank", () => {
    const c = getCourseProgress(makeProgress(), [], []);
    expect(c.masteredFraction).toBe(0);
    expect(c.nextLesson).toBeNull();
  });
});
