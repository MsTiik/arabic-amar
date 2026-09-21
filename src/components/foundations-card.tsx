import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";

import { cn } from "@/lib/cn";

/** Card linking to the Foundations reading course (/read). Shown alongside
 *  lesson cards on the Home and Lessons pages. */
export function FoundationsCard({ className }: { className?: string }) {
  return (
    <Link
      href="/read"
      className={cn(
        "brand-panel group relative flex min-h-48 flex-col overflow-hidden rounded-2xl border border-border p-5 hover-lift focus-ring",
        className,
      )}
    >
      <span
        className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full border border-accent-gold/20 bg-accent-gold/10 transition-transform duration-300 group-hover:scale-110"
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-gold/15 text-accent-gold ring-1 ring-inset ring-accent-gold/25">
          <BookOpen className="h-5 w-5" aria-hidden />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-gold/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-gold ring-1 ring-inset ring-accent-gold/20">
          <Sparkles className="h-3 w-3" aria-hidden />
          Qurʼān reading
        </span>
      </div>

      <div className="relative mt-4">
        <h3 className="text-xl font-semibold tracking-tight">Foundations</h3>
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
