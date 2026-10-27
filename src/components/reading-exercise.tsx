"use client";

import { Check, ChevronDown, RotateCcw, ScrollText, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import {
  readingSentenceToArabic,
  type LevelTwoReading,
  type LevelTwoReadingQuestion,
} from "@/data/level-two-lessons";
import { cn } from "@/lib/cn";
import {
  readingResultsActions,
  scoreReading,
  useReadingResults,
  type ReadingAnswerMark,
} from "@/lib/reading-results";

export function readingSentenceAnchor(sentenceId: string): string {
  return `sentence-${sentenceId}`;
}

export function ReadingExercise({ reading }: { reading: LevelTwoReading }) {
  const results = useReadingResults();
  const marks = results[reading.slug];
  const score = scoreReading(
    marks,
    reading.questions.map((question) => question.id),
  );

  return (
    <div>
      <div className="mb-3 flex items-center gap-3 rounded-[10px] border border-hairline bg-card px-3 py-2 text-sm" aria-live="polite">
        <span className="font-semibold tabular-nums">
          {score.right} / {score.total} correct
        </span>
        <span className="text-xs text-muted-foreground">
          {score.answered === score.total ? "All answered" : `${score.total - score.answered} still to mark`}
        </span>
        {score.answered > 0 ? (
          <button
            type="button"
            onClick={() => readingResultsActions.reset(reading.slug)}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Start again
          </button>
        ) : null}
      </div>
      <ol className="grid gap-2 sm:gap-3 md:grid-cols-2">
        {reading.questions.map((question, index) => (
          <ReadingQuestionCard
            key={question.id}
            slug={reading.slug}
            question={question}
            number={index + 1}
            mark={marks?.[question.id]}
          />
        ))}
      </ol>
    </div>
  );
}

function ReadingQuestionCard({
  slug,
  question,
  number,
  mark,
}: {
  slug: string;
  question: LevelTwoReadingQuestion;
  number: number;
  mark: ReadingAnswerMark | undefined;
}) {
  const setMark = (next: ReadingAnswerMark) =>
    readingResultsActions.mark(slug, question.id, mark === next ? null : next);

  return (
    <li>
      <details
        className={cn(
          "group surface h-full p-3 sm:p-4",
          mark === "right" && "border-l-4 border-l-tense-present-accent",
          mark === "wrong" && "border-l-4 border-l-accent-amber",
        )}
      >
        <summary className="flex cursor-pointer list-none items-center gap-3 focus-ring [&::-webkit-details-marker]:hidden">
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
              mark === "right"
                ? "bg-tense-present text-tense-present-accent"
                : mark === "wrong"
                  ? "bg-accent-amber-soft text-accent-amber"
                  : "bg-primary-soft text-primary",
            )}
          >
            {mark === "right" ? <Check className="h-4 w-4" aria-label="Got it" /> : number}
          </span>
          <span className="min-w-0 flex-1">
            <ArabicText className="text-2xl leading-loose sm:text-3xl">
              {readingSentenceToArabic(question.question)}
            </ArabicText>
            <span lang="ar-Latn" className="block text-sm italic text-foreground-soft">
              {question.question.transliteration}
            </span>
            <span className="block text-xs text-muted-foreground">{question.question.english}</span>
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="mt-2 border-t border-hairline pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Answer</p>
          <ArabicText className="text-2xl leading-loose text-foreground sm:text-3xl">
            {readingSentenceToArabic(question.answer)}
          </ArabicText>
          <p lang="ar-Latn" className="text-sm italic text-foreground-soft">
            {question.answer.transliteration}
          </p>
          <p className="text-sm font-medium">{question.answer.english}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMark("right")}
              aria-pressed={mark === "right"}
              className={cn("btn btn-sm", mark === "right" ? "btn-primary" : "btn-secondary")}
            >
              <Check className="h-4 w-4" aria-hidden />
              Got it
            </button>
            <button
              type="button"
              onClick={() => setMark("wrong")}
              aria-pressed={mark === "wrong"}
              className={cn(
                "btn btn-sm btn-secondary",
                mark === "wrong" && "border-accent-amber bg-accent-amber-soft text-accent-amber",
              )}
            >
              <X className="h-4 w-4" aria-hidden />
              Not yet
            </button>
            {question.sentenceId ? (
              <a
                href={`#${readingSentenceAnchor(question.sentenceId)}`}
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring"
              >
                <ScrollText className="h-3.5 w-3.5" aria-hidden />
                Show in story
              </a>
            ) : null}
          </div>
        </div>
      </details>
    </li>
  );
}
