import Link from "next/link";

import { CurriculumLevelCard } from "@/components/curriculum-level-card";
import { CurriculumUnitCard } from "@/components/curriculum-unit-card";
import { FoundationsCard } from "@/components/foundations-card";
import { TopicCard } from "@/components/topic-card";
import { CURRICULUM_LEVELS, getCurriculumLevel } from "@/data/curriculum";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Lessons" };

export default function TopicsPage() {
  const content = getSiteContent();
  const levelOne = getCurriculumLevel("level-1");
  const levelTwo = getCurriculumLevel("level-2");
  const levelOneTopics = (levelOne?.topicSlugs ?? [])
    .map((slug) => content.topics.find((topic) => topic.slug === slug))
    .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-6">
        <p className="section-label">Curriculum</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Courses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Foundations is the reading course. Each numbered level keeps its lessons,
          grammar, and practice together without duplicating your word progress.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FoundationsCard />
        {CURRICULUM_LEVELS.map((level) => (
          <CurriculumLevelCard
            key={level.slug}
            level={level}
            vocab={content.vocab.filter((entry) =>
              entry.topicSlugs.some((slug) => level.topicSlugs.includes(slug)),
            )}
          />
        ))}
      </div>

      {levelOneTopics.length > 0 ? (
        <section className="mt-12" aria-labelledby="topics-level-1-heading">
          <header className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Course map</p>
              <h2 id="topics-level-1-heading" className="mt-1 text-2xl font-semibold tracking-tight">
                Level 1 lessons
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Twelve lessons in course order. Jump straight into any lesson.
              </p>
            </div>
            <Link
              href="/levels/level-1"
              className="shrink-0 text-sm font-medium text-primary hover:underline"
            >
              Level 1 overview
            </Link>
          </header>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {levelOneTopics.map((topic) => (
              <TopicCard
                key={topic.slug}
                topic={topic}
                vocab={content.vocab.filter((entry) => entry.topicSlugs.includes(topic.slug))}
              />
            ))}
          </div>
        </section>
      ) : null}

      {levelTwo?.units?.length ? (
        <section className="mt-12" aria-labelledby="topics-level-2-heading">
          <header className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Growing course</p>
              <h2 id="topics-level-2-heading" className="mt-1 text-2xl font-semibold tracking-tight">
                Level 2 topics
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                New material is added as the course continues. Study these in any order.
              </p>
            </div>
            <Link
              href="/levels/level-2"
              className="shrink-0 text-sm font-medium text-primary hover:underline"
            >
              Level 2 overview
            </Link>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {levelTwo.units.map((unit) => (
              <CurriculumUnitCard key={unit.id} unit={unit} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
