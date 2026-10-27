import { describe, expect, test } from "vitest";

import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_ACTION_SENTENCES,
  LEVEL_TWO_CLASSROOM_VOCABULARY,
  LEVEL_TWO_KHALIDS_HOUSE,
  LEVEL_TWO_MARKETPLACE_ORDERING,
  LEVEL_TWO_MARKETPLACE_QUESTIONS,
  LEVEL_TWO_MARKETPLACE_READING,
  LEVEL_TWO_MATCHING_PHRASES,
} from "../../src/data/level-two-lessons";
import { VERB_FAMILIES } from "../../src/data/verb-families";
import { LEVEL_TWO_VOCAB_SETS, LEVEL_TWO_VOCAB_THEMES } from "../../src/data/level-two-vocab-sets";
import { validateLevelTwoPublishedContent } from "../../src/lib/level-two-content";

describe("published Level 2 content", () => {
  test("passes the publication accuracy gate", () => {
    expect(validateLevelTwoPublishedContent()).toEqual([]);
  });

  test("groups Bayt to Masjid under the Home and Places theme", () => {
    expect(LEVEL_TWO_VOCAB_THEMES.map((theme) => theme.slug)).toEqual(["home-and-places"]);
    expect(LEVEL_TWO_VOCAB_THEMES[0].sets.map((set) => set.slug)).toEqual(["bayt-to-masjid"]);
  });

  test("keeps every Bayt to Masjid card and example sentence", () => {
    const set = LEVEL_TWO_VOCAB_SETS.find((entry) => entry.slug === "bayt-to-masjid");
    expect(set?.words.map((word) => word.id)).toEqual([
      "bayt", "kabir", "jamil", "shari", "hadiqa", "wasi", "hawla",
      "yartafiu", "shajara", "yatakawwanu", "tabiq", "qarib", "masjid",
    ]);
    expect(set?.words.flatMap((word) => word.sentences)).toHaveLength(33);
    for (const word of set?.words ?? []) expect(word.sentences.length).toBeGreaterThan(0);
  });

  test("keeps the reviewed source sections complete", () => {
    expect(LEVEL_TWO_CLASSROOM_VOCABULARY).toHaveLength(26);
    expect(LEVEL_TWO_MARKETPLACE_QUESTIONS).toHaveLength(11);
    expect(LEVEL_TWO_MARKETPLACE_READING).toHaveLength(4);
    expect(LEVEL_TWO_MARKETPLACE_READING.flatMap((sentence) => sentence.tokens)).toHaveLength(39);
    expect(LEVEL_TWO_KHALIDS_HOUSE.sentences).toHaveLength(9);
    expect(LEVEL_TWO_KHALIDS_HOUSE.questions).toHaveLength(8);
    const sentenceIds = LEVEL_TWO_KHALIDS_HOUSE.sentences.map((sentence) => sentence.id);
    for (const question of LEVEL_TWO_KHALIDS_HOUSE.questions) {
      expect(sentenceIds).toContain(question.sentenceId);
    }
    expect(LEVEL_TWO_MATCHING_PHRASES).toHaveLength(9);
    expect(LEVEL_TWO_MARKETPLACE_ORDERING).toHaveLength(9);
    expect(LEVEL_TWO_ACTIONS).toHaveLength(27);
    expect(LEVEL_TWO_ACTION_SENTENCES).toHaveLength(11);
    expect(VERB_FAMILIES.filter((family) => family.levelTwoSourcePage !== undefined)).toHaveLength(5);
    expect(VERB_FAMILIES.filter((family) => family.levelTwoLesson !== undefined)).toHaveLength(17);
    expect(VERB_FAMILIES.filter((family) => family.levelTwoOrder !== undefined)).toHaveLength(22);
  });

  test("adds the teacher’s five near-and-far examples to the qarīb card", () => {
    const qarib = LEVEL_TWO_VOCAB_SETS.flatMap((set) => set.words).find((word) => word.id === "qarib");
    expect(qarib?.sentences.slice(-5).map((sentence) => sentence.english)).toEqual([
      "The pen is near the book and far from the ruler.",
      "The teacher is near the board and far from the students.",
      "The car is near the tree and far from the house.",
      "Pakistan is near Iran and far from Egypt.",
      "The Muslim is close to Allah and far from Satan.",
    ]);
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
