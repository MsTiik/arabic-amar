"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Square, Volume2, VolumeX } from "lucide-react";

import { getAudioForWord } from "@/lib/audio";
import {
  playWithFallback,
  teardownAudioElement,
} from "@/lib/audio-prefetch";
import { cn } from "@/lib/cn";

interface Props {
  /** The Arabic word to play. Looked up by diacritic-stripped form. */
  arabic: string;
  /** A short readable description of the word for the aria-label
   *  (e.g. English gloss). */
  label?: string;
  /** Visual size hint. `sm` for inline / dense rows, `md` for cards. */
  size?: "sm" | "md";
  className?: string;
  /** Override: pass a fully-resolved URL (e.g. for Qur'an ayah audio). */
  url?: string;
  /** Override the aria-label entirely (e.g. "Play recitation of Qur'an 20:14"). */
  ariaLabel?: string;
  /** Keep a disabled icon visible when no vocabulary recording exists. */
  showUnavailable?: boolean;
}

/** A small, unobtrusive speaker button that plays a Wikimedia Commons audio
 *  recording of the given Arabic word. */
export function SpeakerButton({
  arabic,
  label,
  size = "md",
  className,
  url,
  ariaLabel,
  showUnavailable = false,
}: Props) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">(
    "idle",
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const entry = url ? null : getAudioForWord(arabic);
  const playUrl = url ?? entry?.url;

  useEffect(() => {
    return () => {
      if (audioRef.current) teardownAudioElement(audioRef.current);
      audioRef.current = null;
    };
  }, []);

  const sizeClass =
    size === "sm"
      ? "h-6 w-6 rounded-md p-1 text-xs"
      : "h-8 w-8 rounded-lg p-1.5 text-sm";

  const unavailableLabel =
    label ? `Audio unavailable for ${label}` : "Audio unavailable";

  if (!playUrl) {
    if (!showUnavailable) return null;
    return (
      <span
        aria-label={unavailableLabel}
        title={unavailableLabel}
        className={cn(
          "inline-flex items-center justify-center border border-dashed border-border bg-background-soft text-muted-foreground/70",
          sizeClass,
          className,
        )}
        role="img"
      >
        <VolumeX
          className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
          aria-hidden="true"
        />
      </span>
    );
  }

  function play(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!playUrl) return;
    // Toggle: a second click on a button that's already loading or playing
    // stops playback instead of restarting from zero. Matches the user's
    // mental model of a play/pause button.
    if (audioRef.current && (state === "playing" || state === "loading")) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState("idle");
      return;
    }
    // One reusable element per button: browsers cap live media players per
    // page, so a fresh Audio per click eventually gets every play() rejected.
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio();
      audio.preload = "auto";
      audioRef.current = audio;
      audio.addEventListener("playing", () => setState("playing"));
      audio.addEventListener("ended", () => setState("idle"));
      audio.addEventListener("pause", () => setState("idle"));
    }
    setState("loading");
    // Plays the prefetched in-memory copy when available; falls back to the
    // network URL if the cached blob has been released.
    playWithFallback(audio, playUrl).catch(() => setState("error"));
  }

  const labelText =
    ariaLabel ??
    (label ? `Play pronunciation of ${label}` : "Play pronunciation");

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  let Icon = Volume2;
  if (state === "loading") Icon = Loader2;
  else if (state === "playing") Icon = Square;
  else if (state === "error") Icon = VolumeX;

  return (
    <button
      type="button"
      onClick={play}
      aria-label={labelText}
      title={labelText}
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
