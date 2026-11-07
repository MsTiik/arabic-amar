"use client";

import { Check, X } from "lucide-react";
import { useState } from "react";

import { ArabicText } from "@/components/arabic-text";
import { Disclosure } from "@/components/disclosure";
import { ScoreBar } from "@/components/lesson-notes-client";
import { MarkedArabic } from "@/components/marked-arabic";
import { cn } from "@/lib/cn";
import {
  chartForms,
  type ChartVerb,
  type GrammarQuestion,
  type PresentPerson,
} from "@/data/level-two-grammar";

export function VerbChart({
  verbs,
  persons,
}: {
  verbs: readonly ChartVerb[];
  persons: readonly PresentPerson[];
}) {
  const [verbId, setVerbId] = useState(verbs[0]?.id);
  const verb = verbs.find((entry) => entry.id === verbId) ?? verbs[0];
  if (!verb) return null;
  const forms = chartForms(verb, persons);

  return (
    <div className="rounded-[12px] border border-hairline bg-card p-3 sm:p-4">
      <div
        role="tablist"
        aria-label="Choose a verb"
        className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
      >
        {verbs.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={entry.id === verb.id}
            onClick={() => setVerbId(entry.id)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium focus-ring sm:py-1 sm:text-xs",
              entry.id === verb.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-hairline bg-background-soft hover:bg-muted",
            )}
          >
            {entry.english}
          </button>
        ))}
      </div>
      {verb.prefixVowel === "u" ? (
        <p className="mt-3 text-sm text-muted-foreground">
          This verb starts with a ḍamma in the present tense, so the prefixes
          are <ArabicText variant="inline">يُـ تُـ أُ</ArabicText> instead of{" "}
          <ArabicText variant="inline">يَـ تَـ أَ</ArabicText>. The pattern is
          exactly the same.
        </p>
      ) : null}
      <ul className="mt-2 divide-y divide-hairline sm:mt-4">
        {forms.map((form) => (
          <li
            key={form.person.id}
            className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5 py-2 sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)]"
          >
            <div className="row-span-2 sm:row-span-1">
              <ArabicText className="text-xl text-foreground">{form.person.pronoun.arabic}</ArabicText>
              <p className="text-xs text-muted-foreground">{form.person.pronoun.english}</p>
            </div>
            <MarkedArabic text={form.arabic} className="text-2xl text-foreground sm:order-last sm:text-right" />
            <p className="text-sm text-muted-foreground">
              <span lang="ar-Latn" className="italic">{form.transliteration}</span> · {form.english}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuestionCard({
  question,
  index,
  picked,
  onPick,
}: {
  question: GrammarQuestion;
  index: number;
  picked: string | undefined;
  onPick: (arabic: string) => void;
}) {
  const answered = picked !== undefined;
  const correct = picked === question.answer;
  const [before, after] = question.stem.split("___");

  return (
    <li
      className={cn(
        "flex h-full flex-col gap-2 rounded-[12px] border bg-card p-3 shadow-[var(--shadow-sm)]",
        !answered && "border-hairline-strong",
        answered && correct && "border-success/50",
        answered && !correct && "border-danger/50",
      )}
    >
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs normal-case tabular-nums",
            !answered && "bg-primary-soft text-primary",
            answered && correct && "bg-success text-white",
            answered && !correct && "bg-danger text-white",
          )}
        >
          {answered ? (correct ? <Check className="h-3.5 w-3.5" aria-label="Right" /> : <X className="h-3.5 w-3.5" aria-label="Wrong" />) : index + 1}
        </span>
        {question.ask}
      </p>
      <ArabicText className="text-center text-2xl leading-relaxed text-foreground">
        {before}
        <span
          className={cn(
            "mx-1 inline-block min-w-16 border-b-2 px-1 text-center",
            !answered && "border-muted-foreground/50",
            answered && correct && "border-success text-success",
            answered && !correct && "border-danger text-danger",
          )}
        >
          {answered ? picked : "\u00a0"}
        </span>
        {after}
      </ArabicText>
      <div className="flex flex-wrap justify-center gap-2" dir="rtl">
        {question.options.map((option) => {
          const isAnswer = option.arabic === question.answer;
          const isPicked = option.arabic === picked;
          return (
            <button
              key={option.arabic}
              type="button"
              disabled={answered}
              onClick={() => onPick(option.arabic)}
              className={cn(
                "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 py-1 font-arabic text-xl transition-colors focus-ring",
                !answered && "border-hairline bg-card hover:border-primary/50 hover:bg-primary-soft",
                answered && isAnswer && "border-success bg-success-soft text-success",
                answered && isPicked && !isAnswer && "border-danger bg-danger-soft text-danger",
                answered && !isPicked && !isAnswer && "border-hairline opacity-50",
              )}
            >
              <span lang="ar">{option.arabic}</span>
              {answered && isAnswer ? <Check className="size-4" aria-hidden /> : null}
              {answered && isPicked && !isAnswer ? <X className="size-4" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className="mt-auto space-y-0.5 border-t border-hairline pt-2 text-sm leading-snug" aria-live="polite">
          <p className={cn("font-medium", correct ? "text-success" : "text-danger")}>
            {correct ? "Correct." : `Not quite: it’s ${question.answer}.`} {question.why}
          </p>
          <p className="text-muted-foreground">
            <span lang="ar-Latn" className="italic">{question.transliteration}</span> · {question.english}
          </p>
        </div>
      ) : null}
    </li>
  );
}

/** Choose-the-word questions, folded away until the learner wants them, with a running score. */
export function GrammarPractice({
  questions,
  title = "Choose the right word",
  defaultOpen = false,
}: {
  questions: readonly GrammarQuestion[];
  title?: string;
  defaultOpen?: boolean;
}) {
  const [picks, setPicks] = useState<Readonly<Record<string, string>>>({});
  const answered = questions.filter((question) => picks[question.id] !== undefined);
  const right = answered.filter((question) => picks[question.id] === question.answer).length;

  return (
    <Disclosure
      title={title}
      meta={`${questions.length} questions · verbs, هَذَا / هَذِهِ, مَنْ / مَا`}
      status={answered.length ? `${right} / ${questions.length} correct` : undefined}
      defaultOpen={defaultOpen}
      bodyClassName="space-y-3 bg-background-soft/40"
    >
      <ScoreBar
        right={right}
        answered={answered.length}
        total={questions.length}
        onRetryMissed={() =>
          setPicks((current) =>
            Object.fromEntries(
              Object.entries(current).filter(([id, pick]) => questions.find((question) => question.id === id)?.answer === pick),
            ),
          )
        }
        onRestart={() => setPicks({})}
      />
      <ol className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            picked={picks[question.id]}
            onPick={(arabic) => setPicks((current) => ({ ...current, [question.id]: arabic }))}
          />
        ))}
      </ol>
    </Disclosure>
  );
}
