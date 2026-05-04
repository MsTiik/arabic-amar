import contentJson from "../../content/content.json";
import { foldForSearch } from "./diacritics";
import type { GrammarRule, Lesson, SiteContent, Topic, VocabEntry } from "./types";

const DERIVED_MEMORISED_WORDS: Record<
  string,
  Pick<VocabEntry, "pronunciation" | "english" | "gender"> & { idSuffix: string }
> = {
  [foldForSearch("هٰذَا")]: {
    idSuffix: "hadha",
    pronunciation: "hādhā",
    english: "this (masculine)",
    gender: "M",
  },
  [foldForSearch("هٰذِهِ")]: {
    idSuffix: "hadhihi",
    pronunciation: "hādhihi",
    english: "this (feminine)",
    gender: "F",
  },
};

const content = addDerivedMemorisationVocab(contentJson as SiteContent);

function addDerivedMemorisationVocab(base: SiteContent): SiteContent {
  const lessons = base.lessons.map((lesson) => ({
    ...lesson,
    vocabIds: [...lesson.vocabIds],
  }));
  const topics = base.topics.map((topic) => ({ ...topic }));
  const vocab = [...base.vocab];
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));

  for (const rule of base.rules) {
    const arabic = memorisedArabicToken(rule);
    if (!arabic) continue;
    const arabicFolded = foldForSearch(arabic);
    const derived = DERIVED_MEMORISED_WORDS[arabicFolded];
    if (!derived) continue;
    if (vocab.some((entry) => entry.arabicFolded === arabicFolded)) {
      continue;
    }

    const entry: VocabEntry = {
      id: `${rule.lessonId}__memorise__${derived.idSuffix}`,
      arabic,
      arabicFolded,
      pronunciation: derived.pronunciation,
      english: derived.english,
      category: "Demonstratives",
      subCategory: "What to memorise",
      gender: derived.gender,
      isExtra: false,
      topicSlugs: [...rule.topicSlugs],
      lessonId: rule.lessonId,
    };
    vocab.push(entry);
    lessonById.get(rule.lessonId)?.vocabIds.push(entry.id);
    for (const slug of rule.topicSlugs) {
      const topic = topicBySlug.get(slug);
      if (topic) topic.vocabCount += 1;
    }
  }

  return { ...base, lessons, topics, vocab };
}

function memorisedArabicToken(rule: GrammarRule): string | undefined {
  const body = rule.body.trim();
  if (body.includes("/") || body.includes("+")) return undefined;
  const match =
    /^\*\*What to Memorise:\*\*\s*([\u0600-\u06FF\u064B-\u065F\u0670\u06D6-\u06ED]+)$/u.exec(
      body,
    );
  return match?.[1];
}

export function getSiteContent(): SiteContent {
  return content;
}

export function getTopics(): Topic[] {
  return content.topics;
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return content.topics.find((t) => t.slug === slug);
}

export function getLessonsForTopic(slug: string): Lesson[] {
  const topic = getTopicBySlug(slug);
  if (!topic) return [];
  return content.lessons.filter((l) => topic.lessonIds.includes(l.id));
}

export function getVocabForTopic(slug: string): VocabEntry[] {
  return content.vocab.filter((v) => v.topicSlugs.includes(slug));
}

export function getRulesForTopic(slug: string) {
  return content.rules.filter((r) => r.topicSlugs.includes(slug));
}

export function getRulesForLesson(lessonId: string) {
  return content.rules.filter((r) => r.lessonId === lessonId);
}

export function getLessonById(id: string): Lesson | undefined {
  return content.lessons.find((l) => l.id === id);
}

/**
 * Slug used in the per-lesson grammar URL `/grammar/lessons/[slug]`. We
 * reuse the lesson's primary topic slug so links look natural
 * (`/grammar/lessons/body-parts`).
 */
export function grammarLessonSlug(lesson: Lesson): string {
  return lesson.topicSlugs[0] ?? lesson.id;
}

export function getLessonByGrammarSlug(slug: string): Lesson | undefined {
  return content.lessons.find((l) => grammarLessonSlug(l) === slug);
}

export interface VocabSearchOptions {
  query?: string;
  topicSlug?: string;
  category?: string;
  gender?: "M" | "F" | "Both";
  isExtra?: boolean;
}

export function searchVocab(options: VocabSearchOptions = {}): VocabEntry[] {
  const folded = options.query ? foldForSearch(options.query) : "";
  return content.vocab.filter((v) => {
    if (options.topicSlug && !v.topicSlugs.includes(options.topicSlug)) return false;
    if (options.category && v.category !== options.category) return false;
    if (options.gender && v.gender !== options.gender) return false;
    if (options.isExtra !== undefined && v.isExtra !== options.isExtra) return false;
    if (folded) {
      const haystack = [
        v.arabicFolded,
        foldForSearch(v.arabic),
        foldForSearch(v.pronunciation),
        foldForSearch(v.english),
        foldForSearch(v.category),
      ];
      if (
        !haystack.some((value) =>
          isArabicFolded(folded) ? value.split(/\s+/).includes(folded) : value.includes(folded),
        )
      ) {
        return false;
      }
    }
    return true;
  });
}

function isArabicFolded(value: string): boolean {
  return /[\u0600-\u06FF]/u.test(value);
}

export interface CategoryGroup {
  category: string;
  entries: VocabEntry[];
}

export function groupVocabByCategory(entries: VocabEntry[]): CategoryGroup[] {
  const map = new Map<string, VocabEntry[]>();
  for (const v of entries) {
    const key = v.category || "Other";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(v);
  }
  return [...map.entries()].map(([category, entries]) => ({ category, entries }));
}
