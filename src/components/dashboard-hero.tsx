"use client";

import Link from "next/link";
import { Flame, Target, BookOpen, GraduationCap, Sparkles } from "lucide-react";

import { useProgress, summarizeMastery, getMistakeWords, progressActions } from "@/lib/progress";
import { getSiteContent } from "@/lib/content";
import { cn } from "@/lib/cn";

interface Props {
  totalVocab: number;
  totalRules: number;
  totalLessons: number;
}

export function DashboardHero({ totalVocab, totalRules, totalLessons }: Props) {
  const progress = useProgress();
  const allWordIds = getSiteContent().vocab.map((v) => v.id);
  const summary = summarizeMastery(progress, allWordIds);
  const mistakes = getMistakeWords(progress, allWordIds);
  const goal = progress.daily.goalCards;
  const seen = progress.daily.today.cardsSeen;
  const correctToday = progress.daily.today.correct;
  const accuracy = seen > 0 ? Math.round((correctToday / seen) * 100) : null;
  const goalReached = seen >= goal;

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Welcome back
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Today&apos;s practice
          </h1>
          <p className="mt-2 max-w-xl text-base text-foreground-soft">
            Hit your daily goal, keep your streak alive, and chip away at any words you&apos;ve
            been getting wrong. Your progress is saved in this browser — no account needed.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
            >
              <Sparkles className="h-4 w-4" />
              {seen === 0 ? "Start today's session" : "Continue practicing"}
            </Link>
            {mistakes.length > 0 ? (
              <Link
                href="/practice?deck=mistakes"
                className="inline-flex items-center gap-2 rounded-full border border-danger bg-danger-soft px-4 py-2 text-sm font-semibold text-foreground hover:opacity-90 focus-ring"
              >
                Review mistakes ({mistakes.length})
              </Link>
            ) : null}
            <Link
              href="/vocabulary"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background-soft px-4 py-2 text-sm font-medium hover:bg-muted focus-ring"
            >
              Vocabulary bank
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat
            icon={<Flame className="h-4 w-4" />}
            label="Streak"
            value={`${progress.streak.count}d`}
            tone={progress.streak.count > 0 ? "gold" : "muted"}
          />
          <Stat
            icon={<Target className="h-4 w-4" />}
            label="Today"
            value={`${seen}/${goal}`}
            tone={goalReached ? "success" : "primary"}
          />
          <Stat
            icon={<GraduationCap className="h-4 w-4" />}
            label="Mastered"
            value={`${summary.mastered}/${summary.total}`}
            tone="success"
          />
          <Stat
            icon={<BookOpen className="h-4 w-4" />}
            label="Accuracy"
            value={accuracy === null ? "—" : `${accuracy}%`}
            tone="muted"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Pill label="Words" value={totalVocab} />
        <Pill label="Grammar rules" value={totalRules} />
        <Pill label="Lessons" value={totalLessons} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Daily goal:{" "}
          <button
            className="underline-offset-2 hover:underline focus-ring"
            onClick={() => {
              const next = window.prompt("Daily goal (cards):", String(goal));
              const parsed = Number(next);
              if (Number.isFinite(parsed) && parsed > 0) {
                progressActions.setDailyGoal(parsed);
              }
            }}
          >
            {goal} cards
          </button>
        </span>
        <button
          className="underline-offset-2 hover:underline focus-ring"
          onClick={() => {
            if (window.confirm("Reset all progress?")) progressActions.reset();
          }}
        >
          Reset progress
        </button>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "success" | "gold" | "muted";
}) {
  const toneClasses: Record<typeof tone, string> = {
    primary: "border-primary/40 bg-primary/10 text-primary",
    success: "border-success/40 bg-success-soft text-foreground",
    gold: "border-accent-gold/50 bg-accent-gold-soft text-foreground",
    muted: "border-border bg-background-soft text-foreground-soft",
  };
  return (
    <div className={cn("rounded-2xl border p-3", toneClasses[tone])}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider opacity-80">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background-soft px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
    </div>
  );
}
