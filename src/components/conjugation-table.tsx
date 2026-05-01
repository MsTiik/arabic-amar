"use client";

import { useState } from "react";

import type { ConjugationEntry } from "@/lib/types";
import { ArabicText } from "@/components/arabic-text";
import { SpeakerButton } from "@/components/speaker-button";
import { cn } from "@/lib/cn";

interface Props {
  past: ConjugationEntry[];
  presentFuture: ConjugationEntry[];
}

type Tab = "past" | "present-future";

const ROOT_LABEL = "ك‑ت‑ب";

/** Render a "(root) + ت" pattern with the suffix in a coloured pill so the
 *  pattern is visually obvious. Splits on the literal "(root)" or "ك-ت-ب"
 *  marker and highlights everything else. */
function PatternCell({ pattern }: { pattern: string }) {
  if (!pattern.trim()) {
    return <span className="text-muted-foreground">—</span>;
  }
  // Replace the doc's "ك-ت-ب" with a properly-spaced version, and tokenise
  // the rest. Anything that's not the root marker counts as an ending and
  // gets highlighted.
  const normalised = pattern.replace(/ك-ت-ب/g, ROOT_LABEL);
  const parts = normalised.split(/(\(root\)|ك‑ت‑ب|\+)/g).filter(Boolean);
  return (
    <span className="inline-flex flex-wrap items-center gap-1" dir="rtl">
      {parts.map((part, i) => {
        const trimmed = part.trim();
        if (!trimmed) return null;
        if (trimmed === "+") {
          return (
            <span key={i} className="text-muted-foreground">
              +
            </span>
          );
        }
        if (trimmed === "(root)" || trimmed === ROOT_LABEL) {
          return (
            <span
              key={i}
              className="rounded-md bg-background-soft px-2 py-0.5 font-mono text-sm text-foreground-soft sm:text-base"
              lang={trimmed === "(root)" ? "en" : "ar"}
            >
              {trimmed}
            </span>
          );
        }
        // The rest is the Arabic suffix / prefix. Display-size so the fatha
        // and other diacritics stay legible inside the pattern pill.
        return (
          <ArabicText
            key={i}
            variant="display"
            className="rounded-md bg-accent-gold-soft px-2 py-0.5 text-xl leading-none text-foreground sm:text-2xl"
          >
            {trimmed}
          </ArabicText>
        );
      })}
    </span>
  );
}

function GenderBadge({ gender }: { gender?: "M" | "F" | "Both" }) {
  if (!gender) return null;
  const label =
    gender === "M" ? "m" : gender === "F" ? "f" : "m / f";
  return (
    <span className="ml-2 inline-flex items-center rounded-full border border-border bg-background-soft px-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  );
}

function Table({ rows }: { rows: ConjugationEntry[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        No conjugations captured yet — try refreshing from the source doc.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead className="text-left">
          <tr className="border-b border-border bg-background-soft">
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Person
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pattern
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Example
            </th>
            <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Arabic
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pronunciation
            </th>
            <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              English
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.id}
              className={cn(
                "border-b border-border/60 last:border-0",
                i % 2 === 1 ? "bg-background-soft/30" : "",
              )}
            >
              <td className="px-3 py-3 font-medium text-foreground">
                {r.category}
                <GenderBadge gender={r.gender} />
              </td>
              <td className="px-3 py-3">
                <PatternCell pattern={r.patternRule} />
              </td>
              <td className="px-3 py-3">
                <PatternCell pattern={r.patternExample} />
              </td>
              <td className="px-3 py-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <SpeakerButton
                    arabic={r.arabic}
                    label={r.english}
                    size="sm"
                  />
                  <ArabicText
                    variant="display"
                    className="text-2xl text-foreground sm:text-3xl"
                  >
                    {r.arabic}
                  </ArabicText>
                </div>
              </td>
              <td className="px-3 py-3 italic text-foreground-soft" lang="ar-Latn">
                {r.pronunciation}
              </td>
              <td className="px-3 py-3 text-muted-foreground">{r.english}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ConjugationTable({ past, presentFuture }: Props) {
  const [tab, setTab] = useState<Tab>("past");
  const rows = tab === "past" ? past : presentFuture;

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" className="flex gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "past"}
          onClick={() => setTab("past")}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium focus-ring",
            tab === "past"
              ? "bg-foreground text-background"
              : "border border-border bg-background-soft text-foreground-soft hover:bg-muted",
          )}
        >
          Past (
          <span lang="ar-Latn" className="italic">
            Māḍī
          </span>
          )
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "present-future"}
          onClick={() => setTab("present-future")}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium focus-ring",
            tab === "present-future"
              ? "bg-foreground text-background"
              : "border border-border bg-background-soft text-foreground-soft hover:bg-muted",
          )}
        >
          Present / Future (
          <span lang="ar-Latn" className="italic">
            Muḍāriʿ
          </span>
          )
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing root{" "}
        <span lang="ar" dir="rtl" className="font-mono text-foreground-soft">
          {ROOT_LABEL}
        </span>{" "}
        (write). The Arabic ending in the pattern column is highlighted to make
        the suffix easy to spot — same colour appears at the matching position
        in the example.
      </p>

      <Table rows={rows} />
    </div>
  );
}
