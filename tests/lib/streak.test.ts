import { describe, expect, test } from "vitest";

import { MAX_FREEZES, recordStreakOn, regenFreezesOn } from "../../src/lib/progress";
import type { UserProgress } from "../../src/lib/types";

function makeProgress(overrides: Partial<UserProgress["streak"]> = {}): UserProgress {
  return {
    version: 1,
    startedAt: "2025-01-01T00:00:00.000Z",
    streak: {
      count: 0,
      lastDay: "",
      freezesAvailable: MAX_FREEZES,
      lastFreezeRegenAt: "2025-01-01",
      ...overrides,
    },
    daily: {
      goalCards: 20,
      today: { date: "2025-01-01", cardsSeen: 0, correct: 0 },
    },
    words: {},
    topics: {},
  };
}

describe("recordStreakOn", () => {
  test("first ever practice starts streak at 1", () => {
    const p = makeProgress({ count: 0, lastDay: "" });
    recordStreakOn(p, "2025-02-10");
    expect(p.streak.count).toBe(1);
    expect(p.streak.lastDay).toBe("2025-02-10");
  });

  test("same-day practice does nothing", () => {
    const p = makeProgress({ count: 5, lastDay: "2025-02-10" });
    recordStreakOn(p, "2025-02-10");
    expect(p.streak.count).toBe(5);
  });

  test("consecutive day increments streak", () => {
    const p = makeProgress({ count: 5, lastDay: "2025-02-10" });
    recordStreakOn(p, "2025-02-11");
    expect(p.streak.count).toBe(6);
    expect(p.streak.lastDay).toBe("2025-02-11");
  });

  test("missing one day with a freeze available preserves streak and consumes freeze", () => {
    const p = makeProgress({
      count: 5,
      lastDay: "2025-02-10",
      freezesAvailable: 2,
    });
    recordStreakOn(p, "2025-02-12"); // gap = 2 (missed Feb 11)
    expect(p.streak.count).toBe(6);
    expect(p.streak.freezesAvailable).toBe(1);
    expect(p.streak.lastFreezeConsumedAt).toBe("2025-02-12");
    expect(p.streak.lastDay).toBe("2025-02-12");
  });

  test("missing one day with no freezes resets streak to 1", () => {
    const p = makeProgress({
      count: 5,
      lastDay: "2025-02-10",
      freezesAvailable: 0,
      // Recent regen so this run doesn't grant a freeze before the gap check.
      lastFreezeRegenAt: "2025-02-10",
    });
    recordStreakOn(p, "2025-02-12");
    expect(p.streak.count).toBe(1);
    expect(p.streak.freezesAvailable).toBe(0);
    expect(p.streak.lastFreezeConsumedAt).toBeUndefined();
  });

  test("missing two or more days resets streak even with freezes available", () => {
    const p = makeProgress({
      count: 5,
      lastDay: "2025-02-10",
      freezesAvailable: 2,
    });
    recordStreakOn(p, "2025-02-13"); // gap = 3
    expect(p.streak.count).toBe(1);
    // We deliberately don't burn freezes on multi-day absences.
    expect(p.streak.freezesAvailable).toBe(2);
  });
});

describe("regenFreezesOn", () => {
  test("does nothing before regen window has elapsed", () => {
    const p = makeProgress({
      freezesAvailable: 0,
      lastFreezeRegenAt: "2025-02-01",
    });
    regenFreezesOn(p, "2025-02-06"); // 5 days
    expect(p.streak.freezesAvailable).toBe(0);
  });

  test("grants 1 freeze after exactly 7 days", () => {
    const p = makeProgress({
      freezesAvailable: 0,
      lastFreezeRegenAt: "2025-02-01",
    });
    regenFreezesOn(p, "2025-02-08");
    expect(p.streak.freezesAvailable).toBe(1);
    expect(p.streak.lastFreezeRegenAt).toBe("2025-02-08");
  });

  test("grants multiple freezes for long absences but caps at MAX_FREEZES", () => {
    const p = makeProgress({
      freezesAvailable: 0,
      lastFreezeRegenAt: "2025-01-01",
    });
    regenFreezesOn(p, "2025-04-01"); // ~90 days
    expect(p.streak.freezesAvailable).toBe(MAX_FREEZES);
  });

  test("does not exceed MAX_FREEZES when budget is already full", () => {
    const p = makeProgress({
      freezesAvailable: MAX_FREEZES,
      lastFreezeRegenAt: "2025-01-01",
    });
    regenFreezesOn(p, "2025-02-01");
    expect(p.streak.freezesAvailable).toBe(MAX_FREEZES);
  });
});
