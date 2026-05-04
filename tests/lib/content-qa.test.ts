import { describe, expect, test } from "vitest";

import { createContentQaReport } from "../../src/lib/content-qa";
import type { SiteContent } from "../../src/lib/types";

function baseContent(overrides: Partial<SiteContent> = {}): SiteContent {
  return {
    lessons: [
      {
        id: "lesson-one",
        number: "1",
        title: "One",
        topicSlugs: ["one"],
        vocabIds: ["vocab-one"],
        ruleIds: [],
        conversationIds: [],
      },
    ],
    topics: [
      {
        slug: "one",
        name: "One",
        order: 1,
        lessonIds: ["lesson-one"],
        vocabCount: 1,
        ruleCount: 0,
        conversationCount: 0,
      },
    ],
    vocab: [
      {
        id: "vocab-one",
        arabic: "كتاب",
        arabicFolded: "كتاب",
        pronunciation: "kitāb",
        english: "book",
        category: "General",
        isExtra: false,
        topicSlugs: ["one"],
        lessonId: "lesson-one",
      },
    ],
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
    ...overrides,
  };
}

describe("createContentQaReport", () => {
  test("summarizes empty lessons, parser warnings, and missing English", () => {
    const report = createContentQaReport(
      baseContent({
        lessons: [
          {
            id: "empty",
            number: "2",
            title: "Empty",
            topicSlugs: ["empty"],
            vocabIds: [],
            ruleIds: [],
            conversationIds: [],
          },
        ],
        topics: [],
        vocab: [
          {
            id: "missing-english",
            arabic: "قلم",
            arabicFolded: "قلم",
            pronunciation: "qalam",
            english: "",
            category: "General",
            isExtra: false,
            topicSlugs: ["empty"],
            lessonId: "empty",
          },
        ],
      }),
      [
        {
          code: "unknown-table",
          severity: "warning",
          message: "Unknown table shape",
          lesson: "2",
        },
      ],
      "2026-01-02T00:00:00.000Z",
    );

    expect(report.generatedAt).toBe("2026-01-02T00:00:00.000Z");
    expect(report.totals.parserWarnings).toBe(1);
    expect(report.audioCoverage).toMatchObject({
      vocabTotal: 1,
      vocabWithAudio: 0,
      vocabMissingAudio: 1,
      coveragePercent: 0,
    });
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(["parser-warnings", "empty-lessons", "empty-vocab-english"]),
    );
  });

  test("uses the same audio key shape as runtime lookup for paired vocab", () => {
    const report = createContentQaReport(
      baseContent({
        vocab: [
          {
            id: "paired",
            arabic: "حُجْرَة / حُجُر",
            arabicFolded: "حجرة حجر",
            pronunciation: "ḥujrah / ḥujar",
            english: "room → rooms",
            category: "Classroom",
            isExtra: false,
            topicSlugs: ["one"],
            lessonId: "lesson-one",
          },
        ],
      }),
      [],
      "2026-01-02T00:00:00.000Z",
    );

    expect(report.issues.find((issue) => issue.code === "missing-audio")).toBeUndefined();
  });

  test("preserves tatweel when checking audio keys", () => {
    const report = createContentQaReport(
      baseContent({
        vocab: [
          {
            id: "connector",
            arabic: "فَـ",
            arabicFolded: "ف",
            pronunciation: "fa-",
            english: "then/so",
            category: "Connector",
            isExtra: false,
            topicSlugs: ["one"],
            lessonId: "lesson-one",
          },
        ],
      }),
      [],
      "2026-01-02T00:00:00.000Z",
    );

    expect(report.issues.find((issue) => issue.code === "missing-audio")).toBeDefined();
  });
});
