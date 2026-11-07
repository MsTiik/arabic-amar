import { RotateCcw } from "lucide-react";

import { Prose } from "@/components/prose";
import { cn } from "@/lib/cn";

/**
 * Building blocks shared by every Level 2 exercise (choose-the-answer,
 * complete-the-dialogue, reading questions, matching, corrections), so they
 * look and behave the same.
 */

/** A round answer button holding Arabic. Pair with `pillState`. */
export const PILL =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-1.5 font-arabic text-xl transition-colors focus-ring";

export function pillState(answered: boolean, isAnswer: boolean, isPicked: boolean) {
  return cn(
    !answered && "border-hairline bg-card hover:border-primary/50 hover:bg-primary-soft",
    answered && isAnswer && "border-success bg-success-soft text-success",
    answered && isPicked && !isAnswer && "border-danger bg-danger-soft text-danger",
    answered && !isPicked && !isAnswer && "border-hairline opacity-50",
  );
}

/** "Correct." / "Not quite." followed by the reason. */
export function Feedback({ correct, why }: { correct: boolean; why: string }) {
  return (
    <p className={cn("text-sm font-medium", correct ? "text-success" : "text-danger")}>
      {correct ? "Correct. " : "Not quite. "}
      <Prose text={why} />
    </p>
  );
}

/** A stable shuffle: round 0 keeps the authored order, later rounds reorder. */
export function shuffled<T>(items: readonly T[], seed: number): T[] {
  const copy = [...items];
  if (seed === 0) return copy;
  let state = seed * 9301 + 49297;
  for (let index = copy.length - 1; index > 0; index--) {
    state = (state * 9301 + 49297) % 233280;
    const swap = Math.floor((state / 233280) * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

/** A small text button for the score strip (start again, show English…). */
export function StripAction({
  onClick,
  icon: Icon = RotateCcw,
  pressed,
  children,
}: {
  onClick: () => void;
  icon?: typeof RotateCcw;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {children}
    </button>
  );
}

/** The strip above an exercise: the score, a hint, and actions on the right. */
export function ScoreStrip({
  score,
  hint,
  complete = false,
  children,
}: {
  score: React.ReactNode;
  hint?: React.ReactNode;
  /** Everything answered and right: the strip turns green. */
  complete?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[10px] border px-3 py-2 text-sm",
        complete ? "border-success/40 bg-success-soft" : "border-hairline bg-card",
      )}
      aria-live="polite"
    >
      <span className="font-semibold tabular-nums">{score}</span>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      {children ? <span className="ml-auto flex flex-wrap items-center gap-3">{children}</span> : null}
    </div>
  );
}

/** A score strip for right/wrong exercises, with retry-the-missed and start-again. */
export function ScoreBar({
  right,
  answered,
  total,
  onRetryMissed,
  onRestart,
  children,
}: {
  right: number;
  answered: number;
  total: number;
  onRetryMissed: () => void;
  onRestart: () => void;
  children?: React.ReactNode;
}) {
  const done = answered === total;
  const missed = answered - right;
  return (
    <ScoreStrip
      score={`${right} / ${total} correct`}
      hint={done ? (missed === 0 ? "All right. Well done!" : `Done. ${missed} to look at again.`) : `${total - answered} to go`}
      complete={done && missed === 0}
    >
      {children}
      {done && missed > 0 ? <StripAction onClick={onRetryMissed}>Retry the {missed} I missed</StripAction> : null}
      {answered > 0 ? <StripAction onClick={onRestart}>Start again</StripAction> : null}
    </ScoreStrip>
  );
}
