import { describe, expect, test } from "vitest";

import {
  VERB_FAMILIES,
  VERB_FORM_KEYS,
  type VerbFormKey,
} from "../../src/data/verb-families";
import {
  isVerbSortCorrect,
  shuffledVerbFormKeys,
} from "../../src/lib/verb-families";

describe("verb families", () => {
  test("the starter deck has complete four-part families", () => {
    expect(VERB_FAMILIES.length).toBeGreaterThanOrEqual(12);

    for (const family of VERB_FAMILIES) {
      expect(family.id).toBeTruthy();
      expect(family.root).toMatch(/.-.-./);
      for (const key of VERB_FORM_KEYS) {
        expect(family.forms[key].arabic).toBeTruthy();
        expect(family.forms[key].transliteration).toBeTruthy();
        expect(family.forms[key].english).toBeTruthy();
      }
      expect(family.examples.length).toBeGreaterThan(0);
      for (const example of family.examples) {
        expect(example.arabic).toContain(example.focusArabic);
        expect(example.transliteration).toBeTruthy();
        expect(example.english).toBeTruthy();
        expect(example.url).toMatch(/^https:\/\//);
      }
    }
  });

  test("includes the requested courtesy and remaining families", () => {
    expect(VERB_FAMILIES.some((family) => family.id === "tafaddala")).toBe(true);
    expect(VERB_FAMILIES.some((family) => family.id === "baqiya")).toBe(true);
  });

  test("shuffles every form exactly once and stays deterministic", () => {
    const first = shuffledVerbFormKeys(31);
    expect(first).toEqual(shuffledVerbFormKeys(31));
    expect(new Set(first)).toEqual(new Set(VERB_FORM_KEYS));
    expect(first).not.toEqual(VERB_FORM_KEYS);
  });

  test("accepts only forms placed in their matching columns", () => {
    const correct = Object.fromEntries(
      VERB_FORM_KEYS.map((key) => [key, key]),
    ) as Record<VerbFormKey, VerbFormKey>;
    expect(isVerbSortCorrect(correct)).toBe(true);
    expect(isVerbSortCorrect({ ...correct, past: "present" })).toBe(false);
    expect(isVerbSortCorrect({ past: "past" })).toBe(false);
  });
});
