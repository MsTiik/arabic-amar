"use client";

import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/cn";
import type { VocabEntry } from "@/lib/types";
import { ArabicText } from "./arabic-text";
import { MasteryDots } from "./mastery-dots";

interface Props {
  entry: VocabEntry;
  /**
   * Visual size of the Arabic line.
   *  - `xl` for hero/single-card layouts
   *  - `lg` for default vocab list
   *  - `md` for dense list views
   */
  size?: "md" | "lg" | "xl";
  showMastery?: boolean;
  className?: string;
}



const SIZE_CLASSES: Record<NonNullable<Props["size"]>, string> = {
  md: "text-3xl sm:text-4xl",
  lg: "text-5xl sm:text-6xl",
  xl: "text-6xl sm:text-7xl",
};

export function VocabCard({
  entry,
  size = "lg",
  showMastery = true,
  className,
}: Props) {
  const progress = useProgress();
  const wp = progress.words[entry.id];
  const mastery = wp?.mastery ?? 0;

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6 hover-lift",
        className,
      )}
    >
      {entry.isExtra ? (
        <span className="absolute right-3 top-3 rounded-full bg-accent-gold-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
          Extra
        </span>
      ) : null}

      <ArabicText
        variant="display"
        className={cn(SIZE_CLASSES[size], "text-foreground")}
      >
        {entry.arabic}
      </ArabicText>

      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-foreground sm:text-lg" lang="ar-Latn">
          {entry.pronunciation}
        </p>
        <p className="text-sm text-foreground-soft sm:text-base">{entry.english}</p>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {entry.gender ? (
          <span className="rounded-md border border-border bg-background-soft px-2 py-0.5 font-medium">
            {entry.gender === "M" ? "مذكر" : entry.gender === "F" ? "مؤنث" : entry.gender}
          </span>
        ) : null}
        {entry.subCategory && entry.subCategory !== entry.continent ? (
          <span className="rounded-md border border-border bg-background-soft px-2 py-0.5">
            {entry.subCategory}
          </span>
        ) : null}
        {entry.continent ? (
          <span className="rounded-md border border-border bg-background-soft px-2 py-0.5">
            {entry.continent}
          </span>
        ) : null}
        {entry.nationalityArabic ? (
          <span className="ml-auto inline-flex items-center gap-1 text-foreground-soft">
            <span className="font-medium">Nationality:</span>
            <ArabicText variant="inline" className="text-base">
              {entry.nationalityArabic}
            </ArabicText>
            {entry.nationalityPronunciation ? (
              <span className="italic">({entry.nationalityPronunciation})</span>
            ) : null}
          </span>
        ) : null}
        {showMastery ? (
          <MasteryDots
            mastery={mastery}
            className={entry.nationalityArabic ? "" : "ml-auto"}
          />
        ) : null}
      </div>
    </article>
  );
}
