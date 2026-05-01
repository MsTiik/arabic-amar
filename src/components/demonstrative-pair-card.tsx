"use client";

import { useState } from "react";

import type { GrammarRule } from "@/lib/types";
import { leadingArabicWord, stripBodyPrefix } from "@/lib/rule-shape";
import { ArabicText } from "./arabic-text";
import { cn } from "@/lib/cn";

interface Props {
  rule: GrammarRule;
  className?: string;
}

interface Pair {
  /** The trailing noun stripped of the leading demonstrative, e.g. "رأس". */
  noun: string;
  /** Full Arabic sentence as written, e.g. "هذا رأس". */
  sentence: string;
  /** English meaning of the sentence, e.g. "this is a head". */
  english?: string;
}

/**
 * Renderer for "(token) + noun = sentence" rules with many parallel
 * examples, like body-parts "Masculine = هذا" / "Feminine = هذه".
 *
 * Layout:
 *   - Hero "Pattern" line: (token) + noun = "this is a (noun)"
 *   - One worked example, always visible
 *   - "See all N examples" button reveals the rest as a 2-3 column grid
 */
export function DemonstrativePairCard({ rule, className }: Props) {
  const [open, setOpen] = useState(false);

  const intro = rule.examples.find(
    (ex) => !(ex.arabic ?? "").trim() && (ex.english ?? "").trim(),
  );
  const sentenceExamples = rule.examples.filter(
    (ex) => (ex.arabic ?? "").trim().length > 0,
  );

  // Demonstrative is the leading word of the first sentence example. Falls
  // back to the body's memorise token if the body shape is recognised.
  const memorise = stripBodyPrefix(rule.body);
  const fromExample =
    sentenceExamples.length > 0 ? leadingArabicWord(sentenceExamples[0].arabic) : "";
  const token = fromExample || memorise;

  const pairs: Pair[] = sentenceExamples.map((ex) => {
    const sentence = (ex.arabic ?? "").trim();
    const noun = stripLeadingToken(sentence, token).trim();
    return { sentence, noun, english: (ex.english ?? "").trim() || undefined };
  });

  if (pairs.length === 0) return null;

  const hero = pairs[0];
  const rest = pairs.slice(1);
  const usageNote = (intro?.english ?? "").trim();

  return (
    <article
      className={cn(
        "rounded-2xl border border-border border-l-4 border-l-accent-gold bg-card p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <header className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-balance sm:text-xl">
          {rule.title}
        </h3>
        {usageNote ? (
          <p className="mt-1 text-sm text-muted-foreground">{usageNote}</p>
        ) : null}
      </header>

      {/* Pattern */}
      <section aria-labelledby={`${rule.id}__pattern`} className="mb-5">
        <h4
          id={`${rule.id}__pattern`}
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Pattern
        </h4>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background-soft px-4 py-3 sm:px-5 sm:py-4">
          <TokenChip token={token} label="Demonstrative" />
          <Plus />
          <NounChip />
          <Eq />
          <span className="text-sm italic text-muted-foreground">
            “this is a (noun)”
          </span>
        </div>
      </section>

      {/* Worked example */}
      <section aria-labelledby={`${rule.id}__example`} className="mb-2">
        <h4
          id={`${rule.id}__example`}
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Worked example
        </h4>
        <PairRow pair={hero} highlightNoun />
      </section>

      {rest.length > 0 ? (
        <section aria-labelledby={`${rule.id}__more`} className="mt-4">
          <h4
            id={`${rule.id}__more`}
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            More examples ({rest.length})
          </h4>
          {open ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {rest.map((pair, i) => (
                <PairRow key={i} pair={pair} />
              ))}
            </div>
          ) : null}
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="mt-3 inline-flex items-center gap-1 rounded-full border border-border bg-background-soft px-3 py-1 text-xs font-medium text-foreground-soft hover:bg-muted focus-ring"
          >
            {open ? "Show fewer" : `See all ${rest.length} examples`}
            <span aria-hidden="true">{open ? "↑" : "↓"}</span>
          </button>
        </section>
      ) : null}
    </article>
  );
}

function PairRow({ pair, highlightNoun = false }: { pair: Pair; highlightNoun?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background-soft p-3 sm:p-4">
      <ArabicText variant="display" className="text-xl sm:text-2xl">
        {pair.sentence}
      </ArabicText>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        {pair.english ?? "—"}
        {highlightNoun && pair.noun ? (
          <>
            {" "}
            <span className="text-foreground-soft">
              (noun:{" "}
              <span lang="ar" dir="rtl" className="font-arabic">
                {pair.noun}
              </span>
              )
            </span>
          </>
        ) : null}
      </p>
    </div>
  );
}

function TokenChip({ token, label }: { token: string; label: string }) {
  return (
    <span className="inline-flex flex-col items-center rounded-lg border border-accent-gold/50 bg-accent-gold-soft/40 px-3 py-1.5">
      <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {token ? (
        <ArabicText variant="display" className="text-xl sm:text-2xl">
          {token}
        </ArabicText>
      ) : null}
    </span>
  );
}

function NounChip() {
  return (
    <span className="inline-flex flex-col items-center rounded-lg border border-border bg-card px-3 py-1.5">
      <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
        Noun
      </span>
      <span className="text-base italic text-foreground-soft sm:text-lg">(any)</span>
    </span>
  );
}

function Plus() {
  return (
    <span aria-hidden="true" className="text-2xl text-muted-foreground">
      +
    </span>
  );
}

function Eq() {
  return (
    <span aria-hidden="true" className="text-2xl text-muted-foreground">
      =
    </span>
  );
}

/** Removes a leading Arabic token from the sentence if present. */
function stripLeadingToken(sentence: string, token: string): string {
  if (!token) return sentence;
  const re = new RegExp(`^${escapeRe(token)}\\s+`);
  return sentence.replace(re, "");
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
