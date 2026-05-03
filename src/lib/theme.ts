"use client";

import { useEffect, useSyncExternalStore } from "react";

export const THEME_STORAGE_KEY = "arabic-amar:theme:v1";

/** "system" follows OS preference; "light" / "dark" are explicit overrides. */
export type ThemePreference = "light" | "dark" | "system";

export type ResolvedTheme = "light" | "dark";

/**
 * Inline `<script>` injected before React hydration to apply the saved theme
 * class to <html> ahead of paint, avoiding a flash of the wrong theme.
 *
 * Self-contained — duplicates the storage key string, the resolution logic,
 * and the class names so it runs without any imports. Keep in sync with
 * `applyTheme` below.
 */
export const themeBootstrapScript = `
(function() {
  try {
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var pref = localStorage.getItem(key) || "system";
    var resolved = pref;
    if (pref === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    var root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
    root.dataset.themePref = pref;
    root.style.colorScheme = resolved;
  } catch (_) {}
})();
`.trim();

function isPreference(v: unknown): v is ThemePreference {
  return v === "light" || v === "dark" || v === "system";
}

function readPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isPreference(raw)) return raw;
  } catch {
    /* ignored */
  }
  return "system";
}

function resolvePreference(pref: ThemePreference): ResolvedTheme {
  if (pref === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return pref;
}

function applyTheme(pref: ThemePreference): void {
  if (typeof document === "undefined") return;
  const resolved = resolvePreference(pref);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.dataset.themePref = pref;
  root.style.colorScheme = resolved;
}

const listeners = new Set<() => void>();
let cached: ThemePreference | null = null;

function getSnapshot(): ThemePreference {
  if (cached) return cached;
  cached = readPreference();
  return cached;
}

// `useSyncExternalStore` requires a stable server snapshot to avoid
// hydration loops; "system" matches the bootstrap script's first-run
// default before any user override.
function getServerSnapshot(): ThemePreference {
  return "system";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setPreference(next: ThemePreference): void {
  cached = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* localStorage may be unavailable (private mode, etc.) */
    }
  }
  applyTheme(next);
  for (const l of listeners) l();
}

export const themeActions = {
  /** Cycle: light → dark → system → light. Used by the topbar toggle. */
  cycle(): void {
    const order: ThemePreference[] = ["light", "dark", "system"];
    const idx = order.indexOf(getSnapshot());
    const next = order[(idx + 1) % order.length];
    setPreference(next);
  },
  set(pref: ThemePreference): void {
    setPreference(pref);
  },
};

/** Returns the current theme preference, re-rendering when it changes. */
export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Mount once at the app root: keeps the OS-preference media query in sync
 * with our class when the user's preference is "system", and listens for
 * cross-tab changes so two open tabs stay in sync.
 */
export function useThemeSync(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial reconciliation in case the bootstrap script ran with a
    // stale cached snapshot.
    applyTheme(readPreference());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMedia = () => {
      if (getSnapshot() === "system") applyTheme("system");
    };
    media.addEventListener("change", onMedia);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== THEME_STORAGE_KEY) return;
      cached = readPreference();
      applyTheme(cached);
      for (const l of listeners) l();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      media.removeEventListener("change", onMedia);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
}
