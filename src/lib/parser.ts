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
  type Conversation,
  type GrammarExample,
  type GrammarRule,
  type Lesson,
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
}

/**
 * Convert a `<table>` element into a 2D matrix of cell text, expanding `rowspan`/`colspan`
 * so every row has the same number of columns. This makes it easy to interpret merged
 * "Section" cells where the category label spans many rows.
 */
function tableToMatrix(table: HTMLElement): RowData[] {
  const rawRows = table.querySelectorAll("tr");
  const matrix: string[][] = [];
  // Fill cells respecting rowspan/colspan
  for (let r = 0; r < rawRows.length; r++) {
    const cells = rawRows[r].querySelectorAll("th, td");
    if (!matrix[r]) matrix[r] = [];
    let c = 0;
    for (const cell of cells) {
      // Skip past any positions already filled by a prior rowspan
      while (matrix[r][c] !== undefined) c++;
      const text = cellText(cell);
      const rowSpan = Math.max(1, Number(cell.getAttribute("rowspan") ?? "1"));
      const colSpan = Math.max(1, Number(cell.getAttribute("colspan") ?? "1"));
      for (let dr = 0; dr < rowSpan; dr++) {
        if (!matrix[r + dr]) matrix[r + dr] = [];
        for (let dc = 0; dc < colSpan; dc++) {
          matrix[r + dr][c + dc] = text;
        }
      }
      c += colSpan;
    }
  }
  return matrix.map((cells) => ({ cells }));
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
  kind: "vocab" | "rule-table" | "grammar-example" | "countries" | "unknown";
  arabicCol?: number;
  pronunciationCol?: number;
  englishCol?: number;
  sectionCol?: number;
  numberCol?: number;
  genderCol?: number;
}

function classifyTable(headers: string[]): TableClassification {
  const lower = headers.map((h) => h.toLowerCase());
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
          examples.push({ arabic: extractInlineArabic(cell) ?? "", english: cell });
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
      return;
    }

    if (tag === "p") {
      if (!text) return;
      // While we're in a "rules" section under an h3, accumulate paragraphs as the rule body
      if (cursor.subSection?.kind === "rules" && cursor.ruleBuffer) {
        cursor.ruleBuffer.paragraphs.push(text);
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

  // Deduplicate vocab IDs: stableId() drops diacritics, so two distinct
  // entries that share the same lesson + category + un-diacritised arabic
  // would collide and break React's keyed reconciliation downstream.
  // Suffix collisions with -2, -3, … so every entry has a unique id.
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

  const content: SiteContent = {
    lessons,
    topics,
    vocab,
    rules,
    conversations,
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
