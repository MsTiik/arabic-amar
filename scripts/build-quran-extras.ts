/**
 * Build-time generator for supplementary per-word Qur'ān data.
 *
 * Reads the QAC morphology TSV (downloaded once into /tmp/qac.txt or the
 * local mirror) and emits `src/data/quran/word-extras.json` with:
 *   - lemma (dictionary headword in Arabic)
 *   - frequency (count of that lemma across the entire Qur'ān)
 *   - inTop125 (whether the lemma appears in TOP_QURAN_WORDS)
 *
 * Keys are `${surah}:${ayah}:${wordIdx}` (1-indexed word) — matching the
 * QAC location format. Only the surahs that have authored data are
 * included.
 *
 * Usage:  pnpm tsx scripts/build-quran-extras.ts
 *
 * QAC source: https://corpus.quran.com (Dukes 2009, GNU GPL).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { SURAHS } from "../src/data/quran";
import { TOP_QURAN_WORDS } from "../src/data/quran/top-frequency";

// ---------- Buckwalter → Arabic ----------

const BUCK_TO_AR: Record<string, string> = {
  A: "ا",
  b: "ب",
  t: "ت",
  v: "ث",
  j: "ج",
  H: "ح",
  x: "خ",
  d: "د",
  "*": "ذ",
  r: "ر",
  z: "ز",
  s: "س",
  $: "ش",
  S: "ص",
  D: "ض",
  T: "ط",
  Z: "ظ",
  E: "ع",
  g: "غ",
  f: "ف",
  q: "ق",
  k: "ك",
  l: "ل",
  m: "م",
  n: "ن",
  h: "ه",
  w: "و",
  y: "ي",
  Y: "ى",
  p: "ة",
  "'": "ء",
  ">": "أ",
  "<": "إ",
  "&": "ؤ",
  "}": "ئ",
  "|": "آ",
  "{": "ٱ",
  // Diacritics
  a: "\u064E", // fatha
  i: "\u0650", // kasra
  u: "\u064F", // damma
  o: "\u0652", // sukun
  "~": "\u0651", // shadda
  "F": "\u064B", // tanwin fath
  "K": "\u064D", // tanwin kasr
  "N": "\u064C", // tanwin damm
  "`": "\u0670", // dagger alif
};

function buckToArabic(s: string): string {
  return s
    .split("")
    .map((c) => BUCK_TO_AR[c] ?? c)
    .join("");
}

/** Strip diacritics, tatweel, and unify alef/alef-maqsūra/tāʾ-marbūṭa
 *  variants for forgiving comparison. We deliberately do NOT strip a
 *  leading "ال" here: QAC lemmas and our top-125 deck both store words
 *  in their bare form (e.g. "رحمن" not "الرحمن"), and stripping ال would
 *  also corrupt rare lemmas whose first two letters happen to be ا+ل
 *  (e.g. إلف → الف → ف, which would falsely collide with the particle فَ). */
function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .normalize("NFC")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

// ---------- Parse QAC ----------

interface QacSegment {
  surah: number;
  ayah: number;
  word: number;
  features: string;
}

function parseQac(text: string): QacSegment[] {
  const out: QacSegment[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\r$/, "");
    if (!line.startsWith("(")) continue;
    const parts = line.split("\t");
    if (parts.length < 4) continue;
    const loc = parts[0].match(/^\((\d+):(\d+):(\d+):(\d+)\)$/);
    if (!loc) continue;
    out.push({
      surah: Number(loc[1]),
      ayah: Number(loc[2]),
      word: Number(loc[3]),
      features: parts[3] ?? "",
    });
  }
  return out;
}

interface StemInfo {
  lemma?: string; // Buckwalter
  pos?: string;
}

function getStem(segs: QacSegment[]): StemInfo {
  const stem = segs.find((s) => s.features.includes("STEM"));
  if (!stem) return {};
  const map: Record<string, string> = {};
  for (const piece of stem.features.split("|")) {
    const [k, v] = piece.split(":");
    if (k && v) map[k] = v;
  }
  return { lemma: map.LEM, pos: map.POS };
}

// ---------- Build ----------

interface WordExtras {
  lemma: string;
  frequency: number;
  inTop125: boolean;
}

function ensureQacFile(): string {
  const path = "/tmp/qac.txt";
  if (!existsSync(path)) {
    console.log("downloading QAC morphology file...");
    execSync(
      `curl -sSL -o ${path} "https://raw.githubusercontent.com/cltk/arabic_morphology_quranic-corpus/master/quranic-corpus-morphology-0.4.txt"`,
    );
  }
  return path;
}

function main() {
  const qacText = readFileSync(ensureQacFile(), "utf-8");
  const segs = parseQac(qacText);

  // Group segments by (surah, ayah, word).
  const byWord = new Map<string, QacSegment[]>();
  for (const s of segs) {
    const k = `${s.surah}:${s.ayah}:${s.word}`;
    let arr = byWord.get(k);
    if (!arr) {
      arr = [];
      byWord.set(k, arr);
    }
    arr.push(s);
  }

  // Compute lemma frequency across the whole Qur'ān.
  const lemmaFreq = new Map<string, number>();
  for (const wordSegs of byWord.values()) {
    const { lemma } = getStem(wordSegs);
    if (!lemma) continue;
    lemmaFreq.set(lemma, (lemmaFreq.get(lemma) ?? 0) + 1);
  }

  // Build a normalized-Arabic → top-125 lookup from the deck.
  const top125Norm = new Set<string>();
  for (const w of TOP_QURAN_WORDS) {
    top125Norm.add(normalize(w.arabic));
  }

  // Emit per-word extras for every authored surah.
  const extras: Record<string, WordExtras> = {};
  for (const surah of SURAHS) {
    for (const ayah of surah.ayahs) {
      for (let wi = 0; wi < ayah.words.length; wi++) {
        const k = `${surah.number}:${ayah.number}:${wi + 1}`;
        const wordSegs = byWord.get(k);
        if (!wordSegs) continue;
        const { lemma } = getStem(wordSegs);
        if (!lemma) continue;
        const lemmaAr = buckToArabic(lemma);
        const freq = lemmaFreq.get(lemma) ?? 0;
        const inTop125 = top125Norm.has(normalize(lemmaAr));
        extras[k] = { lemma: lemmaAr, frequency: freq, inTop125 };
      }
    }
  }

  const out = new URL("../src/data/quran/word-extras.json", import.meta.url);
  writeFileSync(
    out,
    JSON.stringify(extras, null, 2) + "\n",
    "utf-8",
  );
  console.log(`wrote word-extras.json — ${Object.keys(extras).length} words`);

  // Stats
  const inTop = Object.values(extras).filter((e) => e.inTop125).length;
  console.log(`  ${inTop} words flagged as Top 125`);
}

main();
