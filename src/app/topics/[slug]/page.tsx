import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryJumpNav } from "@/components/category-jump-nav";
import { TopicTabs } from "@/components/topic-tabs";
import { TopicHeader } from "@/components/topic-header";
import { VocabCard } from "@/components/vocab-card";
import { vocabCardSpansTwoCols } from "@/lib/vocab-card-layout";
import { RuleCard } from "@/components/rule-card";
import {
  getRulesForTopic,
  getSiteContent,
  getTopicBySlug,
  getVocabForTopic,
  groupVocabByCategory,
} from "@/lib/content";
import type { VocabEntry } from "@/lib/types";

export function generateStaticParams() {
  return getSiteContent().topics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};
  return { title: topic.name };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const vocab = getVocabForTopic(slug);
  const rules = getRulesForTopic(slug);
  const groups = groupVocabByCategory(vocab);
  const navItems = groups.map((g) => ({
    id: `cat-${slugify(g.category)}`,
    label: g.category,
    count: g.entries.length,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <TopicHeader topic={topic} vocab={vocab} ruleCount={rules.length} />

      <TopicTabs
        slug={slug}
        vocabCount={vocab.length}
        ruleCount={rules.length}
      >
        {{
          vocab: (
            <div className="mt-6 flex gap-8">
              <CategoryJumpNav categories={navItems} />
              <div className="min-w-0 flex-1 space-y-10">
                {groups.map((group) => (
                  <section key={group.category} id={`cat-${slugify(group.category)}`}>
                    <header className="mb-3 flex items-baseline justify-between">
                      <h3 className="text-xl font-semibold tracking-tight">
                        {group.category}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {group.entries.length} words
                      </span>
                    </header>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {group.entries.map((entry) => (
                        <VocabCard
                          key={entry.id}
                          entry={entry}
                          size="md"
                          className={vocabCardSpansTwoCols(entry) ? "sm:col-span-2" : undefined}
                        />
                      ))}
                    </div>
                  </section>
                ))}
                {groups.length === 0 ? (
                  <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                    No vocabulary captured for this lesson yet.
                  </p>
                ) : null}
              </div>
            </div>
          ),
          rules: (
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {rules.length === 0 ? (
                <p className="col-span-full rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  No grammar rules in this lesson — practice with the vocabulary deck instead.
                </p>
              ) : (
                rules.map((rule) => <RuleCard key={rule.id} rule={rule} />)
              )}
            </div>
          ),
          practice: (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <PracticeLink
                href={`/practice?topic=${slug}&kind=flashcard`}
                title="Flashcards"
                description="Tap to flip and self-rate every word in this lesson."
              />
              <PracticeLink
                href={`/practice?topic=${slug}&kind=mc`}
                title="Multiple choice"
                description="Mixed Arabic↔English↔transliteration questions."
              />
              <PracticeLink
                href={`/practice?topic=${slug}&kind=fill`}
                title="Type the transliteration"
                description="Fill-in-the-blank for pronunciation practice."
              />
              {vocab.some((v) => v.gender) ? (
                <PracticeLink
                  href={`/practice?topic=${slug}&kind=gender`}
                  title="Gender quiz"
                  description="Decide whether each noun is masculine or feminine."
                />
              ) : null}
              {hasOrderingDeck(slug, vocab) ? (
                <PracticeLink
                  href={`/practice?topic=${slug}&kind=ordering`}
                  title="Ordering"
                  description={orderingCopyFor(slug)}
                />
              ) : null}
            </div>
          ),
        }}
      </TopicTabs>
    </div>
  );
}

function PracticeLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 rounded-2xl border border-border bg-card p-5 hover-lift focus-ring"
    >
      <h4 className="text-base font-semibold">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
      <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Start →
      </span>
    </Link>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Surface the Ordering deck wherever the underlying vocab actually has
 * sequenced data. Mirrors the columns `makeOrderingDeck` understands so we
 * don't show the deck for a topic where it would have nothing to order.
 */
function hasOrderingDeck(slug: string, vocab: VocabEntry[]): boolean {
  const fields = orderingFieldsFor(slug);
  if (fields.length === 0) return false;
  return fields.some((field) =>
    vocab.filter((v) => typeof v[field] === "number").length >= 4,
  );
}

function orderingFieldsFor(
  slug: string,
): Array<"numericValue" | "weekdayIndex" | "monthIndex"> {
  if (slug === "numbers") return ["numericValue"];
  if (slug === "days-of-the-week") return ["weekdayIndex"];
  if (slug === "islamic-and-gregorian-months") return ["monthIndex"];
  return [];
}

function orderingCopyFor(slug: string): string {
  if (slug === "islamic-and-gregorian-months") {
    return "Drag tiles into the correct calendar month order.";
  }
  if (slug === "days-of-the-week") {
    return "Drag tiles into the correct weekday order.";
  }
  return "Drag tiles into the correct numeric order.";
}
