"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { summarizeNamesOfAllahProgress } from "@/lib/names-of-allah";
import { useProgress } from "@/lib/progress";

export function NamesOfAllahTeaser() {
  const progress = useProgress();
  const summary = summarizeNamesOfAllahProgress(progress);

  return (
    <section className="rounded-3xl border border-primary/20 bg-primary/10 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-card/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            New collection
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Names of Allah
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-foreground-soft">
            Learn verified names with Arabic, click-to-reveal transliteration,
            meanings, short explanations, and Qur&apos;ān references.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card px-4 py-3 text-center">
          <p className="text-2xl font-semibold tabular-nums">
            {summary.known}/{summary.total}
          </p>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            known
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/vocabulary/names-of-allah"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
        >
          Open collection
        </Link>
        <Link
          href="/practice?deck=names-of-allah"
          className="rounded-full border border-border bg-background-soft px-4 py-2 text-sm font-medium hover:bg-muted focus-ring"
        >
          Practice flashcards
        </Link>
      </div>
    </section>
  );
}
