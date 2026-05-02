"use client";

import { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";

import { ALPHABET, NON_CONNECTORS } from "@/data/foundations";
import { cn } from "@/lib/cn";

/**
 * Pick-letters-and-watch-them-join demo. The user picks up to 5 letters and
 * the component renders the resulting Arabic string with proper joining,
 * plus a diagram highlighting where a non-connector breaks the chain.
 */

const SAMPLES = ["ك ت ا ب", "ق ر ا ء ة", "س ل ا م", "ر س و ل", "ن و ر"];

function sampleToLetters(s: string): string[] {
  return s.split(" ").filter(Boolean);
}

export function JoinLettersDemo() {
  const [picked, setPicked] = useState<string[]>(sampleToLetters(SAMPLES[0]));

  const joined = picked.join("");

  // Detect chain breaks: a non-connector at position i means the letter at i+1
  // is forced into its initial / isolated shape.
  const chainBreaks = useMemo(() => {
    const breaks: number[] = [];
    picked.forEach((l, i) => {
      if (NON_CONNECTORS.includes(l) && i < picked.length - 1) breaks.push(i);
    });
    return breaks;
  }, [picked]);

  function addLetter(l: string) {
    if (picked.length >= 6) return;
    setPicked((p) => [...p, l]);
  }

  function removeLast() {
    setPicked((p) => p.slice(0, -1));
  }

  function reset() {
    setPicked([]);
  }

  function loadSample(s: string) {
    setPicked(sampleToLetters(s));
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">
          Pick letters, watch them join
        </h3>
        <span className="text-xs text-muted-foreground">
          Up to 6 letters. Non-connectors break the chain.
        </span>
      </div>

      <div
        className="mt-4 flex min-h-[96px] items-center justify-center rounded-xl bg-background-soft p-4"
        lang="ar"
        dir="rtl"
      >
        {picked.length === 0 ? (
          <span className="text-sm text-muted-foreground" dir="ltr">
            Pick letters below to see them combine.
          </span>
        ) : (
          <span className="font-arabic-display text-5xl sm:text-6xl">{joined}</span>
        )}
      </div>

      {picked.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1 text-sm" dir="ltr">
          {picked.map((l, i) => {
            const isBreak = chainBreaks.includes(i);
            return (
              <span key={i} className="inline-flex items-center gap-1">
                <span
                  className={cn(
                    "inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-card px-1.5 font-arabic text-lg",
                    isBreak && "border-accent-gold/60 bg-accent-gold-soft",
                  )}
                  title={isBreak ? "Non-connector — chain breaks after this letter" : undefined}
                >
                  {l}
                </span>
                {i < picked.length - 1 ? (
                  <span
                    className={cn(
                      "text-xs",
                      isBreak ? "text-accent-gold" : "text-muted-foreground",
                    )}
                  >
                    {isBreak ? "‖" : "→"}
                  </span>
                ) : null}
              </span>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={removeLast}
          disabled={picked.length === 0}
          className="rounded-md border border-border bg-background-soft px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-ring"
        >
          ← Remove last
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={picked.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background-soft px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-ring"
        >
          <RefreshCcw className="h-3 w-3" aria-hidden /> Reset
        </button>
        <span className="ml-1 text-xs text-muted-foreground">Samples:</span>
        {SAMPLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => loadSample(s)}
            className="rounded-md border border-border bg-background-soft px-2.5 py-1 text-xs hover:bg-muted focus-ring"
            lang="ar"
            dir="rtl"
          >
            <span className="font-arabic">{s.replace(/\s/g, "")}</span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tap a letter to add it
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-14" dir="rtl">
          {ALPHABET.map((letter) => {
            const isNC = letter.nonConnector;
            return (
              <button
                key={letter.order}
                type="button"
                onClick={() => addLetter(letter.forms.isolated)}
                disabled={picked.length >= 6}
                className={cn(
                  "rounded-md border border-border bg-card px-1 py-2 font-arabic-display text-xl transition-colors hover:bg-muted focus-ring disabled:cursor-not-allowed disabled:opacity-40",
                  isNC && "border-accent-gold/50",
                )}
                title={isNC ? `${letter.name} — non-connector` : letter.name}
                aria-label={`Add letter ${letter.name}`}
              >
                {letter.forms.isolated}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
