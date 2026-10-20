import { describe, expect, test } from "vitest";

import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_CLASSROOM_VOCABULARY,
  LEVEL_TWO_MARKETPLACE_READING,
} from "../../src/data/level-two-lessons";
import { VERB_FAMILIES } from "../../src/data/verb-families";
import { getSiteContent } from "../../src/lib/content";
import { foldForSearch } from "../../src/lib/diacritics";
import {
  getLevelTwoVocabularyEntries,
  getVocabularyBankContent,
} from "../../src/lib/vocabulary-bank";

describe("Level 2 vocabulary bank coverage", () => {
  const levelTwoEntries = getLevelTwoVocabularyEntries();
  const bank = getVocabularyBankContent(getSiteContent());

  function expectArabicInLevelTwoBank(arabic: string) {
    const folded = foldForSearch(arabic);
    expect(
      levelTwoEntries.some((entry) =>
        entry.arabicFolded.split(/\s*\/\s*/).includes(folded),
      ),
      `Expected ${arabic} in the derived Level 2 vocabulary`,
    ).toBe(true);
    expect(
      bank.vocab.some((entry) =>
        entry.arabicFolded.split(/\s*\/\s*/).includes(folded),
      ),
      `Expected ${arabic} in the complete vocabulary bank`,
    ).toBe(true);
  }

  test("includes every reviewed classroom singular and plural", () => {
    for (const entry of LEVEL_TWO_CLASSROOM_VOCABULARY) {
      expectArabicInLevelTwoBank(entry.arabic);
      if (entry.pluralArabic) expectArabicInLevelTwoBank(entry.pluralArabic);
    }
  });

  test("includes every present-tense action", () => {
    for (const action of LEVEL_TWO_ACTIONS) {
      expectArabicInLevelTwoBank(action.arabic);
    }
  });

  test("includes every marketplace reading token", () => {
    for (const token of LEVEL_TWO_MARKETPLACE_READING.flatMap(
      (sentence) => sentence.tokens,
    )) {
      expectArabicInLevelTwoBank(token.arabic);
    }
  });

  test("includes the four core forms from every Level 2 verb family", () => {
    for (const family of VERB_FAMILIES.filter(
      (entry) => entry.levelTwoOrder !== undefined,
    )) {
      for (const form of Object.values(family.forms)) {
        expectArabicInLevelTwoBank(form.arabic);
      }
    }
  });

  test("finds he takes by English and transliteration", () => {
    const takes = bank.vocab.find((entry) => entry.english === "he takes");

    expect(takes?.arabic).toBe("يَأْخُذُ");
    expect(foldForSearch(takes?.pronunciation ?? "")).toContain("yakhudhu");
  });

  test("preserves Level 2 meanings when the same Arabic appears in an earlier lesson", () => {
    expect(
      bank.vocab.some(
        (entry) => entry.arabic === "كَتَبَ" && entry.english === "he wrote",
      ),
    ).toBe(true);
  });
});
