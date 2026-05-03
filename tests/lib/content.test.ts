import { describe, expect, test } from "vitest";

import { getSiteContent, searchVocab } from "../../src/lib/content";
import { foldForSearch } from "../../src/lib/diacritics";

describe("content vocabulary search", () => {
  test("includes rule memorisation demonstratives in the searchable vocabulary", () => {
    const unvowelled = searchVocab({ query: "هذا" });
    const vowelled = searchVocab({ query: "هٰذَا" });
    const transliterated = searchVocab({ query: "hadha" });
    const english = searchVocab({ query: "this" });

    expect(unvowelled).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          arabic: "هٰذَا",
          pronunciation: "hādhā",
          english: "this (masculine)",
        }),
      ]),
    );
    expect(vowelled.map((entry) => entry.arabic)).toContain("هٰذَا");
    expect(transliterated.map((entry) => entry.arabic)).toContain("هٰذَا");
    expect(english.map((entry) => entry.arabic)).toEqual(
      expect.arrayContaining(["هٰذَا", "هٰذِهِ"]),
    );
  });

  test("keeps topic counts aligned after adding derived memorisation words", () => {
    const content = getSiteContent();
    const bodyParts = content.topics.find((topic) => topic.slug === "body-parts");
    const bodyPartsVocab = content.vocab.filter((entry) =>
      entry.topicSlugs.includes("body-parts"),
    );

    expect(bodyParts?.vocabCount).toBe(bodyPartsVocab.length);
    expect(
      bodyPartsVocab.some((entry) => entry.arabicFolded === foldForSearch("هٰذَا")),
    ).toBe(true);
  });
});
