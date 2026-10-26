"use client";

import { useState } from "react";

import type { PronounEntry } from "@/lib/types";
import { ArabicText } from "@/components/arabic-text";
import { SpeakerButton } from "@/components/speaker-button";
import { getAudioForCitation } from "@/lib/audio";
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
        "group relative flex flex-col gap-1.5 surface p-3 sm:gap-3 sm:p-6 hover-lift",
        className,
      )}
    >
      <div className="flex items-center gap-3 sm:hidden">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <SpeakerButton
              arabic={pronoun.arabic}
              label={pronoun.english}
              size="sm"
            />
            <p className="text-base font-medium text-foreground" lang="ar-Latn">
              {pronoun.pronunciation}
            </p>
          </div>
          <p className="mt-0.5 text-sm text-foreground-soft">{pronoun.english}</p>
        </div>
        <ArabicText variant="display" className="shrink-0 text-4xl text-foreground">
          {pronoun.arabic}
        </ArabicText>
      </div>

      <div className="hidden sm:flex sm:flex-col sm:items-stretch sm:gap-2">
        <span className="chip shrink-0 self-end bg-background-soft text-muted-foreground">
          {pronoun.category}
        </span>

        <ArabicText
          variant="display"
          className="min-w-0 text-6xl text-foreground"
        >
          {pronoun.arabic}
        </ArabicText>
      </div>

      <div className="hidden flex-col gap-1 sm:flex">
        <div className="flex items-center gap-2">
          <SpeakerButton
            arabic={pronoun.arabic}
            label={pronoun.english}
            size="sm"
          />
          <p
            className="text-base font-medium text-foreground sm:text-lg"
            lang="ar-Latn"
          >
            {pronoun.pronunciation}
          </p>
        </div>
        <p className="text-sm text-foreground-soft sm:text-base">
          {pronoun.english}
        </p>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground sm:hidden">
        <span className="font-semibold text-foreground-soft">{pronoun.category}</span>
        {pronoun.usageNote ? <> · {pronoun.usageNote}</> : null}
      </p>
      {pronoun.usageNote ? (
        <p className="hidden text-xs leading-relaxed text-muted-foreground sm:block">
          <span className="font-semibold text-foreground-soft">Usage:</span>{" "}
          {pronoun.usageNote}
        </p>
      ) : null}

      {hasExample ? (
        <div className="mt-auto sm:border-t sm:border-hairline/60 sm:pt-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="-my-1 py-1 text-xs font-medium text-primary hover:underline focus-ring rounded"
          >
            {open ? "Hide example" : "Show example"}
          </button>
          {open ? (
            <div className="mt-2 flex flex-col gap-1 rounded-[10px] bg-background-soft p-3">
              <div className="flex items-start justify-between gap-3">
                <ArabicText
                  variant="body"
                  className="flex-1 text-2xl leading-loose text-foreground sm:text-3xl"
                >
                  {pronoun.example!.arabic}
                </ArabicText>
                {(() => {
                  const ayah = getAudioForCitation(pronoun.example!.citation);
                  return ayah ? (
                    <SpeakerButton
                      arabic={pronoun.example!.arabic}
                      url={ayah.url}
                      ariaLabel={`Play recitation of ${pronoun.example!.citation} by ${ayah.reciter}`}
                      size="sm"
                      className="shrink-0"
                    />
                  ) : null;
                })()}
              </div>
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
