"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Share, SquarePlus, X } from "lucide-react";

const DISMISS_KEY = "arabic-amar:install-hint:v1";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.matchMedia("(display-mode: standalone)").matches &&
    !(navigator as Navigator & { standalone?: boolean }).standalone &&
    !localStorage.getItem(DISMISS_KEY)
  );
}

function getServerSnapshot(): boolean {
  return false;
}

function dismiss() {
  localStorage.setItem(DISMISS_KEY, "dismissed");
  listeners.forEach((l) => l());
}

/**
 * Registers the service worker (production only, to keep dev caching sane)
 * and shows a one-time "Add to Home Screen" hint to iPhone/iPad visitors,
 * where the browser never prompts on its own.
 */
export function PwaSetup() {
  const showHint = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // Offline support is progressive enhancement; ignore failures.
      });
    }
  }, []);

  if (!showHint) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-3 z-50 flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm text-card-foreground shadow-lg"
    >
      <div className="min-w-0">
        <p className="font-semibold">Install Arabic Amar</p>
        <p className="mt-1 text-muted-foreground">
          Tap <Share className="inline h-4 w-4 align-text-bottom" aria-label="Share" /> Share,
          then <SquarePlus className="inline h-4 w-4 align-text-bottom" aria-hidden />{" "}
          &ldquo;Add to Home Screen&rdquo; to use this site as an app.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install hint"
        className="ml-auto inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
