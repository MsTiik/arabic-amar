import Link from "next/link";
import { BookOpen } from "lucide-react";

import { cn } from "@/lib/cn";

/** Card linking to the Foundations reading course (/read). Shown alongside
 *  lesson cards on the Home and Lessons pages. */
export function FoundationsCard({ className }: { className?: string }) {
  return (
    <Link
      href="/read"
      className={cn(
        "group flex items-center gap-5 rounded-2xl border border-accent-gold/40 bg-accent-gold-soft p-5 hover-lift focus-ring",
        className,
      )}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-gold/20">
        <BookOpen className="h-6 w-6 text-accent-gold" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold">Foundations</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Alphabet, harakāt, madd, sun &amp; moon letters — the essentials for
          reading Qurʼān.
        </p>
      </div>
    </Link>
  );
}
