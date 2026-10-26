"use client";

import { Check, RotateCcw, X } from "lucide-react";
import { useState } from "react";

import { ArabicText } from "@/components/arabic-text";
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
    <div className="surface p-3 sm:p-6">
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
            <MarkedArabic text={form.arabic} className="text-2xl text-foreground sm:order-last sm:text-end" />
            <p className="text-sm text-muted-foreground">
              <span lang="ar-Latn" className="italic">{form.transliteration}</span> · {form.english}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuestionCard({ question, index }: { question: GrammarQuestion; index: number }) {
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const correct = picked === question.answer;
  const [before, after] = question.stem.split("___");

  return (
    <li className="tile p-3 sm:p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {index + 1}. {question.ask}
      </p>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 sm:mt-2 sm:block" dir="rtl">
      <ArabicText className="text-2xl leading-loose text-foreground">
        {before}
        <span
          className={cn(
            "mx-1 inline-block min-w-16 border-b-2 px-1 text-center",
            answered ? "border-transparent text-primary" : "border-muted-foreground/50",
          )}
        >
          {answered ? question.answer : "\u00a0"}
        </span>
        {after}
      </ArabicText>
      <div className="flex flex-wrap gap-2 sm:mt-3" dir="rtl">
        {question.options.map((option) => {
          const isAnswer = option.arabic === question.answer;
          const isPicked = option.arabic === picked;
          return (
            <button
              key={option.arabic}
              type="button"
              disabled={answered}
              onClick={() => setPicked(option.arabic)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-arabic text-xl focus-ring",
                !answered && "border-hairline bg-background-soft hover:bg-muted",
                answered && isAnswer && "border-success bg-success-soft text-success",
                answered && isPicked && !isAnswer && "border-danger bg-danger-soft text-danger",
                answered && !isPicked && !isAnswer && "border-hairline opacity-60",
              )}
            >
              <span lang="ar">{option.arabic}</span>
              {answered && isAnswer ? <Check className="size-4" aria-hidden /> : null}
              {answered && isPicked && !isAnswer ? <X className="size-4" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
      </div>
      {answered ? (
        <div className="mt-2 space-y-1 text-sm" aria-live="polite">
          <p className={cn("font-medium", correct ? "text-success" : "text-danger")}>
            {correct ? "Correct." : "Not quite."} {question.why}
          </p>
          <p className="text-muted-foreground">
            <span lang="ar-Latn" className="italic">{question.transliteration}</span> · {question.english}
          </p>
        </div>
      ) : null}
    </li>
  );
}

export function GrammarPractice({ questions }: { questions: readonly GrammarQuestion[] }) {
  const [round, setRound] = useState(0);
  return (
    <div>
      <ol key={round} className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {questions.map((question, index) => (
          <QuestionCard key={question.id} question={question} index={index} />
        ))}
      </ol>
      <button
        type="button"
        onClick={() => setRound((value) => value + 1)}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background-soft px-3 py-1.5 text-sm font-medium hover:bg-muted focus-ring"
      >
        <RotateCcw className="size-4" aria-hidden /> Start again
      </button>
    </div>
  );
}
