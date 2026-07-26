"use client";

import { getAudioForWord } from "@/lib/audio";

/**
 * Warms pronunciation audio before it's needed so playback starts the moment
 * a card is answered instead of after a network round-trip. Fetched files are
 * held as object URLs in memory; `resolveAudioUrl` swaps them in when the
 * player asks for the original URL.
 */

const objectUrls = new Map<string, string>();
const inFlight = new Set<string>();

async function warm(url: string): Promise<void> {
  if (objectUrls.has(url) || inFlight.has(url)) return;
  inFlight.add(url);
  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      if (!objectUrls.has(url)) {
        objectUrls.set(url, URL.createObjectURL(blob));
      }
    }
  } catch {
    /* Prefetch is best-effort; playback falls back to the network. */
  } finally {
    inFlight.delete(url);
  }
}

/** Prefetch pronunciation recordings for a list of Arabic words. */
export function prefetchWordAudio(words: Array<string | undefined>): void {
  if (typeof window === "undefined") return;
  const urls = new Set<string>();
  for (const word of words) {
    if (!word) continue;
    const entry = getAudioForWord(word);
    if (entry) urls.add(entry.url);
  }
  const queue = [...urls];
  const CONCURRENCY = 3;
  const next = (): void => {
    const url = queue.shift();
    if (!url) return;
    void warm(url).then(next);
  };
  for (let i = 0; i < CONCURRENCY; i++) next();
}

/** Returns the prefetched in-memory copy of `url` when available. */
export function resolveAudioUrl(url: string): string {
  return objectUrls.get(url) ?? url;
}
