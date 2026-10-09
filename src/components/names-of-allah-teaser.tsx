"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { summarizeNamesOfAllahProgress } from "@/lib/names-of-allah";
import { useProgress } from "@/lib/progress";

export function NamesOfAllahTeaser() {
  const progress = useProgress();
  const summary = summarizeNamesOfAllahProgress(progress);

  return (
    <section className="rounded-[18px] bg-gradient-to-br from-primary/25 via-primary/15 to-accent-teal-soft p-5 shadow-[var(--shadow-md)] sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="chip border border-primary/30 bg-card/80 text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            New collection
          </p>
          <h2 className="font-display mt-3 text-2xl font-semibold tracking-tight">
            Names of Allah
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-foreground-soft">
            Learn verified names with Arabic, click-to-reveal transliteration,
            meanings, short explanations, and Qur&apos;ān references.
          </p>
        </div>
        <div className="surface px-4 py-3 text-center shadow-[0_0_0_1px_var(--hairline),0_12px_28px_-8px_rgb(0_0_0/0.25),0_3px_8px_-4px_rgb(0_0_0/0.2)]">
          <p className="text-2xl font-semibold tabular-nums">
            {summary.known}/{summary.total}
          </p>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            known
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/vocabulary/names-of-allah" className="btn btn-primary focus-ring">
          Open collection
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link href="/practice?deck=names-of-allah" className="btn btn-secondary focus-ring">
          Practice flashcards
        </Link>
      </div>
    </section>
  );
}
