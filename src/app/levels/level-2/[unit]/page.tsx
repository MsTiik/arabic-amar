import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpenText,
  ChevronDown,
  Footprints,
  Info,
  ListChecks,
  Shapes,
  Waypoints,
} from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { InteractiveArabicReading } from "@/components/interactive-arabic-reading";
import { VocabSetView } from "@/components/vocab-set-view";
import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_ACTION_SENTENCES,
  LEVEL_TWO_KHALIDS_HOUSE,
  LEVEL_TWO_MARKETPLACE_PASSAGE,
  LEVEL_TWO_MARKETPLACE_READING,
  readingSentenceToArabic,
  type LevelTwoAction,
  type LevelTwoReadingQuestion,
  type LevelTwoSentence,
} from "@/data/level-two-lessons";
import { LEVEL_TWO_VOCAB_THEMES, getLevelTwoVocabTheme } from "@/data/level-two-vocab-sets";
import { cn } from "@/lib/cn";

const UNIT_META = {
  "marketplace-reading": {
    title: "Ahmed goes shopping",
    description:
      "Read a short Arabic passage and explore each word without leaving the page.",
  },
  "khalids-house": {
    title: "Khalid’s house",
    description:
      "Read a short description of Khalid’s house, tap any word to check it, then answer eight questions about it.",
  },
  "actions-in-context": {
    title: "Action verbs in context",
    description:
      "Build a visual bank of useful present-tense verbs, then open examples only when you need them.",
  },
} as const;

const ACTION_GROUPS = [
  {
    id: "learning",
    title: "Learning and language",
    description: "Actions used for reading, writing, understanding, and teaching.",
    icon: BookOpenText,
    surface: "border-accent-sky/45 bg-card border-l-4 border-l-accent-sky",
    iconStyle: "bg-accent-sky-soft text-accent-sky",
    countStyle: "border-accent-sky/30 bg-accent-sky-soft text-accent-sky",
    cardStyle: "border-border border-l-4 border-l-accent-sky bg-card",

    ids: ["write", "read", "explain", "understand", "correct", "think", "ask", "answer", "learn", "revise", "teach", "hear"],
  },
  {
    id: "movement",
    title: "Movement and position",
    description: "Actions that describe where someone goes or how they move.",
    icon: Footprints,
    surface: "border-accent-emerald/45 bg-card border-l-4 border-l-accent-emerald",
    iconStyle: "bg-accent-emerald-soft text-accent-emerald",
    countStyle: "border-accent-emerald/30 bg-accent-emerald-soft text-accent-emerald",
    cardStyle: "border-border border-l-4 border-l-accent-emerald bg-card",

    ids: ["stand", "sit", "enter", "leave", "walk", "run"],
  },
  {
    id: "everyday",
    title: "Everyday classroom actions",
    description: "Practical actions for objects, pictures, and classroom activities.",
    icon: Shapes,
    surface: "border-accent-amber/45 bg-card border-l-4 border-l-accent-amber",
    iconStyle: "bg-accent-amber-soft text-accent-amber",
    countStyle: "border-accent-amber/30 bg-accent-amber-soft text-accent-amber",
    cardStyle: "border-border border-l-4 border-l-accent-amber bg-card",

    ids: ["open", "close", "draw", "colour", "take", "give", "point", "watch", "wipe"],
  },
] as const;

type UnitSlug = keyof typeof UNIT_META;

export function generateStaticParams() {
  return [
    ...Object.keys(UNIT_META),
    ...LEVEL_TWO_VOCAB_THEMES.map((theme) => theme.slug),
  ].map((unit) => ({ unit }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ unit: string }>;
}) {
  const { unit } = await params;
  const meta = UNIT_META[unit as UnitSlug] ?? getLevelTwoVocabTheme(unit);
  return meta ? { title: `${meta.title} · Level 2` } : {};
}

export default async function LevelTwoUnitPage({
  params,
}: {
  params: Promise<{ unit: string }>;
}) {
  const { unit } = await params;
  const vocabTheme = getLevelTwoVocabTheme(unit);
  if (vocabTheme) return <VocabThemePage theme={vocabTheme} />;
  if (!(unit in UNIT_META)) notFound();
  const slug = unit as UnitSlug;
  const meta = UNIT_META[slug];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="brand-panel rounded-[18px] shadow-[var(--shadow-md),inset_0_1px_0_oklch(1_0_0/8%)] p-5 sm:p-8">
        <Link
          href="/levels/level-2"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Level 2 topics
        </Link>
        <h1 className="mt-4 max-w-4xl page-title">
          {meta.title}
        </h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-foreground-soft">
          {meta.description}
        </p>
      </header>

      {slug === "marketplace-reading" ? <MarketplaceReading /> : null}
      {slug === "khalids-house" ? <KhalidsHouseReading /> : null}
      {slug === "actions-in-context" ? <ActionsInContext /> : null}
    </div>
  );
}

function VocabThemePage({ theme }: { theme: NonNullable<ReturnType<typeof getLevelTwoVocabTheme>> }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="brand-panel rounded-[18px] shadow-[var(--shadow-md),inset_0_1px_0_oklch(1_0_0/8%)] p-5 sm:p-8">
        <Link
          href="/levels/level-2"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Level 2 topics
        </Link>
        <p className="mt-4 section-label">Level 2 vocabulary</p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="page-title">{theme.title}</h1>
          <ArabicText variant="display" as="p" className="text-2xl text-foreground-soft sm:text-3xl">
            {theme.titleArabic}
          </ArabicText>
        </div>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-foreground-soft">
          {theme.description}
        </p>
        <Link href="/vocabulary" className="mt-4 btn btn-secondary btn-sm">
          Search these words in the vocabulary bank
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </header>

      <section className="mt-8" aria-label={`${theme.title} word cards`}>
        <VocabSetView theme={theme} />
      </section>
    </div>
  );
}

function MarketplaceReading() {
  return (
    <section className="mt-8" aria-labelledby="marketplace-passage-heading">
      <SectionHeading
        id="marketplace-passage-heading"
        eyebrow="Interactive reading"
        title="Read first, then explore"
        description="The Arabic is the main focus. Tap any word (or hover with a mouse) to see its meaning."
      />
      <InteractiveArabicReading
        sentences={LEVEL_TWO_MARKETPLACE_READING}
        english={LEVEL_TWO_MARKETPLACE_PASSAGE.english}
      />
    </section>
  );
}

function KhalidsHouseReading() {
  const reading = LEVEL_TWO_KHALIDS_HOUSE;
  return (
    <div className="mt-8 space-y-10">
      <section aria-labelledby="khalid-passage-heading">
        <SectionHeading
          id="khalid-passage-heading"
          eyebrow="Interactive reading"
          title="Read first, then explore"
          description="Tap any word (or hover with a mouse) to see its meaning."
        />
        <InteractiveArabicReading sentences={reading.sentences} english={reading.english} />
      </section>

      <section aria-labelledby="khalid-questions-heading">
        <SectionHeading
          id="khalid-questions-heading"
          eyebrow="Exercise"
          title="Answer the questions"
          description="Answer each question in Arabic first, then tap it to check the answer."
        />
        <ol className="grid gap-2 sm:gap-3 md:grid-cols-2">
          {reading.questions.map((question, index) => (
            <ReadingQuestionCard key={question.id} question={question} number={index + 1} />
          ))}
        </ol>
      </section>

      <LessonLink
        href="/levels/level-2/home-and-places"
        title="Study the words from this story"
        body="The Bayt to Masjid cards cover بَيْت, حَدِيقَة, طَابِق, قَرِيب and more, with their forms and example sentences."
      />
    </div>
  );
}

function ReadingQuestionCard({
  question,
  number,
}: {
  question: LevelTwoReadingQuestion;
  number: number;
}) {
  return (
    <li>
      <details className="group surface h-full p-3 sm:p-4">
        <summary className="flex cursor-pointer list-none items-center gap-3 focus-ring [&::-webkit-details-marker]:hidden">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold tabular-nums text-primary">
            {number}
          </span>
          <span className="min-w-0 flex-1">
            <ArabicText className="text-2xl leading-loose sm:text-3xl">
              {readingSentenceToArabic(question.question)}
            </ArabicText>
            <span lang="ar-Latn" className="block text-sm italic text-foreground-soft">
              {question.question.transliteration}
            </span>
            <span className="block text-xs text-muted-foreground">{question.question.english}</span>
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="mt-2 border-t border-hairline pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Answer</p>
          <ArabicText className="text-2xl leading-loose text-foreground sm:text-3xl">
            {readingSentenceToArabic(question.answer)}
          </ArabicText>
          <p lang="ar-Latn" className="text-sm italic text-foreground-soft">
            {question.answer.transliteration}
          </p>
          <p className="text-sm font-medium">{question.answer.english}</p>
        </div>
      </details>
    </li>
  );
}

function ActionsInContext() {
  return (
    <div className="mt-8 space-y-10">
      <section aria-labelledby="action-bank-heading">
        <SectionHeading
          id="action-bank-heading"
          eyebrow="Visual verb bank"
          title={`${LEVEL_TWO_ACTIONS.length} present-tense actions`}
          description="The colours group related ideas. Each Arabic form means ‘he …’; use the information icon for an occasional extra note."
        />
        <div className="space-y-3">
          {ACTION_GROUPS.map((group) => {
            const actions = LEVEL_TWO_ACTIONS.filter((action) =>
              (group.ids as readonly string[]).includes(action.id),
            );
            const Icon = group.icon;
            return (
              <details
                key={group.id}
                className={cn("group overflow-hidden rounded-3xl border shadow-sm", group.surface)}
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4 focus-ring sm:p-5 [&::-webkit-details-marker]:hidden">
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", group.iconStyle)}>

                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-semibold">{group.title}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{group.description}</span>
                  </span>
                  <span className={cn("hidden rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums sm:inline-flex", group.countStyle)}>
                    {actions.length} actions
                  </span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <div className="border-t border-border bg-background-soft/40 p-4 sm:p-5">
                <div className="grid auto-rows-fr grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-4">
                  {actions.map((action) => (
                    <ActionCard key={action.id} action={action} className={group.cardStyle} />
                  ))}
                </div>

                </div>
              </details>
            );
          })}
        </div>
      </section>

      <ActionSentenceCollection sentences={LEVEL_TWO_ACTION_SENTENCES} />

      <div className="grid gap-4 md:grid-cols-2">
        <LessonLink
          href="/grammar/lessons/verbs-in-the-classroom"
          title="Study the full verb tables"
          body="Compare past, present, command, and verbal noun forms side by side."
        />
        <LessonLink
          href="/practice/verb-families"
          title="Explore and sort verb families"
          body="See how related Arabic forms grow from the same root."
        />
      </div>
    </div>
  );
}

function ActionCard({
  action,
  className,
}: {
  action: LevelTwoAction;
  className: string;
}) {
  return (
    <article className={cn("relative flex min-h-36 flex-col items-center justify-center rounded-2xl border p-4 shadow-sm tile border-l-2 px-2 py-3 sm:min-h-44 sm:p-4", className)}>
      {action.note ? <InformationTip label={`More about ${action.arabic}`}>{action.note}</InformationTip> : null}
      <ArabicText variant="display" className="text-center text-[2rem] leading-relaxed sm:text-5xl">

        {action.arabic}
      </ArabicText>
      <p lang="ar-Latn" className="mt-1 text-center text-sm italic text-foreground-soft sm:mt-2">
        {action.transliteration}
      </p>
      <p className="mt-1 text-center text-sm font-semibold">{action.english}</p>
    </article>
  );
}

function InformationTip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    // `<details>` so a tap opens it on phones, where hover/focus tooltips
    // never appear. The note is positioned against the card (not the icon)
    // so it can't spill off-screen from a left-column card.
    <details className="group">
      <summary
        aria-label={label}
        className="absolute right-1.5 top-1.5 z-20 flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-full border border-hairline bg-card/90 text-muted-foreground shadow-sm transition-colors hover:text-primary focus-ring group-open:text-primary sm:right-3 sm:top-3 [&::-webkit-details-marker]:hidden"
      >
        <Info className="h-4 w-4" aria-hidden />
      </summary>
      <span className="absolute inset-x-1.5 top-11 z-20 block tile p-3 text-left text-xs leading-relaxed text-foreground-soft shadow-lg sm:inset-x-auto sm:right-3 sm:top-[3.25rem] sm:w-64">
        {children}
      </span>
    </details>
  );
}

function ActionSentenceCollection({ sentences }: { sentences: readonly LevelTwoSentence[] }) {
  return (
    <section aria-labelledby="action-sentences-heading">
      <SectionHeading
        id="action-sentences-heading"
        eyebrow="See the verbs in context"
        title="Open one sentence at a time"
        description="Read the Arabic first. Open a card only when you want to check the meaning."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {sentences.map((sentence) => (
          <details key={sentence.id} className="group surface p-4 sm:p-5">
            <summary className="flex cursor-pointer list-none items-center gap-3 focus-ring">
              <ArabicText className="min-w-0 flex-1 text-2xl leading-loose sm:text-3xl">
                {sentence.arabic}
              </ArabicText>
              <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="mt-3 border-t border-hairline pt-3 text-sm leading-relaxed text-foreground-soft">
              {sentence.english}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-4">
      <p className="section-label">{eyebrow}</p>
      <h2 id={id} className="mt-1 sm:text-3xl section-title">
        {title}
      </h2>
      {description ? (
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}

function LessonLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-[10px] border border-primary/30 bg-primary-soft p-5 hover-lift focus-ring"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
        {href.includes("verb-families") ? (
          <Waypoints className="h-5 w-5" aria-hidden />
        ) : (
          <ListChecks className="h-5 w-5" aria-hidden />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="mt-1 block text-sm text-foreground-soft">{body}</span>
      </span>
      <ArrowRight className="mt-3 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}
