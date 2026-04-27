import contentJson from "../../content/content.json";
import { foldForSearch } from "./diacritics";
import type { Lesson, SiteContent, Topic, VocabEntry } from "./types";

const content = contentJson as SiteContent;

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
        foldForSearch(v.pronunciation),
        foldForSearch(v.english),
        foldForSearch(v.category),
      ].join(" ");
      if (!haystack.includes(folded)) return false;
    }
    return true;
  });
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
