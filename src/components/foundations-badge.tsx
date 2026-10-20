import { BookOpen } from "lucide-react";
import { cn } from "@/lib/cn";

/** Small tag used on every /read/* page to signal this is baked-in
 *  reference content (not sourced from the Google Doc). */
export function FoundationsBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "chip border border-accent-gold/40 bg-accent-gold-soft text-foreground",
        className,
      )}
      title="Baked-in reference content, independent of the curriculum doc."
    >
      <BookOpen className="h-3 w-3" aria-hidden />
      Foundations
    </span>
  );
}
