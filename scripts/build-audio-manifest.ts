/**
 * Builds `content/audio-manifest.json` — a mapping from Arabic words (with
 * diacritics stripped) to publicly-available audio URLs on Wikimedia Commons.
 *
 * Strategy:
 *   1. Extract every Arabic string from `content/content.json` (vocab,
 *      pronouns, conjugations).
 *   2. Strip diacritics (preserving hamza placement, since Commons file titles
 *      are unvocalized but keep the hamza form).
 *   3. For each unique stripped form, query Commons for:
 *        a) Lingua Libre exact match — `LL-Q13955 (ara)-USER-WORD.wav` where
 *           the part after the username dash equals the search word.
 *        b) Fall back to legacy `Ar-WORD.ogg` if no LL match.
 *   4. Skip any words already in the existing manifest (idempotent / cheap
 *      re-runs after content edits).
 *   5. Write the manifest. CI commits it back so production builds are
 *      offline-safe.
 *
 * Also resolves Qur'an ayah citations on pronoun examples to Quran.com Audio
 * API URLs (Mishary Al-Afasy reciter).
 *
 * Usage: `npm run audio:build`
 */

import fs from "node:fs/promises";
import path from "node:path";

import type { SiteContent } from "../src/lib/types";

const REPO_ROOT = path.resolve(__dirname, "..");
const CONTENT_PATH = path.join(REPO_ROOT, "content", "content.json");
const MANIFEST_PATH = path.join(REPO_ROOT, "content", "audio-manifest.json");

// Wikimedia Commons asks bots to identify themselves; uses their tool policy.
const USER_AGENT =
  "ArabicAmar/1.0 (https://github.com/MsTiik/arabic-amar; arabic-amar.vercel.app)";

const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

// Modern Standard Arabic on Wikidata (Q13955) — Lingua Libre uses this Q-id
// as a prefix on every MSA recording's filename. The constant lives in the
// search query below.

interface AudioEntry {
  /** Public URL playable directly (CORS-enabled, no auth). */
  url: string;
  /** "lingualibre" | "ar-x" */
  source: "lingualibre" | "ar-x";
  /** Original filename on Commons (for attribution / debugging). */
  title: string;
  /** Recording author (Lingua Libre username) when known. */
  author?: string;
  /** SPDX-style license string. */
  license: string;
}

interface QuranAudioEntry {
  /** "20:14" */
  verseKey: string;
  url: string;
  reciter: string;
  license: string;
}

interface AudioManifest {
  version: 1;
  fetchedAt: string;
  /** keyed by diacritic-stripped Arabic word */
  entries: Record<string, AudioEntry>;
  /** keyed by "surah:ayah" verse key */
  quran: Record<string, QuranAudioEntry>;
  /** Words we tried to find but couldn't — retried only on full rebuilds. */
  missing: string[];
}

/** Strip Arabic diacritics (tashkeel) but preserve hamza-bearing letters. */
function stripDiacritics(s: string): string {
  return s.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}

/** Fold hamza-bearing letters to plain forms — matches Wikimedia files that
 *  were uploaded with the looser spelling. Mirrors the parser's foldForSearch
 *  for the cases that affect file names: alif-with-hamza → alif, ya-with-hamza → ya,
 *  ta-marbuta → ha, alef-maqsura → ya. */
function foldHamza(s: string): string {
  return s
    .replace(/[\u0623\u0625\u0671]/g, "\u0627") // أ إ ٱ → ا
    .replace(/[\u0624]/g, "\u0648") // ؤ → و
    .replace(/[\u0626]/g, "\u064A") // ئ → ي
    .replace(/[\u0629]/g, "\u0647") // ة → ه
    .replace(/[\u0649]/g, "\u064A") // ى → ي
    .replace(/[\u0622]/g, "\u0627"); // آ → ا
}

/** Some content entries (e.g. months) prefix the actual word with "<num> - "
 *  or use Arabic-Indic digits. Try the trailing portion after a dash or "/". */
function variantsForLookup(word: string): string[] {
  const set = new Set<string>();
  const base = word.trim();
  set.add(base);
  // Try the part after "<number> - "
  const afterPrefix = base.replace(/^[\d\u0660-\u0669]+\s*-\s*/, "").trim();
  if (afterPrefix && afterPrefix !== base) set.add(afterPrefix);
  // For "ربيع الآخر / الثاني" style, try each side.
  for (const part of base.split(/\s*\/\s*/)) {
    if (part && part !== base) set.add(part.trim());
  }
  // Folded (hamza-removed) variant
  for (const v of [...set]) {
    const folded = foldHamza(v);
    if (folded !== v) set.add(folded);
  }
  return [...set].filter(Boolean);
}

/** Extract "surah:ayah" from citation strings like "Qur'ān 20:14". */
function extractVerseKey(citation: string): string | null {
  const m = citation.match(/(\d+)\s*:\s*(\d+)/);
  return m ? `${m[1]}:${m[2]}` : null;
}

/** Build a Quran.com audio URL for Mishary Al-Afasy reciting a verse. */
function buildQuranAudioUrl(surah: number, ayah: number): string {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  return `https://verses.quran.com/Alafasy/mp3/${s}${a}.mp3`;
}

interface CommonsImageInfo {
  url: string;
  mime: string;
}

interface CommonsSearchHit {
  title: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (r.status === 429) {
    // Rate limited — back off and retry once.
    await sleep(5_000);
    const r2 = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!r2.ok) throw new Error(`HTTP ${r2.status} after retry: ${url}`);
    return (await r2.json()) as T;
  }
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${url}`);
  return (await r.json()) as T;
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

/** Resolve a Commons file title to a direct download URL. Returns null if
 *  the file is missing (Commons returns `missing: ""` on missing pages). */
async function resolveFileUrl(title: string): Promise<string | null> {
  const url =
    `${COMMONS_API}?action=query&format=json&titles=` +
    encodeURIComponent(title) +
    `&prop=imageinfo&iiprop=url%7Cmime`;
  const d = await fetchJson<{
    query?: {
      pages?: Record<
        string,
        { imageinfo?: CommonsImageInfo[]; missing?: string }
      >;
    };
  }>(url);
  const pages = Object.values(d?.query?.pages ?? {});
  const page = pages[0];
  if (!page || page.missing !== undefined) return null;
  const info = page.imageinfo?.[0];
  return info?.url ?? null;
}

/** Find a Lingua Libre MSA recording that matches the word EXACTLY (the
 *  segment after the recording username, before the extension). */
async function findLinguaLibre(word: string): Promise<AudioEntry | null> {
  const search = `intitle:"LL-Q13955" intitle:"${word}"`;
  const url =
    `${COMMONS_API}?action=query&format=json&list=search&srsearch=` +
    encodeURIComponent(search) +
    `&srnamespace=6&srlimit=20`;
  const d = await fetchJson<{ query?: { search?: CommonsSearchHit[] } }>(url);
  const hits = d.query?.search ?? [];
  // Filename format: "File:LL-Q13955 (ara)-USERNAME-WORD.wav".
  // We require the word part (after the LAST dash before .ext) to match.
  for (const h of hits) {
    const m = h.title.match(
      /^File:LL-Q13955 \(ara\)-([^-]+(?:-[^-]+)*?)-(.+?)\.(wav|ogg|mp3)$/,
    );
    if (!m) continue;
    const author = m[1];
    const recordedWord = m[2];
    if (recordedWord !== word) continue;
    const directUrl = await resolveFileUrl(h.title);
    if (!directUrl) continue;
    return {
      url: directUrl,
      source: "lingualibre",
      title: h.title,
      author,
      // Lingua Libre standard: CC-BY-SA-4.0 (some older recordings differ but
      // the project default is BY-SA 4.0).
      license: "CC-BY-SA-4.0",
    };
  }
  return null;
}

/** Try the legacy `Ar-WORD.ogg` filename pattern that many Wiktionary entries
 *  still use (predates Lingua Libre). */
async function findArOgg(word: string): Promise<AudioEntry | null> {
  const title = `File:Ar-${word}.ogg`;
  const directUrl = await resolveFileUrl(title);
  if (!directUrl) return null;
  return {
    url: directUrl,
    source: "ar-x",
    title,
    license: "CC-BY-SA-3.0",
  };
}

async function findAudio(word: string): Promise<AudioEntry | null> {
  // Try the original form, then progressively folded variants. Many recordings
  // exist under one spelling but not the other (especially hamza variants).
  const variants = variantsForLookup(word);
  for (const v of variants) {
    const ll = await findLinguaLibre(v);
    if (ll) return ll;
    await sleep(200);
    const ar = await findArOgg(v);
    if (ar) return ar;
    await sleep(200);
  }
  return null;
}

interface AudioTarget {
  word: string;
  /** Source for debugging where the word came from. */
  origin: string;
}

function collectAudioTargets(content: SiteContent): AudioTarget[] {
  const seen = new Map<string, AudioTarget>();
  function add(arabic: string, origin: string) {
    if (!arabic) return;
    const stripped = stripDiacritics(arabic).trim();
    if (!stripped) return;
    if (!seen.has(stripped)) seen.set(stripped, { word: stripped, origin });
  }
  for (const v of content.vocab) {
    add(v.arabic, `vocab:${v.id}`);
    if (v.nationalityArabic) add(v.nationalityArabic, `vocab-nat:${v.id}`);
  }
  for (const p of content.pronouns) add(p.arabic, `pronoun:${p.id}`);
  for (const c of content.conjugations) add(c.arabic, `conj:${c.id}`);
  return [...seen.values()].sort((a, b) => a.word.localeCompare(b.word));
}

async function main() {
  const refresh = process.argv.includes("--refresh-missing");
  const fullRebuild = process.argv.includes("--full");

  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  const content = JSON.parse(raw) as SiteContent;

  let manifest: AudioManifest;
  try {
    const prior = await fs.readFile(MANIFEST_PATH, "utf8");
    manifest = JSON.parse(prior) as AudioManifest;
    if (fullRebuild) {
      manifest.entries = {};
      manifest.missing = [];
      manifest.quran = {};
    }
  } catch {
    manifest = {
      version: 1,
      fetchedAt: new Date().toISOString(),
      entries: {},
      quran: {},
      missing: [],
    };
  }

  // 1. Vocab + pronouns + conjugations → Wikimedia Commons.
  const targets = collectAudioTargets(content);
  const missingSet = new Set(manifest.missing);
  const toFetch = targets.filter((t) => {
    if (manifest.entries[t.word]) return false;
    if (!refresh && missingSet.has(t.word)) return false;
    return true;
  });
  console.log(
    `[audio] ${targets.length} unique words; ${toFetch.length} need fetching ` +
      `(already cached: ${Object.keys(manifest.entries).length}, ` +
      `previously missing: ${manifest.missing.length})`,
  );

  let fetched = 0;
  let stillMissing = 0;
  for (let i = 0; i < toFetch.length; i++) {
    const t = toFetch[i];
    try {
      const entry = await findAudio(t.word);
      if (entry) {
        manifest.entries[t.word] = entry;
        // No-op if not previously listed; safer to remove either way.
        manifest.missing = manifest.missing.filter((w) => w !== t.word);
        fetched++;
      } else {
        if (!manifest.missing.includes(t.word)) manifest.missing.push(t.word);
        stillMissing++;
      }
    } catch (err) {
      console.warn(`[audio] error for ${t.word}: ${(err as Error).message}`);
      if (!manifest.missing.includes(t.word)) manifest.missing.push(t.word);
      stillMissing++;
    }
    if ((i + 1) % 25 === 0 || i === toFetch.length - 1) {
      console.log(
        `[audio] progress ${i + 1}/${toFetch.length} ` +
          `(found:${fetched} missing:${stillMissing})`,
      );
    }
    // Wikimedia bot policy: be polite. ~3 req/s for searches.
    await sleep(300);
  }

  // 2. Pronoun example citations → Quran.com Audio API.
  for (const p of content.pronouns) {
    const cite = p.example?.citation;
    if (!cite) continue;
    if (!/qur/i.test(cite)) continue; // skip Hadith etc.
    const verseKey = extractVerseKey(cite);
    if (!verseKey) continue;
    if (manifest.quran[verseKey] && !fullRebuild) continue;
    const [s, a] = verseKey.split(":").map((n) => parseInt(n, 10));
    manifest.quran[verseKey] = {
      verseKey,
      url: buildQuranAudioUrl(s, a),
      reciter: "Mishary Al-Afasy",
      // Quran.com surfaces these recitations under Quran.com terms; the
      // recordings themselves are widely distributed for public listening.
      license: "Public listening (Mishary Al-Afasy)",
    };
  }

  // Avoid spurious diffs: only bump `fetchedAt` and rewrite the file when
  // entries / quran / missing actually changed. (Prevents the daily content
  // refresh and Vercel rebuilds from creating empty no-op commits.)
  let prior: AudioManifest | null = null;
  try {
    prior = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8")) as AudioManifest;
  } catch {
    prior = null;
  }
  const same =
    prior !== null &&
    JSON.stringify(prior.entries) === JSON.stringify(manifest.entries) &&
    JSON.stringify(prior.quran) === JSON.stringify(manifest.quran) &&
    JSON.stringify(prior.missing) === JSON.stringify(manifest.missing);

  if (!same) {
    manifest.fetchedAt = new Date().toISOString();
    await fs.writeFile(
      MANIFEST_PATH,
      JSON.stringify(manifest, null, 2) + "\n",
      "utf8",
    );
    console.log(
      `[audio] wrote ${MANIFEST_PATH} ` +
        `(entries=${Object.keys(manifest.entries).length}, ` +
        `quran=${Object.keys(manifest.quran).length}, ` +
        `missing=${manifest.missing.length})`,
    );
  } else {
    console.log(
      `[audio] no changes ` +
        `(entries=${Object.keys(manifest.entries).length}, ` +
        `quran=${Object.keys(manifest.quran).length}, ` +
        `missing=${manifest.missing.length})`,
    );
  }
}

void main().catch((err) => {
  console.error("[audio] build failed:", err);
  process.exit(1);
});
