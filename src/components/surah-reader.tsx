"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { SpeakerButton } from "@/components/speaker-button";
import { cn } from "@/lib/cn";
import type {
  QuranAyah,
  QuranWord,
  QuranWordPos,
  Surah,
} from "@/data/quran";
import { ayahAudioUrl } from "@/data/quran";

const POS_LABEL: Record<QuranWordPos, string> = {
  noun: "Noun",
  "proper-noun": "Proper noun",
  verb: "Verb",
  pronoun: "Pronoun",
  particle: "Particle",
  preposition: "Preposition",
  conjunction: "Conjunction",
  demonstrative: "Demonstrative",
  relative: "Relative pronoun",
  interrogative: "Interrogative",
  negation: "Negation particle",
  vocative: "Vocative particle",
};

const POS_TONE: Record<QuranWordPos, string> = {
  noun: "bg-[oklch(0.95_0.04_220)] text-[oklch(0.32_0.10_220)]",
  "proper-noun": "bg-[oklch(0.95_0.04_280)] text-[oklch(0.32_0.10_280)]",
  verb: "bg-[oklch(0.95_0.04_145)] text-[oklch(0.32_0.10_145)]",
  pronoun: "bg-[oklch(0.95_0.04_40)] text-[oklch(0.32_0.10_40)]",
  particle: "bg-[oklch(0.95_0.04_350)] text-[oklch(0.32_0.10_350)]",
  preposition: "bg-[oklch(0.95_0.04_350)] text-[oklch(0.32_0.10_350)]",
  conjunction: "bg-[oklch(0.95_0.04_350)] text-[oklch(0.32_0.10_350)]",
  demonstrative: "bg-[oklch(0.95_0.04_80)] text-[oklch(0.32_0.10_80)]",
  relative: "bg-[oklch(0.95_0.04_80)] text-[oklch(0.32_0.10_80)]",
  interrogative: "bg-[oklch(0.95_0.04_350)] text-[oklch(0.32_0.10_350)]",
  negation: "bg-[oklch(0.95_0.04_10)] text-[oklch(0.32_0.10_10)]",
  vocative: "bg-[oklch(0.95_0.04_10)] text-[oklch(0.32_0.10_10)]",
};

export function SurahReader({ surah }: { surah: Surah }) {
  const [open, setOpen] = useState<{
    ayah: number;
    index: number;
  } | null>(null);
  const openWord =
    open !== null
      ? surah.ayahs[open.ayah - 1]?.words[open.index]
      : undefined;

  return (
    <div className="space-y-5">
      {surah.ayahs.map((ayah) => (
        <AyahCard
          key={ayah.number}
          surah={surah}
          ayah={ayah}
          openIndex={open?.ayah === ayah.number ? open.index : null}
          onOpen={(idx) => setOpen({ ayah: ayah.number, index: idx })}
        />
      ))}

      {openWord ? (
        <WordPopup
          word={openWord}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}

function AyahCard({
  surah,
  ayah,
  openIndex,
  onOpen,
}: {
  surah: Surah;
  ayah: QuranAyah;
  openIndex: number | null;
  onOpen: (idx: number) => void;
}) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <header className="mb-3 flex items-center gap-3">
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-border bg-background-soft px-2 text-xs font-semibold tabular-nums text-foreground-soft">
          {ayah.number}
        </span>
        <SpeakerButton
          arabic=""
          url={ayahAudioUrl(surah.number, ayah.number)}
          ariaLabel={`Play recitation of surah ${surah.number}, verse ${ayah.number}`}
          size="sm"
        />
        <span className="text-xs text-muted-foreground">Tap any word</span>
      </header>

      <div
        className="flex flex-wrap-reverse justify-end gap-x-2 gap-y-3 text-right leading-loose"
        dir="rtl"
      >
        {ayah.words.map((w, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onOpen(idx)}
            className={cn(
              "rounded-lg px-1.5 py-0.5 transition-colors hover:bg-muted focus-ring",
              openIndex === idx && "bg-primary-soft text-primary",
            )}
          >
            <ArabicText variant="display" className="text-3xl sm:text-4xl">
              {w.arabic}
            </ArabicText>
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {ayah.translation}
      </p>
    </article>
  );
}

function WordPopup({
  word,
  onClose,
}: {
  word: QuranWord;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:bottom-6 sm:px-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <ArabicText
              variant="display"
              className="text-4xl"
              dir="rtl"
            >
              {word.arabic}
            </ArabicText>
            <p
              className="mt-1 text-sm text-muted-foreground"
              lang="ar-Latn"
            >
              {word.translit}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-ring"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Meaning
            </p>
            <p className="text-base">{word.english}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                POS_TONE[word.pos],
              )}
            >
              {POS_LABEL[word.pos]}
            </span>
            {word.root ? (
              <span className="rounded-full border border-dashed border-accent-gold bg-accent-gold-soft px-2.5 py-0.5 text-[11px] font-semibold text-foreground-soft">
                Root&nbsp;
                <ArabicText variant="inline" className="font-semibold">
                  {word.root}
                </ArabicText>
              </span>
            ) : null}
          </div>
          {word.note ? (
            <p className="text-xs text-muted-foreground">{word.note}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
