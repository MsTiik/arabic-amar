"use client";

import Link from "next/link";
import { ArrowRight, Layers3, Sparkles } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { ProgressRing } from "@/components/progress-ring";
import type { CurriculumLevel } from "@/data/curriculum";
import { cn } from "@/lib/cn";
import { summarizeMastery, topicProgressFraction, useProgress } from "@/lib/progress";
import type { VocabEntry } from "@/lib/types";

interface Props {
  level: CurriculumLevel;
  vocab: VocabEntry[];
  className?: string;
}

export function CurriculumLevelCard({ level, vocab, className }: Props) {
  const progress = useProgress();
  const ids = [...new Set(vocab.map((entry) => entry.id))];
  const fraction = topicProgressFraction(progress, ids);
  const summary = summarizeMastery(progress, ids);
  const inProgress = level.status === "in-progress";

  return (
    <Link
      href={`/levels/${level.slug}`}
      className={cn(
        "group relative flex min-h-48 flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 hover-lift focus-ring",
        className,
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full transition-transform duration-300 group-hover:scale-110",
          level.slug === "level-1" ? "bg-primary/10" : "bg-accent-gold/10",
        )}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
            level.slug === "level-1"
              ? "bg-primary-soft text-primary ring-primary/20"
              : "bg-accent-gold/15 text-accent-gold ring-accent-gold/25",
          )}
        >
          <Layers3 className="h-5 w-5" aria-hidden />
        </span>
        {inProgress ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-gold/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-gold ring-1 ring-inset ring-accent-gold/20">
            <Sparkles className="h-3 w-3" aria-hidden />
            Growing course
          </span>
        ) : (
          <ProgressRing value={fraction} size={48} thickness={6} />
        )}
      </div>

      <div className="relative mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {level.stage}
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <h3 className="text-xl font-semibold tracking-tight">{level.title}</h3>
          <ArabicText className="text-xl text-foreground-soft">
            {level.titleArabic}
          </ArabicText>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {level.description}
        </p>
      </div>

      <div className="relative mt-auto flex items-end justify-between gap-3 pt-4">
        <span className="text-xs text-muted-foreground">
          {level.units?.length ?? level.topicSlugs.length} {level.units ? "units" : "lessons"}
          {summary.total > 0 ? ` · ${summary.mastered}/${summary.total} words mastered` : ""}
        </span>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1"
          aria-hidden
        />
      </div>
    </Link>
  );
}
