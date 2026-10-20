import { summarizeMastery, topicNewCount } from "@/lib/progress";
import type { Topic, UserProgress, VocabEntry } from "@/lib/types";

/**
 * Course progress — derived purely from existing word progress and the
 * lesson map. Nothing is stored. "Mastered" is mastery 3; a lesson counts as
 * covered once every one of its words has been introduced in practice.
 */
export interface CourseProgress {
  totalWords: number;
  masteredWords: number;
  /** 0..1 share of the vocabulary bank that is mastered. */
  masteredFraction: number;
  lessonsTotal: number;
  lessonsCovered: number;
  /** The first lesson that still has words to introduce, or null when done. */
  nextLesson: { slug: string; name: string; newCount: number } | null;
}

export function getCourseProgress(
  progress: UserProgress,
  vocab: VocabEntry[],
  topics: Topic[],
): CourseProgress {
  const active = vocab.filter((v) => !v.isExtra);
  const summary = summarizeMastery(
    progress,
    active.map((v) => v.id),
  );
  const ordered = [...topics].sort((a, b) => a.order - b.order);
  let lessonsCovered = 0;
  let nextLesson: CourseProgress["nextLesson"] = null;
  for (const topic of ordered) {
    const newCount = topicNewCount(progress, vocab, topic.slug);
    if (newCount === 0) lessonsCovered++;
    else if (!nextLesson) nextLesson = { slug: topic.slug, name: topic.name, newCount };
  }
  return {
    totalWords: summary.total,
    masteredWords: summary.mastered,
    masteredFraction: summary.total > 0 ? summary.mastered / summary.total : 0,
    lessonsTotal: ordered.length,
    lessonsCovered,
    nextLesson,
  };
}
