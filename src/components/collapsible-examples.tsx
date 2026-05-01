"use client";

import { useId, useState, type ReactNode } from "react";

interface Props {
  /** Children list — typically `<li>` rows. The first `initialVisible`
   *  children are always rendered; the rest are toggled by the button. */
  children: ReactNode[];
  /** Number of children visible before "Show all" is clicked. Defaults to 3. */
  initialVisible?: number;
  /** Optional label override, e.g. "Show all 16 sentences". When omitted,
   *  reads "Show all (N)" / "Show fewer". */
  label?: string;
  /** Class applied to the wrapping `<ul>`. */
  className?: string;
}

/**
 * Wraps a list of example rows so only the first N are visible by default,
 * with a button that reveals the rest. State is per-mount so each rule on a
 * page tracks its own collapsed/expanded state.
 */
export function CollapsibleExamples({
  children,
  initialVisible = 3,
  label,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const items = children.filter(Boolean);
  const total = items.length;

  if (total <= initialVisible) {
    return <ul className={className}>{items}</ul>;
  }

  const visible = open ? items : items.slice(0, initialVisible);
  const hidden = total - initialVisible;

  return (
    <div>
      <ul id={id} className={className}>
        {visible}
      </ul>
      <button
        type="button"
        aria-controls={id}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mt-2 inline-flex items-center gap-1 rounded-full border border-border bg-background-soft px-3 py-1 text-xs font-medium text-foreground-soft hover:bg-muted focus-ring"
      >
        {open ? "Show fewer" : (label ?? `Show all (${total})`)}
        <span aria-hidden="true">{open ? "↑" : `+${hidden}`}</span>
      </button>
    </div>
  );
}
