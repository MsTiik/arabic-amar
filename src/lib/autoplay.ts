"use client";

import { useSyncExternalStore } from "react";

import { getAudioForWord } from "@/lib/audio";
import { playWithFallback } from "@/lib/audio-prefetch";

export const AUTOPLAY_STORAGE_KEY = "arabic-amar:autoplay:v1";

/** Whether word pronunciations play automatically during practice
 *  (on flashcard flip / when an answer is revealed). Default off. */
export type AutoplayPreference = "on" | "off";

function isPreference(v: unknown): v is AutoplayPreference {
  return v === "on" || v === "off";
}

function readPreference(): AutoplayPreference {
  if (typeof window === "undefined") return "off";
  try {
    const raw = window.localStorage.getItem(AUTOPLAY_STORAGE_KEY);
    if (isPreference(raw)) return raw;
  } catch {
    /* ignored */
  }
  return "off";
}

const listeners = new Set<() => void>();
let cached: AutoplayPreference | null = null;

function getSnapshot(): AutoplayPreference {
  if (cached) return cached;
  cached = readPreference();
  return cached;
}

function getServerSnapshot(): AutoplayPreference {
  return "off";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setPreference(next: AutoplayPreference): void {
  cached = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(AUTOPLAY_STORAGE_KEY, next);
    } catch {
      /* localStorage may be unavailable (private mode, etc.) */
    }
  }
  for (const l of listeners) l();
}

export const autoplayActions = {
  toggle(): void {
    setPreference(getSnapshot() === "on" ? "off" : "on");
  },
  set(pref: AutoplayPreference): void {
    setPreference(pref);
  },
};

/** Returns the current autoplay preference, re-rendering when it changes. */
export function useAutoplayPreference(): AutoplayPreference {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// A single reusable element: browsers cap the number of live media players
// per page, so allocating a fresh Audio per word eventually gets every
// play() rejected mid-session. One element, retargeted via src, never hits
// the cap.
let element: HTMLAudioElement | null = null;
let playToken = 0;

/**
 * Play the recording for an Arabic word if autoplay is enabled and a
 * recording exists. Stops any previous autoplay so quick advances through a
 * deck never overlap. Silent no-op when off or no recording is available.
 */
export function autoplayWord(arabic: string | undefined, delayMs = 0): void {
  if (getSnapshot() !== "on") return;
  if (!arabic) return;
  const entry = getAudioForWord(arabic);
  if (!entry) return;
  if (!element) {
    element = new Audio();
    element.preload = "auto";
  }
  const audio = element;
  audio.pause();
  const token = ++playToken;
  const start = () => {
    if (token !== playToken) return;
    playWithFallback(audio, entry.url).catch(() => {
      /* Autoplay is best-effort; browsers may block before interaction. */
    });
  };
  if (delayMs > 0) {
    window.setTimeout(start, delayMs);
  } else {
    start();
  }
}
