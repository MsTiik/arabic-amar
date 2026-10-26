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

  test("adds the 17 lesson-board families after the class notes, in sheet order", () => {
    const lessonFamilies = VERB_FAMILIES.slice(5, 22);
    expect(lessonFamilies.map((family) => family.id)).toEqual([
      "jalasa", "rasama", "lawwana", "masha", "sahhaha", "saala", "ajaba", "shahada", "ashara",
      "fakkara", "taallama", "ishtara", "hasaba", "wazana", "dafaa", "irtafaa", "takawwana",
    ]);
    expect(new Set(lessonFamilies.map((family) => family.levelTwoLesson))).toEqual(new Set([3, 4, 6, 9]));
    for (const family of lessonFamilies) {
      expect(family.pattern, family.id).toBeTruthy();
      expect(family.examples.length, family.id).toBeGreaterThanOrEqual(3);
      for (const example of family.examples) {
        expect(example.reference).toContain(`lesson ${family.levelTwoLesson}`);
      }
    }
    const byId = (id: string) => VERB_FAMILIES.find((family) => family.id === id);
    expect(byId("masha")?.forms.command.arabic).toBe("اِمْشِ");
    expect(byId("wazana")?.forms.present.arabic).toBe("يَزِنُ");
    expect(byId("saala")?.relatedForms?.map((form) => form.arabic)).toContain("سَلْ");
    expect(byId("ishtara")?.relatedForms?.map((form) => form.arabic)).toContain("اِشْتِرَاء");
    expect(byId("saala")?.opposite?.familyId).toBe("ajaba");
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
