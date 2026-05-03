"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { themeActions, useThemePreference } from "@/lib/theme";
import { cn } from "@/lib/cn";

const ICON: Record<string, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const NEXT_LABEL: Record<string, string> = {
  light: "Switch to dark",
  dark: "Switch to system theme",
  system: "Switch to light",
};

const STATE_LABEL: Record<string, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

/**
 * Single-button theme cycle: Light → Dark → System → Light.
 * Always shows the icon for the *current* preference (not "the icon to
 * switch to"), which we found is what users expect from this control.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const pref = useThemePreference();
  const Icon = ICON[pref] ?? Monitor;

  return (
    <button
      type="button"
      onClick={() => themeActions.cycle()}
      title={`Theme: ${STATE_LABEL[pref]}. ${NEXT_LABEL[pref]}.`}
      aria-label={NEXT_LABEL[pref]}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring",
        className,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
