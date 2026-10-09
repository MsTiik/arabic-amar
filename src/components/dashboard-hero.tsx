"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  ChevronRight,
  Cloud,
  Flame,
  GraduationCap,
  Sparkles,
  Snowflake,
  Target,
  Trophy,
} from "lucide-react";

import { AppDialog } from "@/components/app-dialog";
import { ProgressRing } from "@/components/progress-ring";
import { useProgressSync } from "@/components/progress-sync-provider";
import type { DailyPathPlan, DailyPathStep } from "@/lib/progress";
import type { CourseProgress } from "@/lib/course-progress";
import { buildDailyPathPlan, progressActions, summarizeMastery, useProgress } from "@/lib/progress";
import { getSiteContent } from "@/lib/content";
import { getCourseProgress } from "@/lib/course-progress";
import { cn } from "@/lib/cn";

export function DashboardHero() {
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [goalInput, setGoalInput] = useState("");
  const progress = useProgress();
  const sync = useProgressSync();
  const content = getSiteContent();
  const allWordIds = useMemo(() => content.vocab.map((v) => v.id), [content.vocab]);
  const summary = summarizeMastery(progress, allWordIds);
  const course = getCourseProgress(progress, content.vocab, content.topics);
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

  return (
    <>
      <section>
        {freezeJustConsumed ? (
          <div className="surface mb-4 flex items-center gap-2.5 px-4 py-2.5 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
              <Snowflake className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="text-foreground">
              <span className="font-semibold">Streak saved.</span> A freeze
              covered yesterday — your {progress.streak.count}-day streak is
              still alive.
            </span>
          </div>
        ) : null}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="font-display mt-1 text-[2rem] leading-[1.05] text-foreground sm:text-[2.6rem]">
              Today&apos;s practice
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground-soft sm:text-[15px]">
              Hit your daily goal, keep your streak alive, and chip away at any words you&apos;ve
              been getting wrong. Your progress is saved in this browser
              {sync.configured ? " and can sync when you sign in." : " — no account needed."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Link href={primaryPathHref(dailyPath)} className="btn btn-primary focus-ring">
                <Sparkles className="h-4 w-4" />
                {seen === 0 ? "Start today's path" : "Continue today's path"}
              </Link>
              {dailyPath.weakCount > 0 ? (
                <Link href="/practice?deck=weak" className="btn btn-danger-soft focus-ring">
                  Fix weak words ({dailyPath.weakCount})
                </Link>
              ) : null}
              <Link href="/vocabulary" className="btn btn-secondary focus-ring">
                Vocabulary bank
              </Link>
              {sync.configured ? (
                <Link href="/sync" className="btn btn-secondary focus-ring">
                  <Cloud className="h-4 w-4" />
                  {sync.user ? "Sync settings" : "Sign in to sync"}
                </Link>
              ) : null}
            </div>
            <CourseProgressCard course={course} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="surface flex min-w-0 flex-col items-center p-3">
              <GoalRing seen={seen} goal={goal} reached={goalReached} />
              <p className="mt-1 flex flex-wrap items-center justify-center gap-x-1 text-center text-[10px] leading-snug text-muted-foreground">
                <span>
                  Daily goal:{" "}
                  <span className="font-semibold text-foreground tabular-nums">
                    {goal} cards
                  </span>
                </span>
                <span aria-hidden>·</span>
                <button
                  type="button"
                  className="font-semibold text-primary underline-offset-4 hover:underline focus-ring"
                  onClick={openGoalDialog}
                >
                  Edit goal
                </button>
              </p>
            </div>
            <div className="surface flex min-w-0 flex-col items-center justify-center p-3">
              <StreakFlame
                count={progress.streak.count}
                freezes={freezesAvailable}
              />
            </div>
            <Stat
              icon={<GraduationCap className="h-3.5 w-3.5" />}
              label="Mastered"
              value={`${summary.mastered}/${summary.total}`}
              tone="success"
              className="surface min-w-0 p-3"
            />
            <Stat
              icon={<BookOpen className="h-3.5 w-3.5" />}
              label="Accuracy"
              value={accuracy === null ? "—" : `${accuracy}%`}
              tone="muted"
              className="surface min-w-0 p-3"
            />
          </div>
        </div>

        <div className="brand-panel mt-5 overflow-hidden rounded-[18px] p-4 shadow-[var(--shadow-md),inset_0_1px_0_oklch(1_0_0/8%)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow !text-primary">Today&apos;s path</p>
              <h2 className="font-display mt-1 text-xl leading-tight sm:text-[1.4rem]">
                Start with review, then add a little new Arabic.
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Follow these steps in order so due reviews, weak words, new
                vocabulary, and the next lesson stay connected.
              </p>
            </div>
            <Link
              href={primaryPathHref(dailyPath)}
              className="cta-glow inline-flex items-center justify-center gap-2 rounded-[12px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-105 active:translate-y-0.5 focus-ring"
            >
              {seen === 0 ? "Start today's path" : "Continue today's path"}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
            {dailyPath.steps.map((step, index) => (
              <DailyPathStepCard
                key={step.id}
                step={step}
                index={index}
                isFirstReady={step.id === firstReadyId(dailyPath)}
                isLast={index === dailyPath.steps.length - 1}
              />
            ))}
          </div>
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
              className="mt-2 w-full rounded-[10px] border border-hairline-strong bg-background px-3 py-2 text-base outline-none focus-ring"
            />
          </label>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setGoalDialogOpen(false)}
              className="btn btn-secondary focus-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary focus-ring"
            >
              Save goal
            </button>
          </div>
        </form>
      </AppDialog>
    </>
  );
}

/** Quiet "Reset progress" link with its confirmation dialog, shown at the
 *  foot of the homepage so the destructive action sits away from the stats. */
export function ResetProgressButton() {
  const [open, setOpen] = useState(false);

  function resetProgress() {
    progressActions.reset();
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="rounded text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-ring"
        onClick={() => setOpen(true)}
      >
        Reset progress
      </button>
      <AppDialog
        open={open}
        title="Reset all progress?"
        description="This clears your streak, daily stats, and word mastery stored in this browser."
        onClose={() => setOpen(false)}
        tone="danger"
      >
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="btn btn-secondary focus-ring"
          >
            Keep progress
          </button>
          <button
            type="button"
            onClick={resetProgress}
            className="btn bg-danger text-white shadow-[0_2px_0_0_oklch(from_var(--danger)_calc(l-0.14)_c_h)] hover:brightness-105 focus-ring"
          >
            Reset progress
          </button>
        </div>
      </AppDialog>
    </>
  );
}

function GoalRing({
  seen,
  goal,
  reached,
}: {
  seen: number;
  goal: number;
  reached: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <ProgressRing
        value={goal > 0 ? seen / goal : 0}
        size={92}
        thickness={7}
        trackClassName="stroke-muted"
        fillClassName={reached ? "stroke-success" : "stroke-primary"}
        label={
          reached ? (
            <Check className="h-6 w-6 text-success lg:h-8 lg:w-8" aria-label="Goal reached" />
          ) : (
            <span className="font-display text-base tabular-nums lg:text-xl">
              {seen}
              <span className="font-medium text-muted-foreground">/{goal}</span>
            </span>
          )
        }
        className={cn(
          "max-lg:[&>svg]:h-16 max-lg:[&>svg]:w-16",
          reached && "goal-ring-reached",
        )}
      />
      <span className="eyebrow flex items-center gap-1 !text-[10px]">
        <Target className="h-3 w-3" aria-hidden />
        Daily goal
      </span>
    </div>
  );
}

function StreakFlame({ count, freezes }: { count: number; freezes: number }) {
  const lit = count > 0;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 flex-col lg:h-[92px] items-center justify-center gap-1">
        <Flame
          className={cn(
            "h-7 w-7 lg:h-10 lg:w-10",
            lit
              ? "flame-lit fill-accent-gold text-accent-gold"
              : "text-border",
          )}
          aria-hidden
        />
        <span
          className={cn(
            "font-display text-lg leading-none tabular-nums lg:text-2xl",
            lit ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {count}d
        </span>
      </div>
      <span className="eyebrow flex items-center gap-1 !text-[10px]">
        Streak
        {freezes > 0 ? (
          <span className="flex items-center gap-0.5 text-primary">
            <Snowflake className="h-3 w-3" aria-hidden />
            {freezes}
          </span>
        ) : null}
      </span>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
  sublabel,
  sublabelIcon,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "success" | "gold" | "muted";
  sublabel?: string;
  sublabelIcon?: React.ReactNode;
  className?: string;
}) {
  const toneClasses: Record<typeof tone, string> = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    gold: "bg-accent-gold-soft text-accent-gold",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <div className={cn("px-4 py-3", className)}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className={cn("flex h-5 w-5 items-center justify-center rounded-md", toneClasses[tone])}>
          {icon}
        </span>
        {label}
      </div>
      <div className="font-display mt-1 text-2xl leading-none tabular-nums text-foreground">{value}</div>
      {sublabel ? (
        <div className="mt-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
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

function firstReadyId(plan: DailyPathPlan): DailyPathStep["id"] | undefined {
  return plan.steps.find((step) => step.status === "ready")?.id;
}

function DailyPathStepCard({
  step,
  index,
  isFirstReady,
  isLast,
}: {
  step: DailyPathStep;
  index: number;
  isFirstReady: boolean;
  isLast: boolean;
}) {
  const ready = step.status === "ready";
  const content = (
    <>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums",
            !ready && "bg-success text-brand-navy",
            ready && isFirstReady && "path-node-current bg-primary text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/30%)]",
            ready && !isFirstReady && "bg-background text-foreground-soft ring-1 ring-inset ring-hairline-strong",
          )}
        >
          {ready ? index + 1 : <Check className="h-4 w-4" />}
        </span>
        {!isLast ? (
          <span
            className={cn(
              "h-1 flex-1 rounded-full",
              ready ? "bg-border" : "bg-success/50",
            )}
            aria-hidden
          />
        ) : (
          <span className="flex-1" aria-hidden />
        )}
        <span className="rounded-md bg-background/60 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-foreground-soft ring-1 ring-inset ring-hairline">
          {step.count}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-semibold tracking-[-0.005em] text-foreground">{step.title}</h3>
      <p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">
        {step.description}
      </p>
      <span
        className={cn(
          "mt-2 inline-flex items-center gap-1 text-xs font-semibold",
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
      <div className="flex min-h-32 flex-col rounded-xl bg-background/50 p-3.5 text-muted-foreground ring-1 ring-inset ring-hairline">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={step.href}
      className="group flex min-h-32 flex-col rounded-xl bg-card p-3.5 shadow-[inset_0_1px_0_oklch(1_0_0/7%)] ring-1 ring-inset ring-hairline-strong transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-card focus-ring"
    >
      {content}
    </Link>
  );
}

function CourseProgressCard({ course }: { course: CourseProgress }) {
  const pct = Math.round(course.masteredFraction * 100);
  const next = course.nextLesson;
  return (
    <div
      className="surface mt-5 max-w-xl px-4 py-3"
      title="Mastered means answered correctly often enough to reach the top mastery rating. A lesson counts as covered once every word in it has been introduced in practice."
    >
      <div className="flex items-center justify-between gap-3">
        <div className="leading-tight">
          <div className="eyebrow !text-[10px]">
            Course progress
          </div>
          <div className="mt-0.5 text-sm font-semibold text-foreground tabular-nums">
            {course.masteredWords} / {course.totalWords} words mastered
          </div>
        </div>
        <span className="chip !h-6 shrink-0 tabular-nums text-foreground-soft">
          <Trophy className="h-3.5 w-3.5 text-accent-gold" aria-hidden />
          {course.lessonsCovered} of {course.lessonsTotal} lessons covered
        </span>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`${course.masteredWords} of ${course.totalWords} words mastered`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent-aqua transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-foreground-soft">
        {next ? (
          <>
            Next:{" "}
            <Link href={`/topics/${next.slug}`} className="font-semibold text-foreground underline-offset-2 hover:underline focus-ring rounded">
              {next.name}
            </Link>{" "}
            — {next.newCount} new word{next.newCount === 1 ? "" : "s"} left
          </>
        ) : (
          "Every lesson's vocabulary has been introduced — keep reviewing to master the rest."
        )}
      </div>
    </div>
  );
}
