"use client";

import { useState } from "react";
import { BookOpen, MousePointer2 } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import {
  LEVEL_TWO_MARKETPLACE_PASSAGE,
  LEVEL_TWO_MARKETPLACE_READING,
  type LevelTwoReadingToken,
  type LevelTwoReadingTokenKind,
} from "@/data/level-two-lessons";
import { cn } from "@/lib/cn";

const TOKEN_STYLES: Record<
  LevelTwoReadingTokenKind,
  { label: string; button: string; panel: string; dot: string }
> = {
  verb: {
    label: "Action",
    button:
      "border-tense-present-accent/50 bg-tense-present/55 hover:bg-tense-present focus:bg-tense-present",
    panel: "border-tense-present-accent/40 bg-tense-present",
    dot: "bg-tense-present-accent",
  },
  noun: {
    label: "Person or thing",
    button:
      "border-accent-sky/45 bg-accent-sky-soft/55 hover:bg-accent-sky-soft focus:bg-accent-sky-soft",
    panel: "border-accent-sky/40 bg-accent-sky-soft",
    dot: "bg-accent-sky",
  },
  connector: {
    label: "Connecting word",
    button:
      "border-accent-amber/45 bg-accent-amber-soft/55 hover:bg-accent-amber-soft focus:bg-accent-amber-soft",
    panel: "border-accent-amber/40 bg-accent-amber-soft",
    dot: "bg-accent-amber",
  },
};

interface SelectedWord {
  key: string;
  token: LevelTwoReadingToken;
}

export function InteractiveArabicReading() {
  const firstToken = LEVEL_TWO_MARKETPLACE_READING[0].tokens[0];
  const [selected, setSelected] = useState<SelectedWord>({
    key: `${LEVEL_TWO_MARKETPLACE_READING[0].id}-0`,
    token: firstToken,
  });
  const selectedStyle = TOKEN_STYLES[selected.token.kind];

  return (
    <article className="surface p-4 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-hairline pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <MousePointer2 className="h-4 w-4 text-primary" aria-hidden />
            Hover or tap any Arabic word
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Its pronunciation and meaning will appear without interrupting the reading.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground" aria-label="Word colour key">
          {(Object.keys(TOKEN_STYLES) as LevelTwoReadingTokenKind[]).map((kind) => (
            <span key={kind} className="inline-flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", TOKEN_STYLES[kind].dot)} />
              {TOKEN_STYLES[kind].label}
            </span>
          ))}
        </div>
      </div>

      <div className="divide-y divide-hairline">
        {LEVEL_TWO_MARKETPLACE_READING.map((sentence) => (
          <div key={sentence.id} className="py-5 sm:py-6">
            <div dir="rtl" className="flex flex-wrap items-baseline justify-start gap-x-2 gap-y-3">
              {sentence.tokens.map((token, index) => {
                const key = `${sentence.id}-${index}`;
                const style = TOKEN_STYLES[token.kind];
                return (
                  <span key={key} className="group relative inline-flex">
                    <button
                      type="button"
                      onMouseEnter={() => setSelected({ key, token })}
                      onFocus={() => setSelected({ key, token })}
                      onClick={() => setSelected({ key, token })}
                      aria-pressed={selected.key === key}
                      className={cn(
                        "rounded-[10px] border-b-2 px-2 py-1 transition-all focus-ring",
                        style.button,
                        selected.key === key && "ring-2 ring-primary/25",
                      )}
                    >
                      <ArabicText as="span" variant="display" className="text-[2rem] leading-[1.9] sm:text-[2.65rem]">
                        {token.arabic}
                        {token.punctuationAfter ?? ""}
                      </ArabicText>
                    </button>
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 hidden min-w-36 -translate-x-1/2 tile px-3 py-2 text-center shadow-lg group-hover:block group-focus-within:block"
                    >
                      <span lang="ar-Latn" className="block text-xs italic text-foreground-soft">
                        {token.transliteration}
                      </span>
                      <span className="mt-0.5 block text-xs font-semibold text-foreground">
                        {token.english}
                      </span>
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <section
        aria-live="polite"
        className={cn("grid gap-3 rounded-[10px] border p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:p-5", selectedStyle.panel)}
      >
        <ArabicText variant="display" className="text-4xl leading-relaxed sm:min-w-40 sm:text-center sm:text-5xl">
          {selected.token.arabic}
        </ArabicText>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {selectedStyle.label}
          </p>
          <p lang="ar-Latn" className="mt-1 text-sm italic text-foreground-soft">
            {selected.token.transliteration}
          </p>
          <p className="mt-1 text-base font-semibold">{selected.token.english}</p>
        </div>
      </section>

      <details className="mt-4 tile p-4 sm:p-5">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-primary focus-ring">
          <BookOpen className="h-4 w-4" aria-hidden />
          Show the complete English meaning
        </summary>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-foreground-soft">
          {LEVEL_TWO_MARKETPLACE_PASSAGE.english}
        </p>
      </details>
    </article>
  );
}
