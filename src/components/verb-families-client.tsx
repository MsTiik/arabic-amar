"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCcw,
  Shuffle,
  Sparkles,
  XCircle,
} from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import {
  VERB_FAMILIES,
  VERB_FORM_KEYS,
  type VerbFamily,
  type VerbFormKey,
} from "@/data/verb-families";
import { cn } from "@/lib/cn";
import {
  isVerbSortCorrect,
  shuffledVerbFormKeys,
  VERB_FORM_META,
} from "@/lib/verb-families";

type Mode = "explore" | "sort";
type SortStatus = "building" | "correct" | "incorrect";

const FORM_STYLES: Record<
  VerbFormKey,
  { surface: string; accent: string; dot: string }
> = {
  past: {
    surface: "border-l-4 border-l-tense-past-accent",
    accent: "text-tense-past-accent",
    dot: "bg-tense-past-accent",
  },
  present: {
    surface: "border-l-4 border-l-tense-present-accent",
    accent: "text-tense-present-accent",
    dot: "bg-tense-present-accent",
  },
  command: {
    surface: "border-l-4 border-l-tense-command-accent",
    accent: "text-tense-command-accent",
    dot: "bg-tense-command-accent",
  },
  masdar: {
    surface: "border-l-4 border-l-tense-masdar-accent",
    accent: "text-tense-masdar-accent",
    dot: "bg-tense-masdar-accent",
  },
};

export function VerbFamiliesClient() {
  const [mode, setMode] = useState<Mode>("explore");
  const [familyIndex, setFamilyIndex] = useState(0);

  return (
    <div className="space-y-7">
      <div className="segmented grid grid-cols-2">
        <ModeButton active={mode === "explore"} onClick={() => setMode("explore")}>
          <Sparkles className="h-4 w-4" aria-hidden />
          Explore the families
        </ModeButton>
        <ModeButton active={mode === "sort"} onClick={() => setMode("sort")}>
          <Shuffle className="h-4 w-4" aria-hidden />
          Sort the forms
        </ModeButton>
      </div>

      {mode === "explore" ? (
        <ExploreMode
          key={VERB_FAMILIES[familyIndex].id}
          family={VERB_FAMILIES[familyIndex]}
          familyIndex={familyIndex}
          onSelect={setFamilyIndex}
        />
      ) : (
        <SortMode />
      )}
    </div>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "segmented-item min-h-11 focus-ring",
        !active && "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ExploreMode({
  family,
  familyIndex,
  onSelect,
}: {
  family: VerbFamily;
  familyIndex: number;
  onSelect: (index: number) => void;
}) {
  const pickerRef = useRef<HTMLDivElement>(null);

  function scrollPicker(direction: "left" | "right") {
    pickerRef.current?.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  }

  return (
    <div className="space-y-6">
      <section aria-labelledby="family-picker-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="family-picker-heading" className="text-lg font-display">
              Choose a verb
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Use the arrow buttons to browse all {VERB_FAMILIES.length} verbs.
            </p>
          </div>
          <p className="text-xs font-semibold text-muted-foreground">
            {familyIndex + 1} of {VERB_FAMILIES.length}
          </p>
        </div>
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
          <button
            type="button"
            onClick={() => scrollPicker("left")}
            aria-label="Show earlier verbs"
            className="icon-btn h-11 w-11"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <div ref={pickerRef} className="flex gap-2 overflow-x-auto scroll-smooth pb-2">
            {VERB_FAMILIES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(index)}
                aria-pressed={index === familyIndex}
                className={cn(
                  "min-w-32 shrink-0 rounded-[10px] border px-3 py-2 text-center transition-colors focus-ring",
                  index === familyIndex
                    ? "border-primary bg-primary-soft shadow-sm"
                    : "border-hairline bg-card hover:bg-muted",
                )}
              >
                <ArabicText variant="display" className="text-3xl leading-tight">
                  {item.forms.past.arabic}
                </ArabicText>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {item.meaning}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollPicker("right")}
            aria-label="Show more verbs"
            className="icon-btn h-11 w-11 border-primary/30 bg-primary-soft text-primary hover:bg-primary/10"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </section>

      <article className="overflow-hidden surface">
        <header className="flex flex-col gap-4 border-b border-hairline p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
          <div>
            <p className="section-label">Verb family</p>
            <h2 className="mt-1 section-title">
              {family.meaning}
            </h2>
            {family.usageNote ? (
              <p className="mt-2 max-w-2xl text-sm text-foreground-soft">
                {family.usageNote}
              </p>
            ) : null}
          </div>
          <div className="self-start tile border-l-2 border-l-accent-gold px-4 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Root
            </p>
            <ArabicText variant="display" className="text-2xl">
              {family.root}
            </ArabicText>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          {VERB_FORM_KEYS.map((key) => (
            <FamilyFormCard key={key} family={family} formKey={key} />
          ))}
        </div>

        {family.relatedForms?.length ? (
          <details className="group border-t border-hairline px-4 py-5 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 focus-ring">
              <span className="flex flex-wrap items-baseline gap-2 text-sm font-semibold">
                Related form{family.relatedForms.length === 1 ? "" : "s"}
                <ArabicText as="span" className="text-xl text-foreground-soft">صِيغَة أُخْرَى</ArabicText>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Show
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" aria-hidden />
              </span>
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {family.relatedForms.map((form) => (
                <div key={`${form.label}-${form.arabic}`} className="tile p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    {form.label}
                  </p>
                  <ArabicText variant="display" className="mt-2 text-3xl">
                    {form.arabic}
                  </ArabicText>
                  <p lang="ar-Latn" className="mt-1 text-sm italic text-foreground-soft">
                    {form.transliteration}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{form.english}</p>
                </div>
              ))}
            </div>
          </details>
        ) : null}

        <div
          className={cn(
            "grid gap-4 border-t border-hairline bg-background-soft p-4 sm:p-6",
            (family.opposite || family.relatedNameOfAllah) &&
              "lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.42fr)]",
          )}
        >
          <ContextCarousel family={family} />

          <div className="space-y-3">
            {family.opposite ? (
              <aside className="surface p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Useful opposite
                </p>
                <ArabicText variant="display" className="mt-2 text-3xl">
                  {family.opposite.arabic}
                </ArabicText>
                <p lang="ar-Latn" className="text-sm italic text-foreground-soft">
                  {family.opposite.transliteration}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {family.opposite.english}
                </p>
                {family.opposite.familyId ? (
                  <button
                    type="button"
                    onClick={() => {
                      const index = VERB_FAMILIES.findIndex(
                        (item) => item.id === family.opposite?.familyId,
                      );
                      if (index >= 0) onSelect(index);
                    }}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-ring"
                  >
                    Open this family <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </button>
                ) : null}
              </aside>
            ) : null}

            {family.relatedNameOfAllah ? (
              <aside className="surface border-l-4 border-l-accent-gold p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Related Name of Allah
                </p>
                <ArabicText variant="display" className="mt-2 text-3xl">
                  {family.relatedNameOfAllah.arabic}
                </ArabicText>
                <p lang="ar-Latn" className="text-sm italic text-foreground-soft">
                  {family.relatedNameOfAllah.transliteration}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {family.relatedNameOfAllah.english}
                </p>
                <Link
                  href={family.relatedNameOfAllah.href}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-ring"
                >
                  Study the Names collection <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </aside>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}

function ContextCarousel({ family }: { family: VerbFamily }) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const example = family.examples[exampleIndex] ?? family.examples[0];
  if (!example) return null;
  const hasSourceMeta =
    example.kind !== "class" || Boolean(example.grade) || Boolean(example.url);

  function move(direction: -1 | 1) {
    setExampleIndex((current) =>
      (current + direction + family.examples.length) % family.examples.length,
    );
  }

  return (
    <section className="space-y-3" aria-labelledby={`${family.id}-context-heading`}>
      <div className="flex items-center justify-between gap-3">
        <h3 id={`${family.id}-context-heading`} className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-accent-gold" aria-hidden />
          Examples
        </h3>
        <span className="text-xs font-semibold text-muted-foreground">
          {exampleIndex + 1} of {family.examples.length}
        </span>
      </div>

      <div className="surface p-4 sm:p-6">
        {hasSourceMeta ? (
          <div className="flex items-center justify-between gap-3">
            <span className="flex flex-wrap items-center gap-2">
              {example.kind !== "class" ? (
                <span className="chip bg-primary-soft text-primary">
                  {example.kind === "quran" ? "Qur’an" : "Hadith"}
                </span>
              ) : null}
              {example.grade ? (
                <span className="text-xs font-medium text-muted-foreground">{example.grade}</span>
              ) : null}
            </span>
            {example.url ? (
              <a
                href={example.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-ring"
              >
                {example.reference}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            ) : null}
          </div>
        ) : null}

        <HighlightedArabicExample
          arabic={example.arabic}
          focusArabic={example.focusArabic}
          className={hasSourceMeta ? "mt-5" : "mt-1"}
        />
        <p lang="ar-Latn" className="mt-2 text-sm italic leading-relaxed text-foreground-soft">
          {example.transliteration}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{example.english}</p>
        {example.note ? (
          <details className="mt-3 tile px-3 py-2 text-xs leading-relaxed text-foreground-soft">
            <summary className="cursor-pointer font-semibold text-primary focus-ring">Why this example?</summary>
            <p className="mt-2">{example.note}</p>
          </details>
        ) : null}

        {family.examples.length > 1 ? (
          <div className="mt-5 flex items-center justify-between border-t border-hairline pt-4">
            <button
              type="button"
              onClick={() => move(-1)}
              className="btn btn-secondary btn-sm"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Previous
            </button>
            <div className="flex gap-1.5" aria-hidden>
              {family.examples.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === exampleIndex ? "w-6 bg-primary" : "w-2 bg-border",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => move(1)}
              className="btn btn-primary btn-sm"
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function HighlightedArabicExample({
  arabic,
  focusArabic,
  className,
}: {
  arabic: string;
  focusArabic: string;
  className?: string;
}) {
  const focusIndex = arabic.indexOf(focusArabic);
  if (focusIndex < 0) {
    return (
      <ArabicText
        variant="display"
        className={cn("text-right text-4xl leading-[1.9] sm:text-5xl", className)}
      >
        {arabic}
      </ArabicText>
    );
  }

  return (
    <ArabicText
      variant="display"
      className={cn("text-right text-4xl leading-[1.9] sm:text-5xl", className)}
    >
      {arabic.slice(0, focusIndex)}
      <span className="rounded-lg bg-primary-soft px-1 text-primary">
        {focusArabic}
      </span>
      {arabic.slice(focusIndex + focusArabic.length)}
    </ArabicText>
  );
}

function FamilyFormCard({
  family,
  formKey,
}: {
  family: VerbFamily;
  formKey: VerbFormKey;
}) {
  const form = family.forms[formKey];
  const meta = VERB_FORM_META[formKey];
  const style = FORM_STYLES[formKey];

  return (
    <section className={cn("min-w-0 tile p-4", style.surface)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={cn("text-xs font-bold uppercase tracking-wide", style.accent)}>
            {meta.shortLabel}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {meta.grammarLabel} · {meta.prompt}
          </p>
        </div>
        <ArabicText className="text-lg text-muted-foreground">
          {meta.arabicLabel}
        </ArabicText>
      </div>
      <ArabicText variant="display" className="mt-5 text-center text-4xl leading-relaxed sm:text-5xl">
        {form.arabic}
      </ArabicText>
      <p lang="ar-Latn" className="mt-2 text-center text-sm font-medium italic text-foreground-soft">
        {form.transliteration}
      </p>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        {form.english}
      </p>
    </section>
  );
}

function SortMode() {
  const [round, setRound] = useState(0);
  const [placements, setPlacements] = useState<
    Partial<Record<VerbFormKey, VerbFormKey>>
  >({});
  const [selected, setSelected] = useState<VerbFormKey | null>(null);
  const [status, setStatus] = useState<SortStatus>("building");
  const [score, setScore] = useState(0);
  const family = VERB_FAMILIES[round % VERB_FAMILIES.length];
  const shuffled = useMemo(() => shuffledVerbFormKeys(round + 31), [round]);
  const placedKeys = new Set(Object.values(placements));
  const bank = shuffled.filter((key) => !placedKeys.has(key));
  const complete = VERB_FORM_KEYS.every((key) => placements[key]);

  function placeIn(slot: VerbFormKey) {
    if (!selected || status !== "building") return;
    setPlacements((current) => {
      const next = { ...current };
      for (const key of VERB_FORM_KEYS) {
        if (next[key] === selected) delete next[key];
      }
      next[slot] = selected;
      return next;
    });
    setSelected(null);
  }

  function returnToBank(slot: VerbFormKey) {
    if (status !== "building") return;
    setPlacements((current) => {
      const next = { ...current };
      delete next[slot];
      return next;
    });
  }

  function check() {
    if (!complete) return;
    const correct = isVerbSortCorrect(placements);
    setStatus(correct ? "correct" : "incorrect");
    if (correct) setScore((value) => value + 1);
  }

  function nextRound() {
    setRound((value) => value + 1);
    setPlacements({});
    setSelected(null);
    setStatus("building");
  }

  function resetRound() {
    setPlacements({});
    setSelected(null);
    setStatus("building");
  }

  return (
    <section className="overflow-hidden surface">
      <header className="border-b border-hairline p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-label">Round {round + 1}</p>
            <h2 className="mt-1 section-title">
              Sort one verb family
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a shuffled form, then select the column where it belongs.
            </p>
          </div>
          <div className="tile px-4 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Score</p>
            <p className="text-xl font-bold tabular-nums">{score}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 tile p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Meaning
            </p>
            <p className="text-lg font-semibold">{family.meaning}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Root
            </p>
            <ArabicText variant="display" className="text-2xl">
              {family.root}
            </ArabicText>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {VERB_FORM_KEYS.map((slot) => {
            const tileKey = placements[slot];
            const slotCorrect = tileKey === slot;
            const meta = VERB_FORM_META[slot];
            const style = FORM_STYLES[slot];
            return (
              <button
                key={slot}
                type="button"
                onClick={() => (tileKey ? returnToBank(slot) : placeIn(slot))}
                disabled={status !== "building"}
                className={cn(
                    "btn-chunky flex min-h-44 min-w-0 flex-col rounded-[12px] border-2 border-dashed p-3 text-left transition-colors focus-ring sm:min-h-48",
                  style.surface,
                  selected && !tileKey && "border-solid ring-2 ring-primary/30",
                  status !== "building" && slotCorrect && "border-success bg-success-soft",
                  status !== "building" && !slotCorrect && "border-danger bg-danger-soft",
                )}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div>
                    <p className={cn("text-xs font-bold uppercase tracking-wide", style.accent)}>
                      {meta.shortLabel}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{meta.grammarLabel}</p>
                  </div>
                  {status !== "building" ? (
                    slotCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-success" aria-label="Correct" />
                    ) : (
                      <XCircle className="h-5 w-5 text-danger" aria-label="Incorrect" />
                    )
                  ) : null}
                </div>

                {tileKey ? (
                  <div className="my-auto w-full text-center">
                    <ArabicText variant="display" className="text-3xl leading-relaxed sm:text-4xl">
                      {family.forms[tileKey].arabic}
                    </ArabicText>
                    <p lang="ar-Latn" className="mt-1 text-xs italic text-foreground-soft sm:text-sm">
                      {family.forms[tileKey].transliteration}
                    </p>
                    {status === "building" ? (
                      <p className="mt-2 text-[11px] text-muted-foreground">Tap to move it</p>
                    ) : null}
                  </div>
                ) : (
                  <p className="my-auto w-full text-center text-xs text-muted-foreground">
                    {selected ? "Place selected form here" : "Choose a form below"}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 tile p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold">Shuffled forms</h3>
            <button
              type="button"
              onClick={resetRound}
              disabled={status === "correct"}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 focus-ring"
            >
              <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
              Reset
            </button>
          </div>
          {bank.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {bank.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected((current) => (current === key ? null : key))}
                  aria-pressed={selected === key}
                  disabled={status !== "building"}
                  className={cn(
                    "btn-chunky min-w-0 rounded-[12px] bg-card p-3 text-center ring-1 ring-inset ring-hairline transition-all focus-ring",
                    selected === key
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-hairline hover:border-primary/50",
                  )}
                >
                  <ArabicText variant="display" className="text-2xl leading-relaxed sm:text-3xl">
                    {family.forms[key].arabic}
                  </ArabicText>
                  <p lang="ar-Latn" className="mt-1 truncate text-xs italic text-muted-foreground">
                    {family.forms[key].transliteration}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              All four forms are placed. Check your answer.
            </p>
          )}
        </div>

        {status === "correct" ? (
          <div className="mt-4 flex flex-col gap-3 rounded-[10px] border border-success bg-success-soft p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5 text-success" aria-hidden />
              Correct — this family is complete.
            </div>
            <button
              type="button"
              onClick={nextRound}
              className="btn-chunky btn-chunky-primary sm:ml-auto inline-flex items-center justify-center gap-2 rounded-[12px] bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground focus-ring"
            >
              Next verb <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : status === "incorrect" ? (
          <div className="mt-4 flex flex-col gap-3 rounded-[10px] border border-danger bg-danger-soft p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <XCircle className="h-5 w-5 text-danger" aria-hidden />
              A few forms are in the wrong columns. The markers show which ones.
            </div>
            <button
              type="button"
              onClick={() => setStatus("building")}
              className="btn btn-secondary btn-sm sm:ml-auto"
            >
              Adjust my answer
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={check}
            disabled={!complete}
            className="btn-chunky btn-chunky-primary mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 focus-ring sm:ml-auto sm:w-auto"
          >
            <Check className="h-4 w-4" aria-hidden />
            Check my sorting
          </button>
        )}
      </div>
    </section>
  );
}
