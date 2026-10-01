import Link from "next/link";
import { notFound } from "next/navigation";

import { ArabicText } from "@/components/arabic-text";
import { CurriculumUnitCard } from "@/components/curriculum-unit-card";
import { TopicCard } from "@/components/topic-card";
import { CURRICULUM_LEVELS, getCurriculumLevel } from "@/data/curriculum";
import { getSiteContent } from "@/lib/content";

export function generateStaticParams() {
  return CURRICULUM_LEVELS.map((level) => ({ slug: level.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const level = getCurriculumLevel(slug);
  return level ? { title: level.title } : {};
}

export default async function CurriculumLevelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const level = getCurriculumLevel(slug);
  if (!level) notFound();

  const content = getSiteContent();
  const topics = level.topicSlugs.map((topicSlug) =>
    content.topics.find((topic) => topic.slug === topicSlug),
  );
  if (topics.some((topic) => !topic)) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="brand-panel rounded-3xl border border-border p-6 sm:p-8">
        <Link
          href="/topics"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← All courses
        </Link>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {level.title}
          </h1>
          <ArabicText variant="display" className="text-3xl text-foreground-soft sm:text-4xl">
            {level.titleArabic}
          </ArabicText>
        </div>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-foreground-soft">
          {level.description}
        </p>
        {level.status === "in-progress" ? (
          <p className="mt-4 inline-flex rounded-full bg-accent-gold-soft px-3 py-1 text-xs font-semibold text-accent-gold">
            This course will grow as new material is added.
          </p>
        ) : null}
      </header>

      {level.units ? (
        <section className="mt-8" aria-labelledby="level-units-heading">
          <div className="mb-4">
            <p className="section-label">Explore</p>
            <h2 id="level-units-heading" className="mt-1 text-2xl font-semibold tracking-tight">
              Level 2 topics
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose any topic that interests you. There is no required order.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {level.units.map((unit) => (
              <CurriculumUnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-8" aria-labelledby="level-lessons-heading">
          <div className="mb-4">
            <p className="section-label">Course map</p>
            <h2 id="level-lessons-heading" className="mt-1 text-2xl font-semibold tracking-tight">
              Level 1 lessons
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => {
              if (!topic) return null;
              return (
                <TopicCard
                  key={topic.slug}
                  topic={topic}
                  vocab={content.vocab.filter((entry) => entry.topicSlugs.includes(topic.slug))}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
