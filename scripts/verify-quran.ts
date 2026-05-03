/**
 * Cross-checks our authored word-by-word surah data against:
 *   1. The Quranic Arabic Corpus (QAC) morphology TSV — for root + POS
 *   2. quran.com word-by-word API — for English gloss
 *
 * Outputs a markdown report listing every divergence so the maintainer
 * (a non-native speaker) can manually review and fix.
 *
 * Usage:  pnpm tsx scripts/verify-quran.ts
 *
 * Inputs:
 *   - /tmp/qac.txt  (QAC morphology v0.4 — pre-downloaded)
 *   - quran.com API (live fetch)
 *
 * Output:
 *   - <repo-root>/verification.md
 */
import { readFileSync, writeFileSync } from "node:fs";
import { SURAHS } from "../src/data/quran";
import type { Surah, QuranWordPos } from "../src/data/quran/types";

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
};

/** Convert a QAC root (e.g. "rHm") to dashed Arabic ("ر-ح-م"). */
function buckRootToDashed(root: string): string {
  return root
    .split("")
    .map((c) => BUCK_TO_AR[c] ?? c)
    .join("-");
}

/** Strip diacritics + tatweel for forgiving root comparison. */
function stripDiacritics(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .normalize("NFC");
}

/** Treat ا / أ / إ / آ / ء all as alif-like for root variant tolerance. */
function normalizeRootChar(c: string): string {
  if (c === "ا" || c === "أ" || c === "إ" || c === "آ" || c === "ء") return "ا";
  if (c === "ى") return "ي";
  return c;
}

function rootsMatch(ours: string, qac: string): boolean {
  const ourClean = stripDiacritics(ours).replace(/-/g, "");
  const qacClean = stripDiacritics(qac).replace(/-/g, "");
  if (ourClean === qacClean) return true;
  if (ourClean.length !== qacClean.length) return false;
  for (let i = 0; i < ourClean.length; i++) {
    if (normalizeRootChar(ourClean[i]) !== normalizeRootChar(qacClean[i]))
      return false;
  }
  return true;
}

// ---------- POS mapping ----------

function mapQacPos(qacPos: string): QuranWordPos {
  switch (qacPos) {
    case "N":
    case "ADJ":
    case "T":
    case "LOC":
    case "IMPN":
      return "noun";
    case "PN":
      return "proper-noun";
    case "V":
      return "verb";
    case "PRON":
      return "pronoun";
    case "DEM":
      return "demonstrative";
    case "REL":
      return "relative";
    case "P":
      return "preposition";
    case "CONJ":
      return "conjunction";
    case "INTG":
      return "interrogative";
    case "NEG":
      return "negation";
    case "VOC":
      return "vocative";
    default:
      return "particle";
  }
}

/** Some words we author as the prefixed POS (e.g. لِرَبِّكَ as "noun")
 *  while QAC stem is N. Our shorthand sometimes flips between the categories
 *  below — we treat these as equivalent rather than mismatches. */
function posSoftMatch(ours: QuranWordPos, qac: QuranWordPos): boolean {
  if (ours === qac) return true;
  // Many "noun" stems are tagged as proper-noun in our data when the entity
  // is a name (Allah, Quraysh, Abu Lahab). QAC marks these as PN consistently.
  if (ours === "proper-noun" && qac === "noun") return true;
  if (ours === "noun" && qac === "proper-noun") return true;
  // Particle umbrella absorbs many edge cases.
  if (ours === "particle" && (qac === "noun" || qac === "conjunction")) return true;
  return false;
}

// ---------- Parse QAC ----------

interface QacSegment {
  surah: number;
  ayah: number;
  word: number;
  segment: number;
  form: string;
  tag: string;
  features: string;
}

interface QacWord {
  surah: number;
  ayah: number;
  word: number;
  segments: QacSegment[];
}

function parseQac(text: string): Map<string, QacWord> {
  const lines = text.split("\n");
  const segs: QacSegment[] = [];
  for (const raw of lines) {
    const line = raw.replace(/\r$/, "");
    if (!line.startsWith("(")) continue;
    const parts = line.split("\t");
    if (parts.length < 4) continue;
    const locMatch = parts[0].match(/^\((\d+):(\d+):(\d+):(\d+)\)$/);
    if (!locMatch) continue;
    segs.push({
      surah: Number(locMatch[1]),
      ayah: Number(locMatch[2]),
      word: Number(locMatch[3]),
      segment: Number(locMatch[4]),
      form: parts[1] ?? "",
      tag: parts[2] ?? "",
      features: parts[3] ?? "",
    });
  }
  const words = new Map<string, QacWord>();
  for (const seg of segs) {
    const k = `${seg.surah}:${seg.ayah}:${seg.word}`;
    let w = words.get(k);
    if (!w) {
      w = { surah: seg.surah, ayah: seg.ayah, word: seg.word, segments: [] };
      words.set(k, w);
    }
    w.segments.push(seg);
  }
  return words;
}

function getStemFeatures(w: QacWord): {
  pos?: string;
  root?: string;
  lemma?: string;
} {
  const stem = w.segments.find((s) => s.features.includes("STEM"));
  if (!stem) return {};
  const featMap: Record<string, string> = {};
  for (const piece of stem.features.split("|")) {
    const [k, v] = piece.split(":");
    if (k && v) featMap[k] = v;
  }
  return {
    pos: featMap.POS,
    root: featMap.ROOT,
    lemma: featMap.LEM,
  };
}

// ---------- Fetch quran.com ----------

interface QcWord {
  position: number;
  translation: string;
  transliteration: string;
}

interface QcAyah {
  verseNumber: number;
  words: QcWord[];
}

async function fetchSurahFromQuranCom(surahNum: number): Promise<QcAyah[]> {
  const url = `https://api.quran.com/api/v4/verses/by_chapter/${surahNum}?words=true&word_translation_language=en&fields=text_uthmani&per_page=300`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`quran.com API error ${res.status}`);
  const data = (await res.json()) as {
    verses: Array<{
      verse_number: number;
      words: Array<{
        position: number;
        char_type_name: string;
        translation: { text: string };
        transliteration: { text: string | null };
      }>;
    }>;
  };
  return data.verses.map((v) => ({
    verseNumber: v.verse_number,
    words: v.words
      .filter((w) => w.char_type_name === "word")
      .map((w) => ({
        position: w.position,
        translation: w.translation.text,
        transliteration: w.transliteration.text ?? "",
      })),
  }));
}

// ---------- Main ----------

interface Mismatch {
  surah: number;
  ayah: number;
  wordIdx: number;
  arabic: string;
  field: string;
  ours: string;
  expected: string;
  note?: string;
}

async function main() {
  const qacText = readFileSync("/tmp/qac.txt", "utf-8");
  const qac = parseQac(qacText);

  const targetSurahs = [1, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
  const ourSurahs: Surah[] = SURAHS.filter((s) => targetSurahs.includes(s.number));
  if (ourSurahs.length !== targetSurahs.length) {
    throw new Error(
      `expected ${targetSurahs.length} surahs, got ${ourSurahs.length}`,
    );
  }

  const mismatches: Mismatch[] = [];
  const englishDiffs: Mismatch[] = [];

  for (const surah of ourSurahs) {
    let qcAyahs: QcAyah[] = [];
    try {
      qcAyahs = await fetchSurahFromQuranCom(surah.number);
    } catch (e) {
      console.error(`failed to fetch surah ${surah.number}:`, e);
    }

    for (const ayah of surah.ayahs) {
      const qcAyah = qcAyahs.find((a) => a.verseNumber === ayah.number);

      for (let wi = 0; wi < ayah.words.length; wi++) {
        const ours = ayah.words[wi];
        const qacWord = qac.get(`${surah.number}:${ayah.number}:${wi + 1}`);

        if (qacWord) {
          const { pos: stemPos, root: stemRoot } = getStemFeatures(qacWord);

          // Root check
          if (ours.root && stemRoot) {
            const expectedRoot = buckRootToDashed(stemRoot);
            if (!rootsMatch(ours.root, expectedRoot)) {
              mismatches.push({
                surah: surah.number,
                ayah: ayah.number,
                wordIdx: wi,
                arabic: ours.arabic,
                field: "root",
                ours: ours.root,
                expected: expectedRoot,
              });
            }
          } else if (ours.root && !stemRoot) {
            mismatches.push({
              surah: surah.number,
              ayah: ayah.number,
              wordIdx: wi,
              arabic: ours.arabic,
              field: "root",
              ours: ours.root,
              expected: "(none in QAC)",
              note: "QAC has no root for this word; consider removing.",
            });
          } else if (!ours.root && stemRoot) {
            // Particles/proper nouns may genuinely have no root in our schema.
            // Only flag if QAC's POS is N/V/ADJ (content-word).
            if (
              stemPos === "N" ||
              stemPos === "V" ||
              stemPos === "ADJ" ||
              stemPos === "T" ||
              stemPos === "LOC"
            ) {
              mismatches.push({
                surah: surah.number,
                ayah: ayah.number,
                wordIdx: wi,
                arabic: ours.arabic,
                field: "root",
                ours: "(missing)",
                expected: buckRootToDashed(stemRoot),
                note: "Content word missing root.",
              });
            }
          }

          // POS check
          if (stemPos) {
            const expectedPos = mapQacPos(stemPos);
            if (!posSoftMatch(ours.pos, expectedPos)) {
              mismatches.push({
                surah: surah.number,
                ayah: ayah.number,
                wordIdx: wi,
                arabic: ours.arabic,
                field: "pos",
                ours: ours.pos,
                expected: `${expectedPos} (QAC: ${stemPos})`,
              });
            }
          }
        } else {
          mismatches.push({
            surah: surah.number,
            ayah: ayah.number,
            wordIdx: wi,
            arabic: ours.arabic,
            field: "qac-lookup",
            ours: "",
            expected: "",
            note: `No QAC word at ${surah.number}:${ayah.number}:${wi + 1}`,
          });
        }

        // English gloss check (informational only)
        if (qcAyah) {
          const qcw = qcAyah.words[wi];
          if (qcw) {
            const ourEn = ours.english.toLowerCase().trim();
            const qcEn = qcw.translation.toLowerCase().trim();
            if (ourEn !== qcEn) {
              englishDiffs.push({
                surah: surah.number,
                ayah: ayah.number,
                wordIdx: wi,
                arabic: ours.arabic,
                field: "english",
                ours: ours.english,
                expected: qcw.translation,
              });
            }
          }
        }
      }
    }
  }

  // ---------- Report ----------

  const lines: string[] = [];
  lines.push("# Word-by-word verification report");
  lines.push("");
  lines.push(
    "Cross-checks our authored data (`src/data/quran/surahs/*.ts`) against:",
  );
  lines.push("- Quranic Arabic Corpus v0.4 (Dukes 2009) for **root + POS**");
  lines.push("- quran.com word-by-word API for **English gloss**");
  lines.push("");
  lines.push(
    "POS uses 'soft match' — proper-noun↔noun and particle↔conjunction/noun are not flagged.",
  );
  lines.push(
    "English diffs are *informational only* — different translators legitimately disagree, so each diff is a candidate to review, not necessarily a bug.",
  );
  lines.push("");

  // Root + POS section (must-fix)
  lines.push("## 1. Root + POS mismatches (action required)");
  lines.push("");
  if (mismatches.length === 0) {
    lines.push("**None.** All authored roots & POS tags align with QAC.");
  } else {
    lines.push(`**${mismatches.length} mismatches.**`);
    lines.push("");
    lines.push(
      "| Surah:Ayah:W | Arabic | Field | Ours | Expected (QAC) | Note |",
    );
    lines.push("|---|---|---|---|---|---|");
    for (const m of mismatches) {
      lines.push(
        `| ${m.surah}:${m.ayah}:${m.wordIdx + 1} | ${m.arabic} | ${m.field} | \`${m.ours}\` | \`${m.expected}\` | ${m.note ?? ""} |`,
      );
    }
  }
  lines.push("");

  // English gloss diffs (informational)
  lines.push("## 2. English gloss diffs vs quran.com (review-only)");
  lines.push("");
  if (englishDiffs.length === 0) {
    lines.push("**None.** All English glosses match quran.com exactly.");
  } else {
    lines.push(
      `**${englishDiffs.length} diffs.** Differences are common between translations — only edit if ours is clearly wrong.`,
    );
    lines.push("");
    lines.push("| Surah:Ayah:W | Arabic | Ours | quran.com |");
    lines.push("|---|---|---|---|");
    for (const d of englishDiffs) {
      lines.push(
        `| ${d.surah}:${d.ayah}:${d.wordIdx + 1} | ${d.arabic} | ${d.ours} | ${d.expected} |`,
      );
    }
  }
  lines.push("");

  writeFileSync(
    new URL("../verification.md", import.meta.url),
    lines.join("\n"),
    "utf-8",
  );

  console.log(
    `wrote verification.md — ${mismatches.length} root/POS mismatches, ${englishDiffs.length} English diffs`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
