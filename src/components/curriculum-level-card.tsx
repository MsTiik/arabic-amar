"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

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

/** Arabic-Indic numeral shown in each level card's badge tile. */
const LEVEL_NUMERAL: Record<string, string> = {
  "level-1": "١",
  "level-2": "٢",
};

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
        "surface group relative flex min-h-48 flex-col overflow-hidden p-5 hover-lift focus-ring",
        className,
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ring-1 ring-inset",
            level.slug === "level-1"
              ? "bg-primary-soft text-primary ring-primary/20"
              : "bg-accent-gold/15 text-accent-gold ring-accent-gold/25",
          )}
        >
          <span className="font-arabic-display text-2xl leading-none" aria-hidden>
            {LEVEL_NUMERAL[level.slug] ?? "١"}
          </span>
        </span>
        {inProgress ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-gold/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-gold ring-1 ring-inset ring-accent-gold/20">
            <Sparkles className="h-3 w-3" aria-hidden />
            Growing course
          </span>
        ) : (
          <ProgressRing value={fraction} size={44} thickness={5} trackClassName="stroke-muted" className="text-xs" />
        )}
      </div>

      <div className="relative mt-4">
        <p className="eyebrow">
          {level.stage}
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
          <h3 className="font-display text-[1.4rem] leading-tight">{level.title}</h3>
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
