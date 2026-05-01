import type { GrammarExample, GrammarRule } from "./types";

/**
 * Structured form of a "rule-table" entry — a Pattern + Worked-example + Result
 * walkthrough. The doc encodes these as a flat list of fragments in the
 * `examples` array, with the formula in `body` smashed together with its Arabic
 * mirror. This module unpacks them into something the UI can render with
 * meaningful hierarchy.
 */
export interface ParsedRuleTable {
  /** English-side formula (e.g. "Unit + وَ + Tens"). */
  patternEnglish: string;
  /** Arabic-mirror formula (e.g. "الوحدة + وَ + العشرات"). May be empty. */
  patternArabic: string;
  /** Optional caveat extracted from the trailing "Note: …" of the body. */
  patternNote?: string;
  /** Worked-example label, e.g. "21" or "5:05". */
  exampleLabel: string;
  /** Components that compose the worked example. */
  components: ParsedComponent[];
  /** Final assembled result. */
  result: ParsedResult;
  /** Free-text notes that appeared inside the examples list. */
  notes: string[];
}

export interface ParsedComponent {
  /** English label, e.g. "Unit", "And", "The hour". */
  label: string;
  /** Arabic value supplied for this slot. */
  arabic: string;
  /** Optional caveat that came after the "=" in the bullet line. */
  caveat?: string;
}

export interface ParsedResult {
  arabic: string;
  pronunciation?: string;
}

/**
 * Returns true if the rule looks like a Pattern → Worked-example → Result
 * walkthrough. Detected structurally (at least one component-style bullet)
 * so we don't accidentally apply the layout to free-form example lists
 * that share the `__rule-table__` ID convention (e.g. body-parts).
 */
export function isPatternWalkthrough(rule: GrammarRule): boolean {
  return rule.examples.some((ex) => COMPONENT_RE.test((ex.english ?? "").trim()));
}

const COMPONENT_RE = /^•\s*(.+?)\s*=\s*(.*)$/;
const PREFIX_RE = /^\*\*(Rule|Pattern to Memorise|What to Memorise):\*\*\s*/;

/**
 * Split a rule's `body` field into the English formula, its Arabic mirror, and
 * any trailing "Note:" caveat. The doc paragraphs are concatenated by the
 * parser without a separator — the boundary between English and Arabic is
 * always a Latin character (letter or closing quote/paren) immediately
 * followed by an Arabic letter.
 */
export function splitRuleBody(
  body: string,
): { english: string; arabic: string; note?: string } {
  let s = body.trim().replace(PREFIX_RE, "");

  let note: string | undefined;
  const noteMatch = s.match(/Note:\s*([\s\S]+)$/);
  if (noteMatch && noteMatch.index !== undefined) {
    note = noteMatch[1].trim();
    s = s.slice(0, noteMatch.index).trim();
  }

  // Find the first English-letter / quote / paren followed (with optional
  // whitespace) by an Arabic letter. Whitespace is sometimes absent (the
  // parser concatenates two doc paragraphs without a separator) and
  // sometimes present (when the source line wrapped). Using a lookahead so
  // the cut lands right at the start of the Arabic mirror.
  const boundary = s.match(/[A-Za-z"”’\)\]]\s*(?=[\u0600-\u06FF])/);
  if (boundary && boundary.index !== undefined) {
    const cut = boundary.index + boundary[0].length;
    return { english: s.slice(0, cut).trim(), arabic: s.slice(cut).trim(), note };
  }
  return { english: s, arabic: "", note };
}

/** Walk the `examples` array and pull out the structured walkthrough. */
export function parseRuleExamples(examples: GrammarExample[]): {
  exampleLabel: string;
  components: ParsedComponent[];
  result: ParsedResult;
  notes: string[];
} {
  let exampleLabel = "";
  const components: ParsedComponent[] = [];
  let result: ParsedResult | null = null;
  const notes: string[] = [];
  let resultPending = false;

  for (const ex of examples) {
    const arabic = (ex.arabic ?? "").trim();
    const english = (ex.english ?? "").trim();

    // "Example (21):" / "Example (5:05):" — the worked-example label.
    const headerMatch = english.match(/^Example\s*\(?\s*([^)]+?)\s*\)?\s*:?\s*$/);
    if (headerMatch && !arabic) {
      exampleLabel = headerMatch[1].trim();
      continue;
    }

    // "• Unit =" / "• Unit = (instead of the usual: ثَلَاثَةُ)"
    const compMatch = english.match(COMPONENT_RE);
    if (compMatch) {
      const label = compMatch[1].trim();
      const caveat = compMatch[2].trim() || undefined;
      components.push({ label, arabic, caveat });
      continue;
    }

    // "= Together: …" — junk restatement line in Numbers, skip.
    if (english.startsWith("= Together")) continue;

    // Lone "=" line — Time pattern. The arabic on this line is the result.
    if (english === "=" && arabic) {
      result = { arabic };
      continue;
    }

    // "So 21 is:" / "So 300 is:" — Numbers pattern; the next bare-arabic
    // line is the result.
    if (/^So\b/.test(english) && english.endsWith(":") && !arabic) {
      resultPending = true;
      continue;
    }

    // "Note: …" — promote to the notes bucket.
    if (/^Note\b/i.test(english)) {
      notes.push(english.replace(/^Note:?\s*/i, ""));
      continue;
    }

    // Bare-arabic line directly after "So X is:" — this is the result.
    if (resultPending && arabic && !english) {
      result = { arabic };
      resultPending = false;
      continue;
    }

    // Bare-english line after we've captured the result — this is the
    // transliteration / pronunciation.
    if (result && !arabic && english && !result.pronunciation) {
      result.pronunciation = english;
      continue;
    }

    // Fallback — odd row, treat as a free-text note.
    if (!arabic && english) {
      notes.push(english);
    }
  }

  return {
    exampleLabel,
    components,
    result: result ?? { arabic: "" },
    notes,
  };
}

/** One-shot parser used by the renderer. */
export function parseRuleTable(rule: GrammarRule): ParsedRuleTable {
  const body = splitRuleBody(rule.body);
  const ex = parseRuleExamples(rule.examples);
  return {
    patternEnglish: body.english,
    patternArabic: body.arabic,
    patternNote: body.note,
    exampleLabel: ex.exampleLabel,
    components: ex.components,
    result: ex.result,
    notes: ex.notes,
  };
}
