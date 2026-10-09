"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { MasteryDots } from "@/components/mastery-dots";
import { TranslitReveal } from "@/components/translit-reveal";
import { NAMES_OF_ALLAH } from "@/data/names-of-allah";
import {
  nameOfAllahWordId,
  summarizeNamesOfAllahProgress,
} from "@/lib/names-of-allah";
import { useProgress } from "@/lib/progress";

export function NamesOfAllahClient() {
  const progress = useProgress();
  const summary = summarizeNamesOfAllahProgress(progress);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-10">
      <header className="brand-panel overflow-hidden rounded-[18px] p-6 shadow-[var(--shadow-md),inset_0_1px_0_oklch(1_0_0/8%)] sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="chip mb-3 !bg-white/10 !text-accent-gold !shadow-[inset_0_0_0_1px_oklch(1_0_0/15%)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Full 99-name collection
            </p>
            <p className="mb-1 text-2xl leading-[1.5] text-accent-gold">
              <span lang="ar" dir="rtl" className="font-arabic-display">
                الأسماء الحسنى
              </span>
            </p>
            <h1 className="page-title text-white">
              Names of Allah
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
              Study the traditional Asmā&apos; al-Ḥusnā 99-name list, with
              Qur&apos;ān references where the name or closely related attribute
              wording appears. Each card includes Arabic, a pronunciation
              reveal, a concise meaning, a longer explanation, and sources.
            </p>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-white/60">
              Source note: the general 99 Names hadith is authentic in{" "}
              <a
                href="https://sunnah.com/bukhari:7392"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-white underline underline-offset-2"
              >
                Sahih al-Bukhari 7392
              </a>
              . The exact sequence follows the widely taught{" "}
              <a
                href="https://sunnah.com/tirmidhi:3507"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-white underline underline-offset-2"
              >
                Jami&apos; at-Tirmidhi 3507
              </a>{" "}
              enumeration, which Darussalam grades da&apos;if and scholars
              discuss, so Qur&apos;ān links are shown separately where available.
            </p>
          </div>
          <div className="grid min-w-64 grid-cols-2 gap-2">
            <ProgressStat label="Known" value={`${summary.known}/${summary.total}`} variant="midnight" />
            <ProgressStat label="Learning" value={String(summary.learning)} variant="midnight" />
            <ProgressStat label="Mastered" value={String(summary.mastered)} variant="midnight" />
            <ProgressStat label="New" value={String(summary.new)} variant="midnight" />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/practice?deck=names-of-allah"
            className="btn cta-glow bg-primary text-primary-foreground focus-ring"
          >
            Practice Names of Allah
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/vocabulary"
            className="btn bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15 focus-ring"
          >
            Back to vocabulary
          </Link>
        </div>
      </header>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="section-title">
            99 names of Allah
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {NAMES_OF_ALLAH.map((name) => {
            const wordId = nameOfAllahWordId(name);
            const mastery = progress.words[wordId]?.mastery ?? 0;
            return (
              <article
                key={name.id}
                id={name.id}
                className="surface p-5 sm:p-6"
              >
                <div>
                  <ArabicText variant="display" className="text-5xl sm:text-6xl">
                    {name.arabic}
                  </ArabicText>
                  <TranslitReveal text={name.transliteration} className="mx-0" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {name.shortMeaning}
                    </h3>
                    <MasteryDots mastery={mastery} />
                  </div>
                  <p className="text-sm leading-6 text-foreground-soft">
                    {name.explanation}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {name.sources.map((source) => (
                    <a
                      key={`${name.id}-${source.reference}`}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="chip text-muted-foreground hover:text-foreground focus-ring"
                    >
                      {source.reference}
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ProgressStat({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "midnight";
}) {
  const midnight = variant === "midnight";
  return (
    <div
      className={
        midnight
          ? "rounded-[12px] bg-white/8 px-4 py-3 text-white ring-1 ring-inset ring-white/12"
          : "surface px-4 py-3"
      }
    >
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p
        className={`text-xs uppercase tracking-wider ${
          midnight ? "text-white/60" : "text-muted-foreground"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
