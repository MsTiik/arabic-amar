import { describe, expect, test } from "vitest";

import { getSiteContent, searchVocab } from "../../src/lib/content";
import { foldForSearch } from "../../src/lib/diacritics";

describe("content vocabulary search", () => {
  test("includes demonstratives in the searchable vocabulary", () => {
    const unvowelled = searchVocab({ query: "هذا" });
    const vowelled = searchVocab({ query: "هٰذَا" });
    const transliterated = searchVocab({ query: "hadha" });
    const english = searchVocab({ query: "this" });

    expect(unvowelled).toHaveLength(1);
    expect(
      unvowelled.some(
        (entry) =>
          foldForSearch(entry.arabic) === foldForSearch("هذا") &&
          entry.pronunciation === "hādhā" &&
          entry.english === "this (m)",
      ),
    ).toBe(true);
    expect(unvowelled.map((entry) => foldForSearch(entry.arabic))).not.toContain(
      foldForSearch("هَذَانِ"),
    );
    expect(searchVocab({ query: "هذا", allowArabicPrefix: true })).toHaveLength(1);
    expect(searchVocab({ query: "هذ", allowArabicPrefix: true }).map((entry) => foldForSearch(entry.arabic))).toEqual(
      expect.arrayContaining([foldForSearch("هذا"), foldForSearch("هذه"), foldForSearch("هذان")]),
    );
    expect(vowelled.map((entry) => foldForSearch(entry.arabic))).toContain(foldForSearch("هذا"));
    expect(transliterated.map((entry) => foldForSearch(entry.arabic))).toContain(
      foldForSearch("هذا"),
    );
    expect(searchVocab({ query: "حجرة الدراسة" }).map((entry) => foldForSearch(entry.arabic))).toEqual(
      [foldForSearch("حُجْرَةُ الدِّرَاسَة / حُجَرُ الدِّرَاسَة")],
    );
    expect(searchVocab({ query: "حجرة / حجر" }).map((entry) => foldForSearch(entry.arabic))).toEqual(
      [foldForSearch("حُجْرَة / حُجُر")],
    );
    expect(english.map((entry) => foldForSearch(entry.arabic))).toEqual(
      expect.arrayContaining([foldForSearch("هذا"), foldForSearch("هذه")]),
    );
  });

  test("keeps topic counts aligned after parsing source vocabulary", () => {
    const content = getSiteContent();
    const gettingToKnow = content.topics.find(
      (topic) => topic.slug === "getting-to-know-each-other",
    );
    const topicVocab = content.vocab.filter((entry) =>
      entry.topicSlugs.includes("getting-to-know-each-other"),
    );

    expect(gettingToKnow?.vocabCount).toBe(topicVocab.length);
    const marketplace = content.topics.find(
      (topic) => topic.slug === "the-marketplace-and-colours",
    );
    const marketplaceVocab = content.vocab.filter((entry) =>
      entry.topicSlugs.includes("the-marketplace-and-colours"),
    );

    expect(marketplace?.vocabCount).toBe(marketplaceVocab.length);
    expect(
      marketplaceVocab.some((entry) => entry.arabicFolded === foldForSearch("هٰذَا")),
    ).toBe(true);
    expect(
      marketplaceVocab.some((entry) => entry.arabicFolded === foldForSearch("جَزَّارُون")),
    ).toBe(true);
    expect(
      marketplaceVocab.some((entry) => entry.arabicFolded === foldForSearch("بَيْضَاء")),
    ).toBe(true);
  });
});

describe("content grammar data", () => {
  test("labels third-person masculine plural conjugations as plural", () => {
    const content = getSiteContent();

    const pastTheyMasc = content.conjugations.find(
      (entry) => entry.pronunciation === "katabū",
    );
    const presentTheyMasc = content.conjugations.find(
      (entry) => entry.pronunciation === "yaktubūna",
    );

    expect(pastTheyMasc).toMatchObject({
      tense: "past",
      category: "3rd person plural",
      gender: "M",
      english: "they wrote",
    });
    expect(presentTheyMasc).toMatchObject({
      tense: "present-future",
      category: "3rd person plural",
      gender: "M",
      english: "they write",
    });
  });
});
