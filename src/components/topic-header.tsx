"use client";

import Link from "next/link";
import { useEffect } from "react";

import { ArabicText } from "@/components/arabic-text";
import { ProgressRing } from "@/components/progress-ring";
import { useProgress, progressActions, summarizeMastery, topicProgressFraction } from "@/lib/progress";
import { getLessonIdentity } from "@/lib/lesson-identity";
import type { Topic, VocabEntry } from "@/lib/types";

interface Props {
  topic: Topic;
  vocab: VocabEntry[];
  ruleCount: number;
}

export function TopicHeader({ topic, vocab, ruleCount }: Props) {
  const progress = useProgress();
  useEffect(() => {
    progressActions.visitTopic(topic.slug);
  }, [topic.slug]);

  const ids = vocab.map((v) => v.id);
  const fraction = topicProgressFraction(progress, ids);
  const summary = summarizeMastery(progress, ids);
  const identity = getLessonIdentity(topic.slug);
  const Icon = identity.icon;

  return (
    <header className="brand-panel rounded-3xl border border-border p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/topics"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← All lessons
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${identity.chip}`}
            >
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {topic.name}
            </h1>
          </div>
          {topic.nameArabic ? (
            <ArabicText variant="display" className="mt-1 text-3xl text-foreground-soft sm:text-4xl">
              {topic.nameArabic}
            </ArabicText>
          ) : null}
          <p className="mt-3 text-sm text-muted-foreground">
            {vocab.length} words · {ruleCount} rules
          </p>
        </div>
        <div className="flex items-center gap-6">
          <ProgressRing value={fraction} size={96} thickness={10} />
          <div className="flex flex-col gap-1 text-sm">
            <Legend dotClassName="bg-success" label="Mastered" count={summary.mastered} />
            <Legend dotClassName="bg-primary/70" label="Familiar" count={summary.familiar} />
            <Legend dotClassName="bg-primary/40" label="Learning" count={summary.learning} />
            <Legend dotClassName="bg-border" label="New" count={summary.new} />
          </div>
        </div>
      </div>
      {topic.notes && topic.notes.length > 0 ? (
        <div className="mt-5 space-y-3 border-t border-border pt-5">
          {topic.notes.map((note, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground-soft">
              {note}
            </p>
          ))}
        </div>
      ) : null}
    </header>
  );
}

function Legend({
  dotClassName,
  label,
  count,
}: {
  dotClassName: string;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${dotClassName}`} />
      <span className="text-foreground-soft">{label}</span>
      <span className="ml-1 tabular-nums text-muted-foreground">{count}</span>
    </div>
  );
}
