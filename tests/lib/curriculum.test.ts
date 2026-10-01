import { describe, expect, test } from "vitest";

import { CURRICULUM_LEVELS, getCurriculumLevel } from "../../src/data/curriculum";
import { getSiteContent } from "../../src/lib/content";

describe("curriculum levels", () => {
  test("keeps every generated beginner topic in Level 1", () => {
    const content = getSiteContent();
    const levelOne = getCurriculumLevel("level-1");

    expect(levelOne).toBeDefined();
    expect(new Set(levelOne?.topicSlugs)).toEqual(
      new Set(content.topics.map((topic) => topic.slug)),
    );
  });

  test("maps every referenced topic to an existing canonical topic", () => {
    const topicSlugs = new Set(getSiteContent().topics.map((topic) => topic.slug));

    for (const level of CURRICULUM_LEVELS) {
      for (const slug of level.topicSlugs) expect(topicSlugs.has(slug)).toBe(true);
      for (const unit of level.units ?? []) {
        for (const slug of unit.topicSlugs) expect(topicSlugs.has(slug)).toBe(true);
      }
    }
  });

  test("keeps Level 2 as a small set of optional topics rather than numbered units", () => {
    const levelTwo = getCurriculumLevel("level-2");
    expect(levelTwo?.units?.map((unit) => unit.id)).toEqual([
      "marketplace-reading",
      "actions-in-context",
      "core-verb-families",
    ]);
  });

  test("reuses canonical topics where Level 2 revises Level 1", () => {
    const levelOne = getCurriculumLevel("level-1");
    const levelTwo = getCurriculumLevel("level-2");

    expect(levelTwo?.topicSlugs.every((slug) => levelOne?.topicSlugs.includes(slug))).toBe(true);
  });
});
