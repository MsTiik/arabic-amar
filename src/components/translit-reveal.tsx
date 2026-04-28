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
  /** BCP-47 language tag for the revealed text. Defaults to `ar-Latn`
   *  (Arabic transliterated in Latin script). Pass an empty string (`""`)
   *  when the revealed text is not a transliteration — e.g. an English
   *  meaning hint — so screen readers get the right pronunciation.
   *  (An explicit `undefined` will be treated as "not provided" by JS
   *  default-parameter semantics and fall back to `ar-Latn`.) */
  lang?: string;
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
  lang,
}: Props) {
  const [shown, setShown] = useState(false);
  if (!text || !text.trim()) return null;
  // `lang === ""` → caller explicitly wants no lang attribute (e.g. revealed
  // text is plain English). Otherwise default to `ar-Latn`.
  const resolvedLang =
    lang === "" ? undefined : (lang ?? "ar-Latn");
  // Mirror the hidden-state label for the shown state so screen readers stay
  // consistent when callers override `hiddenLabel` (e.g. "Show meaning" →
  // "Hide meaning").
  const shownLabel = hiddenLabel.replace(/^Show\b/i, "Hide");

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShown((s) => !s);
        }}
        aria-pressed={shown}
        aria-label={shown ? shownLabel : hiddenLabel}
        className={cn(
          "block w-full text-center text-[10px] leading-tight text-muted-foreground/60 hover:text-muted-foreground focus-ring rounded",
          className,
        )}
        lang={shown ? resolvedLang : undefined}
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
      aria-label={shown ? shownLabel : hiddenLabel}
      className={cn(
        "mx-auto mt-1 block text-xs italic text-muted-foreground/70 hover:text-muted-foreground focus-ring rounded px-2",
        className,
      )}
      lang={shown ? resolvedLang : undefined}
    >
      {shown ? text : hiddenLabel}
    </button>
  );
}
