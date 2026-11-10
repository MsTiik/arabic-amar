import { describe, expect, test } from "vitest";

import { CURRICULUM_LEVELS, getCurriculumLevel } from "../../src/data/curriculum";
import { LEVEL_TWO_VOCAB_THEMES } from "../../src/data/level-two-vocab-sets";
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
      "home-and-places",
      "getting-to-know-each-other",
      "masculine-and-feminine",
    ]);
  });

  test("gives every Level 2 page exactly one way in from the topics overview", () => {
    const levelTwo = getCurriculumLevel("level-2");
    const hrefs = levelTwo?.units?.map((unit) => unit.href) ?? [];
    expect(new Set(hrefs).size).toBe(hrefs.length);

    // Pages listed inside Home and Places must not also be top-level topics.
    const nested = new Set(
      LEVEL_TWO_VOCAB_THEMES.flatMap((theme) => theme.readingSlugs ?? []).map(
        (slug) => `/levels/level-2/${slug}`,
      ),
    );
    for (const href of hrefs) expect(nested.has(href)).toBe(false);
  });

  test("reuses canonical topics where Level 2 revises Level 1", () => {
    const levelOne = getCurriculumLevel("level-1");
    const levelTwo = getCurriculumLevel("level-2");

    expect(levelTwo?.topicSlugs.every((slug) => levelOne?.topicSlugs.includes(slug))).toBe(true);
  });
});
