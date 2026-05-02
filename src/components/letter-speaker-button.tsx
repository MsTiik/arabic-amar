"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Volume2, VolumeX } from "lucide-react";

import { getAudioForWord } from "@/lib/audio";
import { cn } from "@/lib/cn";

interface Props {
  /** The text to be spoken. Looked up in the Wikimedia audio manifest first,
   *  falls back to the browser SpeechSynthesis API if no recording exists. */
  text: string;
  /** Accessible label (e.g. "Play pronunciation of bā'"). */
  ariaLabel: string;
  /** Visual size. */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Force the TTS fallback even if a Wikimedia entry exists (useful for
   *  single letters like 'بَ' where the manifest would never match). */
  ttsOnly?: boolean;
}

/**
 * Speaker button with a two-tier audio strategy:
 *   1. Wikimedia Commons recording (via the existing audio manifest).
 *   2. Browser SpeechSynthesis API with `ar-SA` voice, as a free fallback.
 *
 * The button is hidden only if BOTH sources are unavailable (i.e. no manifest
 * entry AND the browser lacks any Arabic voice after voices have loaded).
 * Server-side render shows the button optimistically; the fallback check
 * only runs in the browser.
 */
export function LetterSpeakerButton({
  text,
  ariaLabel,
  size = "md",
  className,
  ttsOnly = false,
}: Props) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">(
    "idle",
  );
  const [ttsAvailable, setTtsAvailable] = useState<boolean | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const entry = ttsOnly ? undefined : getAudioForWord(text);
  const wikimediaUrl = entry?.url;

  useEffect(() => {
    // Detect Arabic TTS voice availability once voices have loaded.
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      const id = requestAnimationFrame(() => setTtsAvailable(false));
      return () => cancelAnimationFrame(id);
    }
    const check = () => {
      const voices = window.speechSynthesis.getVoices();
      setTtsAvailable(voices.some((v) => /^ar/i.test(v.lang)));
    };
    const id = requestAnimationFrame(check);
    window.speechSynthesis.addEventListener?.("voiceschanged", check);
    return () => {
      cancelAnimationFrame(id);
      window.speechSynthesis.removeEventListener?.("voiceschanged", check);
      audioRef.current?.pause();
      audioRef.current = null;
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }
    };
  }, []);

  // Don't render at all if neither source works (deliberate: no broken UI).
  // SSR: render optimistically (ttsAvailable === null) so Next.js doesn't
  // hydration-mismatch; client-side, the effect will hide it if truly unavailable.
  if (!wikimediaUrl && ttsAvailable === false) return null;

  const sizeClass =
    size === "sm"
      ? "h-6 w-6 rounded-md p-1 text-xs"
      : size === "lg"
        ? "h-10 w-10 rounded-xl p-2 text-base"
        : "h-8 w-8 rounded-lg p-1.5 text-sm";
  const iconSize =
    size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  function stopAll() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
  }

  function play(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    stopAll();
    setState("loading");

    if (wikimediaUrl) {
      const audio = new Audio(wikimediaUrl);
      audio.preload = "auto";
      audioRef.current = audio;
      const isCurrent = () => audioRef.current === audio;
      audio.addEventListener("playing", () => {
        if (isCurrent()) setState("playing");
      });
      audio.addEventListener("ended", () => {
        if (isCurrent()) setState("idle");
      });
      audio.addEventListener("pause", () => {
        if (isCurrent()) setState("idle");
      });
      audio.addEventListener("error", () => {
        if (isCurrent()) setState("error");
      });
      audio.play().catch(() => {
        if (isCurrent()) setState("error");
      });
      return;
    }

    // TTS fallback.
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setState("error");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-SA";
    utterance.rate = 0.85;
    utterance.pitch = 1;
    const arVoice = window.speechSynthesis
      .getVoices()
      .find((v) => /^ar/i.test(v.lang));
    if (arVoice) utterance.voice = arVoice;
    utteranceRef.current = utterance;
    utterance.onstart = () => {
      if (utteranceRef.current === utterance) setState("playing");
    };
    utterance.onend = () => {
      if (utteranceRef.current === utterance) setState("idle");
    };
    utterance.onerror = () => {
      if (utteranceRef.current === utterance) setState("error");
    };
    window.speechSynthesis.speak(utterance);
  }

  let Icon = Volume2;
  if (state === "loading") Icon = Loader2;
  else if (state === "error") Icon = VolumeX;

  return (
    <button
      type="button"
      onClick={play}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center border border-border bg-background-soft text-foreground-soft transition-colors hover:bg-muted hover:text-foreground focus-ring",
        sizeClass,
        state === "playing" && "border-primary text-primary",
        state === "error" && "border-danger text-danger",
        className,
      )}
    >
      <Icon
        className={cn(iconSize, state === "loading" && "animate-spin")}
        aria-hidden="true"
      />
    </button>
  );
}
