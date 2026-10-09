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
import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_ACTION_SENTENCES,
  type LevelTwoAction,
  type LevelTwoSentence,
} from "@/data/level-two-lessons";
import { cn } from "@/lib/cn";

const UNIT_META = {
  "marketplace-reading": {
    title: "Ahmed goes shopping",
    description:
      "Read a short Arabic passage and explore each word without leaving the page.",
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
    surface: "border-l-4 border-l-accent-sky",
    iconStyle: "bg-accent-sky-soft text-accent-sky",
    cardStyle: "border-l-2 border-l-accent-sky",
    ids: ["write", "read", "explain", "understand", "correct", "think", "ask", "answer", "learn", "revise", "teach", "hear"],
  },
  {
    id: "movement",
    title: "Movement and position",
    description: "Actions that describe where someone goes or how they move.",
    icon: Footprints,
    surface: "border-l-4 border-l-accent-emerald",
    iconStyle: "bg-accent-emerald-soft text-accent-emerald",
    cardStyle: "border-l-2 border-l-accent-emerald",
    ids: ["stand", "sit", "enter", "leave", "walk", "run"],
  },
  {
    id: "everyday",
    title: "Everyday classroom actions",
    description: "Practical actions for objects, pictures, and classroom activities.",
    icon: Shapes,
    surface: "border-l-4 border-l-accent-amber",
    iconStyle: "bg-accent-amber-soft text-accent-amber",
    cardStyle: "border-l-2 border-l-accent-amber",
    ids: ["open", "close", "draw", "colour", "take", "give", "point", "watch", "wipe"],
  },
] as const;

type UnitSlug = keyof typeof UNIT_META;

export function generateStaticParams() {
  return Object.keys(UNIT_META).map((unit) => ({ unit }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ unit: string }>;
}) {
  const { unit } = await params;
  const meta = UNIT_META[unit as UnitSlug];
  return meta ? { title: `${meta.title} · Level 2` } : {};
}

export default async function LevelTwoUnitPage({
  params,
}: {
  params: Promise<{ unit: string }>;
}) {
  const { unit } = await params;
  if (!(unit in UNIT_META)) notFound();
  const slug = unit as UnitSlug;
  const meta = UNIT_META[slug];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="brand-panel rounded-[18px] shadow-[var(--shadow-md),inset_0_1px_0_oklch(1_0_0/8%)] p-6 sm:p-8">
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
      {slug === "actions-in-context" ? <ActionsInContext /> : null}
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
        description="The Arabic is the main focus. Hover with a mouse or tap on a phone to inspect any word."
      />
      <InteractiveArabicReading />
    </section>
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
        <div className="space-y-5">
          {ACTION_GROUPS.map((group) => {
            const actions = LEVEL_TWO_ACTIONS.filter((action) =>
              (group.ids as readonly string[]).includes(action.id),
            );
            const Icon = group.icon;
            return (
              <section key={group.id} className={cn("surface p-4 sm:p-6", group.surface)}>
                <header className="mb-4 flex items-start gap-3">
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px]", group.iconStyle)}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{group.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{group.description}</p>
                  </div>
                </header>
                <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {actions.map((action) => (
                    <ActionCard key={action.id} action={action} className={group.cardStyle} />
                  ))}
                </div>
              </section>
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
    <article className={cn("relative flex min-h-44 flex-col items-center justify-center tile border-l-2 p-4", className)}>
      {action.note ? <InformationTip label={`More about ${action.arabic}`}>{action.note}</InformationTip> : null}
      <ArabicText variant="display" className="text-center text-5xl leading-relaxed sm:text-6xl">
        {action.arabic}
      </ArabicText>
      <p lang="ar-Latn" className="mt-2 text-center text-sm italic text-foreground-soft">
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
    <span className="group absolute right-3 top-3 z-20">
      <button
        type="button"
        aria-label={label}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-card/90 text-muted-foreground shadow-sm transition-colors hover:text-primary focus-ring"
      >
        <Info className="h-4 w-4" aria-hidden />
      </button>
      <span
        role="tooltip"
        className="absolute right-0 top-10 hidden w-64 tile p-3 text-left text-xs leading-relaxed text-foreground-soft shadow-lg group-hover:block group-focus-within:block"
      >
        {children}
      </span>
    </span>
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
