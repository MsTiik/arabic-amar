"use client";

import { useState } from "react";

import type { PronounEntry } from "@/lib/types";
import { ArabicText } from "@/components/arabic-text";
import { cn } from "@/lib/cn";

interface Props {
  pronoun: PronounEntry;
  className?: string;
}

/**
 * Reference card for a single pronoun. Top half mirrors a vocab card
 * (large Arabic + pronunciation + gloss). The Quranic / Hadith example is
 * tucked behind a discreet "Show example" toggle so the grid stays scannable.
 */
export function PronounCard({ pronoun, className }: Props) {
  const [open, setOpen] = useState(false);
  const hasExample = !!pronoun.example;

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6 hover-lift",
        className,
      )}
    >
      <span className="absolute right-3 top-3 rounded-full bg-background-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {pronoun.category}
      </span>

      <ArabicText
        variant="display"
        className="text-5xl text-foreground sm:text-6xl"
      >
        {pronoun.arabic}
      </ArabicText>

      <div className="flex flex-col gap-1">
        <p
          className="text-base font-medium text-foreground sm:text-lg"
          lang="ar-Latn"
        >
          {pronoun.pronunciation}
        </p>
        <p className="text-sm text-foreground-soft sm:text-base">
          {pronoun.english}
        </p>
      </div>

      {pronoun.usageNote ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground-soft">Usage:</span>{" "}
          {pronoun.usageNote}
        </p>
      ) : null}

      {hasExample ? (
        <div className="mt-auto border-t border-border/60 pt-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="text-xs font-medium text-primary hover:underline focus-ring rounded"
          >
            {open ? "Hide example" : "Show example"}
          </button>
          {open ? (
            <div className="mt-2 flex flex-col gap-1 rounded-xl bg-background-soft p-3">
              <ArabicText
                variant="body"
                className="text-2xl leading-loose text-foreground sm:text-3xl"
              >
                {pronoun.example!.arabic}
              </ArabicText>
              {pronoun.example!.transliteration ? (
                <p
                  className="text-xs italic text-muted-foreground"
                  lang="ar-Latn"
                >
                  {pronoun.example!.transliteration}
                </p>
              ) : null}
              {pronoun.example!.english ? (
                <p className="text-sm text-foreground-soft">
                  {pronoun.example!.english}
                </p>
              ) : null}
              {pronoun.example!.citation ? (
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  — {pronoun.example!.citation}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
