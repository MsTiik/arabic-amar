import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { cn } from "@/lib/cn";

/** Card linking to the Foundations reading course (/read). Shown alongside
 *  lesson cards on the Home and Lessons pages. */
export function FoundationsCard({ className }: { className?: string }) {
  return (
    <Link
      href="/read"
      className={cn(
        "brand-panel group relative flex min-h-48 flex-col overflow-hidden rounded-[14px] p-5 shadow-[var(--shadow-md),inset_0_1px_0_oklch(1_0_0/8%)] hover-lift focus-ring",
        className,
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-gold/15 text-accent-gold ring-1 ring-inset ring-accent-gold/25">
          <span className="font-arabic-display text-2xl leading-none" aria-hidden>
            ب
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-accent-gold/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-gold ring-1 ring-inset ring-accent-gold/20">
          <Sparkles className="h-3 w-3" aria-hidden />
          Qurʼān reading
        </span>
      </div>

      <div className="relative mt-4">
        <h3 className="font-display text-[1.4rem] leading-tight">Foundations</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Build your reading skills, then explore Al-Fātiḥah and short surahs
          word by word.
        </p>
      </div>

      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-4 text-xs font-semibold text-primary">
        Start reading
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </Link>
  );
}
