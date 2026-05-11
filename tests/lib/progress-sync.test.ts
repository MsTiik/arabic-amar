import { describe, expect, test } from "vitest";

import { mergeProgress } from "../../src/lib/progress";
import type { UserProgress, WordProgress } from "../../src/lib/types";

function word(overrides: Partial<WordProgress>): WordProgress {
  return {
    attempts: 0,
    correct: 0,
    streak: 0,
    mastery: 0,
    lastSeen: "2026-01-01T00:00:00.000Z",
    nextDue: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function progress(overrides: Partial<UserProgress>): UserProgress {
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
    words: {},
    topics: {},
    ...overrides,
  };
}

describe("mergeProgress", () => {
  test("keeps the newest per-word record when devices changed the same word", () => {
    const local = progress({
      words: {
        head: word({
          attempts: 1,
          correct: 1,
          streak: 1,
          mastery: 1,
          lastSeen: "2026-01-02T00:00:00.000Z",
        }),
      },
    });
    const remote = progress({
      words: {
        head: word({
          attempts: 3,
          correct: 3,
          streak: 3,
          mastery: 2,
          lastSeen: "2026-01-03T00:00:00.000Z",
        }),
      },
    });

    expect(mergeProgress(local, remote).words.head).toEqual(remote.words.head);
  });

  test("preserves unique word and topic progress from both devices", () => {
    const local = progress({
      words: { head: word({ mastery: 1 }) },
      topics: { body: { lastVisited: "2026-01-02T00:00:00.000Z" } },
    });
    const remote = progress({
      words: { hand: word({ mastery: 2 }) },
      topics: { numbers: { lastVisited: "2026-01-03T00:00:00.000Z" } },
    });

    const merged = mergeProgress(local, remote);

    expect(Object.keys(merged.words).sort()).toEqual(["hand", "head"]);
    expect(Object.keys(merged.topics).sort()).toEqual(["body", "numbers"]);
  });

  test("keeps the stronger same-timestamp word instead of downgrading mastery", () => {
    const lastSeen = "2026-01-02T00:00:00.000Z";
    const local = progress({
      words: { head: word({ mastery: 3, lastSeen }) },
    });
    const remote = progress({
      words: { head: word({ mastery: 1, lastSeen }) },
    });

    expect(mergeProgress(local, remote).words.head.mastery).toBe(3);
  });
});
