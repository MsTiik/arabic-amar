import { BookOpen, ChevronDown, Dumbbell, HelpCircle, ListChecks } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * A collapsible panel for optional material: exercises, Qur’an examples,
 * self-tests and word lists. It is a native `<details>`, so it works without
 * JavaScript, keeps its contents (and any answers given) while closed, and
 * opens on find-in-page. It has no hooks, so server and client components can
 * both use it; a client exercise passes its live score as `status`.
 */
export type DisclosureTone = "exercise" | "quran" | "quiz" | "plain";

const TONES: Record<DisclosureTone, { icon: typeof Dumbbell; badge: string; ring: string; cta: string }> = {
  exercise: {
    icon: Dumbbell,
    badge: "bg-primary text-primary-foreground",
    ring: "border-primary/25 bg-primary-soft/45 open:bg-card",
    cta: "Start",
  },
  quiz: {
    icon: HelpCircle,
    badge: "bg-accent-indigo-soft text-accent-indigo",
    ring: "border-accent-indigo/25 bg-accent-indigo-soft/40 open:bg-card",
    cta: "Test yourself",
  },
  quran: {
    icon: BookOpen,
    badge: "bg-accent-gold-soft text-accent-gold",
    ring: "border-accent-gold/30 bg-accent-gold-soft/35 open:bg-card",
    cta: "Show",
  },
  plain: {
    icon: ListChecks,
    badge: "bg-muted text-muted-foreground",
    ring: "border-hairline-strong bg-card",
    cta: "Show",
  },
};

export function Disclosure({
  title,
  meta,
  status,
  tone = "exercise",
  cta,
  defaultOpen = false,
  id,
  className,
  bodyClassName,
  children,
}: {
  title: React.ReactNode;
  /** Short detail beside the title, e.g. "6 questions". */
  meta?: React.ReactNode;
  /** Live progress, e.g. "3 / 6 correct"; replaces nothing, sits beside meta. */
  status?: React.ReactNode;
  tone?: DisclosureTone;
  /** Label on the closed panel's button; defaults by tone. */
  cta?: string;
  defaultOpen?: boolean;
  id?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  const style = TONES[tone];
  const Icon = style.icon;
  return (
    <details id={id} open={defaultOpen} className={cn("group/disc scroll-mt-24 rounded-[14px] border transition-colors", style.ring, className)}>
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-[14px] px-3 py-2.5 focus-ring sm:px-4 sm:py-3 [&::-webkit-details-marker]:hidden">
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]", style.badge)}>
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-snug sm:text-base">{title}</span>
          {meta || status ? (
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              {meta ? <span>{meta}</span> : null}
              {status ? <span className="font-semibold text-foreground-soft">{status}</span> : null}
            </span>
          ) : null}
        </span>
        <span className="hidden shrink-0 rounded-full border border-hairline-strong bg-card px-3 py-1 text-xs font-semibold text-primary shadow-sm group-open/disc:hidden sm:inline-flex">
          {cta ?? style.cta}
        </span>
        <ChevronDown
          className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open/disc:rotate-180"
          aria-hidden
        />
      </summary>
      <div className={cn("border-t border-hairline px-3 pb-3 pt-3 sm:px-4 sm:pb-4", bodyClassName)}>{children}</div>
    </details>
  );
}
