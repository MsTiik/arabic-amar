"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
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
    surface: "border-tense-past-accent/40 bg-tense-past",
    accent: "text-tense-past-accent",
    dot: "bg-tense-past-accent",
  },
  present: {
    surface: "border-tense-present-accent/40 bg-tense-present",
    accent: "text-tense-present-accent",
    dot: "bg-tense-present-accent",
  },
  command: {
    surface: "border-tense-command-accent/40 bg-tense-command",
    accent: "text-tense-command-accent",
    dot: "bg-tense-command-accent",
  },
  masdar: {
    surface: "border-tense-masdar-accent/40 bg-tense-masdar",
    accent: "text-tense-masdar-accent",
    dot: "bg-tense-masdar-accent",
  },
};

export function VerbFamiliesClient() {
  const [mode, setMode] = useState<Mode>("explore");
  const [familyIndex, setFamilyIndex] = useState(0);

  return (
    <div className="space-y-7">
      <div className="grid grid-cols-2 rounded-2xl border border-border bg-muted p-1">
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
        "flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus-ring",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
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
  return (
    <div className="space-y-6">
      <section aria-labelledby="family-picker-heading">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 id="family-picker-heading" className="text-lg font-semibold">
            Choose a verb
          </h2>
          <p className="text-xs text-muted-foreground">
            {familyIndex + 1} of {VERB_FAMILIES.length}
          </p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {VERB_FAMILIES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={index === familyIndex}
              className={cn(
                "min-w-28 shrink-0 rounded-2xl border px-3 py-2 text-center transition-colors focus-ring",
                index === familyIndex
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-card hover:bg-muted",
              )}
            >
              <ArabicText variant="display" className="text-2xl leading-tight">
                {item.forms.past.arabic}
              </ArabicText>
              <span className="mt-1 block text-xs text-muted-foreground">
                {item.meaning}
              </span>
            </button>
          ))}
        </div>
      </section>

      <article className="overflow-hidden rounded-3xl border border-border bg-card">
        <header className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between sm:p-7">
          <div>
            <p className="section-label">Verb family</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {family.meaning}
            </h2>
            {family.usageNote ? (
              <p className="mt-2 max-w-2xl text-sm text-foreground-soft">
                {family.usageNote}
              </p>
            ) : null}
          </div>
          <div className="self-start rounded-2xl border border-dashed border-accent-gold bg-accent-gold-soft px-4 py-2 text-center">
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

        <div className="grid gap-4 border-t border-border bg-background-soft p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.42fr)]">
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-accent-gold" aria-hidden />
              In context
            </h3>
            {family.examples.map((example) => (
              <div key={`${family.id}-${example.reference}`} className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
                      {example.kind === "quran" ? "Qur’an" : "Hadith"}
                    </span>
                    {example.grade ? (
                      <span className="text-xs font-medium text-muted-foreground">
                        {example.grade}
                      </span>
                    ) : null}
                  </span>
                  <a
                    href={example.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-ring"
                  >
                    {example.reference}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
                <ArabicText variant="display" className="mt-4 text-right text-3xl leading-[1.8] sm:text-4xl">
                  {example.arabic}
                </ArabicText>
                <p lang="ar-Latn" className="mt-2 text-sm italic leading-relaxed text-foreground-soft">
                  {example.transliteration}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {example.english}
                </p>
                <div className="mt-3 flex flex-wrap items-baseline gap-1.5 text-xs font-semibold text-primary">
                  <span>Form in the verse:</span>
                  <ArabicText className="text-lg">{example.focusArabic}</ArabicText>
                </div>
                {example.note ? (
                  <p className="mt-3 rounded-xl bg-accent-amber-soft px-3 py-2 text-xs leading-relaxed text-foreground-soft">
                    {example.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {family.opposite ? (
              <aside className="rounded-2xl border border-border bg-card p-4">
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
              <aside className="rounded-2xl border border-accent-gold/50 bg-accent-gold-soft p-4">
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
    <section className={cn("min-w-0 rounded-2xl border p-4", style.surface)}>
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
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <header className="border-b border-border p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-label">Round {round + 1}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Sort one verb family
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a shuffled form, then select the column where it belongs.
            </p>
          </div>
          <div className="rounded-2xl bg-primary-soft px-4 py-2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Score</p>
            <p className="text-xl font-bold tabular-nums">{score}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background-soft p-4">
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
                  "flex min-h-44 min-w-0 flex-col rounded-2xl border-2 border-dashed p-3 text-left transition-colors focus-ring sm:min-h-48",
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

        <div className="mt-6 rounded-2xl border border-border bg-background-soft p-4">
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
                    "min-w-0 rounded-xl border bg-card p-3 text-center transition-all focus-ring",
                    selected === key
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/50",
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
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-success bg-success-soft p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-5 w-5 text-success" aria-hidden />
              Correct — this family is complete.
            </div>
            <button
              type="button"
              onClick={nextRound}
              className="btn-chunky btn-chunky-primary sm:ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground focus-ring"
            >
              Next verb <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : status === "incorrect" ? (
          <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-danger bg-danger-soft p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <XCircle className="h-5 w-5 text-danger" aria-hidden />
              A few forms are in the wrong columns. The markers show which ones.
            </div>
            <button
              type="button"
              onClick={() => setStatus("building")}
              className="sm:ml-auto rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold hover:bg-muted focus-ring"
            >
              Adjust my answer
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={check}
            disabled={!complete}
            className="btn-chunky btn-chunky-primary mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 focus-ring sm:ml-auto sm:w-auto"
          >
            <Check className="h-4 w-4" aria-hidden />
            Check my sorting
          </button>
        )}
      </div>
    </section>
  );
}
