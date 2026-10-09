"use client";

import { AudioLines } from "lucide-react";

import { autoplayActions, useAutoplayPreference } from "@/lib/autoplay";
import { cn } from "@/lib/cn";

/**
 * Toggles automatic pronunciation playback during practice: when on, a word's
 * recording plays on flashcard flip and when an answer is revealed.
 */
export function AutoplayToggle({ className }: { className?: string }) {
  const pref = useAutoplayPreference();
  const on = pref === "on";
  const label = on
    ? "Turn off automatic pronunciation"
    : "Turn on automatic pronunciation";

  return (
    <button
      type="button"
      onClick={() => autoplayActions.toggle()}
      title={`Autoplay pronunciation: ${on ? "On" : "Off"}. ${label}.`}
      aria-label={label}
      aria-pressed={on}
      className={cn(
        "icon-btn",
        on
          ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20"
          : "border-hairline bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <AudioLines className="h-4 w-4" aria-hidden />
    </button>
  );
}
