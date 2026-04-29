import audioManifest from "../../content/audio-manifest.json";

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

interface AudioManifest {
  version: 1;
  fetchedAt: string;
  entries: Record<string, AudioEntry>;
  quran: Record<string, QuranAudioEntry>;
  missing: string[];
}

const manifest = audioManifest as AudioManifest;

/** Strip Arabic diacritics (tashkeel) so vocab Arabic forms map to the
 *  unvocalized keys used in the manifest. */
function stripDiacritics(s: string): string {
  return s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}

/** Get a playable audio URL for an Arabic word. Falls back through stripped
 *  variants the same way the build script does, so newly-added words don't
 *  silently break if `arabic` retains diacritics that the key doesn't. */
export function getAudioForWord(arabic: string): AudioEntry | undefined {
  if (!arabic) return undefined;
  const stripped = stripDiacritics(arabic).trim();
  if (!stripped) return undefined;
  return manifest.entries[stripped];
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
  return manifest.quran[key];
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
