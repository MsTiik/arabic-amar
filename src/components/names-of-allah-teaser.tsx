"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { summarizeNamesOfAllahProgress } from "@/lib/names-of-allah";
import { useProgress } from "@/lib/progress";

export function NamesOfAllahTeaser() {
  const progress = useProgress();
  const summary = summarizeNamesOfAllahProgress(progress);

  return (
    <section className="surface relative overflow-hidden p-5 sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_90%_at_100%_50%,oklch(from_var(--accent-aqua)_l_c_h/14%),transparent_70%)]"
        aria-hidden
      />
      <span
        className="glyph-watermark -bottom-4 right-8 hidden text-[5.5rem] text-primary/[0.07] md:block"
        aria-hidden
      >
        الأسماء الحسنى
      </span>
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
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
        </div>
        <div className="flex items-baseline gap-2 self-start rounded-xl bg-background-soft px-4 py-3 ring-1 ring-inset ring-hairline sm:flex-col sm:items-center sm:gap-0.5">
          <p className="font-display text-[1.75rem] leading-none tabular-nums">
            {summary.known}
            <span className="text-muted-foreground">/{summary.total}</span>
          </p>
          <p className="eyebrow !text-[10px]">known</p>
        </div>
      </div>
      <div className="relative mt-5 flex flex-wrap gap-2.5">
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
