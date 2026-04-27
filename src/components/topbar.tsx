"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Target, Sparkles } from "lucide-react";

import { useProgress, useProgressStorageSync } from "@/lib/progress";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/topics", label: "Lessons" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/grammar", label: "Grammar" },
  { href: "/practice", label: "Practice" },
  { href: "/about", label: "About" },
];

export function Topbar() {
  useProgressStorageSync();
  const progress = useProgress();
  const pathname = usePathname();
  const goal = progress.daily.goalCards;
  const seen = progress.daily.today.cardsSeen;
  const goalRatio = Math.min(1, seen / Math.max(1, goal));
  const streakActive = progress.streak.count > 0;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Sparkles className="h-5 w-5 text-accent-gold" aria-hidden />
          <span>
            Arabic Amar
            <span className="ml-2 hidden text-xs font-normal text-muted-foreground sm:inline">
              · Quranic Arabic, gamified
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors focus-ring",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
              streakActive
                ? "border-accent-gold bg-accent-gold-soft text-foreground"
                : "border-border bg-muted text-muted-foreground",
            )}
            title={
              streakActive
                ? `You're on a ${progress.streak.count}-day streak!`
                : "Practice today to start a streak."
            }
          >
            <Flame
              className={cn(
                "h-3.5 w-3.5",
                streakActive ? "text-accent-gold" : "text-muted-foreground",
              )}
              aria-hidden
            />
            <span>{progress.streak.count}</span>
            <span className="hidden sm:inline">streak</span>
          </div>
          <DailyGoalChip seen={seen} goal={goal} ratio={goalRatio} />
        </div>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto px-3 py-2 text-sm md:hidden">
        {NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 transition-colors focus-ring",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

function DailyGoalChip({
  seen,
  goal,
  ratio,
}: {
  seen: number;
  goal: number;
  ratio: number;
}) {
  const done = seen >= goal;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        done
          ? "border-success bg-success-soft text-foreground"
          : "border-border bg-muted text-foreground",
      )}
      title={`${seen} of ${goal} cards practiced today`}
    >
      <Target
        className={cn(
          "h-3.5 w-3.5",
          done ? "text-success" : "text-muted-foreground",
        )}
        aria-hidden
      />
      <div className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-muted-foreground/20 sm:block">
        <div
          className={cn(
            "h-full rounded-full",
            done ? "bg-success" : "bg-primary",
          )}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>
      <span className="tabular-nums">
        {seen}/{goal}
      </span>
    </div>
  );
}
