import { describe, expect, test } from "vitest";

import { correctConjugationLabels, fillIslamicMonthGlosses } from "../../src/lib/post-process";
import type { ConjugationEntry, SiteContent, VocabEntry } from "../../src/lib/types";

function vocab(overrides: Partial<VocabEntry>): VocabEntry {
  return {
    id: "vocab",
    arabic: "١ - مُحَرَّم",
    arabicFolded: "١ - محرم",
    pronunciation: "muḥarram",
    english: "",
    category: "ISLAMICMONTHS",
    isExtra: false,
    topicSlugs: ["islamic-and-gregorian-months"],
    lessonId: "lesson-islamic-and-gregorian-months",
    ...overrides,
  };
}

function content(vocabEntries: VocabEntry[]): SiteContent {
  return {
    lessons: [],
    topics: [],
    vocab: vocabEntries,
    rules: [],
    conversations: [],
    pronouns: [],
    conjugations: [],
    pluralForms: [],
    grammarIntros: [],
    source: {
      name: "Test",
      contactEmail: "test@example.com",
      instagram: "@test",
      docUrl: "https://example.com",
    },
    fetchedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("fillIslamicMonthGlosses", () => {
  test("fills empty Hijri month glosses from Arabic row numbers", () => {
    const result = fillIslamicMonthGlosses(
      content([
        vocab({ arabic: "١ - مُحَرَّم" }),
        vocab({
          id: "ramadan",
          arabic: "٩ - رَمَضَان",
          arabicFolded: "٩ - رمضان",
          pronunciation: "ramaḍān",
        }),
      ]),
    );

    expect(result.vocab[0].english).toBe("Muḥarram (1st Hijri month)");
    expect(result.vocab[0].monthIndex).toBe(1);
    expect(result.vocab[0].monthSystem).toBe("hijri");
    expect(result.vocab[1].english).toBe("Ramaḍān (9th Hijri month)");
    expect(result.vocab[1].monthIndex).toBe(9);
  });

  test("does not overwrite existing English glosses", () => {
    const result = fillIslamicMonthGlosses(
      content([vocab({ english: "Existing gloss", monthIndex: 1, monthSystem: "hijri" })]),
    );

    expect(result.vocab[0].english).toBe("Existing gloss");
  });
});

function conjugation(overrides: Partial<ConjugationEntry>): ConjugationEntry {
  return {
    id: "conjugation__past__3rd-person-singular__katabu",
    tense: "past",
    category: "3rd person singular",
    patternRule: "(root) + وا",
    patternExample: "ك-ت-ب + وا",
    arabic: "كَتَبُوا",
    arabicFolded: "كتبوا",
    pronunciation: "katabū",
    english: "they wrote",
    gender: "M",
    ...overrides,
  };
}

describe("correctConjugationLabels", () => {
  test("corrects masculine they rows mislabeled as singular", () => {
    const result = correctConjugationLabels({
      ...content([]),
      conjugations: [
        conjugation({ tense: "past", english: "they wrote", pronunciation: "katabū" }),
        conjugation({
          id: "conjugation__present-future__3rd-person-singular__yaktubuna",
          tense: "present-future",
          patternRule: "يَ + (root) + ونَ",
          patternExample: "يَ + ك-ت-ب + ونَ",
          arabic: "يَكْتُبُونَ",
          arabicFolded: "يكتبون",
          pronunciation: "yaktubūna",
          english: "they write",
        }),
      ],
    });

    expect(result.conjugations.map((entry) => entry.category)).toEqual([
      "3rd person plural",
      "3rd person plural",
    ]);
    expect(result.conjugations.map((entry) => entry.id)).toEqual([
      "conjugation__past__3rd-person-plural__katabu",
      "conjugation__present-future__3rd-person-plural__yaktubuna",
    ]);
  });

  test("leaves true singular masculine rows unchanged", () => {
    const original = conjugation({
      id: "conjugation__past__base-form__kataba",
      category: "Base form",
      patternRule: "(root) + َ",
      patternExample: "ك-ت-ب + َ",
      arabic: "كَتَبَ",
      arabicFolded: "كتب",
      pronunciation: "kataba",
      english: "he wrote",
    });

    const result = correctConjugationLabels({
      ...content([]),
      conjugations: [original],
    });

    expect(result.conjugations[0]).toEqual(original);
  });
});
