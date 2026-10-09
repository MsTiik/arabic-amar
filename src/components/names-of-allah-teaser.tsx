"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { summarizeNamesOfAllahProgress } from "@/lib/names-of-allah";
import { useProgress } from "@/lib/progress";

export function NamesOfAllahTeaser() {
  const progress = useProgress();
  const summary = summarizeNamesOfAllahProgress(progress);

  return (
    <section className="brand-panel overflow-hidden rounded-[18px] p-6 shadow-[var(--shadow-md),inset_0_1px_0_oklch(1_0_0/8%)] sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="chip mb-3 !bg-white/10 !text-accent-gold !shadow-[inset_0_0_0_1px_oklch(1_0_0/15%)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            New collection
          </p>
          <p className="mb-1 text-2xl leading-[1.5] text-accent-gold">
            <span lang="ar" dir="rtl" className="font-arabic-display">
              الأسماء الحسنى
            </span>
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
            Names of Allah
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-white/75">
            Learn verified names with Arabic, click-to-reveal transliteration,
            meanings, short explanations, and Qur&apos;ān references.
          </p>
        </div>
        <div className="shrink-0 rounded-[14px] bg-white/8 px-5 py-4 text-center text-white ring-1 ring-inset ring-white/12">
          <p className="text-3xl font-semibold tabular-nums">
            {summary.known}
            <span className="text-white/50">/{summary.total}</span>
          </p>
          <p className="text-xs uppercase tracking-wider text-white/60">
            known
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/vocabulary/names-of-allah"
          className="btn cta-glow bg-primary text-primary-foreground focus-ring"
        >
          Open collection
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/practice?deck=names-of-allah"
          className="btn bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15 focus-ring"
        >
          Practice flashcards
        </Link>
      </div>
    </section>
  );
}
