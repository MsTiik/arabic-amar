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
// Bumped on release so fetches that were in flight when the cache was
// cleared discard their blob instead of storing a URL nobody will revoke.
let generation = 0;

async function warm(url: string): Promise<void> {
  if (objectUrls.has(url) || inFlight.has(url)) return;
  inFlight.add(url);
  const startedIn = generation;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      if (startedIn === generation && !objectUrls.has(url)) {
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

/** Release all prefetched recordings (e.g. when a practice session ends). */
export function releasePrefetchedAudio(): void {
  generation++;
  for (const objectUrl of objectUrls.values()) {
    URL.revokeObjectURL(objectUrl);
  }
  objectUrls.clear();
}

/**
 * Fully detach a media element so the browser can reclaim its decoder.
 * Browsers cap the number of live media players per page; pages that keep
 * allocating `new Audio()` without releasing old ones eventually have every
 * `play()` call rejected — the classic "pronunciation stopped working
 * mid-session" failure. Standard teardown: pause, drop the src, load().
 */
export function teardownAudioElement(audio: HTMLAudioElement): void {
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
}

/**
 * Play `url` on `audio`, resolving through the prefetch cache. If the cached
 * blob URL fails (e.g. it was revoked while a delayed play was pending),
 * retries once with the network URL instead of failing silently.
 */
export function playWithFallback(
  audio: HTMLAudioElement,
  url: string,
): Promise<void> {
  const resolved = resolveAudioUrl(url);
  audio.src = resolved;
  return audio.play().catch((err) => {
    if (resolved === url) throw err;
    objectUrls.delete(url);
    audio.src = url;
    return audio.play();
  });
}
