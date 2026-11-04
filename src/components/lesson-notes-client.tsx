"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, PenLine, RotateCcw, Ruler, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import type { NoteDialogueLine, NoteItem, PracticeQuestion, PracticeVisual } from "@/data/level-two-lesson-notes";
import { cn } from "@/lib/cn";
import { ARABIC_RUN } from "@/lib/inline-arabic";

/* ---------- Shared bits ---------- */

const PILL = "inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-arabic text-xl focus-ring";

function pillState(answered: boolean, isAnswer: boolean, isPicked: boolean) {
  return cn(
    !answered && "border-hairline bg-background-soft hover:bg-muted",
    answered && isAnswer && "border-success bg-success-soft text-success",
    answered && isPicked && !isAnswer && "border-danger bg-danger-soft text-danger",
    answered && !isPicked && !isAnswer && "border-hairline opacity-60",
  );
}

function Feedback({ correct, why }: { correct: boolean; why: string }) {
  return (
    <p className={cn("text-sm font-medium", correct ? "text-success" : "text-danger")}>
      {correct ? "Correct. " : "Not quite. "}
      {inlineArabic(why)}
    </p>
  );
}

/** English with inline Arabic set in the Arabic font (client-side twin of `Prose`). */
function inlineArabic(text: string): React.ReactNode {
  return text.split(ARABIC_RUN).map((part, index) =>
    index % 2 === 1 ? (
      <ArabicText key={index} variant="inline" className="text-[1.15em]">
        {part}
      </ArabicText>
    ) : (
      part
    ),
  );
}

function EnglishToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={shown}
      className="inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring"
    >
      {shown ? <EyeOff className="h-3.5 w-3.5" aria-hidden /> : <Eye className="h-3.5 w-3.5" aria-hidden />}
      {shown ? "Hide English" : "Show English"}
    </button>
  );
}

/* ---------- Choose the missing line ---------- */

/** A numbered dialogue where each missing line is chosen from a few options. */
export function GapDialogue({ lines }: { lines: readonly NoteDialogueLine[] }) {
  const gaps = lines.flatMap((line, index) => (line.gap ? [index] : []));
  const [picks, setPicks] = useState<Readonly<Record<number, string>>>({});
  const [english, setEnglish] = useState(false);
  const answered = gaps.filter((index) => picks[index] !== undefined);
  const right = answered.filter((index) => picks[index] === lines[index].arabic).length;

  return (
    <div className="surface p-3 sm:p-5">
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-hairline pb-2 text-sm" aria-live="polite">
        <span className="font-semibold tabular-nums">
          {right} / {gaps.length} correct
        </span>
        {answered.length < gaps.length ? (
          <span className="text-xs text-muted-foreground">{gaps.length - answered.length} still to choose</span>
        ) : null}
        <span className="ml-auto flex items-center gap-3">
          <EnglishToggle shown={english} onToggle={() => setEnglish((value) => !value)} />
          {answered.length ? (
            <button
              type="button"
              onClick={() => setPicks({})}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Start again
            </button>
          ) : null}
        </span>
      </div>
      <ol className="divide-y divide-hairline">
        {lines.map((line, index) => {
          const picked = picks[index];
          const open = !line.gap || picked !== undefined;
          return (
            <li key={index} className="flex items-start gap-3 py-2.5">
              <span
                className={cn(
                  "mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                  line.gap ? "bg-accent-amber-soft text-accent-amber" : "bg-primary-soft text-primary",
                )}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                {line.gap ? (
                  <div className="space-y-2">
                    {!open ? <p className="text-xs font-semibold text-accent-amber">Which line goes here?</p> : null}
                    <div className="flex flex-wrap gap-2" dir="rtl">
                      {(line.options ?? []).map((option) => {
                        const isAnswer = option === line.arabic;
                        const isPicked = option === picked;
                        return (
                          <button
                            key={option}
                            type="button"
                            lang="ar"
                            disabled={open}
                            onClick={() => setPicks((current) => ({ ...current, [index]: option }))}
                            className={cn(PILL, "text-lg", pillState(open, isAnswer, isPicked))}
                          >
                            {option}
                            {open && isAnswer ? <Check className="size-4" aria-hidden /> : null}
                            {open && isPicked && !isAnswer ? <X className="size-4" aria-hidden /> : null}
                          </button>
                        );
                      })}
                    </div>
                    {open ? (
                      <div className="space-y-0.5" aria-live="polite">
                        <Feedback correct={picked === line.arabic} why={line.why ?? ""} />
                        <p lang="ar-Latn" className="text-sm italic text-foreground-soft">{line.transliteration}</p>
                        <p className="text-sm text-muted-foreground">{line.english}</p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <>
                    <ArabicText className="text-xl leading-loose text-foreground sm:text-2xl">{line.arabic}</ArabicText>
                    {english ? (
                      <>
                        <p lang="ar-Latn" className="text-sm italic text-foreground-soft">{line.transliteration}</p>
                        <p className="text-sm text-muted-foreground">{line.english}</p>
                      </>
                    ) : null}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Pictures ---------- */

function PositionPicture({ position }: { position: Extract<PracticeVisual, { kind: "position" }>["position"] }) {
  const box = (x: number) => (
    <rect key={x} x={x} y={46} width={44} height={36} rx={3} className="fill-accent-amber-soft stroke-accent-amber" strokeWidth={2} />
  );
  const ball = (cx: number, cy: number, r = 11) => (
    <circle key="ball" cx={cx} cy={cy} r={r} className="fill-accent-sky stroke-accent-sky" strokeWidth={2} />
  );
  const floor = <line x1={8} y1={96} x2={152} y2={96} className="stroke-muted-foreground/40" strokeWidth={1.5} />;
  let content: React.ReactNode;
  switch (position) {
    case "above":
      content = [box(58), ball(80, 33)];
      break;
    case "under":
      // A table: the ball sits on the floor beneath it.
      content = [
        <rect key="top" x={46} y={40} width={68} height={6} rx={2} className="fill-accent-amber-soft stroke-accent-amber" strokeWidth={2} />,
        <line key="l1" x1={52} y1={46} x2={52} y2={96} className="stroke-accent-amber" strokeWidth={3} />,
        <line key="l2" x1={108} y1={46} x2={108} y2={96} className="stroke-accent-amber" strokeWidth={3} />,
        ball(80, 85),
      ];
      break;
    case "in":
      // An open box with the ball showing inside.
      content = [
        <path key="b" d="M58 46 V82 H102 V46" className="fill-accent-amber-soft stroke-accent-amber" strokeWidth={2} />,
        ball(80, 66, 10),
        <path key="front" d="M58 70 H102 V82 H58 Z" className="fill-accent-amber-soft stroke-accent-amber" strokeWidth={2} />,
      ];
      break;
    case "front":
      // The ball is drawn over the box, low and larger, so it is nearer to us.
      content = [box(58), ball(80, 80, 14)];
      break;
    case "behind":
      // The box is drawn over a larger ball set back and to one side, so only
      // part of the ball shows: it is hidden behind the box, not sitting on it.
      content = [ball(100, 58, 17), box(58)];
      break;
    case "between":
      content = [box(14), box(102), ball(80, 71)];
      break;
  }
  return (
    <svg viewBox="0 0 160 100" className="h-24 w-36 shrink-0" role="img" aria-label="Where is the ball?">
      {floor}
      {content}
    </svg>
  );
}

function CountPicture({ object, count }: Extract<PracticeVisual, { kind: "count" }>) {
  const Icon = object === "pen" ? PenLine : Ruler;
  return (
    <div className="flex h-24 w-36 shrink-0 flex-wrap content-center items-center justify-center gap-2" role="img" aria-label={`${count} ${object}${count > 1 ? "s" : ""}`}>
      {Array.from({ length: count }, (_, index) => (
        <Icon key={index} className={cn("h-9 w-9", object === "pen" ? "text-accent-sky" : "text-accent-amber")} strokeWidth={1.75} aria-hidden />
      ))}
    </div>
  );
}

function Picture({ visual }: { visual: PracticeVisual }) {
  return (
    <div className="flex justify-center rounded-[10px] bg-background-soft">
      {visual.kind === "position" ? <PositionPicture position={visual.position} /> : <CountPicture {...visual} />}
    </div>
  );
}

/* ---------- Choose the answer ---------- */

function ChoiceCard({ question, index }: { question: PracticeQuestion; index: number }) {
  const [picked, setPicked] = useState<NoteItem | null>(null);
  const answered = picked !== null;
  const correct = picked?.arabic === question.answer;
  const [before, after] = question.stem?.split("___") ?? [];

  return (
    <li className="tile flex h-full flex-col gap-2 p-3 sm:p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {index + 1}. <span className="normal-case tracking-normal">{inlineArabic(question.ask)}</span>
      </p>
      {question.visual ? <Picture visual={question.visual} /> : null}
      {question.stem !== undefined ? (
        <ArabicText className="text-2xl leading-loose text-foreground">
          {before}
          <span
            className={cn(
              "mx-1 inline-block min-w-16 border-b-2 px-1 text-center",
              answered ? "border-transparent text-primary" : "border-muted-foreground/50",
            )}
          >
            {answered ? question.answer : " "}
          </span>
          {after}
        </ArabicText>
      ) : null}
      <div className="flex flex-wrap gap-2" dir="rtl">
        {question.options.map((option) => {
          const isAnswer = option.arabic === question.answer;
          const isPicked = option.arabic === picked?.arabic;
          return (
            <button
              key={option.arabic}
              type="button"
              lang="ar"
              disabled={answered}
              onClick={() => setPicked(option)}
              className={cn(PILL, pillState(answered, isAnswer, isPicked))}
            >
              {option.arabic}
              {answered && isAnswer ? <Check className="size-4" aria-hidden /> : null}
              {answered && isPicked && !isAnswer ? <X className="size-4" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className="mt-auto space-y-1 border-t border-hairline pt-2 text-sm" aria-live="polite">
          <Feedback correct={correct} why={question.why} />
          {!correct && picked ? (
            <p className="text-muted-foreground">
              You chose <ArabicText variant="inline" className="text-[1.15em]">{picked.arabic}</ArabicText>: {picked.english.replace(/^✗\s*/, "")}
            </p>
          ) : null}
          {question.result ? (
            <div>
              <ArabicText className="text-lg leading-loose text-foreground">{question.result.arabic}</ArabicText>
              <p className="text-muted-foreground">
                <span lang="ar-Latn" className="italic">{question.result.transliteration}</span> · {question.result.english}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {(() => {
                const answer = question.options.find((option) => option.arabic === question.answer);
                return answer ? (
                  <>
                    <span lang="ar-Latn" className="italic">{answer.transliteration}</span> · {answer.english}
                  </>
                ) : null;
              })()}
            </p>
          )}
        </div>
      ) : null}
    </li>
  );
}

/** A set of choose-the-answer questions with a restart button. */
export function ChoicePractice({ questions }: { questions: readonly PracticeQuestion[] }) {
  const [round, setRound] = useState(0);
  return (
    <div>
      <ol key={round} className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {questions.map((question, index) => (
          <ChoiceCard key={question.id} question={question} index={index} />
        ))}
      </ol>
      <button
        type="button"
        onClick={() => setRound((value) => value + 1)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background-soft px-3 py-1.5 text-sm font-medium hover:bg-muted focus-ring"
      >
        <RotateCcw className="size-4" aria-hidden /> Start again
      </button>
    </div>
  );
}
