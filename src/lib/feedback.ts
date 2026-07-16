"use client";

import { useSyncExternalStore } from "react";

export const FEEDBACK_STORAGE_KEY = "arabic-amar:feedback:v1";

/** Whether answer sounds + haptics are enabled. Default on. */
export type FeedbackPreference = "on" | "off";

function isPreference(v: unknown): v is FeedbackPreference {
  return v === "on" || v === "off";
}

function readPreference(): FeedbackPreference {
  if (typeof window === "undefined") return "on";
  try {
    const raw = window.localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (isPreference(raw)) return raw;
  } catch {
    /* ignored */
  }
  return "on";
}

const listeners = new Set<() => void>();
let cached: FeedbackPreference | null = null;

function getSnapshot(): FeedbackPreference {
  if (cached) return cached;
  cached = readPreference();
  return cached;
}

function getServerSnapshot(): FeedbackPreference {
  return "on";
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setPreference(next: FeedbackPreference): void {
  cached = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(FEEDBACK_STORAGE_KEY, next);
    } catch {
      /* localStorage may be unavailable (private mode, etc.) */
    }
  }
  for (const l of listeners) l();
}

export const feedbackActions = {
  toggle(): void {
    setPreference(getSnapshot() === "on" ? "off" : "on");
  },
  set(pref: FeedbackPreference): void {
    setPreference(pref);
  },
};

/** Returns the current feedback preference, re-rendering when it changes. */
export function useFeedbackPreference(): FeedbackPreference {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function enabled(): boolean {
  return getSnapshot() === "on";
}

/* ------------------------------------------------------------------ */
/* Haptics                                                             */
/* ------------------------------------------------------------------ */

export type HapticKind =
  | "correct"
  | "wrong"
  | "tap"
  | "combo"
  | "complete";

const HAPTIC_PATTERNS: Record<HapticKind, number | number[]> = {
  correct: 40,
  wrong: [60, 50, 60],
  tap: 15,
  combo: [30, 40, 30, 40, 60],
  complete: [50, 60, 50, 60, 120],
};

/** Fire a vibration pattern on devices that support it (mostly Android). */
export function haptic(kind: HapticKind): void {
  if (!enabled()) return;
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(HAPTIC_PATTERNS[kind]);
  } catch {
    /* ignored */
  }
}

/* ------------------------------------------------------------------ */
/* Sound effects (synthesised — no audio assets needed)                */
/* ------------------------------------------------------------------ */

export type SoundKind = "correct" | "wrong" | "match" | "combo" | "complete";

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") {
    void ctx.resume().catch(() => {});
  }
  return ctx;
}

interface Note {
  freq: number;
  at: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

function playNotes(notes: Note[]): void {
  const audio = getContext();
  if (!audio) return;
  const now = audio.currentTime;
  for (const note of notes) {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = note.type ?? "sine";
    osc.frequency.value = note.freq;
    const start = now + note.at;
    const peak = note.gain ?? 0.12;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.duration);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(start);
    osc.stop(start + note.duration + 0.02);
  }
}

const SOUNDS: Record<SoundKind, Note[]> = {
  // Bright ascending major third — the classic "ding-ding".
  correct: [
    { freq: 660, at: 0, duration: 0.15, type: "triangle" },
    { freq: 880, at: 0.1, duration: 0.22, type: "triangle" },
  ],
  // Soft low "thud" — informative, not punishing.
  wrong: [
    { freq: 220, at: 0, duration: 0.2, type: "sine", gain: 0.1 },
    { freq: 175, at: 0.12, duration: 0.28, type: "sine", gain: 0.1 },
  ],
  // Tiny click for a successful pair match mid-question.
  match: [{ freq: 990, at: 0, duration: 0.1, type: "triangle", gain: 0.08 }],
  // Rising arpeggio when a combo milestone is hit.
  combo: [
    { freq: 587, at: 0, duration: 0.12, type: "triangle" },
    { freq: 740, at: 0.09, duration: 0.12, type: "triangle" },
    { freq: 880, at: 0.18, duration: 0.2, type: "triangle" },
  ],
  // Short fanfare for finishing a deck.
  complete: [
    { freq: 523, at: 0, duration: 0.16, type: "triangle" },
    { freq: 659, at: 0.12, duration: 0.16, type: "triangle" },
    { freq: 784, at: 0.24, duration: 0.16, type: "triangle" },
    { freq: 1047, at: 0.36, duration: 0.4, type: "triangle" },
  ],
};

export function playSound(kind: SoundKind): void {
  if (!enabled()) return;
  playNotes(SOUNDS[kind]);
}

/* ------------------------------------------------------------------ */
/* Combined helpers                                                    */
/* ------------------------------------------------------------------ */

/** Sound + haptic for an answered question. */
export function answerFeedback(correct: boolean): void {
  playSound(correct ? "correct" : "wrong");
  haptic(correct ? "correct" : "wrong");
}

/** Sound + haptic for hitting a combo milestone (e.g. 5 in a row). */
export function comboFeedback(): void {
  playSound("combo");
  haptic("combo");
}

/** Sound + haptic for completing a deck. */
export function completeFeedback(): void {
  playSound("complete");
  haptic("complete");
}
