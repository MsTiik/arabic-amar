import Link from "next/link";
import { ArrowRight, ChevronDown, Lightbulb } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { Disclosure } from "@/components/disclosure";
import { ChatDialogue, ChoicePractice, GapDialogue } from "@/components/lesson-notes-client";
import { MarkedArabic } from "@/components/marked-arabic";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { AccordionControls, AccordionSection } from "@/components/section-accordion";
import { SpeakerButton } from "@/components/speaker-button";
import { ayahAudioUrl } from "@/data/quran";
import {
  isNoteItem,
  type LevelTwoLessonNotes,
  type NoteBlock,
  type NoteCell,
  type NoteItem,
  type NoteSection,
  type QuranExample,
} from "@/data/level-two-lesson-notes";
import { cn } from "@/lib/cn";

/* ---------- Items ---------- */

/** An Arabic word or phrase on one line, its transliteration and meaning on the next. */
function CompactItem({ item, size = "md", center = false }: { item: NoteItem; size?: "md" | "lg"; center?: boolean }) {
  return (
    <div className={cn("min-w-0", center && "text-center")}>
      <div className={cn("flex items-center gap-1.5", center && "justify-center")}>
        <ArabicText
          className={cn(
            "leading-normal text-foreground",
            size === "lg" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
          )}
        >
          {item.arabic}
        </ArabicText>
        <SpeakerButton arabic={item.arabic} label={item.english} size="sm" className="shrink-0" />
      </div>
      <p className="text-xs leading-snug text-muted-foreground sm:text-[13px]">
        <span lang="ar-Latn" className="italic text-foreground-soft">{item.transliteration}</span>
        {" · "}
        {item.english}
      </p>
    </div>
  );
}

/** A sentence: Arabic first (right to left), then transliteration and meaning. */
function SentenceItem({ item }: { item: NoteItem }) {
  return (
    <div className="min-w-0">
      <div className="flex items-start gap-2">
        <ArabicText className="min-w-0 flex-1 text-lg leading-relaxed text-foreground sm:text-xl">{item.arabic}</ArabicText>
        <SpeakerButton arabic={item.arabic} label={item.english} size="sm" className="mt-1 shrink-0" />
      </div>
      <p className="text-xs leading-snug text-muted-foreground sm:text-[13px]">
        <span lang="ar-Latn" className="italic text-foreground-soft">{item.transliteration}</span>
        {" · "}
        {item.english}
      </p>
    </div>
  );
}

function Cell({ cell, center = false }: { cell: NoteCell; center?: boolean }) {
  return isNoteItem(cell) ? (
    <CompactItem item={cell} center={center} />
  ) : (
    <p className={cn("text-sm leading-snug text-foreground-soft", center && "text-center")}>
      <Prose text={cell} />
    </p>
  );
}

function BlockTitle({ title, className }: { title?: string; className?: string }) {
  return title ? (
    <h3 className={cn("mb-1.5 text-sm font-semibold text-foreground sm:text-base", className)}>
      <Prose text={title} />
    </h3>
  ) : null;
}

/** Letters only: harakat and tatweel do not take up width of their own. */
const letters = (text: string) => text.replace(/[\u064B-\u065F\u0670\u0640\s]/g, "").length;
/** A word or short phrase (not a sentence): drawn as a small tile, not a sentence row. */
const isShortItem = (item: NoteItem) => !/[.؟?!]\s*$/.test(item.arabic) && item.arabic.trim().split(/\s+/).length <= 3;
/** Rough display width of a cell, in Arabic letters. */
const cellLength = (cell: NoteCell) => (isNoteItem(cell) ? letters(cell.arabic) : cell.length / 2);
const SHORT = 12;

/* ---------- Tables ---------- */

type TableBlock = Extract<NoteBlock, { kind: "table" }>;

/** A label and one form per row (e.g. a verb's past, present, command…): a strip of tiles. */
function LabelledTiles({ block }: { block: TableBlock }) {
  return (
    <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
      {block.rows.map((row, index) => (
        <li key={index} className="tile flex flex-col items-center gap-1 px-2 py-2 text-center">
          <p className="text-[11px] font-semibold leading-tight text-muted-foreground">
            {typeof row[0] === "string" ? <Prose text={row[0]} /> : null}
          </p>
          {row[1] !== undefined ? <Cell cell={row[1]} center /> : null}
        </li>
      ))}
    </ul>
  );
}

/** Two columns (word → plural, question → answer…): one small card per row. */
function PairCards({ block }: { block: TableBlock }) {
  const longest = Math.max(...block.rows.flatMap((row) => row.map(cellLength)));
  const short = longest <= SHORT;
  const bothItems = block.rows.every((row) => row.every(isNoteItem));
  // A short word paired with a long sentence: the word keeps its own width.
  const narrowFirst = !short && block.rows.every((row) => cellLength(row[0]) <= 6);
  const columns = narrowFirst
    ? "grid-cols-[auto_auto_minmax(0,1fr)]"
    : short
      ? "grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
      : "sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]";
  const stacked = !short && !narrowFirst;
  return (
    <div>
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Prose text={block.columns[0]} />
        <span aria-hidden>{bothItems ? " → " : " · "}</span>
        <Prose text={block.columns[1]} />
      </p>
      <ul className={cn("grid gap-1.5", short ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2")}>
        {block.rows.map((row, index) => (
          <li
            key={index}
            className={cn("tile grid items-center gap-x-3 gap-y-1 px-3 py-2", columns)}
          >
            <Cell cell={row[0]} />
            <span aria-hidden className={cn("text-muted-foreground/60", stacked && "hidden sm:block")}>
              {bothItems ? "→" : "|"}
            </span>
            {row[1] !== undefined ? <Cell cell={row[1]} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Three or more columns: a tight grid that folds to two columns on phones. */
function CompactTable({ block, split = true }: { block: TableBlock; split?: boolean }) {
  // A long two-column word list sits as two half-tables side by side on wide screens.
  if (split && block.columns.length <= 2 && block.rows.length > 12) {
    const half = Math.ceil(block.rows.length / 2);
    return (
      <div className="grid items-start gap-2 lg:grid-cols-2">
        <CompactTable block={{ ...block, rows: block.rows.slice(0, half) }} split={false} />
        <CompactTable block={{ ...block, rows: block.rows.slice(half) }} split={false} />
      </div>
    );
  }
  // Two plain columns fit a phone as they are: keep the header row, skip the per-cell labels.
  const plain = block.columns.length <= 2 && !block.rowHeader;
  const rest = block.rowHeader ? block.columns.length - 1 : block.columns.length;
  const template = `${block.rowHeader ? "minmax(0, 0.55fr) " : ""}repeat(${rest}, minmax(0, 1fr))`;
  return (
    <div className="overflow-hidden rounded-[12px] border border-hairline bg-card" style={{ "--cols": template } as React.CSSProperties}>
      <div
        className={cn(
          "gap-3 border-b border-hairline bg-background-soft/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid sm:px-4 sm:[grid-template-columns:var(--cols)]",
          plain ? "grid grid-cols-2" : "hidden",
        )}
      >
        {block.columns.map((column) => (
          <span key={column}>
            <Prose text={column} />
          </span>
        ))}
      </div>
      <ul className="divide-y divide-hairline">
        {block.rows.map((row, rowIndex) => (
          <li key={rowIndex} className="grid grid-cols-2 gap-x-3 gap-y-1.5 px-3 py-2 sm:px-4 sm:[grid-template-columns:var(--cols)]">
            {row.map((cell, cellIndex) =>
              block.rowHeader && cellIndex === 0 && typeof cell === "string" ? (
                <p key={cellIndex} className="col-span-2 text-sm font-semibold text-foreground sm:col-span-1 sm:self-center sm:font-medium sm:text-foreground-soft">
                  <Prose text={cell} />
                </p>
              ) : (
                <div key={cellIndex} className="min-w-0">
                  {plain ? null : (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:hidden">
                      <Prose text={block.columns[cellIndex]} />
                    </p>
                  )}
                  <Cell cell={cell} />
                </div>
              ),
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Table({ block }: { block: TableBlock }) {
  const twoColumns = block.columns.length === 2;
  const labelled = twoColumns && block.rowHeader && block.rows.every((row) => typeof row[0] === "string");
  return (
    <div>
      <BlockTitle title={block.title} />
      {labelled ? (
        <LabelledTiles block={block} />
      ) : twoColumns && block.layout !== "table" ? (
        <PairCards block={block} />
      ) : (
        <CompactTable block={block} />
      )}
    </div>
  );
}

/* ---------- Other blocks ---------- */

function QuranCard({ example }: { example: QuranExample }) {
  const reference = `${example.surahName} ${example.surah}:${example.ayah}`;
  return (
    <li className="flex h-full flex-col gap-1.5 rounded-[12px] border border-hairline border-l-4 border-l-accent-gold bg-card p-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <a
          href={`https://quran.com/${example.surah}/${example.ayah}`}
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground hover:underline focus-ring"
        >
          {reference}
        </a>
        <SpeakerButton
          arabic={example.focus.arabic}
          url={ayahAudioUrl(example.surah, example.ayah)}
          ariaLabel={`Play the recitation of ${reference}`}
          size="sm"
          className="ml-auto"
        />
      </div>
      <MarkedArabic
        text={example.text}
        variant="display"
        className="text-xl leading-[2] text-foreground sm:text-2xl"
        markClassName="text-accent-gold"
      />
      <p className="text-sm leading-snug text-foreground-soft">{example.english}</p>
      <p className="mt-auto border-t border-hairline pt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
        <ArabicText variant="inline" className="text-[1.15em] text-foreground">{example.focus.arabic}</ArabicText>{" "}
        <span lang="ar-Latn" className="italic">{example.focus.transliteration}</span> · {example.focus.english}.{" "}
        <Prose text={example.note} />
      </p>
    </li>
  );
}

type ExamplesBlock = Extract<NoteBlock, { kind: "examples" }>;

/** A run of short sentence groups (word → its example sentences), one row each. */
function BoardGroup({ blocks }: { blocks: readonly ExamplesBlock[] }) {
  return (
    <div>
      <h3 className="mb-1.5 text-sm font-semibold text-foreground sm:text-base">Example sentences</h3>
      <ul className="divide-y divide-hairline overflow-hidden rounded-[12px] border border-hairline bg-card">
        {blocks.map((block) => (
          <li key={block.id} className="grid gap-x-4 gap-y-1 px-3 py-2 sm:px-4 md:grid-cols-[8.5rem_minmax(0,1fr)]">
            <p className="text-sm font-semibold text-accent-rose md:pt-1.5">
              <Prose text={block.title ?? ""} />
            </p>
            <div className="grid gap-x-5 gap-y-1.5 sm:grid-cols-2">
              {block.items.map((item) => (
                <SentenceItem key={item.arabic} item={item} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Examples({ block }: { block: ExamplesBlock }) {
  if (block.items.every(isShortItem)) {
    return (
      <div>
        <BlockTitle title={block.title} />
        <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
          {block.items.map((item) => (
            <li key={item.arabic} className="tile px-2.5 py-1.5">
              <CompactItem item={item} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div>
      <BlockTitle title={block.title} />
      <ul className="grid gap-1.5 md:grid-cols-2">
        {block.items.map((item) => (
          <li key={item.arabic} className="tile px-3 py-2">
            <SentenceItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Block({ block }: { block: NoteBlock }) {
  if (block.kind === "dialogue") {
    if (block.lines.some((line) => line.gap)) return <GapDialogue lines={block.lines} title={block.title} />;
    return (
      <div>
        <BlockTitle title={block.title} />
        <ChatDialogue lines={block.lines} numbered={block.numbered} />
      </div>
    );
  }

  if (block.kind === "table") return <Table block={block} />;

  if (block.kind === "bullets") {
    const List = block.ordered ? "ol" : "ul";
    return (
      <div className="rounded-[12px] border border-accent-sky/25 bg-accent-sky-soft/35 px-3 py-2.5 sm:px-4">
        <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Lightbulb className="h-4 w-4 shrink-0 text-accent-sky" aria-hidden />
          {block.title ? <Prose text={block.title} /> : "Notes"}
        </p>
        <List
          className={cn(
            "space-y-1 pl-5 text-sm leading-relaxed text-foreground-soft",
            block.ordered ? "list-decimal" : "list-disc marker:text-accent-sky/60",
          )}
        >
          {block.items.map((item) => (
            <li key={item}>
              <Prose text={item} />
            </li>
          ))}
        </List>
      </div>
    );
  }

  if (block.kind === "examples") return <Examples block={block} />;

  if (block.kind === "quran") {
    const verses = block.items.length;
    return (
      <Disclosure
        tone="quran"
        title={block.title ?? "In the Qur’an"}
        meta={`${verses} ${verses === 1 ? "verse" : "verses"} · ${block.items.map((example) => `${example.surah}:${example.ayah}`).join(", ")}`}
        bodyClassName="bg-background-soft/40"
      >
        <ul className="grid gap-2 md:grid-cols-2">
          {block.items.map((example) => (
            <QuranCard key={`${example.surah}:${example.ayah}`} example={example} />
          ))}
        </ul>
      </Disclosure>
    );
  }

  if (block.kind === "practice") {
    return <ChoicePractice questions={block.questions} title={block.title} intro={block.intro} />;
  }

  return (
    <Disclosure
      tone="quiz"
      title={block.title ?? "Self-test"}
      meta={`${block.items.length} questions · say the answer, then tap to check`}
      bodyClassName="bg-background-soft/40"
    >
      <ol className="grid gap-1.5 md:grid-cols-2">
        {block.items.map((question, index) => (
          <li key={question.id}>
            <details className="group h-full rounded-[12px] border border-hairline bg-card p-2.5 sm:p-3">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 focus-ring [&::-webkit-details-marker]:hidden">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-indigo-soft text-xs font-semibold tabular-nums text-accent-indigo">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <Prose text={question.question} />
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="mt-2 border-t border-hairline pt-2">
                {isNoteItem(question.answer) ? (
                  <CompactItem item={question.answer} size="lg" />
                ) : (
                  <p className="text-sm font-medium"><Prose text={question.answer} /></p>
                )}
                {question.note ? (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]"><Prose text={question.note} /></p>
                ) : null}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </Disclosure>
  );
}

/* ---------- Sections ---------- */

/** A board sentence group: a titled examples block of up to three sentences. */
function isBoardEntry(block: NoteBlock): block is ExamplesBlock {
  return (
    block.kind === "examples" &&
    Boolean(block.title) &&
    block.items.length <= 3 &&
    !block.items.every(isShortItem) &&
    !/^other words/i.test(block.title ?? "")
  );
}

/** Runs of two or more board entries are drawn together as one compact board. */
function groupBlocks(blocks: readonly NoteBlock[]): (NoteBlock | ExamplesBlock[])[] {
  const out: (NoteBlock | ExamplesBlock[])[] = [];
  for (const block of blocks) {
    const last = out.at(-1);
    if (isBoardEntry(block) && Array.isArray(last)) last.push(block);
    else if (isBoardEntry(block)) out.push([block]);
    else out.push(block);
  }
  return out.map((entry) => (Array.isArray(entry) && entry.length === 1 ? entry[0] : entry));
}

const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;

/** Chips for a closed section: what is inside it. */
function sectionContents(section: NoteSection): string[] {
  let dialogues = 0;
  let tables = 0;
  let exercises = 0;
  let verses = 0;
  let notes = 0;
  let sentences = 0;
  for (const block of section.blocks) {
    if (block.kind === "dialogue") {
      if (block.lines.some((line) => line.gap)) exercises++;
      else dialogues++;
    }
    if (block.kind === "table") tables++;
    if (block.kind === "practice" || block.kind === "quiz") exercises++;
    if (block.kind === "quran") verses += block.items.length;
    if (block.kind === "bullets") notes++;
    if (block.kind === "examples" && !block.items.every(isShortItem)) sentences += block.items.length;
  }
  return [
    dialogues ? plural(dialogues, "dialogue") : "",
    tables ? plural(tables, "table") : "",
    sentences ? plural(sentences, "example sentence") : "",
    notes ? plural(notes, "note") : "",
    exercises ? plural(exercises, "exercise") : "",
    verses ? plural(verses, "Qur’an verse") : "",
  ].filter(Boolean);
}

function Section({ section, number, next, defaultOpen }: { section: NoteSection; number: number; next?: NoteSection; defaultOpen: boolean }) {
  return (
    <AccordionSection
      id={section.id}
      number={number}
      title={section.title}
      titleArabic={section.heading?.arabic}
      intro={section.intro ? <Prose text={section.intro} /> : undefined}
      contents={sectionContents(section)}
      defaultOpen={defaultOpen}
      next={next ? { id: next.id, label: next.label } : undefined}
    >
      {groupBlocks(section.blocks).map((entry) =>
        Array.isArray(entry) ? (
          <BoardGroup key={entry[0].id} blocks={entry} />
        ) : (
          <Block key={entry.id} block={entry} />
        ),
      )}
    </AccordionSection>
  );
}

export function LessonNotesPage({ notes }: { notes: LevelTwoLessonNotes }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:py-8">
      <PageHero
        className="mb-4 sm:mb-6"
        back={{ href: "/levels/level-2", label: "Level 2 topics" }}
        eyebrow="Level 2"
        title={notes.title}
        titleArabic={notes.titleArabic}
        description={<Prose text={notes.description} />}
        clampDescription
      >
        <Link href="/vocabulary" className="btn btn-secondary btn-sm">
          Look up these words in the vocabulary bank
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </PageHero>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{notes.sections.length} parts.</span> Open one at a time;
          exercises open when you want to practise.
        </p>
        <AccordionControls className="flex gap-1" />
      </div>

      <div className="space-y-2.5">
        {notes.sections.map((section, index) => (
          <Section
            key={section.id}
            section={section}
            number={index + 1}
            next={notes.sections[index + 1]}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
