"use client";

import Link from "next/link";

import { useProgress } from "@/lib/progress";
import { topicProgressFraction, summarizeMastery } from "@/lib/progress";
import { cn } from "@/lib/cn";
import type { Topic, VocabEntry } from "@/lib/types";
import { ArabicText } from "./arabic-text";
import { ProgressRing } from "./progress-ring";

interface Props {
  topic: Topic;
  vocab: VocabEntry[];
  className?: string;
}

export function TopicCard({ topic, vocab, className }: Props) {
  const progress = useProgress();
  const ids = vocab.map((v) => v.id);
  const fraction = topicProgressFraction(progress, ids);
  const summary = summarizeMastery(progress, ids);

  return (
    <Link
      href={`/topics/${topic.slug}`}
      className={cn(
        "group flex items-center gap-5 rounded-2xl border border-border bg-card p-5 hover-lift focus-ring",
        className,
      )}
    >
      <ProgressRing value={fraction} size={72} thickness={8} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-lg font-semibold">{topic.name}</h3>
        </div>
        {topic.nameArabic ? (
          <ArabicText variant="inline" className="block text-2xl text-foreground-soft">
            {topic.nameArabic}
          </ArabicText>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">
          {topic.vocabCount} words
          {topic.ruleCount > 0 ? ` · ${topic.ruleCount} rules` : ""}
        </p>
        {summary.total > 0 ? (
          <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-success"
              style={{ width: `${(summary.mastered / summary.total) * 100}%` }}
            />
            <div
              className="h-full bg-primary/70"
              style={{ width: `${(summary.familiar / summary.total) * 100}%` }}
            />
            <div
              className="h-full bg-primary/40"
              style={{ width: `${(summary.learning / summary.total) * 100}%` }}
            />
          </div>
        ) : null}
      </div>
    </Link>
  );
}
