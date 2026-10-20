"use client";

import { Moon, Sun } from "lucide-react";

import { themeActions } from "@/lib/theme";
import { cn } from "@/lib/cn";

/**
 * Light/dark toggle. Shows a sun in light mode and a moon in dark mode.
 * Icons are swapped with the `dark:` variant rather than React state so
 * the server render and the first client paint always match.
 */
export function ThemeToggle({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => themeActions.toggle()}
      title="Switch between light and dark mode"
      aria-label="Toggle dark mode"
      className={cn("icon-btn focus-ring", className)}
    >
      <Sun className="h-4 w-4 dark:hidden" aria-hidden />
      <Moon className="hidden h-4 w-4 dark:block" aria-hidden />
    </button>
  );
}
