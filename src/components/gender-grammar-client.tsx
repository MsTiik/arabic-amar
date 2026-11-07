"use client";

import { useState } from "react";

import { ArabicText } from "@/components/arabic-text";
import { ChoicePractice } from "@/components/lesson-notes-client";
import type { PracticeQuestion } from "@/data/level-two-lesson-notes";
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

/**
 * Choose-the-word questions, drawn with the same practice cards as
 * the Level 2 lessons: each becomes a choice question whose result is the
 * completed sentence.
 */
export function GrammarPractice({
  questions,
  title = "Choose the right word",
  defaultOpen = false,
}: {
  questions: readonly GrammarQuestion[];
  title?: string;
  defaultOpen?: boolean;
}) {
  const practice: PracticeQuestion[] = questions.map((question) => ({
    id: question.id,
    ask: question.ask,
    stem: question.stem,
    options: question.options,
    answer: question.answer,
    why: question.why,
    result: {
      arabic: question.stem.replace("___", question.answer),
      transliteration: question.transliteration,
      english: question.english,
    },
  }));
  return (
    <ChoicePractice
      questions={practice}
      title={title}
      meta={`${questions.length} questions · verbs, هَذَا / هَذِهِ, مَنْ / مَا`}
      defaultOpen={defaultOpen}
    />
  );
}
