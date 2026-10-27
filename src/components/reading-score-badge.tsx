"use client";

import { scoreReading, useReadingResults } from "@/lib/reading-results";

export function ReadingScoreBadge({
  slug,
  questionIds,
}: {
  slug: string;
  questionIds: readonly string[];
}) {
  const results = useReadingResults();
  const score = scoreReading(results[slug], questionIds);
  if (score.answered === 0) return null;
  return (
    <p className="mt-3 inline-flex w-fit items-center rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold tabular-nums text-primary">
      Exercise: {score.right} / {score.total} correct
    </p>
  );
}
