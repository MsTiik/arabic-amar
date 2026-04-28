"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import {
  makeFillBlankDeck,
  makeFlashcardDeck,
  makeGenderQuizDeck,
  makeMultipleChoiceDeck,
  makeOrderingDeck,
} from "@/lib/exercises";
import {
  getMistakeWords,
  progressActions,
  useProgress,
} from "@/lib/progress";
import type { ExerciseDeck, Lesson, Topic, VocabEntry } from "@/lib/types";
import { ExerciseRunner } from "@/components/exercise-runner";

interface Props {
  vocab: VocabEntry[];
  topics: Topic[];
  lessons: Lesson[];
}

export function PracticeClient(props: Props) {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
      <PracticeInner {...props} />
    </Suspense>
  );
}

function PracticeInner({ vocab, topics, lessons }: Props) {
  const search = useSearchParams();
  const deckParam = search.get("deck"); // "mistakes" | "today"
  const topicSlug = search.get("topic") ?? "";
  const kindParam = search.get("kind") ?? "mc"; // "flashcard" | "mc" | "fill" | "gender" | "ordering"

  const progress = useProgress();
  const allWordIds = useMemo(() => vocab.map((v) => v.id), [vocab]);

  // Track whether the user has explicitly exited a URL-driven deck.
  const [exitedKey, setExitedKey] = useState<string | null>(null);
  // Manually selected deck (from button clicks) takes precedence over the URL deck.
  const [manualDeck, setManualDeck] = useState<ExerciseDeck | null>(null);

  // Build a deck implied by the URL on every render. Cheap (just data shaping).
  const urlDeck = useMemo<ExerciseDeck | null>(() => {
    if (deckParam === "mistakes") {
      const ids = new Set(getMistakeWords(progress, allWordIds));
      const subset = vocab.filter((v) => ids.has(v.id));
      if (subset.length === 0) return null;
      return makeMultipleChoiceDeck(subset, vocab, "ar-to-en", {
        id: "deck-mistakes",
        title: "Review mistakes",
      });
    }
    if (topicSlug) {
      const subset = vocab.filter((v) => v.topicSlugs.includes(topicSlug));
      const topic = topics.find((t) => t.slug === topicSlug);
      if (subset.length === 0 || !topic) return null;
      const title = `${topic.name} · ${kindLabel(kindParam)}`;
      return buildDeck(kindParam, subset, vocab, topicSlug, title);
    }
    return null;
    // We intentionally key off URL params and the static word list. Re-deriving on every
    // progress change is cheap and keeps the deck stable until the user exits.
  }, [deckParam, topicSlug, kindParam, vocab, topics, allWordIds, progress]);

  const urlDeckKey = `${deckParam ?? ""}|${topicSlug}|${kindParam}`;
  const activeDeck =
    manualDeck ??
    (urlDeck && exitedKey !== urlDeckKey ? urlDeck : null);

  function exitActive() {
    setManualDeck(null);
    setExitedKey(urlDeckKey);
  }

  if (activeDeck) {
    return (
      <ExerciseRunner
        deck={activeDeck}
        onExit={exitActive}
        onAttempt={(wordId, correct) => {
          if (wordId) progressActions.recordAttempt(wordId, correct);
        }}
      />
    );
  }

  const mistakeIds = getMistakeWords(progress, allWordIds);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Practice</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a deck and play. Every answered card counts toward your daily goal and your
          per-word mastery.
        </p>
      </header>

      <section className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Quick decks</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DeckButton
            title="Mixed multiple choice"
            description="Random 12 words across all lessons (Arabic ↔ English)."
            onClick={() => {
              const sample = sampleRandom(vocab, 12, Date.now());
              setManualDeck(
                makeMultipleChoiceDeck(sample, vocab, "ar-to-en", {
                  id: "deck-mixed-mc",
                  title: "Mixed multiple choice",
                }),
              );
            }}
          />
          <DeckButton
            title="Flashcards (mixed)"
            description="Tap to flip. Self-rate after each card."
            onClick={() => {
              const sample = sampleRandom(vocab, 15, Date.now());
              setManualDeck(
                makeFlashcardDeck(sample, {
                  id: "deck-mixed-flash",
                  title: "Mixed flashcards",
                }),
              );
            }}
          />
          <DeckButton
            title="Type the transliteration"
            description="Read the Arabic, type the pronunciation."
            onClick={() => {
              const sample = sampleRandom(vocab, 10, Date.now());
              setManualDeck(
                makeFillBlankDeck(sample, {
                  id: "deck-mixed-fill",
                  title: "Type the transliteration",
                }),
              );
            }}
          />
          <DeckButton
            title="Gender quiz"
            description="Decide masculine or feminine on Body Parts and Entities."
            onClick={() => {
              const candidates = vocab.filter((v) => v.gender === "M" || v.gender === "F");
              const sample = sampleRandom(candidates, 12, Date.now());
              setManualDeck(
                makeGenderQuizDeck(sample, {
                  id: "deck-mixed-gender",
                  title: "Gender quiz",
                }),
              );
            }}
          />
          {mistakeIds.length > 0 ? (
            <DeckButton
              title={`Review mistakes (${mistakeIds.length})`}
              description="Words you've recently gotten wrong."
              tone="danger"
              onClick={() => {
                const ids = new Set(mistakeIds);
                const subset = vocab.filter((v) => ids.has(v.id));
                setManualDeck(
                  makeMultipleChoiceDeck(subset, vocab, "ar-to-en", {
                    id: "deck-mistakes",
                    title: "Review mistakes",
                  }),
                );
              }}
            />
          ) : null}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">By lesson</h2>
        <p className="text-xs text-muted-foreground">
          Run through a single lesson’s worth of words.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {lessons.map((l) => {
            const subset = vocab.filter((v) => v.lessonId === l.id);
            if (subset.length === 0) return null;
            return (
              <Link
                key={l.id}
                href={`/practice?topic=${l.topicSlugs[0]}&kind=mc`}
                className="flex items-center justify-between rounded-2xl border border-border bg-background-soft p-4 hover:bg-muted focus-ring"
              >
                <div>
                  <p className="text-sm font-semibold">
                    Lesson {l.number}: {l.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subset.length} words
                  </p>
                </div>
                <span className="text-sm font-medium text-primary">Start →</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function DeckButton({
  title,
  description,
  onClick,
  tone = "default",
}: {
  title: string;
  description: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-colors hover-lift focus-ring ${
        tone === "danger"
          ? "border-danger bg-danger-soft"
          : "border-border bg-background-soft hover:bg-muted"
      }`}
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );
}

function sampleRandom<T>(arr: T[], n: number, seed: number): T[] {
  const a = [...arr];
  // Reduce the seed into the LCG's range first. Date.now() (~1.78e12 in 2026)
  // multiplied by 9301 overflows Number.MAX_SAFE_INTEGER (9.0e15) on the
  // first step, costing precision on the first swap.
  let s = (seed % 233280) || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

function kindLabel(kind: string): string {
  switch (kind) {
    case "flashcard":
      return "Flashcards";
    case "fill":
      return "Type-the-translit";
    case "gender":
      return "Gender quiz";
    case "ordering":
      return "Ordering";
    default:
      return "Multiple choice";
  }
}

function buildDeck(
  kind: string,
  subset: VocabEntry[],
  pool: VocabEntry[],
  topicSlug: string,
  title: string,
): ExerciseDeck {
  const id = `deck-${topicSlug}-${kind}`;
  switch (kind) {
    case "flashcard":
      return makeFlashcardDeck(subset, { id, title, topicSlug });
    case "fill":
      return makeFillBlankDeck(subset, { id, title, topicSlug });
    case "gender":
      return makeGenderQuizDeck(subset, { id, title, topicSlug });
    case "ordering": {
      const orderBy: "numericValue" | "weekdayIndex" | "monthIndex" =
        topicSlug === "numbers"
          ? "numericValue"
          : topicSlug === "days-of-the-week"
            ? "weekdayIndex"
            : "monthIndex";
      return makeOrderingDeck(subset, { id, title, topicSlug, orderBy });
    }
    default:
      return makeMultipleChoiceDeck(subset, pool, "ar-to-en", { id, title, topicSlug });
  }
}
