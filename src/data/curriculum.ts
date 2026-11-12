export type CurriculumLevelSlug = "level-1" | "level-2";

export interface CurriculumUnit {
  id: string;
  title: string;
  description: string;
  /** Existing topic records reused by this unit, so word progress is shared. */
  topicSlugs: readonly string[];
  /** The one way into this topic. Every Level 2 page has exactly one entry point. */
  href: string;
  cta: string;
  /** Pages that live inside this topic, listed so its scope is visible from the overview. */
  includes?: readonly string[];
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
    href: "/levels/level-2/marketplace-reading",
    cta: "Open the reading",
  },
  {
    id: "actions-in-context",
    title: "Action verbs in context",
    description:
      "Learn classroom actions as complete present-tense forms, then read them in short standard-Arabic sentences.",
    topicSlugs: ["verbs-in-the-classroom"],
    href: "/levels/level-2/actions-in-context",
    cta: "Explore the action verbs",
  },
  {
    id: "core-verb-families",
    title: "Verb families",
    description:
      "Compare past, present, command, verbal noun, and related forms for 24 everyday verbs, from writing and studying to sitting, drawing, buying, weighing, welcoming and sleeping.",
    topicSlugs: ["verbs-in-the-classroom"],
    href: "/practice/verb-families",
    cta: "Explore the verb families",
  },
  {
    id: "home-and-places",
    title: "Home and Places",
    description:
      "Words for the home, its rooms and the places around it, with plurals, opposites, verb forms and example sentences, plus the stories and lessons that use them: what people do around the house, and the story of ʿUmar and the woman with the pot.",
    topicSlugs: [],
    href: "/levels/level-2/home-and-places",
    cta: "Open Home and Places",
    includes: [
      "Bayt to Masjid word cards",
      "Khalid’s house (reading)",
      "Naming every room in Khalid’s house",
      "The Sacred Mosque in Makkah",
      "Vocabulary of the home (Lesson 14)",
      "Daily actions at home and the story of ʿUmar (Lesson 15)",
    ],
  },
  {
    id: "getting-to-know-each-other",
    title: "Getting to know each other",
    description:
      "Greetings, names, how you are, where you are from and nationalities, with dialogue exercises and words of position. Then the dual, the broken plural, and counting from one to four.",
    topicSlugs: [],
    href: "/levels/level-2/getting-to-know-each-other",
    cta: "Open the lesson",
  },
  {
    id: "masculine-and-feminine",
    title: "Masculine and feminine",
    description:
      "How to spot a feminine noun, when to use هَذَا or هَذِهِ, and how present-tense verbs change for he, she, you and I, with a verb chart and a short quiz.",
    topicSlugs: [],
    href: "/grammar/masculine-and-feminine",
    cta: "Open the grammar guide",
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
