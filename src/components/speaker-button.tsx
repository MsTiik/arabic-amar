"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Volume2, VolumeX } from "lucide-react";

import { getAudioForWord } from "@/lib/audio";
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
}

/** A small, unobtrusive speaker button that plays a Wikimedia Commons audio
 *  recording of the given Arabic word. Hidden entirely if no recording exists
 *  in the manifest, so cards without coverage stay clean (no broken icons). */
export function SpeakerButton({
  arabic,
  label,
  size = "md",
  className,
  url,
  ariaLabel,
}: Props) {
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">(
    "idle",
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const entry = url ? null : getAudioForWord(arabic);
  const playUrl = url ?? entry?.url;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  if (!playUrl) return null;

  const sizeClass =
    size === "sm"
      ? "h-6 w-6 rounded-md p-1 text-xs"
      : "h-8 w-8 rounded-lg p-1.5 text-sm";

  function play(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!playUrl) return;
    // Stop any other speaker audio first so two clicks don't overlap.
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState("loading");
    const audio = new Audio(playUrl);
    audio.preload = "auto";
    audioRef.current = audio;
    // Guard each handler against the orphaned-Audio case: pausing the previous
    // Audio (above) queues an async "pause" event whose listener would reset
    // state to "idle" after we've already moved on to a new Audio. Only react
    // to events from the Audio that is *still* the current one.
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
  }

  const labelText =
    ariaLabel ??
    (label ? `Play pronunciation of ${label}` : "Play pronunciation");

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  let Icon = Volume2;
  if (state === "loading") Icon = Loader2;
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
