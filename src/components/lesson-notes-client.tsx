"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, RotateCcw, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { Disclosure } from "@/components/disclosure";
import { SpeakerButton } from "@/components/speaker-button";
import type { NoteDialogueLine, NoteItem, PracticeQuestion, PracticeVisual } from "@/data/level-two-lesson-notes";
import { cn } from "@/lib/cn";
import { ARABIC_RUN } from "@/lib/inline-arabic";

/* ---------- Shared bits ---------- */

const PILL = "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-1.5 font-arabic text-xl transition-colors focus-ring";

function pillState(answered: boolean, isAnswer: boolean, isPicked: boolean) {
  return cn(
    !answered && "border-hairline bg-card hover:border-primary/50 hover:bg-primary-soft",
    answered && isAnswer && "border-success bg-success-soft text-success",
    answered && isPicked && !isAnswer && "border-danger bg-danger-soft text-danger",
    answered && !isPicked && !isAnswer && "border-hairline opacity-50",
  );
}

/** English with inline Arabic set in the Arabic font (client twin of `Prose`). */
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

function Feedback({ correct, why }: { correct: boolean; why: string }) {
  return (
    <p className={cn("text-sm font-medium", correct ? "text-success" : "text-danger")}>
      {correct ? "Correct. " : "Not quite. "}
      {inlineArabic(why)}
    </p>
  );
}

/** A stable shuffle: round 0 keeps the authored order, later rounds reorder. */
function shuffled<T>(items: readonly T[], seed: number): T[] {
  const copy = [...items];
  if (seed === 0) return copy;
  let state = seed * 9301 + 49297;
  for (let index = copy.length - 1; index > 0; index--) {
    state = (state * 9301 + 49297) % 233280;
    const swap = Math.floor((state / 233280) * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function ScoreBar({
  right,
  answered,
  total,
  onRetryMissed,
  onRestart,
  children,
}: {
  right: number;
  answered: number;
  total: number;
  onRetryMissed: () => void;
  onRestart: () => void;
  children?: React.ReactNode;
}) {
  const done = answered === total;
  const missed = answered - right;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[10px] border px-3 py-2 text-sm",
        done && missed === 0 ? "border-success/40 bg-success-soft" : "border-hairline bg-card",
      )}
      aria-live="polite"
    >
      <span className="font-semibold tabular-nums">
        {right} / {total} correct
      </span>
      <span className="text-xs text-muted-foreground">
        {done
          ? missed === 0
            ? "All right. Well done!"
            : `Done. ${missed} to look at again.`
          : `${total - answered} to go`}
      </span>
      <span className="ml-auto flex flex-wrap items-center gap-3">
        {children}
        {done && missed > 0 ? (
          <button type="button" onClick={onRetryMissed} className="inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Retry the {missed} I missed
          </button>
        ) : null}
        {answered > 0 ? (
          <button type="button" onClick={onRestart} className="inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Start again
          </button>
        ) : null}
      </span>
    </div>
  );
}

/* ---------- Dialogue as a conversation ---------- */

/**
 * A model dialogue drawn as chat bubbles: the first speaker on the right (as
 * an Arabic conversation reads), the other on the left. Lines without a
 * speaker alternate. The translation can be hidden to read the Arabic alone.
 */
export function ChatDialogue({
  lines,
  numbered = false,
}: {
  lines: readonly NoteDialogueLine[];
  numbered?: boolean;
}) {
  const [english, setEnglish] = useState(true);
  const firstSpeaker = lines.find((line) => line.speaker)?.speaker;
  return (
    <div className="rounded-[14px] border border-hairline bg-background-soft/50 p-2.5 sm:p-3">
      <div className="mb-1.5 flex justify-end">
        <button
          type="button"
          onClick={() => setEnglish((value) => !value)}
          aria-pressed={!english}
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-primary hover:bg-primary-soft focus-ring"
        >
          {english ? <EyeOff className="h-3.5 w-3.5" aria-hidden /> : <Eye className="h-3.5 w-3.5" aria-hidden />}
          {english ? "Hide translation" : "Show translation"}
        </button>
      </div>
      <ol className="space-y-1.5">
        {lines.map((line, index) => {
          const right = line.speaker ? line.speaker === firstSpeaker : index % 2 === 0;
          return (
            <li key={index} className={cn("flex", right ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "min-w-0 max-w-[92%] rounded-2xl px-3 py-1.5 shadow-[var(--shadow-sm)] sm:max-w-[78%]",
                  right
                    ? "rounded-tr-md bg-primary-soft"
                    : "rounded-tl-md border border-hairline bg-card",
                )}
              >
                {line.speaker || numbered ? (
                  <p className={cn("flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground", right && "justify-end")}>
                    {numbered ? <span className="tabular-nums text-primary">{index + 1}</span> : null}
                    {line.speaker}
                  </p>
                ) : null}
                <div className="flex items-start gap-2">
                  <SpeakerButton arabic={line.arabic} label={line.english} size="sm" className="mt-1.5 shrink-0" />
                  <ArabicText className="min-w-0 flex-1 text-xl leading-relaxed text-foreground sm:text-[1.4rem]">
                    {line.arabic}
                  </ArabicText>
                </div>
                {english ? (
                  <p className={cn("text-xs leading-snug text-muted-foreground sm:text-[13px]", right && "text-right")}>
                    <span lang="ar-Latn" className="italic text-foreground-soft">{line.transliteration}</span> · {line.english}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------- Choose the missing line ---------- */

/** A numbered dialogue where each missing line is chosen from a few options. */
export function GapDialogue({ lines, title }: { lines: readonly NoteDialogueLine[]; title?: string }) {
  const gaps = lines.flatMap((line, index) => (line.gap ? [index] : []));
  const [picks, setPicks] = useState<Readonly<Record<number, string>>>({});
  const [round, setRound] = useState(0);
  const [english, setEnglish] = useState(false);
  const answered = gaps.filter((index) => picks[index] !== undefined);
  const right = answered.filter((index) => picks[index] === lines[index].arabic).length;

  return (
    <Disclosure
      title={inlineArabic(title ?? "Complete the dialogue")}
      meta={`${lines.length} lines · ${gaps.length} to choose`}
      status={answered.length ? `${right} / ${gaps.length} correct` : undefined}
      bodyClassName="space-y-2 bg-background-soft/40"
    >
      <ScoreBar
        right={right}
        answered={answered.length}
        total={gaps.length}
        onRetryMissed={() => {
          setPicks((current) =>
            Object.fromEntries(Object.entries(current).filter(([index, pick]) => pick === lines[Number(index)].arabic)),
          );
          setRound((value) => value + 1);
        }}
        onRestart={() => {
          setPicks({});
          setRound((value) => value + 1);
        }}
      >
        <button
          type="button"
          onClick={() => setEnglish((value) => !value)}
          aria-pressed={english}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring"
        >
          {english ? <EyeOff className="h-3.5 w-3.5" aria-hidden /> : <Eye className="h-3.5 w-3.5" aria-hidden />}
          {english ? "Hide English" : "Show English"}
        </button>
      </ScoreBar>
      <ol className="divide-y divide-hairline rounded-[12px] border border-hairline bg-card px-3 sm:px-4">
        {lines.map((line, index) => {
          const picked = picks[index];
          const open = !line.gap || picked !== undefined;
          return (
            <li key={index} className="flex items-start gap-3 py-2">
              <span
                className={cn(
                  "mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                  line.gap ? "bg-accent-amber-soft text-accent-amber" : "bg-primary-soft text-primary",
                )}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                {line.gap && !open ? (
                  <div className="space-y-2 rounded-[10px] border border-dashed border-accent-amber/50 bg-accent-amber-soft/30 p-2.5">
                    <p className="text-xs font-semibold text-accent-amber">Which line goes here?</p>
                    <div className="flex flex-wrap gap-2" dir="rtl">
                      {shuffled(line.options ?? [], round + index).map((option) => (
                        <button
                          key={option}
                          type="button"
                          lang="ar"
                          onClick={() => setPicks((current) => ({ ...current, [index]: option }))}
                          className={cn(PILL, "text-lg", pillState(false, false, false))}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <ArabicText className="min-w-0 flex-1 text-xl leading-relaxed text-foreground sm:text-2xl">{line.arabic}</ArabicText>
                      <SpeakerButton arabic={line.arabic} label={line.english} size="sm" className="mt-1.5" />
                    </div>
                    {line.gap && picked !== undefined ? (
                      <div className="mt-1 space-y-1">
                        {picked !== line.arabic ? (
                          <p className="text-sm text-muted-foreground">
                            You chose <ArabicText variant="inline" className="text-[1.15em] text-danger line-through">{picked}</ArabicText>
                          </p>
                        ) : null}
                        <Feedback correct={picked === line.arabic} why={line.why ?? ""} />
                      </div>
                    ) : null}
                    {english || (line.gap && picked !== undefined) ? (
                      <p className="text-sm leading-snug text-muted-foreground">
                        <span lang="ar-Latn" className="italic text-foreground-soft">{line.transliteration}</span> · {line.english}
                      </p>
                    ) : null}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </Disclosure>
  );
}

/* ---------- Pictures ----------
 * Every picture shares one 200×120 scene: a floor line at y=100 with a soft
 * ground band below it, wooden boxes and tables in amber, the ball in sky
 * blue, the same 2.5px outline everywhere and a soft shadow under whatever
 * stands on the floor. Things nearer to us sit lower on the ground band.
 */

const OUTLINE = { strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const WOOD = "fill-accent-amber-soft stroke-accent-amber";
const FLOOR_Y = 100;

function Ground() {
  return (
    <>
      <rect x={0} y={FLOOR_Y} width={200} height={20} className="fill-muted-foreground/[0.07]" />
      <line x1={8} y1={FLOOR_Y} x2={192} y2={FLOOR_Y} className="stroke-muted-foreground/30" strokeWidth={1.5} />
    </>
  );
}

function Shadow({ cx, y = FLOOR_Y, rx }: { cx: number; y?: number; rx: number }) {
  return <ellipse cx={cx} cy={y} rx={rx} ry={3.5} className="fill-muted-foreground/20" />;
}

function Box({ x, bottom = FLOOR_Y, w = 52, h = 40 }: { x: number; bottom?: number; w?: number; h?: number }) {
  const y = bottom - h;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} className={WOOD} {...OUTLINE} />
      <line x1={x} y1={y + 9} x2={x + w} y2={y + 9} className="stroke-accent-amber" {...OUTLINE} />
      <line x1={x + w / 2} y1={y + 9} x2={x + w / 2} y2={bottom} className="stroke-accent-amber/50" strokeWidth={1.5} />
    </g>
  );
}

function Ball({ cx, cy, r = 13 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} className="fill-accent-sky stroke-accent-sky" {...OUTLINE} />
      <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.28} className="fill-white/60" />
    </g>
  );
}

function PositionScene({ position }: { position: Extract<PracticeVisual, { kind: "position" }>["position"] }) {
  switch (position) {
    case "above":
      return (
        <>
          <Shadow cx={100} rx={30} />
          <Box x={74} />
          <Ball cx={100} cy={FLOOR_Y - 40 - 13} />
        </>
      );
    case "under":
      return (
        <>
          <Shadow cx={100} rx={50} />
          <rect x={52} y={48} width={96} height={8} rx={3} className={WOOD} {...OUTLINE} />
          <line x1={60} y1={56} x2={60} y2={FLOOR_Y} className="stroke-accent-amber" strokeWidth={5} strokeLinecap="round" />
          <line x1={140} y1={56} x2={140} y2={FLOOR_Y} className="stroke-accent-amber" strokeWidth={5} strokeLinecap="round" />
          <Ball cx={100} cy={FLOOR_Y - 13} />
        </>
      );
    case "in":
      // An open box seen from the front: dark inside, the ball sitting in it,
      // and the front wall covering the ball's lower half.
      return (
        <>
          <Shadow cx={100} rx={30} />
          <rect x={70} y={56} width={60} height={44} rx={4} className="fill-accent-amber/35 stroke-accent-amber" {...OUTLINE} />
          <Ball cx={100} cy={73} />
          <rect x={70} y={80} width={60} height={20} rx={4} className={WOOD} {...OUTLINE} />
        </>
      );
    case "front":
      // Nearer to us: lower on the ground band, drawn over the box.
      return (
        <>
          <Shadow cx={100} rx={30} />
          <Box x={74} />
          <Shadow cx={108} y={113} rx={16} />
          <Ball cx={108} cy={98} r={15} />
        </>
      );
    case "behind":
      // Further away: higher up and partly hidden by the box.
      return (
        <>
          <Shadow cx={116} y={FLOOR_Y - 4} rx={12} />
          <Ball cx={116} cy={FLOOR_Y - 18} r={13} />
          <Shadow cx={96} rx={30} />
          <Box x={70} />
        </>
      );
    case "between":
      return (
        <>
          <Shadow cx={50} rx={26} />
          <Shadow cx={150} rx={26} />
          <Shadow cx={100} rx={12} />
          <Box x={26} w={46} h={36} />
          <Box x={128} w={46} h={36} />
          <Ball cx={100} cy={FLOOR_Y - 13} />
        </>
      );
  }
}

function Pen({ x }: { x: number }) {
  // An upright pen: cap, body and nib, standing on the floor.
  return (
    <g>
      <Shadow cx={x} rx={9} />
      <rect x={x - 6} y={34} width={12} height={52} rx={3} className="fill-accent-sky-soft stroke-accent-sky" {...OUTLINE} />
      <rect x={x - 6} y={34} width={12} height={14} rx={3} className="fill-accent-sky stroke-accent-sky" {...OUTLINE} />
      <path d={`M${x - 6} 86 L${x} ${FLOOR_Y - 1} L${x + 6} 86 Z`} className="fill-card stroke-accent-sky" {...OUTLINE} />
    </g>
  );
}

function RulerPicture({ x }: { x: number }) {
  // An upright ruler with a mark every 8px, about the pen's height.
  const ticks = Array.from({ length: 7 }, (_, index) => 38 + index * 8);
  return (
    <g>
      <Shadow cx={x} rx={11} />
      <rect x={x - 8} y={30} width={16} height={70} rx={2.5} className={WOOD} {...OUTLINE} />
      {ticks.map((y, index) => (
        <line key={y} x1={x - 8} y1={y} x2={x - 8 + (index % 2 === 0 ? 8 : 5)} y2={y} className="stroke-accent-amber" strokeWidth={1.75} strokeLinecap="round" />
      ))}
    </g>
  );
}

function CountScene({ object, count }: Extract<PracticeVisual, { kind: "count" }>) {
  const gap = 34;
  const start = 100 - ((count - 1) * gap) / 2;
  return (
    <>
      {Array.from({ length: count }, (_, index) =>
        object === "pen" ? <Pen key={index} x={start + index * gap} /> : <RulerPicture key={index} x={start + index * gap} />,
      )}
    </>
  );
}

function Picture({ visual }: { visual: PracticeVisual }) {
  const label = visual.kind === "count" ? `A picture of ${visual.count} ${visual.object}${visual.count > 1 ? "s" : ""}` : "Where is the ball?";
  return (
    <figure className="mx-auto w-full max-w-[13rem] overflow-hidden rounded-[12px] border border-hairline bg-background-soft">
      <svg viewBox="0 0 200 120" className="block h-auto w-full" role="img" aria-label={label}>
        <Ground />
        {visual.kind === "position" ? <PositionScene position={visual.position} /> : <CountScene {...visual} />}
      </svg>
    </figure>
  );
}

/* ---------- Choose the answer ---------- */

function ChoiceCard({
  question,
  number,
  picked,
  round,
  onPick,
}: {
  question: PracticeQuestion;
  number: number;
  picked: NoteItem | undefined;
  round: number;
  onPick: (option: NoteItem) => void;
}) {
  const answered = picked !== undefined;
  const correct = picked?.arabic === question.answer;
  const [before, after] = question.stem?.split("___") ?? [];
  const answer = question.options.find((option) => option.arabic === question.answer);
  const shown = question.result ?? answer;

  return (
    <li
      className={cn(
        "flex h-full flex-col gap-2.5 rounded-[12px] border bg-card p-3 shadow-[var(--shadow-sm)]",
        !answered && "border-hairline-strong",
        answered && correct && "border-success/50",
        answered && !correct && "border-danger/50",
      )}
    >
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs tabular-nums",
            !answered && "bg-primary-soft text-primary",
            answered && correct && "bg-success text-white",
            answered && !correct && "bg-danger text-white",
          )}
        >
          {answered ? (correct ? <Check className="h-3.5 w-3.5" aria-label="Right" /> : <X className="h-3.5 w-3.5" aria-label="Wrong" />) : number}
        </span>
        <span className="min-w-0">{inlineArabic(question.ask)}</span>
      </p>
      {question.visual ? <Picture visual={question.visual} /> : null}
      {question.stem !== undefined ? (
        <ArabicText className="text-center text-2xl leading-relaxed text-foreground">
          {before}
          <span
            className={cn(
              "mx-1 inline-block min-w-16 border-b-2 px-1 text-center",
              answered ? (correct ? "border-success text-success" : "border-danger text-danger") : "border-muted-foreground/50",
            )}
          >
            {answered ? picked.arabic : " "}
          </span>
          {after}
        </ArabicText>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2" dir="rtl">
        {shuffled(question.options, round).map((option) => {
          const isAnswer = option.arabic === question.answer;
          const isPicked = option.arabic === picked?.arabic;
          return (
            <button
              key={option.arabic}
              type="button"
              lang="ar"
              disabled={answered}
              onClick={() => onPick(option)}
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
        <div className="mt-auto space-y-1.5 border-t border-hairline pt-2 text-sm leading-snug" aria-live="polite">
          <Feedback correct={correct} why={question.why} />
          {!correct ? (
            <p className="text-muted-foreground">
              <ArabicText variant="inline" className="text-[1.15em]">{picked.arabic}</ArabicText>: {picked.english.replace(/^✗\s*/, "")}
            </p>
          ) : null}
          {shown ? (
            <div className="flex items-start gap-2 rounded-[8px] bg-background-soft px-2.5 py-1.5">
              <div className="min-w-0 flex-1">
                <ArabicText className="text-lg leading-relaxed text-foreground">{shown.arabic}</ArabicText>
                <p className="text-muted-foreground">
                  <span lang="ar-Latn" className="italic">{shown.transliteration}</span> · {shown.english}
                </p>
              </div>
              <SpeakerButton arabic={shown.arabic} label={shown.english} size="sm" className="mt-1.5" />
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

/** A set of choose-the-answer questions with a running score. */
export function ChoicePractice({
  questions,
  title,
  intro,
}: {
  questions: readonly PracticeQuestion[];
  title?: string;
  intro?: string;
}) {
  const [picks, setPicks] = useState<Readonly<Record<string, NoteItem>>>({});
  const [round, setRound] = useState(0);
  const answered = questions.filter((question) => picks[question.id]);
  const right = answered.filter((question) => picks[question.id].arabic === question.answer).length;
  // Three across when every question is short; long sentences need two.
  const longest = Math.max(0, ...questions.map((question) => (question.stem ?? "").length));
  const columns = longest > 34 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <Disclosure
      title={inlineArabic(title ?? "Practice")}
      meta={`${questions.length} questions`}
      status={answered.length ? `${right} / ${questions.length} correct` : undefined}
      bodyClassName="space-y-3 bg-background-soft/40"
    >
      {intro ? <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{inlineArabic(intro)}</p> : null}
      <ScoreBar
        right={right}
        answered={answered.length}
        total={questions.length}
        onRetryMissed={() => {
          setPicks((current) =>
            Object.fromEntries(
              Object.entries(current).filter(([id, pick]) => questions.find((question) => question.id === id)?.answer === pick.arabic),
            ),
          );
          setRound((value) => value + 1);
        }}
        onRestart={() => {
          setPicks({});
          setRound((value) => value + 1);
        }}
      />
      <ol className={cn("grid grid-cols-1 gap-2.5", columns)}>
        {questions.map((question, index) => (
          <ChoiceCard
            key={question.id}
            question={question}
            number={index + 1}
            picked={picks[question.id]}
            round={round}
            onPick={(option) => setPicks((current) => ({ ...current, [question.id]: option }))}
          />
        ))}
      </ol>
    </Disclosure>
  );
}
