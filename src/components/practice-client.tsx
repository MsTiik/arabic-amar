"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  Keyboard,
  Layers,
  Link2,
  PenLine,
  Play,
  Puzzle,
  Search,
  Shuffle,
  Sparkles,
  Star,
  VenusAndMars,
} from "lucide-react";

import {
  makeClozeDeck,
  makeConnectingLettersDeck,
  makeFillBlankDeck,
  makeFlashcardDeck,
  makeGenderQuizDeck,
  makeMatchPairsDeck,
  makeMultipleChoiceDeck,
  makeOrderingDeck,
  makeWhichLetterDeck,
} from "@/lib/exercises";
import {
  getDueStudyWordIds,
  getMistakeWords,
  getNewWordIds,
  getWeakWordIds,
  progressActions,
  topicProgressFraction,
  useProgress,
} from "@/lib/progress";
import type {
  ExerciseDeck,
  GrammarRule,
  Lesson,
  Topic,
  VocabEntry,
} from "@/lib/types";
import { ExerciseRunner } from "@/components/exercise-runner";
import { buildNamesOfAllahFlashcardDeck } from "@/lib/names-of-allah";

interface Props {
  vocab: VocabEntry[];
  topics: Topic[];
  lessons: Lesson[];
  rules: GrammarRule[];
}

export function PracticeClient(props: Props) {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
      <PracticeInner {...props} />
    </Suspense>
  );
}

function buildUrlDeck({
  allWordIds,
  deckParam,
  kindParam,
  progress,
  topicSlug,
  topics,
  vocab,
}: {
  allWordIds: string[];
  deckParam: string | null;
  kindParam: string;
  progress: ReturnType<typeof useProgress>;
  topicSlug: string;
  topics: Topic[];
  vocab: VocabEntry[];
}): ExerciseDeck | null {
  if (deckParam === "mistakes") {
    const ids = new Set(getMistakeWords(progress, allWordIds));
    const subset = vocab.filter((v) => ids.has(v.id));
    if (subset.length === 0) return null;
    return makeMultipleChoiceDeck(subset, vocab, "ar-to-en", {
      id: "deck-mistakes",
      title: "Review mistakes",
    });
  }
  if (deckParam === "weak") {
    const ids = new Set(getWeakWordIds(progress, vocab));
    const subset = vocab.filter((v) => ids.has(v.id));
    if (subset.length === 0) return null;
    return makeMultipleChoiceDeck(subset, vocab, "ar-to-en", {
      id: "deck-weak",
      title: "Fix weak words",
    });
  }
  if (deckParam === "due") {
    const ids = new Set(getDueStudyWordIds(progress, vocab));
    const subset = vocab.filter((v) => ids.has(v.id)).slice(0, 20);
    if (subset.length === 0) return null;
    return makeMultipleChoiceDeck(subset, vocab, "ar-to-en", {
      id: "deck-due",
      title: "Review due cards",
    });
  }
  if (deckParam === "new") {
    const ids = new Set(getNewWordIds(progress, vocab).slice(0, 10));
    const subset = vocab.filter((v) => ids.has(v.id));
    if (subset.length === 0) return null;
    return makeFlashcardDeck(subset, {
      id: "deck-new",
      title: "Add new words",
    });
  }
  if (deckParam === "names-of-allah") {
    return buildNamesOfAllahFlashcardDeck();
  }
  if (topicSlug) {
    const subset = vocab.filter((v) => v.topicSlugs.includes(topicSlug));
    const topic = topics.find((t) => t.slug === topicSlug);
    if (subset.length === 0 || !topic) return null;
    const title = `${topic.name} · ${kindLabel(kindParam)}`;
    return buildDeck(kindParam, subset, vocab, topicSlug, title);
  }
  return null;
}

function PracticeInner({ vocab, topics, lessons, rules }: Props) {
  const search = useSearchParams();
  const deckParam = search.get("deck"); // "due" | "weak" | "mistakes" | "new"
  const topicSlug = search.get("topic") ?? "";
  const rawKindParam = search.get("kind");
  const kindParam = search.get("kind") ?? "mc"; // "flashcard" | "mc" | "fill" | "gender" | "ordering"
  const urlDeckKey = `${deckParam ?? ""}|${topicSlug}|${kindParam}`;
  const hasUrlParams = Boolean(deckParam || topicSlug || rawKindParam);

  return (
    <PracticeSession
      key={urlDeckKey}
      vocab={vocab}
      topics={topics}
      lessons={lessons}
      rules={rules}
      deckParam={deckParam}
      topicSlug={topicSlug}
      kindParam={kindParam}
      hasUrlParams={hasUrlParams}
    />
  );
}

function PracticeSession({
  vocab,
  topics,
  lessons,
  rules,
  deckParam,
  topicSlug,
  kindParam,
  hasUrlParams,
}: Props & {
  deckParam: string | null;
  topicSlug: string;
  kindParam: string;
  hasUrlParams: boolean;
}) {
  const router = useRouter();

  const progress = useProgress();
  const allWordIds = useMemo(() => vocab.map((v) => v.id), [vocab]);
  const urlDeckKey = `${deckParam ?? ""}|${topicSlug}|${kindParam}`;

  // Manually selected deck (from button clicks) takes precedence over the URL deck.
  const [manualDeck, setManualDeck] = useState<ExerciseDeck | null>(null);
  const [urlDeckSnapshot, setUrlDeckSnapshot] = useState<{
    key: string;
    deck: ExerciseDeck | null;
  }>(() => ({
    key: urlDeckKey,
    deck: hasUrlParams
      ? buildUrlDeck({
          allWordIds,
          deckParam,
          kindParam,
          progress,
          topicSlug,
          topics,
          vocab,
        })
      : null,
  }));

  const nextUrlDeck = useMemo(() => {
    if (!hasUrlParams) return null;
    return buildUrlDeck({
      allWordIds,
      deckParam,
      kindParam,
      progress,
      topicSlug,
      topics,
      vocab,
    });
  }, [allWordIds, deckParam, hasUrlParams, kindParam, progress, topicSlug, topics, vocab]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrlDeckSnapshot((current) => {
      if (!hasUrlParams) {
        if (current.key === urlDeckKey && current.deck === null) return current;
        return { key: urlDeckKey, deck: null };
      }
      if (current.key === urlDeckKey && current.deck !== null) return current;
      if (current.key === urlDeckKey && nextUrlDeck === null) return current;
      return { key: urlDeckKey, deck: nextUrlDeck };
    });
  }, [hasUrlParams, nextUrlDeck, urlDeckKey]);

  const activeDeck = manualDeck ?? urlDeckSnapshot.deck;

  function exitActive() {
    setManualDeck(null);
    setUrlDeckSnapshot((current) =>
      current.deck ? { ...current, deck: null } : current,
    );
    // If we exited a deck that came from URL params, clear them so a refresh
    // doesn't drop the user back into the deck and the address bar reflects
    // the picker view they're now looking at.
    if (hasUrlParams) {
      router.replace("/practice");
    }
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
  const dueIds = getDueStudyWordIds(progress, vocab);
  const newIds = getNewWordIds(progress, vocab);

  function startTodaysSession() {
    const picked: VocabEntry[] = [];
    const seen = new Set<string>();
    const add = (ids: string[], limit: number) => {
      const wanted = new Set(ids);
      for (const v of vocab) {
        if (picked.length >= 12) return;
        if (limit <= 0) return;
        if (!wanted.has(v.id) || seen.has(v.id)) continue;
        picked.push(v);
        seen.add(v.id);
        limit--;
      }
    };
    add(dueIds, 8);
    add(mistakeIds, 4);
    add(newIds, 12 - picked.length);
    if (picked.length < 12) {
      for (const v of sampleRandom(vocab, 12, Date.now())) {
        if (picked.length >= 12) break;
        if (seen.has(v.id)) continue;
        picked.push(v);
        seen.add(v.id);
      }
    }
    setManualDeck(
      makeMultipleChoiceDeck(picked, vocab, "ar-to-en", {
        id: "deck-todays-session",
        title: "Today's session",
      }),
    );
  }

  const sessionParts = [
    dueIds.length > 0 ? `${dueIds.length} due` : null,
    mistakeIds.length > 0 ? `${mistakeIds.length} to fix` : null,
    newIds.length > 0 ? `new words` : null,
  ].filter(Boolean);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Practice</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a deck and play. Every answered card counts toward your daily goal and your
          per-word mastery.
        </p>
      </header>

      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold tracking-tight">Today&apos;s session</h2>
            <p className="mt-1 text-sm text-primary-foreground/80">
              {sessionParts.length > 0
                ? `A 12-card mix picked for you: ${sessionParts.join(" · ")}.`
                : "A 12-card mix picked from across your lessons."}
            </p>
          </div>
          <button
            type="button"
            onClick={startTodaysSession}
            className="btn-chunky btn-chunky-gold flex shrink-0 items-center gap-2 rounded-full bg-accent-gold px-7 py-3.5 text-base font-bold text-foreground focus-ring"
          >
            <Play className="h-5 w-5" aria-hidden />
            Start today&apos;s session
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Quick decks</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {dueIds.length > 0 ? (
            <DeckCard
              title="Review due cards"
              description="Words scheduled for review today."
              icon={CalendarClock}
              hue="primary"
              badge={`${dueIds.length} due`}
              onClick={() => {
                const ids = new Set(dueIds);
                const subset = vocab.filter((v) => ids.has(v.id)).slice(0, 20);
                setManualDeck(
                  makeMultipleChoiceDeck(subset, vocab, "ar-to-en", {
                    id: "deck-due",
                    title: "Review due cards",
                  }),
                );
              }}
            />
          ) : null}
          {newIds.length > 0 ? (
            <DeckCard
              title="Add new words"
              description="Preview 10 unseen words as flashcards."
              icon={Sparkles}
              hue="gold"
              badge={`${Math.min(newIds.length, 10)} new`}
              onClick={() => {
                const ids = new Set(newIds.slice(0, 10));
                const subset = vocab.filter((v) => ids.has(v.id));
                setManualDeck(
                  makeFlashcardDeck(subset, {
                    id: "deck-new",
                    title: "Add new words",
                  }),
                );
              }}
            />
          ) : null}
          <DeckCard
            title="Mixed multiple choice"
            description="Random 12 words across all lessons (Arabic ↔ English)."
            icon={Shuffle}
            hue="present"
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
          <DeckCard
            title="Flashcards (mixed)"
            description="Tap to flip. Self-rate after each card."
            icon={Layers}
            hue="past"
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
          <DeckCard
            title="Names of Allah"
            description="Practice the full 99-name collection as Arabic flashcards."
            icon={Star}
            hue="gold"
            onClick={() => {
              setManualDeck(buildNamesOfAllahFlashcardDeck());
            }}
          />
          <DeckCard
            title="Type the transliteration"
            description="Read the Arabic, type the pronunciation."
            icon={Keyboard}
            hue="command"
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
          <DeckCard
            title="Gender quiz"
            description="Decide masculine or feminine on Body Parts and Entities."
            icon={VenusAndMars}
            hue="masdar"
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
            <DeckCard
              title="Review mistakes"
              description="Words you've recently gotten wrong."
              icon={AlertTriangle}
              hue="danger"
              badge={`${mistakeIds.length} to fix`}
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

      <section>
        <h2 className="text-lg font-semibold">Foundations drills</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Bite-size warm-ups that drill specific skills. Built for this site —
          not from the lessons.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DeckCard
            title="Match pairs"
            description="Tap one Arabic, then its English match. Five rounds of six."
            icon={Puzzle}
            hue="present"
            onClick={() => {
              const sample = sampleRandom(vocab, 30, Date.now());
              setManualDeck(
                makeMatchPairsDeck(sample, {
                  id: "deck-match-pairs",
                  title: "Match pairs",
                }),
              );
            }}
          />
          <DeckCard
            title="Which letter?"
            description="Spot the Arabic letter and pick its name. 12 cards across all positions."
            icon={Search}
            hue="past"
            onClick={() => {
              setManualDeck(
                makeWhichLetterDeck({
                  id: "deck-which-letter",
                  title: "Which letter?",
                  positions: "all",
                }),
              );
            }}
          />
          <DeckCard
            title="Connecting letters"
            description="Read disconnected letters; pick the connected word they spell."
            icon={Link2}
            hue="command"
            onClick={() => {
              setManualDeck(
                makeConnectingLettersDeck(vocab, {
                  id: "deck-connecting-letters",
                  title: "Connecting letters",
                }),
              );
            }}
          />
          <DeckCard
            title="Fill the blank"
            description="Pick the missing word in a short Arabic phrase from the lessons."
            icon={PenLine}
            hue="masdar"
            onClick={() => {
              setManualDeck(
                makeClozeDeck(rules, vocab, {
                  id: "deck-cloze",
                  title: "Fill the blank",
                }),
              );
            }}
          />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">By lesson</h2>
        <p className="text-xs text-muted-foreground">
          Run through a single lesson’s worth of words.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {lessons.map((l, i) => {
            const subset = vocab.filter((v) => v.lessonId === l.id);
            if (subset.length === 0) return null;
            const hue = LESSON_HUES[i % LESSON_HUES.length];
            const fraction = topicProgressFraction(
              progress,
              subset.map((v) => v.id),
            );
            return (
              <Link
                key={l.id}
                href={`/practice?topic=${l.topicSlugs[0]}&kind=mc`}
                className="btn-chunky flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-4 hover:bg-background-soft focus-ring"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base font-bold ${HUE_STYLES[hue].chip}`}
                >
                  {l.number}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{l.title}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${HUE_STYLES[hue].bar}`}
                        style={{ width: `${Math.round(fraction * 100)}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {subset.length} words
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-bold text-primary">Start →</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

type DeckHue = "primary" | "gold" | "danger" | "past" | "present" | "command" | "masdar";

const HUE_STYLES: Record<DeckHue, { chip: string; bar: string }> = {
  primary: { chip: "bg-primary/10 text-primary", bar: "bg-primary" },
  gold: { chip: "bg-accent-gold-soft text-accent-gold", bar: "bg-accent-gold" },
  danger: { chip: "bg-danger-soft text-danger", bar: "bg-danger" },
  past: { chip: "bg-tense-past text-tense-past-accent", bar: "bg-tense-past-accent" },
  present: {
    chip: "bg-tense-present text-tense-present-accent",
    bar: "bg-tense-present-accent",
  },
  command: {
    chip: "bg-tense-command text-tense-command-accent",
    bar: "bg-tense-command-accent",
  },
  masdar: {
    chip: "bg-tense-masdar text-tense-masdar-accent",
    bar: "bg-tense-masdar-accent",
  },
};

const LESSON_HUES: DeckHue[] = ["primary", "present", "command", "masdar", "past", "gold"];

function DeckCard({
  title,
  description,
  icon: Icon,
  hue,
  badge,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  hue: DeckHue;
  badge?: string;
  onClick: () => void;
}) {
  const styles = HUE_STYLES[hue];
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-chunky group flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-4 text-left hover:bg-background-soft focus-ring"
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.chip}`}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{title}</span>
          {badge ? (
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${styles.chip}`}
            >
              {badge}
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
      </span>
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
