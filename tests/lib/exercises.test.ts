import { describe, expect, test } from "vitest";
import {
  checkFillBlankAnswer,
  checkOrderingAnswer,
  normalizeAnswers,
} from "../../src/lib/exercises";

describe("normalizeAnswers", () => {
  test("strips macrons and case markers", () => {
    const got = normalizeAnswers("raʾsun");
    expect(got).toContain("rasun");
    expect(got).toContain("ras");
  });

  test("strips the ḥ/ṣ/ḍ/ṭ/ẓ Arabic transliteration markers", () => {
    const got = normalizeAnswers("ḥājibun");
    expect(got).toContain("hajibun");
    expect(got).toContain("hajib");
  });
});

describe("checkFillBlankAnswer", () => {
  const accepted = normalizeAnswers("raʾsun");

  test("accepts the original spelling", () => {
    expect(checkFillBlankAnswer("raʾsun", accepted)).toBe(true);
  });

  test("accepts the simplified spelling", () => {
    expect(checkFillBlankAnswer("rasun", accepted)).toBe(true);
    expect(checkFillBlankAnswer("ras", accepted)).toBe(true);
  });

  test("rejects nonsense", () => {
    expect(checkFillBlankAnswer("hand", accepted)).toBe(false);
  });
});

describe("checkOrderingAnswer", () => {
  test("accepts an exact match", () => {
    expect(checkOrderingAnswer(["a", "b", "c"], ["a", "b", "c"])).toBe(true);
  });
  test("rejects a swap", () => {
    expect(checkOrderingAnswer(["a", "c", "b"], ["a", "b", "c"])).toBe(false);
  });
});
