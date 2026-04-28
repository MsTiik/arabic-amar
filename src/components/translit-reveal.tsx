"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  text: string;
  /** Visual style: `inline` keeps it on one line (good for option buttons),
   *  `block` is centered below a prompt with a discreet toggle. */
  variant?: "inline" | "block";
  className?: string;
  /** Override the toggle label when hidden. Default: "Show pronunciation". */
  hiddenLabel?: string;
}

/**
 * Discreet, click-to-reveal transliteration. Hidden by default so the user
 * has to actively try reading the Arabic; clicking reveals a small dim
 * pronunciation hint they can use as a fallback.
 */
export function TranslitReveal({
  text,
  variant = "block",
  className,
  hiddenLabel = "Show pronunciation",
}: Props) {
  const [shown, setShown] = useState(false);
  if (!text || !text.trim()) return null;

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShown((s) => !s);
        }}
        aria-pressed={shown}
        aria-label={shown ? "Hide pronunciation" : hiddenLabel}
        className={cn(
          "block w-full text-center text-[10px] leading-tight text-muted-foreground/60 hover:text-muted-foreground focus-ring rounded",
          className,
        )}
        lang={shown ? "ar-Latn" : undefined}
      >
        {shown ? text : "🔊 hint"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setShown((s) => !s);
      }}
      aria-pressed={shown}
      aria-label={shown ? "Hide pronunciation" : hiddenLabel}
      className={cn(
        "mx-auto mt-1 block text-xs italic text-muted-foreground/70 hover:text-muted-foreground focus-ring rounded px-2",
        className,
      )}
      lang={shown ? "ar-Latn" : undefined}
    >
      {shown ? text : hiddenLabel}
    </button>
  );
}
