"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { FoundationsBadge } from "@/components/foundations-badge";
import { SpeakerButton } from "@/components/speaker-button";
import { cn } from "@/lib/cn";
import { TOP_QURAN_WORDS } from "@/data/quran/top-frequency";
import type { QuranFrequencyWord } from "@/data/quran/top-frequency";

const PREVIEW_COUNT = 6;

export function QuranFrequencyDeck() {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const groups = useMemo(() => {
    const map = new Map<string, QuranFrequencyWord[]>();
    for (const w of TOP_QURAN_WORDS) {
      if (!map.has(w.category)) map.set(w.category, []);
      map.get(w.category)!.push(w);
    }
    return [...map.entries()];
  }, []);

  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2">
            <FoundationsBadge />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Top Qur&apos;ānic words
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            High-frequency lemmas that account for roughly half of every word
            in the muṣḥaf. Curated, not from the curriculum doc.
          </p>
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          {TOP_QURAN_WORDS.length} words · {groups.length} categories
        </p>
      </header>

      <div className="space-y-6">
        {groups.map(([category, words]) => {
          const isExpanded = expanded.has(category);
          const overflows = words.length > PREVIEW_COUNT;
          const visible =
            overflows && !isExpanded
              ? words.slice(0, PREVIEW_COUNT)
              : words;
          const toggle = () =>
            setExpanded((prev) => {
              const next = new Set(prev);
              if (next.has(category)) next.delete(category);
              else next.add(category);
              return next;
            });
          return (
            <div key={category}>
              <header className="mb-2 flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {category}
                </h3>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {words.length} words
                </span>
              </header>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visible.map((w) => (
                  <FrequencyCard key={w.id} word={w} />
                ))}
              </div>
              {overflows ? (
                <button
                  type="button"
                  onClick={toggle}
                  className="mt-3 inline-flex items-center gap-1 rounded-full border border-border bg-background-soft px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-ring"
                >
                  {isExpanded
                    ? "Show less"
                    : `Show all ${words.length}`}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      isExpanded && "rotate-180",
                    )}
                  />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FrequencyCard({ word }: { word: QuranFrequencyWord }) {
  return (
    <div className="rounded-2xl border border-border bg-background-soft px-3 py-2.5">
      <div className="flex items-start justify-between gap-2">
        <ArabicText variant="display" className="text-2xl">
          {word.arabic}
        </ArabicText>
        <SpeakerButton
          arabic={word.arabic}
          label={word.english}
          size="sm"
        />
      </div>
      <p
        className="mt-1 text-xs italic text-muted-foreground"
        lang="ar-Latn"
      >
        {word.pronunciation}
      </p>
      <p className="text-sm font-medium leading-snug">{word.english}</p>
      {word.root ? (
        <p className="mt-1 text-[11px] text-muted-foreground">
          Root&nbsp;
          <ArabicText variant="inline" className="font-semibold">
            {word.root}
          </ArabicText>
        </p>
      ) : null}
    </div>
  );
}
