import { BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";

/** Small tag used on every /read/* page to signal this is baked-in
 *  reference content (not sourced from the Google Doc). */
export function FoundationsBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-accent-gold/40 bg-accent-gold-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-foreground",
        className,
      )}
      title="Baked-in reference content, independent of the curriculum doc."
    >
      <BookOpen className="h-3 w-3" aria-hidden />
      Foundations
    </span>
  );
}
