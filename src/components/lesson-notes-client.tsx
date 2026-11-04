"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import type { NoteDialogueLine } from "@/data/level-two-lesson-notes";
import { cn } from "@/lib/cn";

/** A numbered dialogue whose missing lines stay hidden until the learner reveals them. */
export function GapDialogue({ lines }: { lines: readonly NoteDialogueLine[] }) {
  const gaps = lines.flatMap((line, index) => (line.gap ? [index] : []));
  const [shown, setShown] = useState<ReadonlySet<number>>(new Set());
  const allShown = shown.size === gaps.length;

  const toggle = (index: number) =>
    setShown((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div className="surface p-3 sm:p-5">
      <div className="mb-2 flex flex-wrap items-center gap-3 border-b border-hairline pb-2 text-sm" aria-live="polite">
        <span className="font-semibold tabular-nums">
          {shown.size} / {gaps.length} lines revealed
        </span>
        <button
          type="button"
          onClick={() => setShown(allShown ? new Set() : new Set(gaps))}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring"
        >
          {allShown ? <EyeOff className="h-3.5 w-3.5" aria-hidden /> : <Eye className="h-3.5 w-3.5" aria-hidden />}
          {allShown ? "Hide the missing lines" : "Show all missing lines"}
        </button>
      </div>
      <ol className="divide-y divide-hairline">
        {lines.map((line, index) => {
          const hidden = line.gap && !shown.has(index);
          return (
            <li key={index} className="flex items-start gap-3 py-2.5">
              <span
                className={cn(
                  "mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                  line.gap ? "bg-accent-amber-soft text-accent-amber" : "bg-primary-soft text-primary",
                )}
              >
                {index + 1}
              </span>
              {hidden ? (
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex min-h-14 flex-1 items-center justify-between gap-3 rounded-[10px] border border-dashed border-accent-amber/60 bg-accent-amber-soft/30 px-3 text-start text-sm text-foreground-soft focus-ring"
                >
                  <span>Say this line yourself, then tap to check</span>
                  <Eye className="h-4 w-4 shrink-0 text-accent-amber" aria-hidden />
                </button>
              ) : (
                <div className="min-w-0 flex-1">
                  <ArabicText className="text-xl leading-loose text-foreground sm:text-2xl">{line.arabic}</ArabicText>
                  <p lang="ar-Latn" className="text-sm italic text-foreground-soft">{line.transliteration}</p>
                  <p className="text-sm text-muted-foreground">{line.english}</p>
                  {line.gap ? (
                    <button
                      type="button"
                      onClick={() => toggle(index)}
                      className="mt-1 text-xs font-semibold text-primary focus-ring"
                    >
                      Hide again
                    </button>
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
