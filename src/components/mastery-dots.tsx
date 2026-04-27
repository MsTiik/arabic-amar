import { cn } from "@/lib/cn";
import type { Mastery } from "@/lib/types";

const LABELS: Record<Mastery, string> = {
  0: "New",
  1: "Learning",
  2: "Familiar",
  3: "Mastered",
};

const COLORS: Record<Mastery, string> = {
  0: "bg-border",
  1: "bg-primary/40",
  2: "bg-primary/70",
  3: "bg-success",
};

interface Props {
  mastery: Mastery;
  showLabel?: boolean;
  className?: string;
}

export function MasteryDots({ mastery, showLabel = false, className }: Props) {
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      title={LABELS[mastery]}
      aria-label={`Mastery: ${LABELS[mastery]}`}
    >
      <span className="flex items-center gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              i <= mastery ? COLORS[mastery] : "bg-border",
            )}
          />
        ))}
      </span>
      {showLabel ? (
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {LABELS[mastery]}
        </span>
      ) : null}
    </span>
  );
}
