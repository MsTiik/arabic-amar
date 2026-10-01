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
        if (example.kind === "class") {
          expect(example.reference).toMatch(/^AMAR Level 2/);
          expect(example.url).toBeUndefined();
        } else {
          expect(example.url).toMatch(/^https:\/\//);
        }
      }
    }
  });

  test("includes the requested courtesy and remaining families", () => {
    expect(VERB_FAMILIES.some((family) => family.id === "tafaddala")).toBe(true);
    expect(VERB_FAMILIES.some((family) => family.id === "baqiya")).toBe(true);
  });

  test("places the five Level 2 class-note families first and preserves related forms", () => {
    const levelTwoFamilies = VERB_FAMILIES.slice(0, 5);
    expect(levelTwoFamilies.map((family) => family.id)).toEqual([
      "kataba",
      "qaraa",
      "sharaha",
      "fahima",
      "waqafa",
    ]);
    expect(levelTwoFamilies.map((family) => family.levelTwoSourcePage)).toEqual([
      16, 17, 18, 19, 20,
    ]);
    expect(levelTwoFamilies.every((family) => family.levelTwoReviewStatus === "confirmed")).toBe(true);
    expect(VERB_FAMILIES.find((family) => family.id === "qaraa")?.relatedForms).toEqual(
      expect.arrayContaining([expect.objectContaining({ arabic: "قَارِئ" })]),
    );
    expect(VERB_FAMILIES.find((family) => family.id === "waqafa")?.relatedForms).toEqual(
      expect.arrayContaining([expect.objectContaining({ arabic: "وَاقِف" })]),
    );
    expect(
      Object.fromEntries(levelTwoFamilies.map((family) => [family.id, family.examples.length])),
    ).toEqual({ kataba: 5, qaraa: 5, sharaha: 4, fahima: 4, waqafa: 5 });
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
