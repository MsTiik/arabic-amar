import { describe, expect, test } from "vitest";

import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_ACTION_SENTENCES,
  LEVEL_TWO_CLASSROOM_VOCABULARY,
  LEVEL_TWO_MARKETPLACE_ORDERING,
  LEVEL_TWO_MARKETPLACE_QUESTIONS,
  LEVEL_TWO_MARKETPLACE_READING,
  LEVEL_TWO_MATCHING_PHRASES,
} from "../../src/data/level-two-lessons";
import { VERB_FAMILIES } from "../../src/data/verb-families";
import { LEVEL_TWO_VOCAB_SETS } from "../../src/data/level-two-vocab-sets";
import { validateLevelTwoPublishedContent } from "../../src/lib/level-two-content";

describe("published Level 2 content", () => {
  test("passes the publication accuracy gate", () => {
    expect(validateLevelTwoPublishedContent()).toEqual([]);
  });

  test("keeps every Bayt to Masjid card and example sentence", () => {
    const set = LEVEL_TWO_VOCAB_SETS.find((entry) => entry.slug === "bayt-to-masjid");
    expect(set?.words.map((word) => word.id)).toEqual([
      "bayt", "kabir", "jamil", "shari", "hadiqa", "wasi", "hawla",
      "yartafiu", "shajara", "yatakawwanu", "tabiq", "qarib", "masjid",
    ]);
    expect(set?.words.flatMap((word) => word.sentences)).toHaveLength(28);
    for (const word of set?.words ?? []) expect(word.sentences.length).toBeGreaterThan(0);
  });

  test("keeps the reviewed source sections complete", () => {
    expect(LEVEL_TWO_CLASSROOM_VOCABULARY).toHaveLength(26);
    expect(LEVEL_TWO_MARKETPLACE_QUESTIONS).toHaveLength(11);
    expect(LEVEL_TWO_MARKETPLACE_READING).toHaveLength(4);
    expect(LEVEL_TWO_MARKETPLACE_READING.flatMap((sentence) => sentence.tokens)).toHaveLength(39);
    expect(LEVEL_TWO_MATCHING_PHRASES).toHaveLength(9);
    expect(LEVEL_TWO_MARKETPLACE_ORDERING).toHaveLength(9);
    expect(LEVEL_TWO_ACTIONS).toHaveLength(27);
    expect(LEVEL_TWO_ACTION_SENTENCES).toHaveLength(11);
    expect(VERB_FAMILIES.filter((family) => family.levelTwoOrder !== undefined)).toHaveLength(5);
  });

  test("does not reintroduce the two inaccurate regularised plurals", () => {
    const forms = LEVEL_TWO_CLASSROOM_VOCABULARY.flatMap((entry) => [
      entry.arabic,
      entry.pluralArabic ?? "",
    ]);

    expect(forms).toContain("مَمَاحٍ");
    expect(forms).toContain("مَبَارٍ");
    expect(forms).not.toContain("مِمْحَات");
    expect(forms).not.toContain("مِبْرَايَات");
  });
});
