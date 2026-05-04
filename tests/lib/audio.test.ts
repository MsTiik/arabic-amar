import { describe, expect, test } from "vitest";

import { createAudioCoverageStats, hasAudioForWord } from "../../src/lib/audio";
import type { SiteContent } from "../../src/lib/types";

function vocab(
  id: string,
  arabic: string,
  topicSlugs: string[],
): SiteContent["vocab"][number] {
  return {
    id,
    arabic,
    arabicFolded: arabic,
    pronunciation: id,
    english: id,
    category: "General",
    isExtra: false,
    topicSlugs,
    lessonId: "lesson-one",
  };
}

describe("audio coverage", () => {
  test("reports manifest coverage for all vocab and by topic", () => {
    const stats = createAudioCoverageStats({
      vocab: [
        vocab("muḥarram", "١ - مُحَرَّم", ["months"]),
        vocab("january", "١ - يَنَايِر", ["months"]),
        vocab("fa", "فَـ", ["connectors"]),
      ],
      topics: [
        {
          slug: "months",
          name: "Months",
          order: 1,
          lessonIds: ["lesson-one"],
          vocabCount: 2,
          ruleCount: 0,
          conversationCount: 0,
        },
        {
          slug: "connectors",
          name: "Connectors",
          order: 2,
          lessonIds: ["lesson-one"],
          vocabCount: 1,
          ruleCount: 0,
          conversationCount: 0,
        },
      ],
    });

    expect(hasAudioForWord("١ - مُحَرَّم")).toBe(true);
    expect(hasAudioForWord("فَـ")).toBe(false);
    expect(stats).toMatchObject({
      vocabTotal: 3,
      vocabWithAudio: 2,
      vocabMissingAudio: 1,
      coveragePercent: 67,
      byTopic: [
        {
          slug: "months",
          total: 2,
          withAudio: 2,
          missingAudio: 0,
          coveragePercent: 100,
        },
        {
          slug: "connectors",
          total: 1,
          withAudio: 0,
          missingAudio: 1,
          coveragePercent: 0,
        },
      ],
    });
  });
});
