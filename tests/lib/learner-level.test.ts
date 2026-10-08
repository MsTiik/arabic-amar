import { describe, expect, test } from "vitest";

import { getLearnerLevel } from "@/lib/learner-level";

describe("getLearnerLevel", () => {
  test("starts at level 1 with nothing mastered", () => {
    const level = getLearnerLevel(0);
    expect(level.level).toBe(1);
    expect(level.title).toBe("Newcomer");
    expect(level.progress).toBe(0);
    expect(level.remaining).toBe(10);
  });

  test("tracks progress toward the next level", () => {
    const level = getLearnerLevel(30);
    expect(level.level).toBe(3);
    expect(level.next).toBe(50);
    expect(level.progress).toBeCloseTo(5 / 25);
    expect(level.remaining).toBe(20);
  });

  test("caps at the top level", () => {
    const level = getLearnerLevel(1000);
    expect(level.title).toBe("Master");
    expect(level.next).toBeNull();
    expect(level.progress).toBe(1);
    expect(level.remaining).toBe(0);
  });

  test("is monotonic and tolerant of bad input", () => {
    expect(getLearnerLevel(-5).level).toBe(1);
    expect(getLearnerLevel(9.9).level).toBe(1);
    expect(getLearnerLevel(10).level).toBe(2);
    let prev = 0;
    for (let n = 0; n <= 450; n += 5) {
      const l = getLearnerLevel(n).level;
      expect(l).toBeGreaterThanOrEqual(prev);
      prev = l;
    }
  });
});
