"use client";

import { Volume2, VolumeX } from "lucide-react";

import { feedbackActions, useFeedbackPreference } from "@/lib/feedback";
import { cn } from "@/lib/cn";

/**
 * Toggles answer sound effects + haptic feedback during practice sessions.
 * Mirrors the ThemeToggle: shows the icon for the *current* state.
 */
export function FeedbackToggle({ className }: { className?: string }) {
  const pref = useFeedbackPreference();
  const on = pref === "on";
  const Icon = on ? Volume2 : VolumeX;
  const label = on
    ? "Turn off sound and haptic feedback"
    : "Turn on sound and haptic feedback";

  return (
    <button
      type="button"
      onClick={() => feedbackActions.toggle()}
      title={`Effects: ${on ? "On" : "Off"}. ${label}.`}
      aria-label={label}
      aria-pressed={on}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
