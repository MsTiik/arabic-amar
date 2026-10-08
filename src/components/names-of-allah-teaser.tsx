"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { summarizeNamesOfAllahProgress } from "@/lib/names-of-allah";
import { useProgress } from "@/lib/progress";

export function NamesOfAllahTeaser() {
  const progress = useProgress();
  const summary = summarizeNamesOfAllahProgress(progress);

  return (
    <section className="surface grid overflow-hidden md:grid-cols-[minmax(0,1fr)_280px]">
      <div className="p-5 sm:p-6">
        <p className="chip !h-6 text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-gold" aria-hidden />
          New collection
        </p>
        <h2 className="font-display mt-3 text-[1.75rem] leading-tight">
          Names of Allah
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-foreground-soft">
          Learn verified names with Arabic, click-to-reveal transliteration,
          meanings, short explanations, and Qur&apos;ān references.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link href="/vocabulary/names-of-allah" className="btn btn-primary focus-ring">
            Open collection
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/practice?deck=names-of-allah" className="btn btn-secondary focus-ring">
            Practice flashcards
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-hairline bg-[radial-gradient(ellipse_80%_90%_at_50%_0%,oklch(from_var(--accent-aqua)_l_c_h/16%),transparent_75%)] px-5 py-5 md:flex-col md:justify-center md:border-l md:border-t-0">
        <p
          lang="ar"
          dir="rtl"
          className="font-arabic-display text-[2.1rem] leading-[1.4] text-primary md:text-[2.6rem]"
        >
          الأسماء الحسنى
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[1.6rem] leading-none tabular-nums">
            {summary.known}
            <span className="text-muted-foreground">/{summary.total}</span>
          </span>
          <span className="eyebrow !text-[10px]">known</span>
        </div>
      </div>
    </section>
  );
}
