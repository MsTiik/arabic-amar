"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Snowflake, Target } from "lucide-react";

import { useProgress, useProgressStorageSync } from "@/lib/progress";
import { useThemeSync } from "@/lib/theme";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/topics", label: "Lessons" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/grammar", label: "Grammar" },
  { href: "/practice", label: "Practice" },
  { href: "/about", label: "About" },
];

const FOUNDATIONS = { href: "/read", label: "Foundations" };

export function Topbar() {
  useProgressStorageSync();
  useThemeSync();
  const progress = useProgress();
  const pathname = usePathname();
  const goal = progress.daily.goalCards;
  const seen = progress.daily.today.cardsSeen;
  const goalRatio = Math.min(1, seen / Math.max(1, goal));
  const streakActive = progress.streak.count > 0;
  const freezesAvailable = progress.streak.freezesAvailable ?? 0;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center whitespace-nowrap text-lg font-semibold tracking-tight"
        >
          <span>
            Arabic AMAR
            <span className="ml-2 hidden text-xs font-normal text-muted-foreground lg:inline">
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
                  "whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors focus-ring",
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
          <FreezeChip count={freezesAvailable} />
          <DailyGoalChip seen={seen} goal={goal} ratio={goalRatio} />
          <ThemeToggle />
          <FoundationsNavLink pathname={pathname} />
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
                "shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 transition-colors focus-ring",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href={FOUNDATIONS.href}
          className={cn(
            "ml-auto shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 transition-colors focus-ring",
            pathname.startsWith(FOUNDATIONS.href)
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {FOUNDATIONS.label}
        </Link>
      </nav>
    </header>
  );
}

function FoundationsNavLink({ pathname }: { pathname: string }) {
  const active = pathname.startsWith(FOUNDATIONS.href);
  return (
    <Link
      href={FOUNDATIONS.href}
      className={cn(
        "hidden whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors focus-ring md:inline-flex",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      title="Alphabet, harakāt, madd, sun/moon — foundations for reading Qurʼān"
    >
      {FOUNDATIONS.label}
    </Link>
  );
}

function FreezeChip({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div
      className="hidden items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground sm:inline-flex"
      title={`${count} streak freeze${count === 1 ? "" : "s"} available — automatically saves your streak if you miss a day. Refills every 7 days.`}
    >
      <Snowflake className="h-3.5 w-3.5 text-primary" aria-hidden />
      <span className="tabular-nums">{count}</span>
    </div>
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
