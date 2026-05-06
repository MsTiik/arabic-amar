"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  GraduationCap,
  Sparkles,
  Snowflake,
  Target,
} from "lucide-react";

import { AppDialog } from "@/components/app-dialog";
import type { DailyPathPlan, DailyPathStep } from "@/lib/progress";
import { buildDailyPathPlan, progressActions, summarizeMastery, useProgress } from "@/lib/progress";
import { getSiteContent } from "@/lib/content";
import { cn } from "@/lib/cn";

interface Props {
  totalVocab: number;
  totalRules: number;
  totalLessons: number;
}

export function DashboardHero({ totalVocab, totalRules, totalLessons }: Props) {
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const progress = useProgress();
  const content = getSiteContent();
  const allWordIds = useMemo(() => content.vocab.map((v) => v.id), [content.vocab]);
  const summary = summarizeMastery(progress, allWordIds);
  const dailyPath = buildDailyPathPlan(progress, content.vocab, content.topics);
  const goal = progress.daily.goalCards;
  const seen = progress.daily.today.cardsSeen;
  const correctToday = progress.daily.today.correct;
  const accuracy = seen > 0 ? Math.round((correctToday / seen) * 100) : null;
  const goalReached = seen >= goal;
  const freezesAvailable = progress.streak.freezesAvailable ?? 0;
  const todayIso = new Date().toISOString().slice(0, 10);
  const freezeJustConsumed = progress.streak.lastFreezeConsumedAt === todayIso;

  function openGoalDialog() {
    setGoalInput(String(goal));
    setGoalDialogOpen(true);
  }

  function saveGoal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(goalInput);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    progressActions.setDailyGoal(parsed);
    setGoalDialogOpen(false);
  }

  function resetProgress() {
    progressActions.reset();
    setResetDialogOpen(false);
  }

  return (
    <>
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        {freezeJustConsumed ? (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm">
            <Snowflake className="h-4 w-4 text-primary" aria-hidden />
            <span className="text-foreground">
              <span className="font-semibold">Streak saved.</span> A freeze
              covered yesterday — your {progress.streak.count}-day streak is
              still alive.
            </span>
          </div>
        ) : null}
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
                href={primaryPathHref(dailyPath)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
              >
                <Sparkles className="h-4 w-4" />
                {seen === 0 ? "Start today's path" : "Continue today's path"}
              </Link>
              {dailyPath.weakCount > 0 ? (
                <Link
                  href="/practice?deck=weak"
                  className="inline-flex items-center gap-2 rounded-full border border-danger bg-danger-soft px-4 py-2 text-sm font-semibold text-foreground hover:opacity-90 focus-ring"
                >
                  Fix weak words ({dailyPath.weakCount})
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
              sublabel={
                freezesAvailable > 0
                  ? `${freezesAvailable} freeze${freezesAvailable === 1 ? "" : "s"}`
                  : undefined
              }
              sublabelIcon={
                freezesAvailable > 0 ? (
                  <Snowflake className="h-3 w-3" />
                ) : undefined
              }
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

        <div className="mt-6 rounded-3xl border border-border bg-background-soft p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Today&apos;s path
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                Start with review, then add a little new Arabic.
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Follow these steps in order so due reviews, weak words, new
                vocabulary, and the next lesson stay connected.
              </p>
            </div>
            <Link
              href={primaryPathHref(dailyPath)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
            >
              {seen === 0 ? "Start today's path" : "Continue today's path"}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {dailyPath.steps.map((step, index) => (
              <DailyPathStepCard key={step.id} step={step} index={index} />
            ))}
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
              type="button"
              className="underline-offset-2 hover:underline focus-ring"
              onClick={openGoalDialog}
            >
              {goal} cards
            </button>
          </span>
          <button
            type="button"
            className="underline-offset-2 hover:underline focus-ring"
            onClick={() => setResetDialogOpen(true)}
          >
            Reset progress
          </button>
        </div>
      </section>

      <AppDialog
        open={goalDialogOpen}
        title="Set daily goal"
        description="Choose how many cards you want to review each day."
        onClose={() => setGoalDialogOpen(false)}
      >
        <form onSubmit={saveGoal} className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Cards per day
            <input
              type="number"
              min="1"
              max="200"
              required
              autoFocus
              value={goalInput}
              onChange={(event) => setGoalInput(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-base outline-none focus-ring"
            />
          </label>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setGoalDialogOpen(false)}
              className="rounded-full border border-border bg-background-soft px-4 py-2 text-sm font-medium hover:bg-muted focus-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
            >
              Save goal
            </button>
          </div>
        </form>
      </AppDialog>

      <AppDialog
        open={resetDialogOpen}
        title="Reset all progress?"
        description="This clears your streak, daily stats, and word mastery stored in this browser."
        onClose={() => setResetDialogOpen(false)}
        tone="danger"
      >
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setResetDialogOpen(false)}
            className="rounded-full border border-border bg-background-soft px-4 py-2 text-sm font-medium hover:bg-muted focus-ring"
          >
            Keep progress
          </button>
          <button
            type="button"
            onClick={resetProgress}
            className="rounded-full bg-danger px-4 py-2 text-sm font-semibold text-white hover:opacity-90 focus-ring"
          >
            Reset progress
          </button>
        </div>
      </AppDialog>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
  sublabel,
  sublabelIcon,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "success" | "gold" | "muted";
  sublabel?: string;
  sublabelIcon?: React.ReactNode;
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
      {sublabel ? (
        <div className="mt-0.5 flex items-center gap-1 text-[10px] font-medium opacity-70">
          {sublabelIcon}
          {sublabel}
        </div>
      ) : null}
    </div>
  );
}

function primaryPathHref(plan: DailyPathPlan): string {
  return plan.steps.find((step) => step.status === "ready")?.href ?? "/practice";
}

function DailyPathStepCard({
  step,
  index,
}: {
  step: DailyPathStep;
  index: number;
}) {
  const ready = step.status === "ready";
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
            ready
              ? "bg-primary text-primary-foreground"
              : "bg-success-soft text-foreground",
          )}
        >
          {ready ? index + 1 : <Check className="h-3.5 w-3.5" />}
        </span>
        <span className="rounded-full bg-background-soft px-2 py-1 text-xs font-semibold tabular-nums text-foreground-soft">
          {step.count}
        </span>
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">{step.title}</h3>
      <p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">
        {step.description}
      </p>
      <span
        className={cn(
          "mt-3 inline-flex items-center gap-1 text-xs font-semibold",
          ready ? "text-primary" : "text-muted-foreground",
        )}
      >
        {ready ? "Open step" : "Complete"}
        {ready ? (
          <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        ) : null}
      </span>
    </>
  );

  if (!ready) {
    return (
      <div className="flex min-h-36 flex-col rounded-2xl border border-border bg-background p-4 text-muted-foreground">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={step.href}
      className="group flex min-h-36 flex-col rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted focus-ring"
    >
      {content}
    </Link>
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
