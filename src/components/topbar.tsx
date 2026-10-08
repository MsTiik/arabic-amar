"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Flame, Snowflake, Target } from "lucide-react";

import { useProgress } from "@/lib/progress";
import { useProgressSync } from "@/components/progress-sync-provider";
import { FeedbackToggle } from "@/components/feedback-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/topics", label: "Lessons" },
  { href: "/read", label: "Foundations" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/grammar", label: "Grammar" },
  { href: "/practice", label: "Practice" },
];

const ABOUT = { href: "/about", label: "About" };

/**
 * Hides the topbar while scrolling down and reveals it on scroll up, so
 * small screens keep the full viewport for content. Always shown near the
 * top of the page.
 */
function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y < 80) {
        setHidden(false);
      } else if (Math.abs(y - lastY.current) > 8) {
        setHidden(y > lastY.current);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

export function Topbar() {
  const hidden = useHideOnScroll();
  const progress = useProgress();
  const sync = useProgressSync();
  const pathname = usePathname();
  const goal = progress.daily.goalCards;
  const seen = progress.daily.today.cardsSeen;
  const goalRatio = Math.min(1, seen / Math.max(1, goal));
  const streakActive = progress.streak.count > 0;
  const freezesAvailable = progress.streak.freezesAvailable ?? 0;

  return (
    <header
      className={cn(
        "site-topbar sticky top-0 z-30 border-b border-hairline bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 transition-transform duration-300 supports-[backdrop-filter]:bg-background/65 md:translate-y-0",
        hidden && "-translate-y-full",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[17px] font-semibold tracking-[-0.02em] focus-ring rounded-lg"
          aria-label="Arabic AMAR home"
        >
          <span
            className="brand-panel flex h-8 w-8 items-center justify-center rounded-[9px] font-arabic-display text-lg leading-none text-accent-gold shadow-[var(--shadow-sm),inset_0_1px_0_oklch(1_0_0/12%)]"
            aria-hidden
          >
            ع
          </span>
          <span>
            Arabic <span className="text-primary">AMAR</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-0.5 rounded-xl bg-muted/60 p-1 ring-1 ring-inset ring-hairline md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-[9px] px-3 py-1.5 text-[13px] font-medium transition-colors focus-ring",
                  active
                    ? "bg-card text-foreground shadow-[0_0_0_1px_var(--hairline),var(--shadow-sm)]"
                    : "text-muted-foreground hover:text-foreground",
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
              "chip",
              streakActive
                ? "!bg-accent-gold-soft text-foreground !shadow-[0_0_0_1px_oklch(from_var(--accent-gold)_l_c_h/45%)]"
                : "text-muted-foreground",
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
          {sync.configured ? <SyncChip status={sync.status} signedIn={Boolean(sync.user)} /> : null}
          <DailyGoalChip seen={seen} goal={goal} ratio={goalRatio} />
          <FeedbackToggle className="hidden sm:inline-flex" />
          <ThemeToggle />
          <AboutNavLink pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function SyncChip({ signedIn, status }: { signedIn: boolean; status: string }) {
  const label = signedIn ? (status === "syncing" ? "syncing" : "synced") : "guest";
  return (
    <Link
      href="/sync"
      className={cn(
        "chip hidden hover:bg-muted focus-ring sm:inline-flex",
        signedIn ? "" : "text-muted-foreground",
      )}
      title={signedIn ? "Progress sync is enabled." : "Sign in to sync progress across devices."}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          signedIn ? "bg-success" : "bg-muted-foreground",
        )}
      />
      <span>{label}</span>
    </Link>
  );
}

function AboutNavLink({ pathname }: { pathname: string }) {
  const active = pathname.startsWith(ABOUT.href);
  return (
    <Link
      href={ABOUT.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "hidden whitespace-nowrap rounded-[9px] px-3 py-1.5 text-[13px] font-medium transition-colors focus-ring md:inline-flex",
        active
          ? "bg-card text-foreground shadow-[0_0_0_1px_var(--hairline),var(--shadow-sm)]"
          : "text-muted-foreground hover:text-foreground",
      )}
      title="About Arabic AMAR"
    >
      {ABOUT.label}
    </Link>
  );
}

function FreezeChip({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div
      className="chip hidden text-foreground sm:inline-flex"
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
        "chip text-foreground",
        done && "!bg-success-soft !shadow-[0_0_0_1px_oklch(from_var(--success)_l_c_h/45%)]",
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
      <div className="hidden h-1 w-12 overflow-hidden rounded-full bg-muted sm:block">
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
