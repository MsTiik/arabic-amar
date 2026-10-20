"use client";

import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/cn";
import type { VocabEntry } from "@/lib/types";
import { ArabicText } from "./arabic-text";
import { MasteryDots } from "./mastery-dots";
import { SpeakerButton } from "./speaker-button";

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
  md: "text-[1.75rem] sm:text-4xl",
  lg: "text-[2rem] sm:text-6xl",
  xl: "text-4xl sm:text-7xl",
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
        // Phones get a compact row (meaning left, Arabic right) so a lesson
        // shows several words per screen; the stacked card returns at `sm`.
        "group surface hover-lift relative grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-3.5 py-3 sm:flex sm:flex-col sm:items-stretch sm:gap-3 sm:p-6",
        className,
      )}
    >
      {entry.isExtra ? (
        <span className="chip absolute -top-2 left-3 bg-accent-gold-soft text-foreground sm:left-auto sm:right-3 sm:top-3">
          Extra
        </span>
      ) : null}

      <ArabicText
        variant="display"
        className={cn(
          SIZE_CLASSES[size],
          "col-start-2 row-span-2 row-start-1 max-w-[11rem] break-words text-right leading-relaxed text-foreground sm:w-full sm:max-w-none sm:text-start",
        )}
      >
        {entry.arabic}
      </ArabicText>

      <div className="col-start-1 row-start-1 flex min-w-0 flex-col gap-0.5 sm:gap-1">
        <div className="flex min-w-0 items-center gap-2">
          <SpeakerButton
            arabic={entry.arabic}
            label={entry.english}
            size="sm"
            showUnavailable
          />
          {entry.pronunciation ? (
            <p
              className="min-w-0 break-words text-[15px] font-medium text-foreground sm:text-lg"
              lang="ar-Latn"
            >
              {entry.pronunciation}
            </p>
          ) : null}
        </div>
        <p className="text-sm text-foreground-soft sm:text-base">{entry.english}</p>
      </div>

      <div className="col-start-1 row-start-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:mt-1 sm:gap-2">
        {entry.gender ? (
          <span
            className={cn(
              "rounded-md px-2 py-0.5 font-medium",
              entry.gender === "M" && "bg-accent-sky-soft text-accent-sky",
              entry.gender === "F" && "bg-accent-rose-soft text-accent-rose",
              entry.gender !== "M" &&
                entry.gender !== "F" &&
                "border border-hairline bg-background-soft",
            )}
          >
            {entry.gender === "M" ? "مذكر" : entry.gender === "F" ? "مؤنث" : entry.gender}
          </span>
        ) : null}
        {entry.subCategory && entry.subCategory !== entry.continent ? (
          <span className="rounded-md border border-hairline bg-background-soft px-2 py-0.5">
            {entry.subCategory}
          </span>
        ) : null}
        {entry.continent ? (
          <span className="rounded-md border border-hairline bg-background-soft px-2 py-0.5">
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
