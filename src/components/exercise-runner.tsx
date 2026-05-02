"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { ProgressRing } from "@/components/progress-ring";
import { SpeakerButton } from "@/components/speaker-button";
import { TranslitReveal } from "@/components/translit-reveal";
import { cn } from "@/lib/cn";
import {
  checkFillBlankAnswer,
  checkMatchPairsAnswer,
  checkOrderingAnswer,
} from "@/lib/exercises";
import type { ExerciseDeck, ExerciseQuestion, MatchPair } from "@/lib/types";

interface Props {
  deck: ExerciseDeck;
  onExit: () => void;
  onAttempt: (wordId: string | undefined, correct: boolean) => void;
}

export function ExerciseRunner({ deck, onExit, onAttempt }: Props) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ correct: number; wrong: number }>({
    correct: 0,
    wrong: 0,
  });
  const [done, setDone] = useState(false);

  const question = deck.questions[index];
  const total = deck.questions.length;
  const ratio = total === 0 ? 0 : index / total;

  if (deck.questions.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <p className="text-base text-foreground">
          This deck doesn&apos;t have any questions yet.
        </p>
        <button
          type="button"
          onClick={onExit}
          className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Back to practice
        </button>
      </div>
    );
  }

  if (done) {
    const accuracy =
      total > 0 ? Math.round((results.correct / total) * 100) : 0;
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Session complete
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {deck.title} · {total} cards
        </p>
        <div className="mt-6 flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-semibold tabular-nums">{accuracy}%</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Accuracy
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold tabular-nums text-success">
              {results.correct}
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Correct
            </p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold tabular-nums text-danger">
              {results.wrong}
            </p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Missed
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setResults({ correct: 0, wrong: 0 });
              setDone(false);
            }}
            className="rounded-full border border-border bg-background-soft px-4 py-2 text-sm font-medium hover:bg-muted focus-ring"
          >
            <RotateCcw className="mr-1 inline h-3.5 w-3.5" />
            Run again
          </button>
          <button
            type="button"
            onClick={onExit}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
          >
            Back to practice
          </button>
        </div>
      </div>
    );
  }

  function recordAndAdvance(correct: boolean) {
    onAttempt(question.wordId, correct);
    setResults((r) =>
      correct
        ? { ...r, correct: r.correct + 1 }
        : { ...r, wrong: r.wrong + 1 },
    );
    if (index + 1 >= total) {
      setDone(true);
    } else {
      setIndex(index + 1);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-border bg-background-soft p-2 hover:bg-muted focus-ring"
          aria-label="Exit deck"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{deck.title}</p>
          <p className="text-xs text-muted-foreground">
            Card {index + 1} of {total}
          </p>
        </div>
        <ProgressRing value={ratio} size={48} thickness={6} showLabel={false} />
      </div>

      <QuestionView
        key={question.id}
        question={question}
        onAnswer={recordAndAdvance}
      />
    </div>
  );
}

function QuestionView({
  question,
  onAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  switch (question.kind) {
    case "flashcard":
      return <FlashcardView question={question} onAnswer={onAnswer} />;
    case "fill-blank-translit":
      return <FillBlankView question={question} onAnswer={onAnswer} />;
    case "gender-quiz":
    case "multiple-choice-en-to-ar":
    case "multiple-choice-ar-to-en":
    case "multiple-choice-translit-to-ar":
      return <MultipleChoiceView question={question} onAnswer={onAnswer} />;
    case "ordering":
      return <OrderingView question={question} onAnswer={onAnswer} />;
    case "match-pairs":
      return <MatchPairsView question={question} onAnswer={onAnswer} />;
    case "which-letter":
      return <WhichLetterView question={question} onAnswer={onAnswer} />;
    case "cloze":
      return <ClozeView question={question} onAnswer={onAnswer} />;
  }
}

function FlashcardView({
  question,
  onAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="rounded-3xl border border-border bg-card p-6 text-center sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {flipped ? "English" : "Arabic"}
      </p>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="mt-6 flex min-h-48 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background-soft p-6 hover:bg-muted focus-ring"
      >
        {flipped ? (
          <>
            <p className="text-3xl font-semibold sm:text-4xl">{question.prompt}</p>
            {question.promptHint ? (
              <p className="text-sm italic text-muted-foreground" lang="ar-Latn">
                {question.promptHint}
              </p>
            ) : null}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ArabicText
              variant="display"
              className="text-7xl sm:text-8xl"
            >
              {question.promptArabic}
            </ArabicText>
          </div>
        )}
        <span className="mt-2 text-xs text-muted-foreground">
          Tap to flip
        </span>
      </button>
      {!flipped && question.promptArabic ? (
        <div className="mt-2 flex justify-center">
          <SpeakerButton
            arabic={question.promptArabic}
            label={question.prompt}
            size="sm"
          />
        </div>
      ) : null}
      {!flipped && question.promptHint ? (
        <TranslitReveal text={question.promptHint} className="mt-2" />
      ) : null}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onAnswer(false)}
          className="rounded-full border border-danger bg-danger-soft px-4 py-2 text-sm font-semibold text-foreground hover:opacity-90 focus-ring"
        >
          <X className="mr-1 inline h-4 w-4" />
          Got it wrong
        </button>
        <button
          type="button"
          onClick={() => onAnswer(true)}
          className="rounded-full bg-success px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
        >
          <Check className="mr-1 inline h-4 w-4" />
          Got it right
        </button>
      </div>
    </div>
  );
}

function MultipleChoiceView({
  question,
  onAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const correct = selected === question.correctAnswerId;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="text-center">
        {question.promptArabic ? (
          <>
            <ArabicText variant="display" className="text-6xl sm:text-7xl">
              {question.promptArabic}
            </ArabicText>
            <div className="mt-2 flex justify-center">
              <SpeakerButton
                arabic={question.promptArabic}
                label={question.prompt}
                size="sm"
              />
            </div>
          </>
        ) : null}
        <p className="mt-2 text-base font-medium">{question.prompt}</p>
        {question.promptHint ? (
          question.kind === "multiple-choice-translit-to-ar" ? (
            // For translit→Arabic, the prompt itself is already the
            // transliteration; the hint stores the English meaning, not a
            // pronunciation, so use English-appropriate label and lang.
            <TranslitReveal
              text={question.promptHint}
              hiddenLabel="Show meaning"
              lang=""
            />
          ) : (
            <TranslitReveal text={question.promptHint} />
          )
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {question.options?.map((opt) => {
          const isCorrect = opt.id === question.correctAnswerId;
          const isSelected = opt.id === selected;
          let style = "border-border bg-background-soft hover:bg-muted";
          if (selected) {
            if (isCorrect) style = "border-success bg-success-soft";
            else if (isSelected) style = "border-danger bg-danger-soft";
            else style = "border-border bg-background-soft opacity-60";
          }
          return (
            <div key={opt.id} className="flex flex-col gap-1">
              <button
                type="button"
                disabled={selected !== null}
                onClick={() => setSelected(opt.id)}
                className={cn(
                  "rounded-2xl border p-4 text-center transition-colors focus-ring",
                  style,
                )}
              >
                {opt.isArabic ? (
                  <ArabicText variant="display" className="text-3xl sm:text-4xl">
                    {opt.text}
                  </ArabicText>
                ) : (
                  <span className="text-base font-semibold">{opt.text}</span>
                )}
              </button>
              {opt.isArabic && opt.translit ? (
                <TranslitReveal text={opt.translit} variant="inline" />
              ) : null}
            </div>
          );
        })}
      </div>

      {selected ? (
        <div className="mt-6 flex items-center justify-between gap-3">
          <p
            className={cn(
              "text-sm font-medium",
              correct ? "text-success" : "text-danger",
            )}
          >
            {correct ? "Correct!" : "Not quite — keep going."}
          </p>
          <button
            type="button"
            onClick={() => onAnswer(correct)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}

function FillBlankView({
  question,
  onAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState<null | boolean>(null);

  function submit() {
    const ok = checkFillBlankAnswer(value, question.acceptableAnswers ?? []);
    setSubmitted(ok);
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="text-center">
        <ArabicText variant="display" className="text-6xl sm:text-7xl">
          {question.promptArabic}
        </ArabicText>
        <p className="mt-2 text-base font-medium">{question.prompt}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (submitted === null) submit();
          else onAnswer(submitted);
        }}
        className="mt-6"
      >
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={submitted !== null}
          placeholder="Type the transliteration"
          aria-label="Transliteration"
          className="w-full rounded-full border border-border bg-background-soft px-4 py-3 text-center text-base outline-none focus-ring disabled:opacity-60"
          lang="ar-Latn"
        />

        {submitted === null ? (
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
          >
            Submit
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <p
              className={cn(
                "text-center text-sm font-medium",
                submitted ? "text-success" : "text-danger",
              )}
            >
              {submitted
                ? "Correct!"
                : `Answer: ${question.acceptableAnswers?.[0] ?? ""}`}
            </p>
            <button
              type="submit"
              className="w-full rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
            >
              Next →
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function OrderingView({
  question,
  onAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const original = useMemo(
    () => question.options?.map((o) => o.id) ?? [],
    [question.options],
  );
  const [order, setOrder] = useState<string[]>(original);
  const [submitted, setSubmitted] = useState<null | boolean>(null);

  function move(id: string, delta: number) {
    const i = order.indexOf(id);
    if (i < 0) return;
    const j = i + delta;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  }

  function submit() {
    const ok = checkOrderingAnswer(order, question.correctOrder ?? []);
    setSubmitted(ok);
  }

  const optionMap = new Map(question.options?.map((o) => [o.id, o]));

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <p className="text-base font-medium">{question.prompt}</p>
      <ul className="mt-4 space-y-2">
        {order.map((id, i) => {
          const opt = optionMap.get(id)!;
          return (
            <li
              key={id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background-soft px-3 py-2"
            >
              <span className="w-6 text-right text-xs tabular-nums text-muted-foreground">
                {i + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <ArabicText variant="display" className="text-3xl">
                  {opt.text}
                </ArabicText>
                {opt.translit ? (
                  <TranslitReveal
                    text={opt.translit}
                    variant="inline"
                    className="mt-0.5 text-left"
                  />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => move(id, -1)}
                disabled={i === 0 || submitted !== null}
                className="rounded-md border border-border bg-background-soft px-2 py-1 text-xs hover:bg-muted disabled:opacity-40 focus-ring"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(id, 1)}
                disabled={i === order.length - 1 || submitted !== null}
                className="rounded-md border border-border bg-background-soft px-2 py-1 text-xs hover:bg-muted disabled:opacity-40 focus-ring"
                aria-label="Move down"
              >
                ↓
              </button>
            </li>
          );
        })}
      </ul>

      {submitted === null ? (
        <button
          type="button"
          onClick={submit}
          className="mt-4 w-full rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
        >
          Check
        </button>
      ) : (
        <div className="mt-4 space-y-3">
          <p
            className={cn(
              "text-center text-sm font-medium",
              submitted ? "text-success" : "text-danger",
            )}
          >
            {submitted ? "Correct!" : "Not quite — order is off."}
          </p>
          <button
            type="button"
            onClick={() => onAnswer(submitted)}
            className="w-full rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Tap one Arabic card, then tap an English card to pair them. Wrong matches
 * flash red and the user keeps trying; the question is "correct" only if
 * every pair was matched without an error.
 */
function MatchPairsView({
  question,
  onAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const pairs = useMemo(() => question.pairs ?? [], [question.pairs]);

  // Independently shuffle each side so the matching isn't order-trivial.
  const leftItems = useMemo(
    () => deterministicShuffle(pairs, question.id, "L"),
    [pairs, question.id],
  );
  const rightItems = useMemo(
    () => deterministicShuffle(pairs, question.id, "R"),
    [pairs, question.id],
  );

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [wrongPulse, setWrongPulse] = useState<{
    left?: string;
    right?: string;
  }>({});
  const [errorCount, setErrorCount] = useState(0);

  function tryResolve(leftId: string, rightId: string) {
    if (leftId === rightId) {
      // Correct pairing.
      setMatched((m) => ({ ...m, [leftId]: rightId }));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      setWrongPulse({ left: leftId, right: rightId });
      setErrorCount((c) => c + 1);
      setTimeout(() => {
        setWrongPulse({});
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  }

  function selectLeft(id: string) {
    if (matched[id] || wrongPulse.left || wrongPulse.right) return;
    if (selectedLeft === id) {
      setSelectedLeft(null);
      return;
    }
    setSelectedLeft(id);
    if (selectedRight) tryResolve(id, selectedRight);
  }

  function selectRight(id: string) {
    if (Object.values(matched).includes(id) || wrongPulse.left || wrongPulse.right)
      return;
    if (selectedRight === id) {
      setSelectedRight(null);
      return;
    }
    setSelectedRight(id);
    if (selectedLeft) tryResolve(selectedLeft, id);
  }

  const allMatched = Object.keys(matched).length === pairs.length;
  const noErrors = errorCount === 0;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <p className="text-base font-medium text-center">{question.prompt}</p>
      <p className="mt-1 text-center text-xs text-muted-foreground">
        Tap one from each column.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <ul className="space-y-2">
          {leftItems.map((p) => (
            <MatchCard
              key={p.id + "L"}
              pair={p}
              side="left"
              selected={selectedLeft === p.id}
              matched={!!matched[p.id]}
              wrong={wrongPulse.left === p.id}
              onClick={() => selectLeft(p.id)}
            />
          ))}
        </ul>
        <ul className="space-y-2">
          {rightItems.map((p) => (
            <MatchCard
              key={p.id + "R"}
              pair={p}
              side="right"
              selected={selectedRight === p.id}
              matched={Object.values(matched).includes(p.id)}
              wrong={wrongPulse.right === p.id}
              onClick={() => selectRight(p.id)}
            />
          ))}
        </ul>
      </div>

      {allMatched ? (
        <div className="mt-6 flex items-center justify-between gap-3">
          <p
            className={cn(
              "text-sm font-medium",
              noErrors ? "text-success" : "text-foreground-soft",
            )}
          >
            {noErrors
              ? "All matched on the first try."
              : `All matched — ${errorCount} miss${errorCount === 1 ? "" : "es"}.`}
          </p>
          <button
            type="button"
            onClick={() =>
              onAnswer(checkMatchPairsAnswer(matched, pairs) && noErrors)
            }
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MatchCard({
  pair,
  side,
  selected,
  matched,
  wrong,
  onClick,
}: {
  pair: MatchPair;
  side: "left" | "right";
  selected: boolean;
  matched: boolean;
  wrong: boolean;
  onClick: () => void;
}) {
  const isArabic = side === "left" ? pair.leftIsArabic : pair.rightIsArabic;
  const text = side === "left" ? pair.leftText : pair.rightText;
  const translit = side === "left" ? pair.leftTranslit : pair.rightTranslit;
  let style = "border-border bg-background-soft hover:bg-muted";
  if (matched) style = "border-success bg-success-soft opacity-80";
  else if (wrong) style = "border-danger bg-danger-soft animate-pulse";
  else if (selected) style = "border-primary bg-primary/5";
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        disabled={matched}
        className={cn(
          "w-full rounded-2xl border p-3 text-center transition-colors focus-ring",
          style,
        )}
      >
        {isArabic ? (
          <ArabicText variant="display" className="text-2xl sm:text-3xl">
            {text}
          </ArabicText>
        ) : (
          <span className="text-sm font-medium">{text}</span>
        )}
        {translit ? (
          <p className="mt-1 text-[10px] italic text-muted-foreground" lang="ar-Latn">
            {translit}
          </p>
        ) : null}
      </button>
    </li>
  );
}

/** Pure UI version of MultipleChoiceView, but the prompt is a large isolated
 *  Arabic glyph (no English meaning), and the four options are letter names.
 */
function WhichLetterView({
  question,
  onAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const correct = selected === question.correctAnswerId;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="text-center">
        <ArabicText
          variant="display"
          className="text-7xl sm:text-8xl text-foreground"
        >
          {question.promptArabic}
        </ArabicText>
        <p className="mt-4 text-base font-medium">{question.prompt}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {question.options?.map((opt) => {
          const isCorrect = opt.id === question.correctAnswerId;
          const isSelected = opt.id === selected;
          let style = "border-border bg-background-soft hover:bg-muted";
          if (selected) {
            if (isCorrect) style = "border-success bg-success-soft";
            else if (isSelected) style = "border-danger bg-danger-soft";
            else style = "border-border bg-background-soft opacity-60";
          }
          return (
            <button
              key={opt.id}
              type="button"
              disabled={selected !== null}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "rounded-2xl border p-4 text-center transition-colors focus-ring",
                style,
              )}
            >
              <span className="text-base font-semibold" lang="ar-Latn">
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="mt-6 flex items-center justify-between gap-3">
          <p
            className={cn(
              "text-sm font-medium",
              correct ? "text-success" : "text-danger",
            )}
          >
            {correct ? "Correct!" : "Not quite — keep going."}
          </p>
          <button
            type="button"
            onClick={() => onAnswer(correct)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Cloze: the prompt is an English sentence; the Arabic phrase is rendered
 * with the missing word replaced by a blank (rendered as ____ until the
 * user picks an option, at which point the blank is filled in).
 */
function ClozeView({
  question,
  onAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const correctOption = question.options?.find(
    (o) => o.id === question.correctAnswerId,
  );
  const correct = selected === question.correctAnswerId;

  // While unanswered, show the blank as ____. After answering, fill in with
  // either the user's wrong choice (so they see the mistake) or the right one.
  const fill =
    selected === null
      ? "____"
      : (question.options?.find((o) => o.id === selected)?.text ?? "____");
  const before = question.clozeBefore ?? "";
  const after = question.clozeAfter ?? "";

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="text-center">
        <p className="text-sm font-medium text-foreground-soft">
          {question.prompt}
        </p>
        <div className="mt-4">
          <ArabicText variant="display" className="text-4xl sm:text-5xl" dir="rtl">
            {before}
            {before ? " " : ""}
            <span
              className={cn(
                "rounded-md px-2",
                selected === null
                  ? "bg-muted text-foreground-soft"
                  : correct
                    ? "bg-success-soft text-success"
                    : "bg-danger-soft text-danger",
              )}
            >
              {fill}
            </span>
            {after ? " " : ""}
            {after}
          </ArabicText>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {question.options?.map((opt) => {
          const isCorrect = opt.id === question.correctAnswerId;
          const isSelected = opt.id === selected;
          let style = "border-border bg-background-soft hover:bg-muted";
          if (selected) {
            if (isCorrect) style = "border-success bg-success-soft";
            else if (isSelected) style = "border-danger bg-danger-soft";
            else style = "border-border bg-background-soft opacity-60";
          }
          return (
            <button
              key={opt.id}
              type="button"
              disabled={selected !== null}
              onClick={() => setSelected(opt.id)}
              className={cn(
                "rounded-2xl border p-3 text-center transition-colors focus-ring",
                style,
              )}
            >
              <ArabicText variant="display" className="text-2xl">
                {opt.text}
              </ArabicText>
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="mt-6 flex items-center justify-between gap-3">
          <p
            className={cn(
              "text-sm font-medium",
              correct ? "text-success" : "text-danger",
            )}
          >
            {correct
              ? "Correct!"
              : `Answer: ${correctOption?.text ?? ""}`}
          </p>
          <button
            type="button"
            onClick={() => onAnswer(correct)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Tiny LCG used to deterministically shuffle a slice without pulling in a
 *  dependency. The string `salt` parameter mixes into the seed so the same
 *  array can be shuffled differently in two places (e.g. left vs right
 *  columns of a matching exercise). */
function deterministicShuffle<T>(arr: T[], baseSeed: string, salt: string): T[] {
  const a = [...arr];
  let s = 0;
  for (let i = 0; i < baseSeed.length; i++) s = (s * 31 + baseSeed.charCodeAt(i)) | 0;
  for (let i = 0; i < salt.length; i++) s = (s * 31 + salt.charCodeAt(i)) | 0;
  s = (s % 233280) || 1;
  if (s < 0) s += 233280;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
