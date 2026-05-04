import audioManifest from "../../content/audio-manifest.json";
import { stripDiacritics } from "./diacritics";
import type { ContentWarning } from "./parser";
import type { SiteContent, VocabEntry } from "./types";

type QaSeverity = "info" | "warning" | "error";

export interface ContentQaIssue {
  code: string;
  severity: QaSeverity;
  message: string;
  count: number;
  examples: string[];
}

export interface ContentQaReport {
  generatedAt: string;
  totals: {
    lessons: number;
    topics: number;
    vocab: number;
    rules: number;
    conversations: number;
    parserWarnings: number;
    issues: number;
  };
  issues: ContentQaIssue[];
}

interface AudioManifest {
  entries: Record<string, unknown>;
}

const AUDIO_ENTRIES = (audioManifest as AudioManifest).entries;

function exampleVocab(entry: VocabEntry): string {
  return `${entry.lessonId}: ${entry.arabic} / ${entry.pronunciation} / ${entry.english || "(empty)"}`;
}

function stripAudioKey(arabic: string): string {
  return stripDiacritics(arabic).trim();
}

function addIssue(
  issues: ContentQaIssue[],
  issue: Omit<ContentQaIssue, "examples"> & { examples: string[] },
) {
  issues.push({
    ...issue,
    examples: issue.examples.slice(0, 12),
  });
}

export function createContentQaReport(
  content: SiteContent,
  parserWarnings: ContentWarning[] = [],
  generatedAt = new Date().toISOString(),
): ContentQaReport {
  const issues: ContentQaIssue[] = [];

  if (parserWarnings.length > 0) {
    addIssue(issues, {
      code: "parser-warnings",
      severity: "error",
      message: "Parser warnings were produced while reading the source document.",
      count: parserWarnings.length,
      examples: parserWarnings.map((warning) => {
        const context = [
          warning.lesson ? `lesson=${warning.lesson}` : undefined,
          warning.subsection ? `sub=${warning.subsection}` : undefined,
          warning.heading ? `heading=${warning.heading}` : undefined,
        ]
          .filter(Boolean)
          .join(" ");
        return context ? `${warning.message} (${context})` : warning.message;
      }),
    });
  }

  const emptyLessons = content.lessons.filter(
    (lesson) =>
      lesson.vocabIds.length === 0 &&
      lesson.ruleIds.length === 0 &&
      lesson.conversationIds.length === 0,
  );
  if (emptyLessons.length > 0) {
    addIssue(issues, {
      code: "empty-lessons",
      severity: "error",
      message: "Learner-facing lessons have no vocab, rules, or conversations.",
      count: emptyLessons.length,
      examples: emptyLessons.map((lesson) => `${lesson.number}: ${lesson.title}`),
    });
  }

  const emptyEnglish = content.vocab.filter((entry) => !entry.english.trim());
  if (emptyEnglish.length > 0) {
    addIssue(issues, {
      code: "empty-vocab-english",
      severity: "warning",
      message: "Vocabulary cards are missing English glosses.",
      count: emptyEnglish.length,
      examples: emptyEnglish.map(exampleVocab),
    });
  }

  const emptyPronunciation = content.vocab.filter((entry) => !entry.pronunciation.trim());
  if (emptyPronunciation.length > 0) {
    addIssue(issues, {
      code: "empty-vocab-pronunciation",
      severity: "warning",
      message: "Vocabulary cards are missing transliteration/pronunciation text.",
      count: emptyPronunciation.length,
      examples: emptyPronunciation.map(exampleVocab),
    });
  }

  const duplicateIds = duplicateGroups(content.vocab, (entry) => entry.id);
  if (duplicateIds.length > 0) {
    addIssue(issues, {
      code: "duplicate-vocab-ids",
      severity: "error",
      message: "Vocabulary IDs must be unique for progress tracking and React keys.",
      count: duplicateIds.length,
      examples: duplicateIds.map(([id, entries]) => `${id}: ${entries.map(exampleVocab).join(" | ")}`),
    });
  }

  const duplicateRows = duplicateGroups(content.vocab, (entry) =>
    [entry.lessonId, entry.category, entry.arabic, entry.pronunciation, entry.english].join("\u0000"),
  );
  if (duplicateRows.length > 0) {
    addIssue(issues, {
      code: "duplicate-vocab-rows",
      severity: "warning",
      message: "Vocabulary rows appear to be exact duplicates in the parsed content.",
      count: duplicateRows.length,
      examples: duplicateRows.map(([, entries]) => entries.map(exampleVocab).join(" | ")),
    });
  }

  const missingAudio = content.vocab.filter((entry) => !AUDIO_ENTRIES[stripAudioKey(entry.arabic)]);
  if (missingAudio.length > 0) {
    addIssue(issues, {
      code: "missing-audio",
      severity: "info",
      message: "Vocabulary words do not have a matching audio-manifest entry.",
      count: missingAudio.length,
      examples: missingAudio.map(exampleVocab),
    });
  }

  const topicCountMismatches = content.topics.flatMap((topic) => {
    const vocabCount = content.vocab.filter((entry) => entry.topicSlugs.includes(topic.slug)).length;
    const ruleCount = content.rules.filter((rule) => rule.topicSlugs.includes(topic.slug)).length;
    const conversationCount = content.conversations.filter((conversation) =>
      conversation.topicSlugs.includes(topic.slug),
    ).length;
    const mismatches = [
      topic.vocabCount !== vocabCount ? `vocab ${topic.vocabCount} != ${vocabCount}` : undefined,
      topic.ruleCount !== ruleCount ? `rules ${topic.ruleCount} != ${ruleCount}` : undefined,
      topic.conversationCount !== conversationCount
        ? `conversations ${topic.conversationCount} != ${conversationCount}`
        : undefined,
    ].filter(Boolean);
    return mismatches.length > 0 ? [`${topic.slug}: ${mismatches.join(", ")}`] : [];
  });
  if (topicCountMismatches.length > 0) {
    addIssue(issues, {
      code: "topic-count-mismatches",
      severity: "error",
      message: "Topic summary counts do not match parsed content.",
      count: topicCountMismatches.length,
      examples: topicCountMismatches,
    });
  }

  return {
    generatedAt,
    totals: {
      lessons: content.lessons.length,
      topics: content.topics.length,
      vocab: content.vocab.length,
      rules: content.rules.length,
      conversations: content.conversations.length,
      parserWarnings: parserWarnings.length,
      issues: issues.length,
    },
    issues,
  };
}

function duplicateGroups<T>(items: T[], getKey: (item: T) => string): Array<[string, T[]]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = getKey(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()].filter(([, group]) => group.length > 1);
}
