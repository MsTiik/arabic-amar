import { describe, expect, test } from "vitest";

import { fillIslamicMonthGlosses } from "../../src/lib/post-process";
import type { SiteContent, VocabEntry } from "../../src/lib/types";

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
