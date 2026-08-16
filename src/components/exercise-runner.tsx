"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Flame, RotateCcw, Trophy, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { AutoplayToggle } from "@/components/autoplay-toggle";
import { FeedbackToggle } from "@/components/feedback-toggle";
import { SpeakerButton } from "@/components/speaker-button";
import { TranslitReveal } from "@/components/translit-reveal";
import { cn } from "@/lib/cn";
import {
  prefetchWordAudio,
  releasePrefetchedAudio,
} from "@/lib/audio-prefetch";
import { autoplayWord } from "@/lib/autoplay";
import {
  answerFeedback,
  comboFeedback,
  completeFeedback,
  haptic,
  playSound,
  unlockAudio,
} from "@/lib/feedback";
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
  // Immersive mode: on phones the site chrome (topbar, tab bar, footer) is
  // hidden via this body class while a deck is running, so the whole
  // viewport belongs to the session.
  const hasQuestions = deck.questions.length > 0;
  useEffect(() => {
    if (!hasQuestions) return;
    document.body.classList.add("session-active");
    return () => document.body.classList.remove("session-active");
  }, [hasQuestions]);

  // Resume the (mobile-suspended) AudioContext on every tap so answer chimes
  // are never swallowed, and warm the deck's pronunciation recordings so
  // playback is instant instead of waiting on a network fetch.
  useEffect(() => {
    if (!hasQuestions) return;
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    return () => window.removeEventListener("pointerdown", unlockAudio);
  }, [hasQuestions]);
  useEffect(() => {
    prefetchWordAudio(
      deck.questions.flatMap((q) => [
        q.promptArabic,
        ...(q.options?.map((o) => o.text) ?? []),
        ...(q.pairs?.flatMap((p) => [p.leftText, p.rightText]) ?? []),
      ]),
    );
    return releasePrefetchedAudio;
  }, [deck]);

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<{ correct: number; wrong: number }>({
    correct: 0,
    wrong: 0,
  });
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
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
          className="btn-chunky btn-chunky-primary mt-3 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-ring"
        >
          Back to practice
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <CompletionScreen
        deckTitle={deck.title}
        total={total}
        correct={results.correct}
        wrong={results.wrong}
        bestCombo={bestCombo}
        onRunAgain={() => {
          setIndex(0);
          setResults({ correct: 0, wrong: 0 });
          setCombo(0);
          setBestCombo(0);
          setDone(false);
        }}
        onExit={onExit}
      />
    );
  }

  function recordAndAdvance(correct: boolean) {
    onAttempt(question.wordId, correct);
    setResults((r) =>
      correct
        ? { ...r, correct: r.correct + 1 }
        : { ...r, wrong: r.wrong + 1 },
    );
    if (correct) {
      const next = combo + 1;
      setCombo(next);
      setBestCombo((b) => Math.max(b, next));
      if (next === 3 || (next > 3 && next % 5 === 0)) comboFeedback();
    } else {
      setCombo(0);
    }
    if (index + 1 >= total) {
      setDone(true);
    } else {
      setIndex(index + 1);
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-4.5rem)] flex-col gap-4 sm:min-h-0">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          className="rounded-full border border-border bg-background-soft p-2 hover:bg-muted focus-ring"
          aria-label="Exit deck"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              {deck.title}
            </p>
            <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {index + 1} / {total}
            </p>
          </div>
          <div
            className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={index}
            aria-label="Deck progress"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(ratio * 100, 4)}%` }}
            />
          </div>
        </div>
        {combo >= 3 ? (
          <span
            key={combo}
            className="combo-pop flex shrink-0 items-center gap-1 rounded-full bg-accent-gold-soft px-3 py-1.5 text-xs font-bold text-foreground"
          >
            <Flame className="h-3.5 w-3.5 text-accent-gold" aria-hidden />
            {combo} in a row!
          </span>
        ) : null}
        <AutoplayToggle className="shrink-0" />
        <FeedbackToggle className="shrink-0" />
      </div>

      <div
        key={question.id}
        className="question-enter flex flex-1 flex-col justify-center sm:block"
      >
        <QuestionView question={question} onAnswer={recordAndAdvance} />
      </div>
    </div>
  );
}

const CONFETTI_COLORS = [
  "var(--primary)",
  "var(--accent-gold)",
  "var(--accent-amber)",
  "var(--accent-terracotta)",
  "var(--accent-teal)",
];

function ConfettiBurst({ count = 28 }: { count?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${(i * 37 + 13) % 100}%`,
            backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            animationDelay: `${(i % 7) * 0.12}s`,
            animationDuration: `${2 + (i % 5) * 0.25}s`,
          }}
        />
      ))}
    </div>
  );
}

function CountUpNumber({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const duration = 800;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [value]);

  return (
    <span className={cn("tabular-nums", className)}>
      {display}
      {suffix}
    </span>
  );
}

function CompletionScreen({
  deckTitle,
  total,
  correct,
  wrong,
  bestCombo,
  onRunAgain,
  onExit,
}: {
  deckTitle: string;
  total: number;
  correct: number;
  wrong: number;
  bestCombo: number;
  onRunAgain: () => void;
  onExit: () => void;
}) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const perfect = accuracy === 100;

  useEffect(() => {
    completeFeedback();
  }, []);

  const heading = perfect
    ? "Perfect session!"
    : accuracy >= 80
      ? "Great work!"
      : "Session complete";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center">
      {accuracy >= 80 ? <ConfettiBurst count={perfect ? 36 : 24} /> : null}
      <div
        className={cn(
          "trophy-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full",
          perfect ? "bg-accent-gold-soft" : "bg-primary/10",
        )}
      >
        <Trophy
          className={cn(
            "h-8 w-8",
            perfect ? "text-accent-gold" : "text-primary",
          )}
          aria-hidden
        />
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight">{heading}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {deckTitle} · {total} cards
      </p>
      <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6">
        <div className="min-w-24 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-center">
          <p className="text-3xl font-bold text-primary">
            <CountUpNumber value={accuracy} suffix="%" />
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Accuracy
          </p>
        </div>
        <div className="min-w-24 rounded-2xl border border-success/40 bg-success-soft px-4 py-3 text-center">
          <p className="text-3xl font-bold text-success">
            <CountUpNumber value={correct} />
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Correct
          </p>
        </div>
        <div className="min-w-24 rounded-2xl border border-danger/40 bg-danger-soft px-4 py-3 text-center">
          <p className="text-3xl font-bold text-danger">
            <CountUpNumber value={wrong} />
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Missed
          </p>
        </div>
      </div>
      {bestCombo >= 3 ? (
        <p className="mt-4 inline-flex items-center gap-1 rounded-full bg-accent-gold-soft px-3 py-1.5 text-xs font-bold">
          <Flame className="h-3.5 w-3.5 text-accent-gold" aria-hidden />
          Best streak: {bestCombo} in a row
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRunAgain}
          className="btn-chunky rounded-full border border-border bg-background-soft px-5 py-2.5 text-sm font-semibold hover:bg-muted focus-ring"
        >
          <RotateCcw className="mr-1 inline h-3.5 w-3.5" />
          Run again
        </button>
        <button
          type="button"
          onClick={onExit}
          className="btn-chunky btn-chunky-primary rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground focus-ring"
        >
          Back to practice
        </button>
      </div>
    </div>
  );
}

/**
 * Slide-up feedback bar shown after answering. The continue button is
 * auto-focused so Enter/Space advances to the next card.
 */
function FeedbackBar({
  correct,
  message,
  detail,
  word,
  onContinue,
}: {
  correct: boolean;
  message?: string;
  detail?: React.ReactNode;
  /** Arabic word to pronounce when the answer is revealed (autoplay pref). */
  word?: string;
  onContinue: () => void;
}) {
  const continueRef = useRef<HTMLButtonElement>(null);

  // The chime + haptic fire in the answer tap handler (not here): running
  // them synchronously inside the user gesture keeps the browser's user-
  // activation guarantees for audio and vibration and lands the feedback on
  // the same frame as the press.
  useEffect(() => {
    continueRef.current?.focus();
    // Delay slightly so the pronunciation doesn't overlap the answer chime.
    autoplayWord(word, 450);
    // Autoplay should fire exactly once, when the bar first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Reserves space under the question so the fixed sheet on phones
          never covers the revealed correct answer. */}
      <div className="h-32 sm:hidden" aria-hidden />
      <div
        className={cn(
          "feedback-enter flex flex-wrap items-center justify-between gap-3 border p-4",
          "fixed inset-x-0 bottom-0 z-40 rounded-t-2xl border-x-0 border-b-0 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgb(0_0_0/0.15)]",
          "sm:static sm:z-auto sm:mt-6 sm:rounded-2xl sm:border sm:pb-4 sm:shadow-none",
          correct
            ? "border-success/50 bg-success-soft"
            : "border-danger/50 bg-danger-soft",
        )}
        role="status"
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-primary-foreground",
              correct ? "bg-success" : "bg-danger",
            )}
          >
            {correct ? (
              <Check className="h-5 w-5" aria-hidden />
            ) : (
              <X className="h-5 w-5" aria-hidden />
            )}
          </span>
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm font-bold",
                correct ? "text-success" : "text-danger",
              )}
            >
              {message ?? (correct ? "Correct!" : "Not quite — keep going.")}
            </p>
            {detail ? (
              <div className="text-sm text-foreground-soft">{detail}</div>
            ) : null}
          </div>
        </div>
        <button
          ref={continueRef}
          type="button"
          onClick={onContinue}
          className={cn(
            "btn-chunky rounded-full px-6 py-2.5 text-sm font-bold text-primary-foreground focus-ring",
            correct
              ? "btn-chunky-success bg-success"
              : "btn-chunky-danger bg-danger",
          )}
        >
          Continue →
        </button>
      </div>
    </>
  );
}

/** Shared chunky styling for tappable answer options. */
function optionClasses(
  answered: boolean,
  isCorrect: boolean,
  isSelected: boolean,
): string {
  const base =
    "btn-chunky rounded-2xl border-2 text-center focus-ring";
  if (!answered)
    return cn(base, "border-border bg-background-soft hover:bg-muted");
  if (isCorrect) return cn(base, "answer-pop border-success bg-success-soft");
  if (isSelected) return cn(base, "answer-shake border-danger bg-danger-soft");
  return cn(base, "border-border bg-background-soft opacity-50");
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
    case "connecting-letters":
      return <ConnectingLettersView question={question} onAnswer={onAnswer} />;
    case "cloze":
      return <ClozeView question={question} onAnswer={onAnswer} />;
  }
}

/** Scale display text down as it gets longer so long entries (e.g. singular /
 *  plural pairs or Hijri month names) stay inside the fixed-height card. */
function arabicDisplaySize(text: string | undefined): string {
  const len = text?.length ?? 0;
  if (len <= 12) return "text-6xl sm:text-8xl";
  if (len <= 22) return "text-5xl sm:text-7xl";
  if (len <= 32) return "text-4xl sm:text-6xl";
  return "text-3xl sm:text-5xl";
}

function englishDisplaySize(text: string | undefined): string {
  const len = text?.length ?? 0;
  if (len <= 16) return "text-4xl sm:text-7xl";
  if (len <= 28) return "text-3xl sm:text-5xl";
  if (len <= 44) return "text-2xl sm:text-4xl";
  return "text-xl sm:text-3xl";
}

function FlashcardView({
  question,
  onAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const lastFlipRef = useRef(0);
  // Absorb double-taps: a second tap while the card is still turning would
  // reverse the flip and read as "the card didn't flip".
  function toggleFlip() {
    const now = Date.now();
    if (now - lastFlipRef.current < 550) return;
    lastFlipRef.current = now;
    if (!flipped) autoplayWord(question.promptArabic);
    setFlipped((f) => !f);
  }
  const flipLabel = flipped
    ? "Flip card to show Arabic"
    : "Flip card to show English";

  return (
    <div className="rounded-3xl border border-border bg-card p-4 text-center sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {flipped ? "English" : "Arabic"}
      </p>
      <div className="flip-scene relative mt-4 h-56 w-full sm:mt-6 sm:h-80">
        <div className={cn("flip-inner absolute inset-0", flipped && "is-flipped")}>
          <button
            type="button"
            aria-label={flipLabel}
            onClick={toggleFlip}
            className="flip-face btn-chunky absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border bg-background-soft p-6 hover:border-primary/50 hover:bg-muted/70 focus-ring sm:p-8"
          >
            <ArabicText
              variant="display"
              className={cn(
                "max-w-full break-words leading-snug",
                arabicDisplaySize(question.promptArabic),
              )}
            >
              {question.promptArabic}
            </ArabicText>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              Tap card to show English
            </p>
          </button>
          <button
            type="button"
            aria-label={flipLabel}
            onClick={toggleFlip}
            className="flip-face flip-face-back btn-chunky btn-chunky-primary absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 focus-ring sm:p-8"
          >
            <p
              className={cn(
                "max-w-full break-words font-semibold leading-tight tracking-tight",
                englishDisplaySize(question.prompt),
              )}
            >
              {question.prompt}
            </p>
            {question.promptHint ? (
              <p className="text-sm italic text-muted-foreground" lang="ar-Latn">
                {question.promptHint}
              </p>
            ) : null}
            {question.answerDetail ? (
              <p className="mt-1 max-w-xl text-sm leading-6 text-foreground-soft">
                {question.answerDetail}
              </p>
            ) : null}
            {question.sourceLabel ? (
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                Source: {question.sourceLabel}
              </p>
            ) : null}
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              Tap card to show Arabic
            </p>
          </button>
        </div>
      </div>
      {!flipped ? (
        <div className="mt-3 flex items-center justify-center gap-3">
          {question.promptHint ? (
            <TranslitReveal text={question.promptHint} />
          ) : null}
          {question.promptArabic && question.showAudio !== false ? (
            <SpeakerButton
              arabic={question.promptArabic}
              label={question.prompt}
              size="sm"
              showUnavailable
            />
          ) : null}
        </div>
      ) : null}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            answerFeedback(false);
            onAnswer(false);
          }}
          className="btn-chunky btn-chunky-danger rounded-full border-2 border-danger bg-danger-soft px-4 py-2.5 text-sm font-bold text-foreground focus-ring"
        >
          <X className="mr-1 inline h-4 w-4" />
          Got it wrong
        </button>
        <button
          type="button"
          onClick={() => {
            answerFeedback(true);
            onAnswer(true);
          }}
          className="btn-chunky btn-chunky-success rounded-full bg-success px-4 py-2.5 text-sm font-bold text-primary-foreground focus-ring"
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
  const correctOption = question.options?.find(
    (o) => o.id === question.correctAnswerId,
  );

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-8">
      <div className="text-center">
        {question.promptArabic ? (
          <>
            <ArabicText
              variant="display"
              className={cn(
                "max-w-full break-words leading-snug",
                arabicDisplaySize(question.promptArabic),
              )}
            >
              {question.promptArabic}
            </ArabicText>
            {question.showAudio !== false ? (
              <div className="mt-2 flex justify-center">
                <SpeakerButton
                  arabic={question.promptArabic}
                  label={question.prompt}
                  size="sm"
                  showUnavailable
                />
              </div>
            ) : null}
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

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
        {question.options?.map((opt) => {
          const isCorrect = opt.id === question.correctAnswerId;
          const isSelected = opt.id === selected;
          return (
            <div key={opt.id} className="flex flex-col gap-1">
              <button
                type="button"
                disabled={selected !== null}
                onClick={() => {
                  answerFeedback(opt.id === question.correctAnswerId);
                  setSelected(opt.id);
                }}
                className={cn(
                  "p-3 sm:p-4",
                  optionClasses(selected !== null, isCorrect, isSelected),
                )}
              >
                {opt.isArabic ? (
                  <ArabicText
                    variant="display"
                    className={cn(
                      "max-w-full break-words leading-snug",
                      (opt.text?.length ?? 0) > 24
                        ? "text-2xl sm:text-3xl"
                        : "text-3xl sm:text-4xl",
                    )}
                  >
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
        <FeedbackBar
          correct={correct}
          word={
            question.promptArabic ??
            (correctOption?.isArabic ? correctOption.text : undefined)
          }
          detail={
            !correct && correctOption ? (
              <span>
                Answer:{" "}
                <span className="font-semibold">{correctOption.text}</span>
              </span>
            ) : undefined
          }
          onContinue={() => onAnswer(correct)}
        />
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
    answerFeedback(ok);
    setSubmitted(ok);
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-8">
      <div className="text-center">
        <ArabicText variant="display" className="text-5xl sm:text-7xl">
          {question.promptArabic}
        </ArabicText>
        <p className="mt-2 text-base font-medium">{question.prompt}</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (submitted === null) submit();
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
            className="btn-chunky btn-chunky-primary mt-4 w-full rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground focus-ring"
          >
            Submit
          </button>
        ) : null}
      </form>
      {submitted !== null ? (
        <FeedbackBar
          correct={submitted}
          word={question.promptArabic}
          detail={
            !submitted ? (
              <span>
                Answer:{" "}
                <span className="font-semibold">
                  {question.acceptableAnswers?.[0] ?? ""}
                </span>
              </span>
            ) : undefined
          }
          onContinue={() => onAnswer(submitted)}
        />
      ) : null}
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
    answerFeedback(ok);
    setSubmitted(ok);
  }

  const optionMap = new Map(question.options?.map((o) => [o.id, o]));

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-8">
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
          className="btn-chunky btn-chunky-primary mt-4 w-full rounded-full bg-primary py-2.5 text-sm font-bold text-primary-foreground focus-ring"
        >
          Check
        </button>
      ) : (
        <FeedbackBar
          correct={submitted}
          message={submitted ? "Correct!" : "Not quite — order is off."}
          onContinue={() => onAnswer(submitted)}
        />
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
      const isLast = Object.keys(matched).length + 1 === pairs.length;
      if (isLast) {
        answerFeedback(errorCount === 0);
      } else {
        playSound("match");
        haptic("tap");
      }
      setMatched((m) => ({ ...m, [leftId]: rightId }));
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      playSound("wrong");
      haptic("wrong");
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
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-8">
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
        <FeedbackBar
          correct={noErrors}
          message={
            noErrors
              ? "All matched on the first try!"
              : `All matched — ${errorCount} miss${errorCount === 1 ? "" : "es"}.`
          }
          onContinue={() =>
            onAnswer(checkMatchPairsAnswer(matched, pairs) && noErrors)
          }
        />
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
  if (matched) style = "answer-pop border-success bg-success-soft opacity-70";
  else if (wrong) style = "answer-shake border-danger bg-danger-soft";
  else if (selected) style = "border-primary bg-primary/10";
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        disabled={matched}
        className={cn(
          // Fixed min-height keeps the Arabic and English columns visually
          // aligned even though their content (large Arabic glyph vs short
          // English gloss) has very different intrinsic sizes.
          "btn-chunky flex h-20 w-full flex-col items-center justify-center rounded-2xl border-2 p-3 text-center focus-ring sm:h-24",
          style,
        )}
      >
        {isArabic ? (
          <ArabicText variant="display" className="text-2xl leading-tight sm:text-3xl">
            {text}
          </ArabicText>
        ) : (
          <span className="text-sm font-semibold leading-tight sm:text-base">
            {text}
          </span>
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
  const correctOption = question.options?.find(
    (o) => o.id === question.correctAnswerId,
  );

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-8">
      <div className="text-center">
        <ArabicText
          variant="display"
          className="text-6xl sm:text-8xl text-foreground"
        >
          {question.promptArabic}
        </ArabicText>
        <p className="mt-4 text-base font-medium">{question.prompt}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {question.options?.map((opt) => {
          const isCorrect = opt.id === question.correctAnswerId;
          const isSelected = opt.id === selected;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={selected !== null}
              onClick={() => {
                answerFeedback(opt.id === question.correctAnswerId);
                setSelected(opt.id);
              }}
              className={cn(
                "p-4",
                optionClasses(selected !== null, isCorrect, isSelected),
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
        <FeedbackBar
          correct={correct}
          detail={
            !correct && correctOption ? (
              <span>
                Answer:{" "}
                <span className="font-semibold" lang="ar-Latn">
                  {correctOption.text}
                </span>
              </span>
            ) : undefined
          }
          onContinue={() => onAnswer(correct)}
        />
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
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Meaning
        </p>
        <p className="mt-1 text-base font-semibold text-foreground">
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
          {question.promptHint ? (
            <p
              className="mt-2 text-sm italic text-muted-foreground"
              lang="ar-Latn"
            >
              {question.promptHint} <span className="opacity-60">…</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {question.options?.map((opt) => {
          const isCorrect = opt.id === question.correctAnswerId;
          const isSelected = opt.id === selected;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={selected !== null}
              onClick={() => {
                answerFeedback(opt.id === question.correctAnswerId);
                setSelected(opt.id);
              }}
              className={cn(
                "p-3",
                optionClasses(selected !== null, isCorrect, isSelected),
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
        <FeedbackBar
          correct={correct}
          word={correctOption?.text}
          detail={
            !correct && correctOption ? (
              <span>
                Answer:{" "}
                <ArabicText className="text-lg font-semibold">
                  {correctOption.text}
                </ArabicText>
              </span>
            ) : undefined
          }
          onContinue={() => onAnswer(correct)}
        />
      ) : null}
    </div>
  );
}

/**
 * Connecting letters: shows the prompt as a sequence of *disconnected*
 * Arabic letters (the deck builder spaced them out so the renderer doesn't
 * shape them together). The learner picks the correctly-connected word from
 * 4 Arabic options.
 */
function ConnectingLettersView({
  question,
  onAnswer,
}: {
  question: ExerciseQuestion;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const correct = selected === question.correctAnswerId;
  const correctOption = question.options?.find(
    (o) => o.id === question.correctAnswerId,
  );

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-8">
      <p className="text-center text-sm font-medium text-foreground-soft">
        {question.prompt}
      </p>
      <div className="mt-4 text-center">
        <ArabicText
          variant="display"
          // tracking-widest plus the explicit spaces inserted by the deck
          // builder keeps every letter visually isolated from its neighbours
          // so the renderer can't auto-join them.
          className="text-5xl tracking-widest sm:text-6xl"
          dir="rtl"
        >
          {question.promptArabic}
        </ArabicText>
        {question.promptHint ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Hint: <span className="font-medium">{question.promptHint}</span>
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
        {question.options?.map((opt) => {
          const isCorrect = opt.id === question.correctAnswerId;
          const isSelected = opt.id === selected;
          return (
            <div key={opt.id} className="flex flex-col gap-1">
              <button
                type="button"
                disabled={selected !== null}
                onClick={() => {
                  answerFeedback(opt.id === question.correctAnswerId);
                  setSelected(opt.id);
                }}
                className={cn(
                  "p-3 sm:p-4",
                  optionClasses(selected !== null, isCorrect, isSelected),
                )}
              >
                <ArabicText variant="display" className="text-3xl sm:text-4xl">
                  {opt.text}
                </ArabicText>
              </button>
              {opt.translit ? (
                <TranslitReveal text={opt.translit} variant="inline" />
              ) : null}
            </div>
          );
        })}
      </div>

      {selected ? (
        <FeedbackBar
          correct={correct}
          word={correctOption?.text}
          message={correct ? "Correct!" : "Not quite — read the letters again."}
          detail={
            !correct && correctOption ? (
              <span>
                Answer:{" "}
                <ArabicText className="text-lg font-semibold">
                  {correctOption.text}
                </ArabicText>
              </span>
            ) : undefined
          }
          onContinue={() => onAnswer(correct)}
        />
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
