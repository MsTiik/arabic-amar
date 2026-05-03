"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { SpeakerButton } from "@/components/speaker-button";
import { cn } from "@/lib/cn";
import type {
  QuranAyah,
  QuranWord,
  QuranWordPos,
  Surah,
  WordExtras,
} from "@/data/quran";
import { ayahAudioUrl, getWordExtras } from "@/data/quran";

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
  const openExtras =
    open !== null
      ? getWordExtras(surah.number, open.ayah, open.index)
      : undefined;

  return (
    <div className="space-y-5">
      {surah.ayahs.map((ayah, idx) => (
        <AyahCard
          key={ayah.number}
          surah={surah}
          ayah={ayah}
          // Only the first ayah shows the "Tap any word" affordance hint;
          // by ayah 2 the reader has already learned the interaction.
          showTapHint={idx === 0}
          openIndex={open?.ayah === ayah.number ? open.index : null}
          onOpen={(i) => setOpen({ ayah: ayah.number, index: i })}
        />
      ))}

      {openWord ? (
        <WordPopup
          word={openWord}
          extras={openExtras}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}

function AyahCard({
  surah,
  ayah,
  showTapHint,
  openIndex,
  onOpen,
}: {
  surah: Surah;
  ayah: QuranAyah;
  showTapHint: boolean;
  openIndex: number | null;
  onOpen: (idx: number) => void;
}) {
  const [showTranslit, setShowTranslit] = useState(false);

  return (
    <article className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <header className="mb-3 flex flex-wrap items-center gap-3">
        <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-border bg-background-soft px-2 text-xs font-semibold tabular-nums text-foreground-soft">
          {ayah.number}
        </span>
        <SpeakerButton
          arabic=""
          url={ayahAudioUrl(surah.number, ayah.number)}
          ariaLabel={`Play recitation of surah ${surah.number}, verse ${ayah.number}`}
          size="sm"
        />
        <button
          type="button"
          onClick={() => setShowTranslit((v) => !v)}
          aria-pressed={showTranslit}
          className={cn(
            "ml-auto rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-ring",
            showTranslit
              ? "border-primary bg-primary-soft text-primary"
              : "border-border bg-background-soft text-muted-foreground hover:text-foreground",
          )}
        >
          {showTranslit ? "Hide transliteration" : "Show transliteration"}
        </button>
        {showTapHint ? (
          <span className="basis-full text-xs text-muted-foreground">
            Tap any word for its meaning, root, and grammar.
          </span>
        ) : null}
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
              "flex flex-col items-center rounded-lg px-1.5 py-0.5 transition-colors hover:bg-muted focus-ring",
              openIndex === idx && "bg-primary-soft text-primary",
            )}
          >
            <ArabicText variant="display" className="text-3xl sm:text-4xl">
              {w.arabic}
            </ArabicText>
            {showTranslit ? (
              <span
                className="mt-1 text-xs italic text-muted-foreground"
                lang="ar-Latn"
                dir="ltr"
              >
                {w.translit}
              </span>
            ) : null}
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
  extras,
  onClose,
}: {
  word: QuranWord;
  extras: WordExtras | undefined;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:bottom-6 sm:px-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-4 shadow-2xl sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <ArabicText
              variant="display"
              className="text-[2.475rem] leading-[1.15]"
              dir="rtl"
            >
              {word.arabic}
            </ArabicText>
            <p
              className="mt-0.5 text-sm text-muted-foreground"
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

        <p className="mt-3 text-base font-medium leading-snug">
          {word.english}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {extras?.inTop125 ? (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-accent-gold bg-accent-gold-soft px-2.5 py-1 text-xs font-semibold text-foreground-soft"
              title="One of the 125 most-used words in the Qurʾān"
            >
              <Sparkles className="h-3 w-3 text-accent-gold" />
              Top 125
            </span>
          ) : null}
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
              POS_TONE[word.pos],
            )}
          >
            {POS_LABEL[word.pos]}
          </span>
          {word.root ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-accent-gold bg-accent-gold-soft px-2.5 py-1 text-xs font-semibold text-foreground-soft">
              <span className="uppercase tracking-wider text-muted-foreground">
                Root
              </span>
              <ArabicText variant="display" className="text-[1.375rem]">
                {word.root}
              </ArabicText>
            </span>
          ) : null}
        </div>

        {extras && (extras.lemma || extras.frequency > 0) ? (
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {extras.lemma ? (
              <span>
                Dictionary:{" "}
                <ArabicText
                  variant="display"
                  className="text-base text-foreground-soft"
                >
                  {extras.lemma}
                </ArabicText>
              </span>
            ) : null}
            {extras.frequency > 0 ? (
              <span>
                Appears{" "}
                <span className="font-semibold tabular-nums text-foreground-soft">
                  {extras.frequency.toLocaleString()}×
                </span>{" "}
                in the Qurʾān
              </span>
            ) : null}
          </div>
        ) : null}

        {word.note ? (
          <p className="mt-2 text-xs italic text-muted-foreground">
            {word.note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
