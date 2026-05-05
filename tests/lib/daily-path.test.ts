import { describe, expect, test } from "vitest";

import { buildDailyPathPlan, getNewWordIds, getNextTopic } from "../../src/lib/progress";
import type { Topic, UserProgress, VocabEntry } from "../../src/lib/types";

function makeProgress(words: UserProgress["words"] = {}): UserProgress {
  return {
    version: 1,
    startedAt: "2026-01-01T00:00:00.000Z",
    streak: {
      count: 0,
      lastDay: "",
      freezesAvailable: 2,
      lastFreezeRegenAt: "2026-01-01",
    },
    daily: {
      goalCards: 20,
      today: { date: "2026-01-01", cardsSeen: 0, correct: 0 },
    },
    words,
    topics: {},
  };
}

function vocabFixture(
  id: string,
  topicSlugs: string[],
  isExtra = false,
): VocabEntry {
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

const topics: Topic[] = [
  {
    slug: "body-parts",
    name: "Body Parts",
    order: 1,
    lessonIds: ["lesson-body-parts"],
    vocabCount: 2,
    ruleCount: 0,
    conversationCount: 0,
  },
  {
    slug: "numbers",
    name: "Numbers",
    order: 2,
    lessonIds: ["lesson-numbers"],
    vocabCount: 1,
    ruleCount: 0,
    conversationCount: 0,
  },
];

describe("daily path planning", () => {
  test("starts new learners with new words and the first unfinished topic", () => {
    const vocab = [
      vocabFixture("head", ["body-parts"]),
      vocabFixture("hand", ["body-parts"]),
      vocabFixture("one", ["numbers"]),
      vocabFixture("bonus", ["body-parts"], true),
    ];
    const progress = makeProgress();

    expect(getNewWordIds(progress, vocab)).toEqual(["head", "hand", "one"]);
    expect(getNextTopic(progress, vocab, topics)?.slug).toBe("body-parts");

    const plan = buildDailyPathPlan(progress, vocab, topics);
    expect(plan.dueCount).toBe(0);
    expect(plan.weakCount).toBe(0);
    expect(plan.newCount).toBe(3);
    expect(plan.nextTopic?.slug).toBe("body-parts");
    expect(plan.steps.map((step) => [step.id, step.count, step.status])).toEqual([
      ["due", 0, "complete"],
      ["weak", 0, "complete"],
      ["new", 3, "ready"],
      ["lesson", 2, "ready"],
    ]);
  });

  test("prioritizes due and weak reviews before new vocabulary", () => {
    const vocab = [
      vocabFixture("head", ["body-parts"]),
      vocabFixture("hand", ["body-parts"]),
      vocabFixture("one", ["numbers"]),
    ];
    const progress = makeProgress({
      head: {
        attempts: 5,
        correct: 5,
        streak: 5,
        mastery: 3,
        lastSeen: "2026-01-01T00:00:00.000Z",
        nextDue: "2099-01-01T00:00:00.000Z",
      },
      hand: {
        attempts: 2,
        correct: 1,
        streak: 0,
        mastery: 0,
        lastSeen: "2026-01-01T00:00:00.000Z",
        nextDue: "2000-01-01T00:00:00.000Z",
      },
    });

    const plan = buildDailyPathPlan(progress, vocab, topics);
    expect(plan.dueCount).toBe(1);
    expect(plan.weakCount).toBe(1);
    expect(plan.newCount).toBe(1);
    expect(plan.nextTopic?.slug).toBe("numbers");
    expect(plan.steps.map((step) => [step.id, step.count, step.status])).toEqual([
      ["due", 1, "ready"],
      ["weak", 1, "ready"],
      ["new", 1, "ready"],
      ["lesson", 1, "ready"],
    ]);
  });
});
