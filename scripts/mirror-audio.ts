/**
 * Mirrors every recording in `content/audio-manifest.json` into
 * `public/audio/` as small mono MP3s so pronunciations are served from our
 * own origin (fast, CDN-cached, offline-cacheable by the service worker)
 * instead of streamed from Wikimedia Commons at play time.
 *
 * - Vocab words  → public/audio/words/<md5(key)>.mp3
 * - Qur'an ayat  → public/audio/quran/<surah><ayah>.mp3
 *
 * Each file is transcoded with ffmpeg: leading silence trimmed (Lingua Libre
 * recordings often start with ~0.5s of silence, which reads as lag) and
 * loudness normalised so volume is consistent across contributors.
 *
 * Writes `content/audio-local.json` mapping manifest keys to local paths.
 * License/attribution metadata stays in the manifest untouched.
 *
 * Idempotent: entries whose output file already exists are skipped.
 *
 * Usage: `npm run audio:mirror` (requires ffmpeg on PATH)
 */

import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REPO_ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(REPO_ROOT, "content", "audio-manifest.json");
const LOCAL_MAP_PATH = path.join(REPO_ROOT, "content", "audio-local.json");
const WORDS_DIR = path.join(REPO_ROOT, "public", "audio", "words");
const QURAN_DIR = path.join(REPO_ROOT, "public", "audio", "quran");

const USER_AGENT =
  "ArabicAmar/1.0 (https://github.com/MsTiik/arabic-amar; arabic-amar.vercel.app)";

// Trim leading silence, normalise loudness, encode small mono MP3.
const FFMPEG_ARGS = [
  "-af",
  "silenceremove=start_periods=1:start_threshold=-40dB:start_silence=0.05,loudnorm=I=-18:TP=-2",
  "-codec:a",
  "libmp3lame",
  "-b:a",
  "48k",
  "-ac",
  "1",
  "-ar",
  "44100",
];

interface Manifest {
  entries: Record<string, { url: string }>;
  quran: Record<string, { url: string }>;
}

interface LocalAudioMap {
  version: 1;
  builtAt: string;
  entries: Record<string, string>;
  quran: Record<string, string>;
}

function hashKey(key: string): string {
  return createHash("md5").update(key).digest("hex").slice(0, 12);
}

function stripTracking(url: string): string {
  const u = new URL(url);
  u.search = "";
  return u.toString();
}

async function download(url: string, dest: string): Promise<void> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(stripTracking(url), {
      headers: { "user-agent": USER_AGENT },
    });
    if (res.ok) {
      await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
      return;
    }
    if (res.status === 429 && attempt < 6) {
      const retryAfter = Number(res.headers.get("retry-after")) || 0;
      await sleep(Math.max(retryAfter * 1000, 15000 * (attempt + 1)));
      continue;
    }
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
}

async function transcode(src: string, dest: string): Promise<void> {
  await execFileAsync("ffmpeg", ["-y", "-i", src, ...FFMPEG_ARGS, dest]);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function mirror(
  url: string,
  dest: string,
  tmpDir: string,
): Promise<boolean> {
  try {
    await fs.access(dest);
    return false; // already mirrored
  } catch {
    /* not yet mirrored */
  }
  const tmp = path.join(tmpDir, path.basename(dest) + ".src");
  await download(url, tmp);
  await transcode(tmp, dest);
  await fs.rm(tmp, { force: true });
  return true;
}

async function main() {
  const manifest = JSON.parse(
    await fs.readFile(MANIFEST_PATH, "utf8"),
  ) as Manifest;

  await fs.mkdir(WORDS_DIR, { recursive: true });
  await fs.mkdir(QURAN_DIR, { recursive: true });
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "amar-audio-"));

  const local: LocalAudioMap = {
    version: 1,
    builtAt: new Date().toISOString(),
    entries: {},
    quran: {},
  };

  let downloaded = 0;
  let failed = 0;

  for (const [key, entry] of Object.entries(manifest.entries)) {
    const file = `${hashKey(key)}.mp3`;
    const dest = path.join(WORDS_DIR, file);
    try {
      const fresh = await mirror(entry.url, dest, tmpDir);
      local.entries[key] = `/audio/words/${file}`;
      if (fresh) {
        downloaded++;
        await sleep(1000); // be polite to Wikimedia
      }
    } catch (err) {
      failed++;
      console.warn(`skip ${key}: ${(err as Error).message}`);
    }
  }

  for (const [key, entry] of Object.entries(manifest.quran)) {
    const m = key.match(/^(\d+):(\d+)$/);
    if (!m) continue;
    const file = `${m[1].padStart(3, "0")}${m[2].padStart(3, "0")}.mp3`;
    const dest = path.join(QURAN_DIR, file);
    try {
      const fresh = await mirror(entry.url, dest, tmpDir);
      local.quran[key] = `/audio/quran/${file}`;
      if (fresh) {
        downloaded++;
        await sleep(1000);
      }
    } catch (err) {
      failed++;
      console.warn(`skip quran ${key}: ${(err as Error).message}`);
    }
  }

  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.writeFile(LOCAL_MAP_PATH, JSON.stringify(local, null, 2) + "\n");
  console.log(
    `Mirrored ${Object.keys(local.entries).length} words + ${Object.keys(local.quran).length} ayat (${downloaded} new, ${failed} failed)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
