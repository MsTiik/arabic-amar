import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { GapDialogue } from "@/components/lesson-notes-client";
import {
  isNoteItem,
  type LevelTwoLessonNotes,
  type NoteBlock,
  type NoteCell,
  type NoteDialogueLine,
  type NoteItem,
  type NoteSection,
} from "@/data/level-two-lesson-notes";
import { cn } from "@/lib/cn";

const ARABIC_RUN = /([؀-ۿ](?:[؀-ۿ\s،؛؟]*[؀-ۿ])?)/;

/** English prose with any Arabic in it set in the Arabic font. */
export function Prose({ text }: { text: string }) {
  const parts = text.split(ARABIC_RUN);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <ArabicText key={index} variant="inline" className="text-[1.15em]">
            {part}
          </ArabicText>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function NoteItemView({
  item,
  size = "md",
  alignLeft = false,
}: {
  item: NoteItem;
  size?: "sm" | "md" | "lg";
  /** Keep the Arabic next to its gloss, e.g. in narrow table columns. */
  alignLeft?: boolean;
}) {
  return (
    <div className="min-w-0">
      <ArabicText
        className={cn(
          "leading-loose text-foreground",
          alignLeft && "text-left",
          size === "lg" ? "text-xl sm:text-2xl" : size === "md" ? "text-lg sm:text-xl" : "text-lg",
        )}
      >
        {item.arabic}
      </ArabicText>
      <p lang="ar-Latn" className="text-sm italic text-foreground-soft">{item.transliteration}</p>
      <p className="text-sm text-muted-foreground">{item.english}</p>
    </div>
  );
}

export function DialogueLineView({ line, number }: { line: NoteDialogueLine; number?: number }) {
  return (
    <div className="flex items-start gap-3">
      {number !== undefined ? (
        <span className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold tabular-nums text-primary">
          {number}
        </span>
      ) : null}
      {line.speaker ? (
        <span className="mt-2.5 w-16 shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {line.speaker}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <NoteItemView item={line} size="lg" />
      </div>
    </div>
  );
}

function Cell({ cell }: { cell: NoteCell }) {
  return isNoteItem(cell) ? <NoteItemView item={cell} alignLeft /> : <p className="text-sm text-foreground-soft"><Prose text={cell} /></p>;
}

function BlockTitle({ title }: { title?: string }) {
  return title ? (
    <h3 className="mb-2 text-base font-semibold sm:text-lg">
      <Prose text={title} />
    </h3>
  ) : null;
}

function Block({ block }: { block: NoteBlock }) {
  if (block.kind === "dialogue") {
    if (block.lines.some((line) => line.gap)) {
      return (
        <div>
          <BlockTitle title={block.title} />
          <GapDialogue lines={block.lines} />
        </div>
      );
    }
    return (
      <div>
        <BlockTitle title={block.title} />
        <ol className="surface divide-y divide-hairline px-3 sm:px-5">
          {block.lines.map((line, index) => (
            <li key={index} className="py-2.5 sm:py-3">
              <DialogueLineView line={line} number={block.numbered ? index + 1 : undefined} />
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (block.kind === "table") {
    const columns = `repeat(${block.columns.length}, minmax(0, 1fr))`;
    const leadingText = block.rows.every((row) => typeof row[0] === "string" && row[0].length <= 14);
    const template = leadingText ? `minmax(0, 0.6fr) repeat(${block.columns.length - 1}, minmax(0, 1fr))` : columns;
    return (
      <div>
        <BlockTitle title={block.title} />
        <div className="surface overflow-hidden" style={{ "--cols": template } as React.CSSProperties}>
          <div className="hidden gap-4 border-b border-hairline px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid sm:[grid-template-columns:var(--cols)]">
            {block.columns.map((column) => (
              <span key={column}>
                <Prose text={column} />
              </span>
            ))}
          </div>
          <ul className="divide-y divide-hairline">
            {block.rows.map((row, rowIndex) => (
              <li key={rowIndex} className="grid gap-x-4 gap-y-2 px-3 py-3 sm:px-5 sm:[grid-template-columns:var(--cols)]">
                {row.map((cell, cellIndex) => (
                  <div key={cellIndex} className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:hidden">
                      <Prose text={block.columns[cellIndex]} />
                    </p>
                    <Cell cell={cell} />
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (block.kind === "bullets") {
    const List = block.ordered ? "ol" : "ul";
    return (
      <div>
        <BlockTitle title={block.title} />
        <List
          className={cn(
            "surface space-y-2 p-4 pl-9 text-sm leading-relaxed text-foreground-soft sm:p-5 sm:pl-10 sm:text-base",
            block.ordered ? "list-decimal" : "list-disc",
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

  if (block.kind === "examples") {
    return (
      <div>
        <BlockTitle title={block.title} />
        <ul className="grid gap-2 md:grid-cols-2">
          {block.items.map((item) => (
            <li key={item.arabic} className="tile px-3 py-2.5 sm:p-4">
              <NoteItemView item={item} size="lg" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <BlockTitle title={block.title} />
      <ol className="grid gap-2 md:grid-cols-2">
        {block.items.map((question, index) => (
          <li key={question.id}>
            <details className="group surface h-full p-3 sm:p-4">
              <summary className="flex cursor-pointer list-none items-center gap-3 focus-ring [&::-webkit-details-marker]:hidden">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold tabular-nums text-primary">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 text-sm sm:text-base">
                  <Prose text={question.question} />
                </span>
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="mt-2 border-t border-hairline pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Answer</p>
                {isNoteItem(question.answer) ? (
                  <NoteItemView item={question.answer} size="lg" />
                ) : (
                  <p className="text-sm font-medium"><Prose text={question.answer} /></p>
                )}
                {question.note ? (
                  <p className="mt-1 text-sm text-muted-foreground"><Prose text={question.note} /></p>
                ) : null}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Section({ section }: { section: NoteSection }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="mb-10 scroll-mt-32 sm:mb-12">
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Part {section.part}</p>
        <div className="mt-0.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id={`${section.id}-title`} className="section-title">{section.title}</h2>
          {section.heading ? (
            <ArabicText variant="display" as="p" className="text-xl text-foreground-soft sm:text-2xl">
              {section.heading.arabic}
            </ArabicText>
          ) : null}
        </div>
        {section.intro ? (
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            <Prose text={section.intro} />
          </p>
        ) : null}
      </header>
      <div className="space-y-5">
        {section.blocks.map((block) => (
          <Block key={block.id} block={block} />
        ))}
      </div>
    </section>
  );
}

export function LessonNotesPage({ notes }: { notes: LevelTwoLessonNotes }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <header className="brand-panel mb-6 rounded-[18px] p-4 shadow-[var(--shadow-md),inset_0_1px_0_oklch(1_0_0/8%)] sm:p-8">
        <Link href="/levels/level-2" className="text-sm text-muted-foreground hover:text-foreground">
          ← Level 2 topics
        </Link>
        <p className="mt-3 section-label">Level 2 · Lesson {notes.lesson}</p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="max-w-3xl page-title">{notes.title}</h1>
          <ArabicText variant="display" as="p" className="text-2xl text-foreground-soft sm:text-3xl">
            {notes.titleArabic}
          </ArabicText>
        </div>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-foreground-soft">
          <Prose text={notes.description} />
        </p>
        <Link href="/vocabulary" className="mt-4 btn btn-secondary btn-sm">
          Search this lesson’s words in the vocabulary bank
        </Link>
      </header>

      <nav aria-label="Jump to section" className="mb-8 flex flex-wrap gap-1">
        {notes.sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-hairline bg-background-soft px-3 py-1 text-xs font-medium hover:bg-muted focus-ring"
          >
            {section.label}
          </a>
        ))}
      </nav>

      {notes.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  );
}
