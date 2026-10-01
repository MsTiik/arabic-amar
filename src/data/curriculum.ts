export type CurriculumLevelSlug = "level-1" | "level-2";

export interface CurriculumLink {
  href: string;
  label: string;
}

export interface CurriculumUnit {
  id: string;
  title: string;
  description: string;
  /** Existing topic records reused by this unit, so word progress is shared. */
  topicSlugs: readonly string[];
  links: readonly CurriculumLink[];
}

export interface CurriculumLevel {
  slug: CurriculumLevelSlug;
  title: string;
  titleArabic: string;
  stage: string;
  description: string;
  topicSlugs: readonly string[];
  units?: readonly CurriculumUnit[];
  status?: "complete" | "in-progress";
}

const LEVEL_ONE_TOPIC_SLUGS = [
  "body-parts",
  "numbers",
  "time",
  "days-of-the-week",
  "islamic-and-gregorian-months",
  "entities",
  "getting-to-know-each-other",
  "nouns-in-the-classroom",
  "verbs-in-the-classroom",
  "the-marketplace",
  "colours",
  "command-verbs-in-the-qur-an",
] as const;

const LEVEL_TWO_UNITS: readonly CurriculumUnit[] = [
  {
    id: "marketplace-reading",
    title: "Ahmed goes shopping",
    description:
      "Read a short shopping passage and explore the meaning and pronunciation of each Arabic word.",
    topicSlugs: ["the-marketplace", "colours"],
    links: [
      { href: "/levels/level-2/marketplace-reading", label: "Open the reading" },
    ],
  },
  {
    id: "actions-in-context",
    title: "Action verbs in context",
    description:
      "Learn classroom actions as complete present-tense forms, then read them in short standard-Arabic sentences.",
    topicSlugs: ["verbs-in-the-classroom"],
    links: [
      { href: "/levels/level-2/actions-in-context", label: "Explore the action verbs" },
      { href: "/grammar/lessons/verbs-in-the-classroom", label: "Study the verb tables" },
    ],
  },
  {
    id: "core-verb-families",
    title: "Five core verb families",
    description:
      "Compare past, present, command, verbal noun, and related forms for writing, reading, explaining, understanding, and standing.",
    topicSlugs: ["verbs-in-the-classroom"],
    links: [
      { href: "/practice/verb-families", label: "Explore the five verb families" },
    ],
  },
] as const;

export const CURRICULUM_LEVELS: readonly CurriculumLevel[] = [
  {
    slug: "level-1",
    title: "Level 1",
    titleArabic: "الْمُسْتَوَى الْأَوَّل",
    stage: "Beginner",
    description:
      "Build the foundations with everyday vocabulary, introductory grammar, and guided practice.",
    topicSlugs: LEVEL_ONE_TOPIC_SLUGS,
    status: "complete",
  },
  {
    slug: "level-2",
    title: "Level 2",
    titleArabic: "الْمُسْتَوَى الثَّانِي",
    stage: "Developing",
    description:
      "Strengthen familiar vocabulary, read longer material, and study how Arabic words change across forms.",
    topicSlugs: [
      "verbs-in-the-classroom",
      "the-marketplace",
      "colours",
    ],
    units: LEVEL_TWO_UNITS,
    status: "in-progress",
  },
] as const;

export function getCurriculumLevel(slug: string): CurriculumLevel | undefined {
  return CURRICULUM_LEVELS.find((level) => level.slug === slug);
}
