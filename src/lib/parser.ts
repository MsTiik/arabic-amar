/**
 * Convert a docx export of the AMAR study notes Google Doc into a typed `SiteContent`.
 *
 * Two-step pipeline:
 *   1. mammoth → HTML (preserves all tashkeel/diacritics in the text content)
 *   2. node-html-parser → walk the HTML tree and bucket nodes by surrounding heading state
 *
 * The parser is convention-based, not lesson-aware. It looks at the doc's heading hierarchy
 * (`<h1>` for lessons, `<h2>` for sub-sections like "Vocabulary" and "Key Rules", `<h3>` for
 * grammar rule sub-sections) and the column layout of each `<table>` to decide how to
 * interpret content.
 *
 * If the doc structure drifts (e.g. someone re-titles a heading or adds a new column),
 * the parser logs a warning and skips the unknown content rather than guessing.
 */

import mammoth from "mammoth";
import { parse, HTMLElement } from "node-html-parser";

import { foldForSearch, stripDiacritics } from "./diacritics";
import {
  type ConjugationEntry,
  type Conversation,
  type GrammarExample,
  type GrammarIntro,
  type GrammarRule,
  type Lesson,
  type PluralForm,
  type PronounEntry,
  type PronounExample,
  type SiteContent,
  type Topic,
  type VocabEntry,
} from "./types";

export interface ParseOptions {
  /** When true, write parser warnings to stderr instead of accumulating silently. */
  verbose?: boolean;
}

export interface ParseResult {
  content: SiteContent;
  warnings: string[];
}

const ARABIC_TITLE_RE = /^(.*?)\s*[-–—]\s*([\u0600-\u06FF\s\u064B-\u065F\u0670]+)\s*$/u;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function stableId(parts: string[]): string {
  return parts
    .map((p) => slugify(stripDiacritics(p)))
    .filter(Boolean)
    .join("__");
}

function cellText(cell: HTMLElement): string {
  // Preserve internal whitespace inside paragraphs but collapse runs.
  return cell.text.replace(/\s+/g, " ").trim();
}

/**
 * Split a table cell into one entry per logical line, treating each top-level
 * `<p>` or `<br>` as a hard break. Used by rule example cells where the doc
 * stacks multiple "هٰذَا رَأْسٌ - this is a head" lines in a single cell;
 * collapsing them with `cellText` produces an unreadable run-on string.
 */
function cellLines(cell: HTMLElement): string[] {
  const ps = cell.querySelectorAll("p");
  const sources = ps.length > 0 ? ps : [cell];
  const out: string[] = [];
  for (const src of sources) {
    // Translate <br> into newlines before extracting text.
    const html = src.innerHTML.replace(/<br\s*\/?\s*>/gi, "\n");
    const tmp = parse(`<div>${html}</div>`);
    const raw = tmp.text;
    for (const line of raw.split(/\n+/)) {
      const trimmed = line.replace(/[ \t]+/g, " ").trim();
      if (trimmed) out.push(trimmed);
    }
  }
  return out;
}

/**
 * Like `cellLines` but only splits on `<p>` boundaries — `<br>` line breaks
 * stay glued to their paragraph. Used when we want the doc's logical
 * paragraphs preserved as units (e.g. plural-form example cells where the
 * meaning paragraph is "teacher / teachers" with an internal soft break).
 */
function cellParagraphs(cell: HTMLElement): string[] {
  const ps = cell.querySelectorAll("p");
  const sources = ps.length > 0 ? ps : [cell];
  const out: string[] = [];
  for (const src of sources) {
    // Replace <br> with a separator we can collapse into "/".
    const html = src.innerHTML.replace(/<br\s*\/?\s*>/gi, " / ");
    const tmp = parse(`<div>${html}</div>`);
    const trimmed = tmp.text.replace(/\s+/g, " ").trim();
    if (trimmed) out.push(trimmed);
  }
  return out;
}

interface ParsedLessonHeading {
  number: string;
  title: string;
  titleArabic?: string;
}

function parseLessonHeading(heading: string): ParsedLessonHeading | undefined {
  const m = /^Lesson\s+([\d\s\-–]+):\s*(.*)$/i.exec(heading.trim());
  if (!m) return undefined;
  const number = m[1].replace(/\s+/g, "").replace(/—/g, "-").replace(/–/g, "-");
  const rest = m[2].trim();
  const titleSplit = ARABIC_TITLE_RE.exec(rest);
  if (titleSplit) {
    return {
      number,
      title: titleSplit[1].trim(),
      titleArabic: titleSplit[2].trim(),
    };
  }
  return { number, title: rest };
}

interface SubSection {
  /** "1.1", "7.4", etc. */
  number: string;
  /** "Vocabulary", "Key Rules", "Vocabulary (Countries and Nationalities)", ... */
  title: string;
  kind: "vocabulary" | "rules" | "worksheet" | "answers" | "other";
  /** Bracketed qualifier, e.g. "Countries and Nationalities". */
  qualifier?: string;
}

const VOCAB_HEADER_KEYWORDS = ["vocabulary", "vocab"];
const RULES_HEADER_KEYWORDS = ["key rules", "key rules and grammar", "rules", "grammar"];
const WORKSHEET_KEYWORDS = ["worksheet", "worksheets"];
const ANSWERS_KEYWORDS = ["answer sheet", "answer sheets", "answers"];

function parseSubSectionHeading(heading: string): SubSection | undefined {
  const m = /^(\d+(?:\.\d+)?):?\s*(.*)$/.exec(heading.trim());
  if (!m) return undefined;
  const number = m[1];
  const rawTitle = m[2].trim();
  const lower = rawTitle.toLowerCase();
  let kind: SubSection["kind"] = "other";
  if (VOCAB_HEADER_KEYWORDS.some((k) => lower.startsWith(k))) kind = "vocabulary";
  else if (RULES_HEADER_KEYWORDS.some((k) => lower.startsWith(k))) kind = "rules";
  else if (WORKSHEET_KEYWORDS.some((k) => lower.startsWith(k))) kind = "worksheet";
  else if (ANSWERS_KEYWORDS.some((k) => lower.startsWith(k))) kind = "answers";

  const qualifierMatch = /\(([^)]+)\)/.exec(rawTitle);
  const qualifier = qualifierMatch ? qualifierMatch[1].trim() : undefined;
  return { number, title: rawTitle, kind, qualifier };
}

interface RowData {
  cells: string[];
  /** Source cell elements aligned with `cells`, preserved for callers (e.g. rule
   * example extraction) that need to inspect paragraph structure beyond the
   * whitespace-collapsed text. Undefined entries correspond to rowspan-filled
   * positions whose source cell lives in an earlier row. */
  cellElements: (HTMLElement | undefined)[];
}

/**
 * Convert a `<table>` element into a 2D matrix of cell text, expanding `rowspan`/`colspan`
 * so every row has the same number of columns. This makes it easy to interpret merged
 * "Section" cells where the category label spans many rows.
 */
function tableToMatrix(table: HTMLElement): RowData[] {
  const rawRows = table.querySelectorAll("tr");
  const matrix: string[][] = [];
  const elements: (HTMLElement | undefined)[][] = [];
  // Fill cells respecting rowspan/colspan
  for (let r = 0; r < rawRows.length; r++) {
    const cells = rawRows[r].querySelectorAll("th, td");
    if (!matrix[r]) matrix[r] = [];
    if (!elements[r]) elements[r] = [];
    let c = 0;
    for (const cell of cells) {
      // Skip past any positions already filled by a prior rowspan
      while (matrix[r][c] !== undefined) c++;
      const text = cellText(cell);
      const rowSpan = Math.max(1, Number(cell.getAttribute("rowspan") ?? "1"));
      const colSpan = Math.max(1, Number(cell.getAttribute("colspan") ?? "1"));
      for (let dr = 0; dr < rowSpan; dr++) {
        if (!matrix[r + dr]) matrix[r + dr] = [];
        if (!elements[r + dr]) elements[r + dr] = [];
        for (let dc = 0; dc < colSpan; dc++) {
          matrix[r + dr][c + dc] = text;
          // Only the originating cell carries the element reference so callers
          // can tell merged copies apart from the source.
          elements[r + dr][c + dc] = dr === 0 && dc === 0 ? cell : undefined;
        }
      }
      c += colSpan;
    }
  }
  return matrix.map((cells, r) => ({
    cells,
    cellElements: elements[r] ?? [],
  }));
}

interface DocCursor {
  lesson: ParsedLessonHeading | null;
  lessonId: string;
  topicSlugs: string[];
  /** Most recent h2 (sub-section). */
  subSection: SubSection | null;
  /** Most recent h3 (used to title grammar rules). */
  subSubHeading: string | null;
  /** Buffer accumulated under the current h3 inside a rules section. */
  ruleBuffer: {
    title: string;
    paragraphs: string[];
    examples: GrammarExample[];
  } | null;
  /** Reference-page bucket the current paragraphs/tables belong to. Set by
   *  h2/h3 detection (e.g. "Vocabulary (Pronouns)" -> "pronouns") so prose
   *  paragraphs in vocab sections can be lifted out of the lesson and into
   *  the dedicated reference pages. */
  specialSection: "pronouns" | "conjugations" | "plurals" | null;
  /** Within a `pronouns` specialSection, which sub-table we're inside. */
  pronounKind: "detached" | "attached" | null;
  /** Within a `conjugations` specialSection, which tense we're inside. */
  conjugationTense: "past" | "present-future" | null;
}

const NUMBER_WORD_TO_VALUE: Record<string, number> = {
  zero: 0,
};

function parseNumberCellValue(cell: string): number | undefined {
  // Doc number column uses Eastern Arabic numerals ٠-٩
  const eastern = "٠١٢٣٤٥٦٧٨٩";
  const ascii = "0123456789";
  let normalized = "";
  for (const ch of cell) {
    const idx = eastern.indexOf(ch);
    if (idx >= 0) normalized += ascii[idx];
    else if (/[0-9]/.test(ch)) normalized += ch;
  }
  if (!normalized) {
    const lower = cell.toLowerCase().trim();
    if (lower in NUMBER_WORD_TO_VALUE) return NUMBER_WORD_TO_VALUE[lower];
    return undefined;
  }
  const n = parseInt(normalized, 10);
  return Number.isFinite(n) ? n : undefined;
}

function deriveTopicSlugs(lesson: ParsedLessonHeading): string[] {
  // Single primary topic per lesson. The category sidebar inside the topic page
  // handles finer grouping (HEAD, UPPER BODY, etc.) without needing nested topics.
  return [slugify(lesson.title)];
}

interface TableClassification {
  kind:
    | "vocab"
    | "rule-table"
    | "grammar-example"
    | "countries"
    | "pronouns"
    | "conjugations"
    | "plurals"
    | "unknown";
  arabicCol?: number;
  pronunciationCol?: number;
  englishCol?: number;
  sectionCol?: number;
  numberCol?: number;
  genderCol?: number;
  /** Pronoun tables: 6th col is the Quranic example. */
  usageNoteCol?: number;
  exampleCol?: number;
  /** Conjugation tables. */
  patternRuleCol?: number;
  patternExampleCol?: number;
  arabicExampleCol?: number;
  /** Plural-forms tables. */
  typeCol?: number;
  howToFormCol?: number;
  ruleCol?: number;
  meaningCol?: number;
}

function classifyTable(headers: string[]): TableClassification {
  const lower = headers.map((h) => h.toLowerCase().trim());
  const has = (...names: string[]) => names.some((n) => lower.includes(n));
  const indexOf = (name: string) => lower.indexOf(name);

  if (has("continent")) {
    return {
      kind: "countries",
      sectionCol: indexOf("continent"),
      arabicCol: indexOf("arabic"),
      pronunciationCol: indexOf("pronunciation"),
    };
  }

  // Pronoun reference shape: Category | Arabic | Pronunciation | English |
  // Usage Note | Example. Identified by the "usage note" column.
  if (
    has("usage note") &&
    has("arabic") &&
    has("pronunciation") &&
    has("english")
  ) {
    return {
      kind: "pronouns",
      sectionCol: indexOf("category") >= 0 ? indexOf("category") : indexOf("section"),
      arabicCol: indexOf("arabic"),
      pronunciationCol: indexOf("pronunciation"),
      englishCol: indexOf("english"),
      usageNoteCol: indexOf("usage note"),
      exampleCol: indexOf("example"),
    };
  }

  // Conjugation reference shape: Category | Pattern Rule | Pattern Example |
  // Arabic Example | Pronunciation | English. Identified by "pattern rule" /
  // "arabic example" headers.
  if (
    (has("pattern rule") || has("pattern example")) &&
    has("arabic example") &&
    has("pronunciation") &&
    has("english")
  ) {
    return {
      kind: "conjugations",
      sectionCol: indexOf("category") >= 0 ? indexOf("category") : indexOf("section"),
      patternRuleCol: indexOf("pattern rule"),
      patternExampleCol: indexOf("pattern example"),
      arabicExampleCol: indexOf("arabic example"),
      pronunciationCol: indexOf("pronunciation"),
      englishCol: indexOf("english"),
    };
  }

  // Plural-forms shape: Type | How to form it | Rule | Example (Arabic) | Meaning.
  // Identified by the "how to form it" column (unique to this table).
  if (
    has("how to form it") ||
    (has("type") && has("rule") && headers.some((h) => h.toLowerCase().includes("example")) && has("meaning"))
  ) {
    const exampleIdx = headers.findIndex((h) => h.toLowerCase().includes("example"));
    return {
      kind: "plurals",
      typeCol: indexOf("type"),
      howToFormCol: indexOf("how to form it"),
      ruleCol: indexOf("rule"),
      arabicCol: exampleIdx,
      meaningCol: indexOf("meaning"),
    };
  }

  if (has("rule") || has("rule no.") || has("rule no")) {
    return { kind: "rule-table" };
  }

  // Grammar example table: "Type | Arabic | Pronunciation | English"
  if (has("type") && has("arabic") && has("pronunciation") && has("english") && headers.length === 4) {
    return {
      kind: "grammar-example",
      sectionCol: indexOf("type"),
      arabicCol: indexOf("arabic"),
      pronunciationCol: indexOf("pronunciation"),
      englishCol: indexOf("english"),
    };
  }

  // Standard vocab table
  if (has("arabic") && has("pronunciation") && has("english")) {
    const sectionCol = indexOf("section") >= 0 ? indexOf("section") : indexOf("category");
    return {
      kind: "vocab",
      sectionCol: sectionCol >= 0 ? sectionCol : undefined,
      arabicCol: indexOf("arabic"),
      pronunciationCol: indexOf("pronunciation"),
      englishCol: indexOf("english"),
      numberCol: indexOf("number") >= 0 ? indexOf("number") : undefined,
      genderCol: indexOf("gender") >= 0 ? indexOf("gender") : undefined,
    };
  }

  return { kind: "unknown" };
}

const WEEKDAY_LOOKUP: Record<string, number> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

// Each tuple is [name-variant, hijri-month-number]. The flat-array form
// previously used `index + 1` as the month number, which broke as soon as a
// month had more than one spelling (e.g. `rabi al-awwal` / `rabi' al-awwal`).
const HIJRI_MONTH_LOOKUP: ReadonlyArray<readonly [string, number]> = [
  ["muharram", 1],
  ["safar", 2],
  ["rabi al-awwal", 3],
  ["rabi' al-awwal", 3],
  ["rabi al-thani", 4],
  ["rabi' al-thani", 4],
  ["jumada al-awwal", 5],
  ["jumada al-thani", 6],
  ["rajab", 7],
  ["shaban", 8],
  ["sha'ban", 8],
  ["ramadan", 9],
  ["shawwal", 10],
  ["dhu al-qadah", 11],
  ["dhu al-qa'dah", 11],
  ["dhu al-hijjah", 12],
];

const GREGORIAN_MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function pickGenderCell(cell: string | undefined): VocabEntry["gender"] | undefined {
  if (!cell) return undefined;
  const t = cell.trim().toUpperCase();
  if (t === "M" || t === "MASCULINE") return "M";
  if (t === "F" || t === "FEMININE") return "F";
  if (t === "M/F" || t === "F/M" || t === "BOTH") return "Both";
  return undefined;
}

export async function parseDocxBuffer(
  buffer: Buffer | ArrayBuffer | Uint8Array,
  options: ParseOptions = {},
): Promise<ParseResult> {
  const warnings: string[] = [];
  const warn = (msg: string) => {
    warnings.push(msg);
    if (options.verbose) console.warn("[parser]", msg);
  };

  const result = await mammoth.convertToHtml({
    buffer: buffer instanceof ArrayBuffer ? Buffer.from(buffer) : Buffer.from(buffer as Uint8Array),
  });

  const root = parse(result.value);
  const lessons: Lesson[] = [];
  const topicMap = new Map<string, Topic>();
  const vocab: VocabEntry[] = [];
  const rules: GrammarRule[] = [];
  const conversations: Conversation[] = [];

  const cursor: DocCursor = {
    lesson: null,
    lessonId: "",
    topicSlugs: [],
    subSection: null,
    subSubHeading: null,
    ruleBuffer: null,
    specialSection: null,
    pronounKind: null,
    conjugationTense: null,
  };

  const pronouns: PronounEntry[] = [];
  const conjugations: ConjugationEntry[] = [];
  const pluralForms: PluralForm[] = [];
  const grammarIntroBuffers: Record<"pronouns" | "conjugations" | "plurals", string[]> = {
    pronouns: [],
    conjugations: [],
    plurals: [],
  };

  // Walk top-level body children in document order
  const bodyChildren = root.childNodes.filter(
    (n): n is HTMLElement => n instanceof HTMLElement,
  );

  let lessonOrder = 0;

  function flushRuleBuffer(): void {
    if (!cursor.ruleBuffer || !cursor.lesson) {
      cursor.ruleBuffer = null;
      return;
    }
    const { title, paragraphs, examples } = cursor.ruleBuffer;
    if (!title && paragraphs.length === 0 && examples.length === 0) {
      cursor.ruleBuffer = null;
      return;
    }
    const ruleId = stableId([cursor.lessonId, "rule", title]);
    const rule: GrammarRule = {
      id: ruleId,
      title: stripLeadingNumber(title) || "Grammar tip",
      body: paragraphs.join("\n\n").trim(),
      examples,
      topicSlugs: [...cursor.topicSlugs],
      lessonId: cursor.lessonId,
    };
    rules.push(rule);
    cursor.ruleBuffer = null;
  }

  function stripLeadingNumber(s: string): string {
    return s.replace(/^\d+(\.\d+)*\s*/, "").trim();
  }

  function ensureTopic(slug: string, name: string, nameArabic: string | undefined, lessonId: string) {
    let t = topicMap.get(slug);
    if (!t) {
      t = {
        slug,
        name,
        nameArabic,
        order: lessonOrder,
        lessonIds: [],
        vocabCount: 0,
        ruleCount: 0,
        conversationCount: 0,
      };
      topicMap.set(slug, t);
    }
    if (!t.lessonIds.includes(lessonId)) t.lessonIds.push(lessonId);
  }

  function processVocabTable(table: HTMLElement, classification: TableClassification): void {
    if (!cursor.lesson) {
      warn(`Skipped vocab table: no current lesson`);
      return;
    }
    if (
      classification.arabicCol === undefined ||
      classification.pronunciationCol === undefined ||
      classification.englishCol === undefined
    ) {
      warn(`Skipped vocab table: missing required columns`);
      return;
    }
    const matrix = tableToMatrix(table);
    if (matrix.length < 2) return;
    const dataRows = matrix.slice(1);

    const categoryOverride: string | undefined =
      cursor.subSection?.qualifier ?? undefined;

    let runningCategory = categoryOverride ?? "General";
    const isExtra =
      cursor.subSection?.qualifier?.toLowerCase().includes("extra") === true ||
      cursor.subSection?.qualifier?.toLowerCase().includes("bonus") === true;

    const isMonthsLesson = cursor.lesson.title.toLowerCase().includes("month");
    const isDaysLesson = cursor.lesson.title.toLowerCase().includes("days");
    const isNumbersLesson = cursor.lesson.title.toLowerCase().includes("number");

    for (const row of dataRows) {
      const arabic = row.cells[classification.arabicCol]?.trim();
      const pronunciation = row.cells[classification.pronunciationCol]?.trim();
      const english = row.cells[classification.englishCol]?.trim();
      if (!arabic || !pronunciation) continue;
      if (classification.sectionCol !== undefined) {
        const sectionCell = row.cells[classification.sectionCol]?.trim();
        if (sectionCell) runningCategory = sectionCell;
      }

      const gender =
        classification.genderCol !== undefined
          ? pickGenderCell(row.cells[classification.genderCol])
          : undefined;

      const numericValue =
        classification.numberCol !== undefined
          ? parseNumberCellValue(row.cells[classification.numberCol] ?? "")
          : isNumbersLesson
            ? parseNumberCellValue(row.cells[classification.arabicCol] ?? "")
            : undefined;

      let weekdayIndex: number | undefined;
      if (isDaysLesson && english) {
        const key = english.toLowerCase().split(/[\s/]/)[0];
        if (key in WEEKDAY_LOOKUP) weekdayIndex = WEEKDAY_LOOKUP[key];
      }

      let monthIndex: number | undefined;
      let monthSystem: VocabEntry["monthSystem"] | undefined;
      if (isMonthsLesson && english) {
        const lower = english.toLowerCase();
        for (const [name, num] of HIJRI_MONTH_LOOKUP) {
          if (lower.includes(name)) {
            monthIndex = num;
            monthSystem = "hijri";
            break;
          }
        }
        if (monthIndex === undefined) {
          for (let i = 0; i < GREGORIAN_MONTHS.length; i++) {
            if (lower.includes(GREGORIAN_MONTHS[i])) {
              monthIndex = i + 1;
              monthSystem = "gregorian";
              break;
            }
          }
        }
      }

      const id = stableId([cursor.lessonId, runningCategory, arabic]);
      vocab.push({
        id,
        arabic,
        arabicFolded: foldForSearch(arabic),
        pronunciation,
        english: english ?? "",
        category: runningCategory,
        gender,
        isExtra,
        numericValue,
        weekdayIndex,
        monthIndex,
        monthSystem,
        topicSlugs: [...cursor.topicSlugs],
        lessonId: cursor.lessonId,
      });
    }
  }

  function processCountriesTable(table: HTMLElement): void {
    if (!cursor.lesson) return;
    const matrix = tableToMatrix(table);
    if (matrix.length < 2) return;
    const headerRow = matrix[0].cells.map((c) => c.toLowerCase());
    // headers: [continent | country | arabic | pronunciation | nationality | arabic | pronunciation]
    const idx = (name: string, fromIndex = 0) => {
      for (let i = fromIndex; i < headerRow.length; i++) {
        if (headerRow[i] === name) return i;
      }
      return -1;
    };
    const continentCol = idx("continent");
    const countryCol = idx("country");
    const countryArabicCol = idx("arabic");
    const countryProCol = idx("pronunciation");
    const nationalityCol = idx("nationality");
    const natArabicCol = idx("arabic", countryProCol + 1);
    const natProCol = idx("pronunciation", countryProCol + 1);

    if (
      continentCol < 0 ||
      countryCol < 0 ||
      countryArabicCol < 0 ||
      countryProCol < 0 ||
      nationalityCol < 0
    ) {
      warn(`Skipped countries table: missing required columns`);
      return;
    }

    let runningContinent = "";
    for (const row of matrix.slice(1)) {
      const continent = row.cells[continentCol]?.trim();
      if (continent) runningContinent = continent;
      const country = row.cells[countryCol]?.trim();
      const countryArabic = row.cells[countryArabicCol]?.trim();
      const countryPro = row.cells[countryProCol]?.trim();
      const nationality = row.cells[nationalityCol]?.trim();
      const natArabic = natArabicCol >= 0 ? row.cells[natArabicCol]?.trim() : undefined;
      const natPro = natProCol >= 0 ? row.cells[natProCol]?.trim() : undefined;

      if (!country || !countryArabic) continue;

      const id = stableId([cursor.lessonId, "country", country]);
      vocab.push({
        id,
        arabic: countryArabic,
        arabicFolded: foldForSearch(countryArabic),
        pronunciation: countryPro ?? "",
        english: country,
        category: "Countries",
        subCategory: runningContinent,
        continent: runningContinent,
        country,
        nationalityArabic: natArabic,
        nationalityPronunciation: natPro,
        isExtra: false,
        topicSlugs: [...cursor.topicSlugs],
        lessonId: cursor.lessonId,
      });

      if (nationality && natArabic) {
        const natId = stableId([cursor.lessonId, "nationality", nationality]);
        vocab.push({
          id: natId,
          arabic: natArabic,
          arabicFolded: foldForSearch(natArabic),
          pronunciation: natPro ?? "",
          english: nationality,
          category: "Nationalities",
          subCategory: runningContinent,
          continent: runningContinent,
          country,
          isExtra: false,
          topicSlugs: [...cursor.topicSlugs],
          lessonId: cursor.lessonId,
        });
      }
    }
  }

  function processRuleTable(table: HTMLElement): void {
    if (!cursor.lesson) return;
    const matrix = tableToMatrix(table);
    if (matrix.length < 2) return;
    const rawHeaders = matrix[0].cells.map((c) => c.trim());
    const headers = rawHeaders.map((c) => c.toLowerCase());

    // Pick the "title column": prefer Section / Rule Title; otherwise the first non-numbering column.
    let titleCol = headers.findIndex((h) => h === "section" || h === "rule title");
    if (titleCol < 0) {
      titleCol = headers.findIndex(
        (h) => !["rule no.", "rule no", "no.", "#"].includes(h),
      );
    }
    if (titleCol < 0) titleCol = 0;

    // Example columns: any header starting with "example" or labelled "How It Works".
    const exampleCols = headers
      .map((h, i) => ({ h, i }))
      .filter(({ h }) => h.startsWith("example") || h === "how it works")
      .map(({ i }) => i);

    for (const row of matrix.slice(1)) {
      const title = stripLeadingNumber(row.cells[titleCol]?.trim() ?? "") || "Rule";

      const bodyParts: string[] = [];
      const examples: GrammarExample[] = [];

      for (let i = 0; i < row.cells.length; i++) {
        if (i === titleCol) continue;
        const cell = row.cells[i]?.trim();
        if (!cell) continue;
        const headerLabel = rawHeaders[i] || `col${i}`;
        // "Rule No." / numbering columns: skip.
        if (["rule no.", "rule no", "no.", "#"].includes(headerLabel.toLowerCase())) continue;
        if (exampleCols.includes(i)) {
          // Split multi-paragraph example cells into one example per line so
          // "هٰذَا رَأْسٌ - this is a head\nهٰذَا شَعْرٌ - this is hair"
          // doesn't render as a single run-on string.
          const cellEl = row.cellElements?.[i];
          const lines = cellEl ? cellLines(cellEl) : [cell];
          for (const line of lines) {
            const arabic = extractInlineArabic(line) ?? "";
            // Strip the Arabic span and any leading separator from the English
            // gloss so the rule card doesn't render the Arabic twice.
            const english = arabic
              ? line
                  .replace(arabic, "")
                  .replace(/^\s*[-–—:.]\s*/, "")
                  .trim()
              : line;
            examples.push({ arabic, english });
          }
        } else {
          bodyParts.push(`**${headerLabel}:** ${cell}`);
        }
      }

      if (!title && bodyParts.length === 0 && examples.length === 0) continue;

      const id = stableId([cursor.lessonId, "rule-table", title]);
      rules.push({
        id,
        title,
        body: bodyParts.join("\n\n"),
        examples,
        topicSlugs: [...cursor.topicSlugs],
        lessonId: cursor.lessonId,
      });
    }
  }

  function processGrammarExampleTable(
    table: HTMLElement,
    classification: TableClassification,
  ): void {
    if (!cursor.lesson) return;
    if (
      classification.arabicCol === undefined ||
      classification.pronunciationCol === undefined ||
      classification.englishCol === undefined
    ) {
      return;
    }
    const matrix = tableToMatrix(table);
    if (matrix.length < 2) return;
    const newExamples: GrammarExample[] = [];
    let runningType = "";
    for (const row of matrix.slice(1)) {
      if (classification.sectionCol !== undefined) {
        const t = row.cells[classification.sectionCol]?.trim();
        if (t) runningType = t;
      }
      const arabic = row.cells[classification.arabicCol]?.trim();
      const pronunciation = row.cells[classification.pronunciationCol]?.trim();
      const english = row.cells[classification.englishCol]?.trim();
      if (!arabic) continue;
      newExamples.push({
        arabic,
        pronunciation,
        english,
        parts: runningType
          ? [{ label: runningType, arabic, english }]
          : undefined,
      });
    }
    if (newExamples.length === 0) return;

    // If there's an open rule buffer (from a prior h3 in this rules section), append to it.
    if (cursor.ruleBuffer) {
      cursor.ruleBuffer.examples.push(...newExamples);
      return;
    }

    // Otherwise emit as a standalone rule.
    const title = cursor.subSubHeading ?? cursor.subSection?.title ?? "Grammar examples";
    const id = stableId([cursor.lessonId, "grammar-example", title]);
    rules.push({
      id,
      title: stripLeadingNumber(title),
      body: "",
      examples: newExamples,
      topicSlugs: [...cursor.topicSlugs],
      lessonId: cursor.lessonId,
    });
  }

  function extractInlineArabic(text: string): string | undefined {
    const m = /([\u0600-\u06FF\u064B-\u065F\u0670][\u0600-\u06FF\u064B-\u065F\u0670\s]+)/u.exec(text);
    return m?.[1].trim();
  }

  /**
   * Map an h2 / h3 heading to a reference-page bucket (pronouns / conjugations
   * / plurals). Returns null if the heading isn't part of a reference section.
   *
   * The doc structure these match is:
   *   h2 "7.5 Vocabulary (Pronouns)"     -> pronouns
   *   h3 "7.51 Detatched Pronouns"       -> pronouns / detached
   *   h3 "7.52 Attached Pronouns"        -> pronouns / attached
   *   h2 "7.7 Vocabulary (Tenses)"       -> conjugations
   *   h3 "7.71 Past Tense (Māḍī)"        -> conjugations / past
   *   h3 "7.72 Present / Future tense"   -> conjugations / present-future
   * Plurals are detected by table shape rather than heading because the doc
   * places that table at the end of a regular vocab section.
   */
  function classifySpecialSection(
    heading: string,
  ): "pronouns" | "conjugations" | null {
    const lower = heading.toLowerCase();
    if (lower.includes("pronoun")) return "pronouns";
    if (
      lower.includes("tense") ||
      lower.includes("māḍī") ||
      lower.includes("madi") ||
      lower.includes("muḍāri") ||
      lower.includes("mudari")
    ) {
      return "conjugations";
    }
    return null;
  }

  function classifyPronounKind(heading: string): "detached" | "attached" | null {
    const lower = heading.toLowerCase();
    if (lower.includes("attached")) return "attached";
    // "Detatched" is the doc's spelling.
    if (lower.includes("detached") || lower.includes("detatched") || lower.includes("independent")) {
      return "detached";
    }
    return null;
  }

  function classifyTense(heading: string): "past" | "present-future" | null {
    const lower = heading.toLowerCase();
    if (lower.includes("past") || lower.includes("māḍī") || lower.includes("madi")) {
      return "past";
    }
    if (
      lower.includes("present") ||
      lower.includes("future") ||
      lower.includes("muḍāri") ||
      lower.includes("mudari")
    ) {
      return "present-future";
    }
    return null;
  }

  function inferGenderFromPronunciation(s: string): "M" | "F" | "Both" | undefined {
    // Pronoun cells often suffix the latin transliteration with "(m)" / "(f)" / "(m/f)".
    const m = /\((m\/f|m|f)\)/i.exec(s);
    if (!m) return undefined;
    const tag = m[1].toLowerCase();
    if (tag === "m/f") return "Both";
    if (tag === "m") return "M";
    if (tag === "f") return "F";
    return undefined;
  }

  function stripGenderTag(s: string): string {
    return s.replace(/\s*\((m\/f|m|f)\)\s*$/i, "").trim();
  }

  /** Best-effort split of an "Example" cell into structured fields:
   *  Arabic ayah, transliteration in parens, English in quotes, citation in
   *  trailing parens. The doc isn't perfectly consistent so we accept whatever
   *  we can recover and leave the rest as the raw `arabic` field. */
  function parsePronounExample(cell: string): PronounExample | undefined {
    const cleaned = cell.replace(/\s+/g, " ").trim();
    if (!cleaned) return undefined;

    // Pull the trailing citation: "(Qur'ān 20:14)" or "(Hadith: Sahih ...)"
    let citation: string | undefined;
    const citationMatch = /\(([^()]*?(?:Qur['ʼ’]?ān|Quran|Hadith)[^()]*)\)\s*$/i.exec(cleaned);
    let body = cleaned;
    if (citationMatch) {
      citation = citationMatch[1].trim();
      body = cleaned.slice(0, citationMatch.index).trim();
    }

    // Pull the english translation from a quoted span: "..." or “...”
    let english: string | undefined;
    const quoteMatch = /[“"]([^”"]+)[”"]/.exec(body);
    if (quoteMatch) english = quoteMatch[1].trim();

    // Pull transliteration from a parenthesised latin block: (innī anā Allāh)
    let transliteration: string | undefined;
    const translitMatch = /\(([^()]*[a-zāīūʿʾḍṭṣẓḥ][^()]*)\)/i.exec(body);
    if (translitMatch) transliteration = translitMatch[1].trim();

    // Strip the english quote, transliteration parens, and a trailing en-dash
    // separator to leave just the Arabic.
    let arabic = body;
    if (quoteMatch) arabic = arabic.replace(quoteMatch[0], "");
    if (translitMatch) arabic = arabic.replace(translitMatch[0], "");
    arabic = arabic.replace(/\s*[-–—]\s*$/, "").trim();

    if (!arabic) arabic = cleaned;
    return { arabic, transliteration, english, citation };
  }

  function processPronounTable(
    table: HTMLElement,
    classification: TableClassification,
  ): void {
    if (
      classification.arabicCol === undefined ||
      classification.pronunciationCol === undefined ||
      classification.englishCol === undefined ||
      classification.usageNoteCol === undefined ||
      classification.exampleCol === undefined
    ) {
      warn("Skipped pronoun table: missing required columns");
      return;
    }
    const matrix = tableToMatrix(table);
    if (matrix.length < 2) return;
    const kind = cursor.pronounKind ?? classifyPronounKind(cursor.subSubHeading ?? "");
    if (!kind) {
      warn(`Pronoun table without a detached/attached heading: ${cursor.subSubHeading}`);
      return;
    }
    let runningCategory = "";
    for (const row of matrix.slice(1)) {
      if (classification.sectionCol !== undefined && classification.sectionCol >= 0) {
        const cat = row.cells[classification.sectionCol]?.trim();
        if (cat) runningCategory = cat;
      }
      const arabic = row.cells[classification.arabicCol]?.trim();
      const pronunciationRaw = row.cells[classification.pronunciationCol]?.trim();
      const english = row.cells[classification.englishCol]?.trim() ?? "";
      const usageNote = row.cells[classification.usageNoteCol]?.trim() || undefined;
      const exampleRaw = row.cells[classification.exampleCol]?.trim() || undefined;
      if (!arabic || !pronunciationRaw) continue;
      const gender = inferGenderFromPronunciation(pronunciationRaw);
      const pronunciation = stripGenderTag(pronunciationRaw);
      const example = exampleRaw ? parsePronounExample(exampleRaw) : undefined;
      const id = stableId(["pronoun", kind, runningCategory, arabic, pronunciation]);
      pronouns.push({
        id,
        kind,
        category: runningCategory || "Other",
        arabic,
        arabicFolded: foldForSearch(arabic),
        pronunciation,
        english,
        gender,
        usageNote,
        example,
      });
    }
  }

  function processConjugationTable(
    table: HTMLElement,
    classification: TableClassification,
  ): void {
    if (
      classification.patternRuleCol === undefined ||
      classification.patternExampleCol === undefined ||
      classification.arabicExampleCol === undefined ||
      classification.pronunciationCol === undefined ||
      classification.englishCol === undefined
    ) {
      warn("Skipped conjugation table: missing required columns");
      return;
    }
    const matrix = tableToMatrix(table);
    if (matrix.length < 2) return;
    const tense = cursor.conjugationTense ?? classifyTense(cursor.subSubHeading ?? "");
    if (!tense) {
      warn(`Conjugation table without a tense heading: ${cursor.subSubHeading}`);
      return;
    }
    let runningCategory = "Base form";
    for (const row of matrix.slice(1)) {
      if (classification.sectionCol !== undefined && classification.sectionCol >= 0) {
        const cat = row.cells[classification.sectionCol]?.trim();
        if (cat) runningCategory = cat;
      }
      const patternRule = row.cells[classification.patternRuleCol]?.trim() ?? "";
      const patternExample = row.cells[classification.patternExampleCol]?.trim() ?? "";
      const arabic = row.cells[classification.arabicExampleCol]?.trim();
      const pronunciationRaw = row.cells[classification.pronunciationCol]?.trim();
      const english = row.cells[classification.englishCol]?.trim() ?? "";
      if (!arabic || !pronunciationRaw) continue;
      const gender = inferGenderFromPronunciation(pronunciationRaw);
      const pronunciation = stripGenderTag(pronunciationRaw);
      const id = stableId(["conjugation", tense, runningCategory, pronunciation]);
      conjugations.push({
        id,
        tense,
        category: runningCategory,
        patternRule,
        patternExample,
        arabic,
        arabicFolded: foldForSearch(arabic),
        pronunciation,
        english,
        gender,
      });
    }
  }

  function processPluralFormsTable(
    table: HTMLElement,
    classification: TableClassification,
  ): void {
    const matrix = tableToMatrix(table);
    if (matrix.length < 2) return;
    if (
      classification.typeCol === undefined ||
      classification.howToFormCol === undefined ||
      classification.ruleCol === undefined ||
      classification.arabicCol === undefined
    ) {
      warn("Skipped plurals table: missing required columns");
      return;
    }
    let current: PluralForm | null = null;
    for (const row of matrix.slice(1)) {
      const type = row.cells[classification.typeCol]?.trim();
      const howToForm = row.cells[classification.howToFormCol]?.trim();
      const rule = row.cells[classification.ruleCol]?.trim();
      const exampleCell = row.cellElements[classification.arabicCol];
      const meaningCell =
        classification.meaningCol !== undefined && classification.meaningCol >= 0
          ? row.cellElements[classification.meaningCol]
          : undefined;
      // Split the example & meaning cells on paragraph boundaries so the doc's
      // multi-line cells (e.g. broken plural with "qalam → aqlām" + "dars →
      // durūs") become separate examples instead of one mashed-together blob.
      // Use `cellParagraphs` (splits on <p> only) — internal <br>s become " / "
      // so meaning cells like "teacher<br>teachers" stay as one entry per row.
      const exampleLines = exampleCell ? cellParagraphs(exampleCell) : [];
      const meaningLines = meaningCell ? cellParagraphs(meaningCell) : [];
      // A new "Type" cell (non-empty after rowspan-fill collisions) marks a new
      // group. The rowspan handling in tableToMatrix already replicates the
      // type into every row of the group, so the simplest grouping is by type
      // value directly.
      if (type) {
        if (!current || current.type !== type) {
          current = {
            id: stableId(["plural-form", type]),
            type,
            howToForm: howToForm ?? "",
            rule: rule ?? "",
            examples: [],
          };
          pluralForms.push(current);
        } else {
          // Top-up rule / how-to-form text on the first row of the group.
          if (!current.howToForm && howToForm) current.howToForm = howToForm;
          if (!current.rule && rule) current.rule = rule;
        }
      }
      if (current && exampleLines.length > 0) {
        // The doc sometimes uses one logical example per arabic line but
        // splits the matching English across two stacked paragraphs
        // ("teacher" + "teachers"). When the English has more lines than
        // the Arabic, group leftover English lines into the previous
        // example so "teacher / teachers" stays together.
        for (let i = 0; i < exampleLines.length; i++) {
          let english: string | undefined;
          if (
            i === exampleLines.length - 1 &&
            meaningLines.length > exampleLines.length
          ) {
            // If a previous line already ends with "/", don't double up.
            // Otherwise insert " / " between the singular and plural meanings.
            english = meaningLines
              .slice(i)
              .reduce<string>(
                (acc, line) =>
                  !acc
                    ? line
                    : acc.endsWith("/")
                      ? `${acc}${line}`
                      : `${acc} / ${line}`,
                "",
              );
          } else {
            english = meaningLines[i];
          }
          current.examples.push({
            arabic: exampleLines[i],
            english: english || undefined,
          });
        }
      }
    }
  }

  function processNode(node: HTMLElement): void {
    const tag = node.tagName?.toLowerCase();
    const text = node.text.replace(/\s+/g, " ").trim();

    if (tag === "h1") {
      // Flush any open rule before starting a new lesson
      flushRuleBuffer();
      const parsed = parseLessonHeading(text);
      if (!parsed) return;
      lessonOrder++;
      cursor.lesson = parsed;
      cursor.lessonId = `lesson-${slugify(parsed.title)}`;
      cursor.topicSlugs = deriveTopicSlugs(parsed);
      cursor.subSection = null;
      cursor.subSubHeading = null;
      const lesson: Lesson = {
        id: cursor.lessonId,
        number: parsed.number,
        title: parsed.title,
        titleArabic: parsed.titleArabic,
        topicSlugs: [...cursor.topicSlugs],
        vocabIds: [],
        ruleIds: [],
        conversationIds: [],
      };
      lessons.push(lesson);
      for (const slug of cursor.topicSlugs) {
        ensureTopic(slug, parsed.title, parsed.titleArabic, cursor.lessonId);
      }
      return;
    }

    if (tag === "h2") {
      flushRuleBuffer();
      const sub = parseSubSectionHeading(text);
      if (!sub) return;
      cursor.subSection = sub;
      cursor.subSubHeading = null;
      // Vocabulary (Pronouns) / Vocabulary (Tenses) live under h2 with a
      // bracketed qualifier. Flip on the matching reference-page bucket so
      // following h3s, paragraphs, and tables are routed to it.
      const special = classifySpecialSection(sub.qualifier ?? sub.title);
      cursor.specialSection = special;
      cursor.pronounKind = null;
      cursor.conjugationTense = null;
      return;
    }

    if (tag === "h3") {
      flushRuleBuffer();
      cursor.subSubHeading = text || null;
      if (cursor.subSection?.kind === "rules" && text) {
        cursor.ruleBuffer = {
          title: stripLeadingNumber(text),
          paragraphs: [],
          examples: [],
        };
      }
      // Within a pronouns / conjugations section, narrow further by h3.
      if (cursor.specialSection === "pronouns") {
        cursor.pronounKind = classifyPronounKind(text);
      } else if (cursor.specialSection === "conjugations") {
        cursor.conjugationTense = classifyTense(text);
      }
      return;
    }

    if (tag === "p") {
      if (!text) return;
      // While we're in a "rules" section under an h3, accumulate paragraphs as the rule body
      if (cursor.subSection?.kind === "rules" && cursor.ruleBuffer) {
        cursor.ruleBuffer.paragraphs.push(text);
        return;
      }
      // While we're inside a reference-page bucket (pronouns / conjugations
      // / plurals), buffer the prose so it can anchor the dedicated page
      // instead of being dropped on the floor.
      if (cursor.specialSection) {
        // Skip whitespace-only or table-of-contents page-number paragraphs.
        if (text.length > 30 && !/^\d+(?:\.\d+)*\s/.test(text)) {
          grammarIntroBuffers[cursor.specialSection].push(text);
        }
      }
      return;
    }

    if (tag === "table") {
      const matrix = tableToMatrix(node);
      if (matrix.length === 0) return;
      const headers = matrix[0].cells.map((c) => c.trim());
      const classification = classifyTable(headers);

      if (cursor.subSection?.kind === "worksheet" || cursor.subSection?.kind === "answers") {
        // Worksheets / answer sheets are images. Skip table parsing — they're rare and empty.
        return;
      }

      switch (classification.kind) {
        case "countries":
          processCountriesTable(node);
          break;
        case "pronouns":
          processPronounTable(node, classification);
          break;
        case "conjugations":
          processConjugationTable(node, classification);
          break;
        case "plurals":
          processPluralFormsTable(node, classification);
          // The plurals table sits inside a regular vocabulary section, but
          // the prose immediately surrounding it belongs to the plurals page.
          // Flip the bucket so any following <p> nodes (until the next h2) get
          // routed correctly.
          cursor.specialSection = "plurals";
          break;
        case "vocab":
          if (cursor.subSection?.kind === "vocabulary") {
            processVocabTable(node, classification);
          } else if (cursor.subSection?.kind === "rules") {
            processGrammarExampleTable(node, classification);
          } else {
            warn(
              `Vocab-shaped table outside vocab/rules section: lesson=${cursor.lesson?.number} sub=${cursor.subSection?.title}`,
            );
          }
          break;
        case "grammar-example":
          processGrammarExampleTable(node, classification);
          break;
        case "rule-table":
          processRuleTable(node);
          break;
        case "unknown":
        default:
          warn(
            `Unknown table shape, headers=[${headers.join(", ")}] in lesson=${cursor.lesson?.number} sub=${cursor.subSection?.title}`,
          );
      }
      return;
    }
  }

  for (const node of bodyChildren) {
    processNode(node);
  }
  flushRuleBuffer();

  // Deduplicate vocab/rule IDs BEFORE cross-linking, so lesson.vocabIds /
  // lesson.ruleIds reference the deduped ids and downstream lookups still
  // resolve. stableId() drops diacritics, so two distinct entries that share
  // the same lesson + category + un-diacritised arabic would collide and
  // break React's keyed reconciliation. Suffix collisions with -2, -3, … so
  // every entry has a unique id.
  const vocabIdCounts = new Map<string, number>();
  for (const v of vocab) {
    const baseId = v.id;
    const count = (vocabIdCounts.get(baseId) ?? 0) + 1;
    vocabIdCounts.set(baseId, count);
    if (count > 1) {
      v.id = `${baseId}-${count}`;
      warn(`Duplicate vocab id collapsed: ${v.id}`);
    }
  }

  const ruleIdCounts = new Map<string, number>();
  for (const r of rules) {
    const baseId = r.id;
    const count = (ruleIdCounts.get(baseId) ?? 0) + 1;
    ruleIdCounts.set(baseId, count);
    if (count > 1) {
      r.id = `${baseId}-${count}`;
      warn(`Duplicate rule id collapsed: ${r.id}`);
    }
  }

  // Same dedupe pass for the new reference collections.
  const pronounIdCounts = new Map<string, number>();
  for (const p of pronouns) {
    const baseId = p.id;
    const count = (pronounIdCounts.get(baseId) ?? 0) + 1;
    pronounIdCounts.set(baseId, count);
    if (count > 1) p.id = `${baseId}-${count}`;
  }
  const conjugationIdCounts = new Map<string, number>();
  for (const c of conjugations) {
    const baseId = c.id;
    const count = (conjugationIdCounts.get(baseId) ?? 0) + 1;
    conjugationIdCounts.set(baseId, count);
    if (count > 1) c.id = `${baseId}-${count}`;
  }
  const pluralIdCounts = new Map<string, number>();
  for (const p of pluralForms) {
    const baseId = p.id;
    const count = (pluralIdCounts.get(baseId) ?? 0) + 1;
    pluralIdCounts.set(baseId, count);
    if (count > 1) p.id = `${baseId}-${count}`;
  }

  // Cross-link lesson → vocab/rules ids
  const lessonsById = new Map(lessons.map((l) => [l.id, l]));
  for (const v of vocab) {
    const l = lessonsById.get(v.lessonId);
    if (l) l.vocabIds.push(v.id);
    for (const slug of v.topicSlugs) {
      const t = topicMap.get(slug);
      if (t) t.vocabCount++;
    }
  }
  for (const r of rules) {
    const l = lessonsById.get(r.lessonId);
    if (l) l.ruleIds.push(r.id);
    for (const slug of r.topicSlugs) {
      const t = topicMap.get(slug);
      if (t) t.ruleCount++;
    }
  }
  for (const c of conversations) {
    const l = lessonsById.get(c.lessonId);
    if (l) l.conversationIds.push(c.id);
    for (const slug of c.topicSlugs) {
      const t = topicMap.get(slug);
      if (t) t.conversationCount++;
    }
  }

  const topics = [...topicMap.values()].sort((a, b) => a.order - b.order);

  const grammarIntros: GrammarIntro[] = (
    ["pronouns", "conjugations", "plurals"] as const
  )
    .map((section) => ({
      section,
      paragraphs: dedupeAdjacent(grammarIntroBuffers[section]),
    }))
    .filter((g) => g.paragraphs.length > 0);

  const content: SiteContent = {
    lessons,
    topics,
    vocab,
    rules,
    conversations,
    pronouns,
    conjugations,
    pluralForms,
    grammarIntros,
    source: {
      name: "AMAR Arabic Programme",
      contactEmail: "majesticmessenger@gmail.com",
      instagram: "@majestic_messenger",
      docUrl: "https://docs.google.com/document/d/1wqbU7rsLUm0wqCjQPS2PbtCTThZOxnE2CnClxa8DETc/edit",
    },
    fetchedAt: new Date().toISOString(),
  };

  return { content, warnings };
}

/** Drop consecutive duplicate paragraphs from a buffer (the doc's
 *  table-of-contents entries can appear adjacent to the real heading). */
function dedupeAdjacent(paragraphs: string[]): string[] {
  const out: string[] = [];
  for (const p of paragraphs) {
    if (out.length === 0 || out[out.length - 1] !== p) out.push(p);
  }
  return out;
}
