import * as React from "react";
import { cn } from "@/lib/cn";

interface ProgressRingProps {
  /** 0..1 */
  value: number;
  size?: number;
  thickness?: number;
  className?: string;
  showLabel?: boolean;
  label?: React.ReactNode;
  trackClassName?: string;
  fillClassName?: string;
}

export function ProgressRing({
  value,
  size = 64,
  thickness = 8,
  className,
  showLabel = true,
  label,
  trackClassName = "stroke-border",
  fillClassName = "stroke-primary",
}: ProgressRingProps) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const safe = Math.max(0, Math.min(1, value));
  const offset = c * (1 - safe);
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} role="img" aria-label={`Progress ${Math.round(safe * 100)}%`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={trackClassName}
          strokeWidth={thickness}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={fillClassName}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 360ms ease-out" }}
        />
      </svg>
      {showLabel ? (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">
          {label ?? `${Math.round(safe * 100)}%`}
        </span>
      ) : null}
    </div>
  );
}
