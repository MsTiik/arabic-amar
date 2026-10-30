"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { readingSentenceAnchor } from "@/components/reading-exercise";
import type {
  LevelTwoReadingSentence,
  LevelTwoReadingToken,
  LevelTwoReadingTokenKind,
} from "@/data/level-two-lessons";
import { cn } from "@/lib/cn";

const TOKEN_STYLES: Record<
  LevelTwoReadingTokenKind,
  { label: string; button: string; underline: string; panel: string; dot: string }
> = {
  verb: {
    label: "Action",
    button:
      "border-tense-present-accent/50 bg-tense-present/55 hover:bg-tense-present focus:bg-tense-present",
    underline: "border-tense-present-accent/70 hover:bg-tense-present focus:bg-tense-present",
    panel: "border-tense-present-accent/40 bg-tense-present",
    dot: "bg-tense-present-accent",
  },
  noun: {
    label: "Person or thing",
    button:
      "border-accent-sky/45 bg-accent-sky-soft/55 hover:bg-accent-sky-soft focus:bg-accent-sky-soft",
    underline: "border-accent-sky/70 hover:bg-accent-sky-soft focus:bg-accent-sky-soft",
    panel: "border-accent-sky/40 bg-accent-sky-soft",
    dot: "bg-accent-sky",
  },
  adjective: {
    label: "Describing word",
    button:
      "border-accent-rose/45 bg-accent-rose-soft/55 hover:bg-accent-rose-soft focus:bg-accent-rose-soft",
    underline: "border-accent-rose/70 hover:bg-accent-rose-soft focus:bg-accent-rose-soft",
    panel: "border-accent-rose/40 bg-accent-rose-soft",
    dot: "bg-accent-rose",
  },
  connector: {
    label: "Connecting word",
    button:
      "border-accent-amber/45 bg-accent-amber-soft/55 hover:bg-accent-amber-soft focus:bg-accent-amber-soft",
    underline: "border-accent-amber/70 hover:bg-accent-amber-soft focus:bg-accent-amber-soft",
    panel: "border-accent-amber/40 bg-accent-amber-soft",
    dot: "bg-accent-amber",
  },
};

interface SelectedWord {
  key: string;
  token: LevelTwoReadingToken;
}

type ReadingMode = "read" | "explore";

const LATIN_PUNCTUATION: Record<string, string> = { "،": ",", "؟": "?", "؛": ";" };

/** The sentence's own transliteration, or one built from its words. */
function sentenceTransliteration(sentence: LevelTwoReadingSentence): string {
  if (sentence.transliteration) return sentence.transliteration;
  return sentence.tokens
    .map((token) => {
      const after = (token.punctuationAfter ?? "").replace(/[،؟؛]/g, (mark) => LATIN_PUNCTUATION[mark]);
      return `${token.transliteration}${after.replace(/[«»]/g, "")}`;
    })
    .join(" ");
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
  const [mode, setMode] = useState<ReadingMode>("read");
  const [openSentences, setOpenSentences] = useState<ReadonlySet<string>>(new Set());
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

  function toggleSentence(id: string) {
    setOpenSentences((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function step(delta: number) {
    const next = allWords[selectedIndex + delta];
    if (next) setSelected(next);
  }

  return (
    <article className="surface p-4 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-hairline pb-3">
        <div role="group" aria-label="Reading view" className="inline-flex rounded-full border border-hairline bg-muted/40 p-0.5 text-xs font-semibold">
          {(["read", "explore"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              aria-pressed={mode === option}
              className={cn(
                "rounded-full px-3 py-1.5 transition-colors focus-ring",
                mode === option ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              {option === "read" ? "Read" : "Explore"}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="sm:hidden">Tap a word · tap a number for English</span>
          <span className="hidden sm:inline">Hover or tap a word · tap a number for English</span>
        </p>
        <div className="flex w-full flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground" aria-label="Word colour key">
          {kinds.map((kind) => (
            <span key={kind} className="inline-flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", TOKEN_STYLES[kind].dot)} />
              {TOKEN_STYLES[kind].label}
            </span>
          ))}
        </div>
      </div>

      <div ref={passageRef} className={cn(mode === "explore" ? "divide-y divide-hairline" : "py-2 sm:py-4")}>
        {sentences.map((sentence, sentenceIndex) => {
          const translationOpen = openSentences.has(sentence.id);
          const translationId = `${readingSentenceAnchor(sentence.id)}-english`;
          return (
            <div
              key={sentence.id}
              id={readingSentenceAnchor(sentence.id)}
              className={cn(
                "scroll-mt-24 rounded-[10px] transition-colors target:bg-primary-soft/60 target:ring-2 target:ring-primary/30",
                mode === "explore" ? "py-3 sm:py-4" : "py-1 sm:py-1.5",
              )}
            >
              <div dir="rtl" className="flex items-start gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => toggleSentence(sentence.id)}
                  aria-expanded={translationOpen}
                  aria-controls={translationId}
                  aria-label={`Sentence ${sentenceIndex + 1}: ${translationOpen ? "hide" : "show"} the English`}
                  className={cn(
                    "mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums transition-colors focus-ring sm:mt-3 sm:h-7 sm:w-7 sm:text-xs",
                    translationOpen ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary",
                  )}
                >
                  {sentenceIndex + 1}
                </button>
                <div
                  className={cn(
                    "flex min-w-0 flex-1 flex-wrap items-baseline justify-start",
                    mode === "explore" ? "gap-x-1 gap-y-1.5 sm:gap-x-1.5 sm:gap-y-2" : "gap-x-1 gap-y-0 sm:gap-x-1.5",
                  )}
                >
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
                            "transition-all focus-ring",
                            mode === "explore"
                              ? cn("rounded-[10px] border-b-2 px-1 py-0.5 sm:rounded-[12px] sm:px-1.5 sm:py-0.5", style.button)
                              : cn("rounded-[6px] border-b-2 px-0.5", style.underline),
                            selected.key === key && (mode === "explore" || sheetOpen) && "ring-2 ring-primary/25",
                          )}
                        >
                          <ArabicText
                            as="span"
                            variant="display"
                            className={cn(
                              "text-[1.35rem] sm:text-[2rem]",
                              mode === "explore" ? "leading-[1.75] sm:leading-[1.9]" : "leading-[1.65] sm:leading-[1.8]",
                            )}
                          >
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
              {translationOpen ? (
                <div id={translationId} className="mb-1 ms-8 me-1 mt-1 border-s-2 border-primary/30 ps-3 sm:ms-10">
                  <p lang="ar-Latn" className="text-sm italic text-foreground-soft">
                    {sentenceTransliteration(sentence)}
                  </p>
                  <p className="text-sm font-medium">{sentence.english}</p>
                </div>
              ) : null}
            </div>
          );
        })}
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
