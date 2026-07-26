import audioLocal from "../../content/audio-local.json";
import audioManifest from "../../content/audio-manifest.json";
import { audioManifestKey } from "./audio-keys";
import type { SiteContent } from "./types";

export interface AudioEntry {
  url: string;
  source: "lingualibre" | "ar-x";
  title: string;
  author?: string;
  license: string;
}

export interface QuranAudioEntry {
  verseKey: string;
  url: string;
  reciter: string;
  license: string;
}

export interface AudioCoverageTopic {
  slug: string;
  name: string;
  total: number;
  withAudio: number;
  missingAudio: number;
  coveragePercent: number;
}

export interface AudioCoverageStats {
  vocabTotal: number;
  vocabWithAudio: number;
  vocabMissingAudio: number;
  coveragePercent: number;
  byTopic: AudioCoverageTopic[];
}

interface AudioManifest {
  version: 1;
  fetchedAt: string;
  entries: Record<string, AudioEntry>;
  quran: Record<string, QuranAudioEntry>;
  missing: string[];
}

interface LocalAudioMap {
  version: 1;
  builtAt: string;
  /** Manifest key → same-origin path under /audio/. */
  entries: Record<string, string>;
  quran: Record<string, string>;
}

const manifest = audioManifest as AudioManifest;
const local = audioLocal as LocalAudioMap;

/** Get a playable audio URL for an Arabic word. Falls back through stripped
 *  variants the same way the build script does, so newly-added words don't
 *  silently break if `arabic` retains diacritics that the key doesn't. */
export function getAudioForWord(arabic: string): AudioEntry | undefined {
  if (!arabic) return undefined;
  const key = audioManifestKey(arabic);
  if (!key) return undefined;
  const entry = manifest.entries[key];
  if (!entry) return undefined;
  // Prefer the mirrored same-origin copy (small MP3, CDN + service-worker
  // cacheable) over streaming from Wikimedia Commons at play time.
  const localUrl = local.entries[key];
  return localUrl ? { ...entry, url: localUrl } : entry;
}

export function hasAudioForWord(arabic: string): boolean {
  return getAudioForWord(arabic) !== undefined;
}

/** Get audio for a Qur'an citation like "Qur'ān 20:14" or "Qur'an 2:255". */
export function getAudioForCitation(
  citation: string | undefined,
): QuranAudioEntry | undefined {
  if (!citation) return undefined;
  if (!/qur/i.test(citation)) return undefined;
  const m = citation.match(/(\d+)\s*:\s*(\d+)/);
  if (!m) return undefined;
  const key = `${m[1]}:${m[2]}`;
  const entry = manifest.quran[key];
  if (!entry) return undefined;
  const localUrl = local.quran[key];
  return localUrl ? { ...entry, url: localUrl } : entry;
}

/** Aggregate counts useful for attribution / debug pages. */
export function audioStats() {
  return {
    fetchedAt: manifest.fetchedAt,
    totalEntries: Object.keys(manifest.entries).length,
    quranAyat: Object.keys(manifest.quran).length,
    missing: manifest.missing.length,
  };
}

export function createAudioCoverageStats(
  content: Pick<SiteContent, "vocab" | "topics">,
): AudioCoverageStats {
  const vocabWithAudio = content.vocab.filter((entry) =>
    hasAudioForWord(entry.arabic),
  ).length;
  return {
    vocabTotal: content.vocab.length,
    vocabWithAudio,
    vocabMissingAudio: content.vocab.length - vocabWithAudio,
    coveragePercent: coveragePercent(vocabWithAudio, content.vocab.length),
    byTopic: content.topics.map((topic) => {
      const topicVocab = content.vocab.filter((entry) =>
        entry.topicSlugs.includes(topic.slug),
      );
      const topicWithAudio = topicVocab.filter((entry) =>
        hasAudioForWord(entry.arabic),
      ).length;
      return {
        slug: topic.slug,
        name: topic.name,
        total: topicVocab.length,
        withAudio: topicWithAudio,
        missingAudio: topicVocab.length - topicWithAudio,
        coveragePercent: coveragePercent(topicWithAudio, topicVocab.length),
      };
    }),
  };
}

function coveragePercent(withAudio: number, total: number): number {
  return total === 0 ? 100 : Math.round((withAudio / total) * 100);
}
