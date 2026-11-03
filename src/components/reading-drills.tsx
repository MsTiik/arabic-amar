"use client";

import { useEffect, useState } from "react";
import { Check, Eye, RotateCcw } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { ReadingExercise } from "@/components/reading-exercise";
import {
  readingSentenceToArabic,
  type LevelTwoOrderItem,
  type LevelTwoReading,
  type LevelTwoReadingDrill,
  type LevelTwoReadingSentence,
} from "@/data/level-two-lessons";
import { cn } from "@/lib/cn";

type Tab = { id: string; label: string };

/** A reading's questions plus its further drills, one tab per exercise on the sheet. */
export function ReadingDrills({ reading }: { reading: LevelTwoReading }) {
  const drills = reading.drills ?? [];
  const tabs: Tab[] = [
    { id: "questions", label: "Questions" },
    ...drills.map((drill) => ({ id: drill.id, label: drill.label })),
  ];
  const [active, setActive] = useState(tabs[0].id);
  const drill = drills.find((candidate) => candidate.id === active);

  return (
    <div className="space-y-3">
      {tabs.length > 1 ? (
        <div className="segmented flex w-full flex-wrap sm:w-fit" role="tablist" aria-label="Exercises">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`${tab.id}-tab`}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              aria-controls={`${tab.id}-panel`}
              className="segmented-item"
              onClick={() => setActive(tab.id)}
            >
              {index + 1}. {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      <div id={`${active}-panel`} role="tabpanel" aria-labelledby={`${active}-tab`}>
        {drill ? (
          <>
            <DrillInstruction heading={drill.heading} instruction={drill.instruction} />
            <DrillBody reading={reading} drill={drill} />
          </>
        ) : (
          <>
            {reading.instruction ? (
              <DrillInstruction heading={reading.questionsHeading} instruction={reading.instruction} />
            ) : null}
            <ReadingExercise reading={reading} />
          </>
        )}
      </div>
    </div>
  );
}

function DrillBody({ reading, drill }: { reading: LevelTwoReading; drill: LevelTwoReadingDrill }) {
  if (drill.kind === "match") return <MatchingExercise key={drill.id} drill={drill} />;
  if (drill.kind === "order") return <OrderingExercise key={drill.id} items={drill.items} />;
  return (
    <ReadingExercise
      key={drill.id}
      reading={reading}
      questions={drill.items}
      resultsKey={`${reading.slug}--${drill.id}`}
      answerLabel="Correction"
    />
  );
}

function DrillInstruction({
  heading,
  instruction,
}: {
  heading?: LevelTwoReadingSentence;
  instruction: LevelTwoReadingSentence;
}) {
  return (
    <div className="mb-3 tile p-3.5 sm:p-4">
      {heading ? (
        <ArabicText className="text-base font-semibold text-muted-foreground">
          {readingSentenceToArabic(heading)}
        </ArabicText>
      ) : null}
      <ArabicText className="text-xl leading-loose sm:text-2xl">{readingSentenceToArabic(instruction)}</ArabicText>
      <p lang="ar-Latn" className="text-sm italic text-foreground-soft">{instruction.transliteration}</p>
      <p className="text-sm text-muted-foreground">{instruction.english}</p>
    </div>
  );
}

function SentenceBlock({ sentence, size = "md" }: { sentence: LevelTwoReadingSentence; size?: "md" | "lg" }) {
  return (
    <>
      <ArabicText className={cn("leading-loose", size === "lg" ? "text-xl sm:text-2xl" : "text-lg sm:text-xl")}>
        {readingSentenceToArabic(sentence)}
      </ArabicText>
      <span lang="ar-Latn" className="block text-sm italic text-foreground-soft">{sentence.transliteration}</span>
      <span className="block text-sm">{sentence.english}</span>
    </>
  );
}

/* ---------- Matching ---------- */

type MatchDrill = Extract<LevelTwoReadingDrill, { kind: "match" }>;
type Side = "left" | "right";

function MatchingExercise({ drill }: { drill: MatchDrill }) {
  const initial = () => new Set(drill.pairs.filter((pair) => pair.example).map((pair) => pair.id));
  const [matched, setMatched] = useState<ReadonlySet<string>>(initial);
  const [selected, setSelected] = useState<{ side: Side; id: string } | null>(null);
  const [miss, setMiss] = useState<string | null>(null);

  useEffect(() => {
    if (!miss) return;
    const timer = window.setTimeout(() => setMiss(null), 700);
    return () => window.clearTimeout(timer);
  }, [miss]);

  const rightPairs = drill.rightOrder.map((id) => drill.pairs.find((pair) => pair.id === id)!);
  const done = matched.size === drill.pairs.length;

  function choose(side: Side, id: string) {
    if (matched.has(id)) return;
    if (!selected || selected.side === side) {
      setSelected(selected?.side === side && selected.id === id ? null : { side, id });
      return;
    }
    if (selected.id === id) {
      setMatched((current) => new Set(current).add(id));
    } else {
      setMiss(`${side}:${id}`);
    }
    setSelected(null);
  }

  function column(side: Side, pairs: typeof drill.pairs) {
    return (
      <ol className="space-y-2" aria-label={side === "left" ? "Column 1" : "Column 2"}>
        {pairs.map((pair) => {
          const sentence = side === "left" ? pair.left : pair.right;
          const isMatched = matched.has(pair.id);
          const isSelected = selected?.side === side && selected.id === pair.id;
          const isMiss = miss === `${side}:${pair.id}`;
          return (
            <li key={pair.id}>
              <button
                type="button"
                onClick={() => choose(side, pair.id)}
                disabled={isMatched}
                aria-pressed={isSelected}
                className={cn(
                  "flex min-h-16 w-full flex-col items-start justify-center rounded-[10px] border bg-card px-3 py-2 text-start transition-colors focus-ring",
                  isMatched && "border-tense-present-accent/50 bg-tense-present/60",
                  isSelected && "border-primary bg-primary-soft",
                  isMiss && "border-accent-amber bg-accent-amber-soft",
                  !isMatched && !isSelected && !isMiss && "border-hairline hover:border-primary/50",
                )}
              >
                <ArabicText as="span" className="block text-lg leading-relaxed sm:text-xl">{readingSentenceToArabic(sentence)}</ArabicText>
                <span className="text-xs text-muted-foreground">{sentence.english}</span>
              </button>
            </li>
          );
        })}
      </ol>
    );
  }

  const answers = drill.pairs.filter((pair) => matched.has(pair.id));

  return (
    <div className="surface p-3 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-sm" aria-live="polite">
        <span className="font-semibold tabular-nums">
          {matched.size} / {drill.pairs.length} matched
        </span>
        <span className="text-xs text-muted-foreground">
          {done ? "All matched" : "Tap a word in one column, then the word it goes with in the other."}
        </span>
        <span className="ml-auto flex gap-2">
          {!done ? (
            <button
              type="button"
              onClick={() => setMatched(new Set(drill.pairs.map((pair) => pair.id)))}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              Show all
            </button>
          ) : null}
          {matched.size > initial().size ? (
            <button
              type="button"
              onClick={() => {
                setMatched(initial());
                setSelected(null);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary focus-ring"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Start again
            </button>
          ) : null}
        </span>
      </div>

      <div dir="rtl" className="grid grid-cols-2 gap-2 sm:gap-4">
        <div>
          <p dir="ltr" className="mb-2 text-center text-xs font-semibold text-muted-foreground">Column ١</p>
          {column("left", drill.pairs)}
        </div>
        <div>
          <p dir="ltr" className="mb-2 text-center text-xs font-semibold text-muted-foreground">Column ٢</p>
          {column("right", rightPairs)}
        </div>
      </div>

      {answers.length ? (
        <div className="mt-4 border-t border-hairline pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Write the phrase</p>
          <ul className="mt-2 grid gap-2 md:grid-cols-2">
            {answers.map((pair) => (
              <li key={pair.id} className="tile p-3">
                {pair.example ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Example</span>
                ) : null}
                <SentenceBlock sentence={pair.answer} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Word order ---------- */

function OrderingExercise({ items }: { items: readonly LevelTwoOrderItem[] }) {
  return (
    <ol className="grid gap-2 sm:gap-3 md:grid-cols-2">
      {items.map((item, index) => (
        <OrderCard key={item.id} item={item} number={index + 1} />
      ))}
    </ol>
  );
}

function OrderCard({ item, number }: { item: LevelTwoOrderItem; number: number }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const complete = placed.length === item.jumbled.length;
  const expected = item.order.map((index) => item.jumbled[index].arabic);
  const matches = complete && placed.every((index, position) => item.jumbled[index].arabic === expected[position]);
  const showAnswer = revealed || complete;

  const chip = "rounded-[8px] border px-2.5 py-1 text-lg leading-relaxed transition-colors focus-ring sm:text-xl";

  return (
    <li
      className={cn(
        "surface flex h-full flex-col gap-3 p-3 sm:p-4",
        matches && "border-l-4 border-l-tense-present-accent",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold tabular-nums text-primary">
          {matches ? <Check className="h-4 w-4" aria-label="Matches" /> : number}
        </span>
        <span className="text-xs text-muted-foreground">Tap the words in order to build the sentence.</span>
      </div>

      <div
        dir="rtl"
        aria-label="Your sentence"
        className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-[10px] border border-dashed border-hairline bg-background-soft/50 p-2"
      >
        {placed.length === 0 ? (
          <span className="text-xs text-muted-foreground" dir="ltr">Your sentence appears here</span>
        ) : (
          placed.map((index, position) => (
            <button
              key={`${index}-${position}`}
              type="button"
              lang="ar"
              onClick={() => setPlaced((current) => current.filter((_, at) => at !== position))}
              className={cn(chip, "font-arabic border-primary/40 bg-primary-soft")}
              aria-label={`Remove ${item.jumbled[index].arabic}`}
            >
              {item.jumbled[index].arabic}
            </button>
          ))
        )}
      </div>

      <div dir="rtl" className="flex flex-wrap gap-1.5" aria-label="Jumbled words">
        {item.jumbled.map((token, index) =>
          placed.includes(index) ? null : (
            <button
              key={index}
              type="button"
              lang="ar"
              onClick={() => setPlaced((current) => [...current, index])}
              className={cn(chip, "font-arabic border-hairline bg-card hover:border-primary/50")}
              title={`${token.transliteration} · ${token.english}`}
            >
              {token.arabic}
            </button>
          ),
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-3 text-xs">
        {placed.length ? (
          <button
            type="button"
            onClick={() => {
              setPlaced([]);
              setRevealed(false);
            }}
            className="inline-flex items-center gap-1 font-semibold text-primary focus-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Start again
          </button>
        ) : null}
        {!showAnswer ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-1 font-semibold text-primary focus-ring"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden />
            Show the sentence
          </button>
        ) : null}
      </div>

      {showAnswer ? (
        <div className="border-t border-hairline pt-2" aria-live="polite">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {matches
              ? "Matches the suggested sentence"
              : complete
                ? "Compare with the suggested sentence (other orders can also be right)"
                : "Suggested sentence"}
          </p>
          <SentenceBlock sentence={item.answer} />
        </div>
      ) : null}
    </li>
  );
}
