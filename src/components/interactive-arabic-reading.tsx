"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, MousePointer2, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import type {
  LevelTwoReadingSentence,
  LevelTwoReadingToken,
  LevelTwoReadingTokenKind,
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
  adjective: {
    label: "Describing word",
    button:
      "border-accent-rose/45 bg-accent-rose-soft/55 hover:bg-accent-rose-soft focus:bg-accent-rose-soft",
    panel: "border-accent-rose/40 bg-accent-rose-soft",
    dot: "bg-accent-rose",
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

export function InteractiveArabicReading({
  sentences,
  english,
}: {
  sentences: readonly LevelTwoReadingSentence[];
  english: string;
}) {
  const allWords: SelectedWord[] = sentences.flatMap((sentence) =>
    sentence.tokens.map((token, index) => ({ key: `${sentence.id}-${index}`, token })),
  );
  const kinds = (Object.keys(TOKEN_STYLES) as LevelTwoReadingTokenKind[]).filter((kind) =>
    allWords.some((word) => word.token.kind === kind),
  );
  const [selected, setSelected] = useState<SelectedWord>(allWords[0]);
  // Phones get a bottom sheet instead of the inline panel, which sits below
  // the whole passage and is easy to miss on a small screen.
  const [sheetOpen, setSheetOpen] = useState(false);
  const selectedStyle = TOKEN_STYLES[selected.token.kind];
  const selectedIndex = allWords.findIndex((word) => word.key === selected.key);
  const passageRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Scroll the selected word clear of the sheet (and the sticky header) so
  // tapping a word low on the screen never hides it.
  useEffect(() => {
    if (!sheetOpen) return;
    const frame = requestAnimationFrame(() => {
      const word = passageRef.current?.querySelector<HTMLElement>(`[data-word-key="${selected.key}"]`);
      const sheet = sheetRef.current;
      if (!word || !sheet) return;
      const wordBox = word.getBoundingClientRect();
      const sheetTop = sheet.getBoundingClientRect().top;
      const margin = 16;
      if (wordBox.bottom > sheetTop - margin) {
        window.scrollBy({ top: wordBox.bottom - sheetTop + margin, behavior: "smooth" });
      } else if (wordBox.top < 80) {
        window.scrollBy({ top: wordBox.top - 80, behavior: "smooth" });
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [sheetOpen, selected.key]);

  function step(delta: number) {
    const next = allWords[selectedIndex + delta];
    if (next) setSelected(next);
  }

  return (
    <article className="surface p-4 sm:p-7">
      <div className="flex flex-col gap-4 border-b border-hairline pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            <MousePointer2 className="h-4 w-4 text-primary" aria-hidden />
            <span className="sm:hidden">Tap any Arabic word</span>
            <span className="hidden sm:inline">Hover or tap any Arabic word</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Its pronunciation and meaning will appear without interrupting the reading.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground" aria-label="Word colour key">
          {kinds.map((kind) => (
            <span key={kind} className="inline-flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", TOKEN_STYLES[kind].dot)} />
              {TOKEN_STYLES[kind].label}
            </span>
          ))}
        </div>
      </div>

      <div ref={passageRef} className="divide-y divide-hairline">
        {sentences.map((sentence) => (
          <div key={sentence.id} className="py-4 sm:py-6">
            <div dir="rtl" className="flex flex-wrap items-baseline justify-start gap-x-1.5 gap-y-2 sm:gap-x-2 sm:gap-y-3">
              {sentence.tokens.map((token, index) => {
                const key = `${sentence.id}-${index}`;
                const style = TOKEN_STYLES[token.kind];
                return (
                  <span key={key} className="group relative inline-flex">
                    <button
                      type="button"
                      data-word-key={key}
                      onMouseEnter={() => setSelected({ key, token })}
                      onFocus={() => setSelected({ key, token })}
                      onClick={() => {
                        setSelected({ key, token });
                        setSheetOpen(true);
                      }}
                      aria-pressed={selected.key === key}
                      className={cn(
                        "rounded-[10px] border-b-2 px-1.5 py-0.5 transition-all focus-ring sm:rounded-[12px] sm:px-2 sm:py-1",
                        style.button,
                        selected.key === key && "ring-2 ring-primary/25",
                      )}
                    >
                      <ArabicText as="span" variant="display" className="text-[1.65rem] leading-[1.75] sm:text-[2.65rem] sm:leading-[1.9]">
                        {token.punctuationBefore ?? ""}
                        {token.arabic}
                        {token.punctuationAfter ?? ""}
                      </ArabicText>
                    </button>
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 hidden min-w-36 -translate-x-1/2 tile px-3 py-2 text-center shadow-lg group-hover:block [@media(hover:hover)]:group-focus-within:block"
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
        className={cn("hidden gap-3 rounded-[10px] border p-4 sm:grid sm:grid-cols-[auto_1fr] sm:items-center sm:p-5", selectedStyle.panel)}
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

      {sheetOpen ? (
        <>
          {/* Keeps the last lines of the passage reachable above the sheet. */}
          <div className="h-44 sm:hidden" aria-hidden />
          <div
            role="dialog"
            aria-label="Word meaning"
            ref={sheetRef}
            className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 px-3 pb-2 sm:hidden"
          >
            <div className={cn("feedback-enter rounded-[14px] border p-4 shadow-2xl", selectedStyle.panel)}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {selectedStyle.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold leading-snug">{selected.token.english}</p>
                  <p lang="ar-Latn" className="mt-0.5 text-sm italic text-foreground-soft">
                    {selected.token.transliteration}
                  </p>
                </div>
                <ArabicText variant="display" className="shrink-0 text-4xl leading-relaxed">
                  {selected.token.arabic}
                </ArabicText>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-hairline pt-3">
                <button
                  type="button"
                  onClick={() => step(1)}
                  disabled={selectedIndex >= allWords.length - 1}
                  className="btn btn-secondary btn-sm disabled:opacity-40"
                  aria-label="Next word in the passage"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  disabled={selectedIndex <= 0}
                  className="btn btn-secondary btn-sm disabled:opacity-40"
                  aria-label="Previous word in the passage"
                >
                  Back
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
                <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                  {selectedIndex + 1} / {allWords.length}
                </span>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="icon-btn"
                  aria-label="Close word meaning"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      <details className="mt-4 tile p-4 sm:p-5">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-primary focus-ring">
          <BookOpen className="h-4 w-4" aria-hidden />
          Show the complete English meaning
        </summary>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-foreground-soft">
          {english}
        </p>
      </details>
    </article>
  );
}
