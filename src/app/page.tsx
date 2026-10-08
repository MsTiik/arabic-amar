import Link from "next/link";

import { CurriculumLevelCard } from "@/components/curriculum-level-card";
import { DashboardHero } from "@/components/dashboard-hero";
import { FoundationsCard } from "@/components/foundations-card";
import { NamesOfAllahTeaser } from "@/components/names-of-allah-teaser";
import { RefreshContentButton } from "@/components/refresh-content-button";
import { CURRICULUM_LEVELS } from "@/data/curriculum";
import { getSiteContent } from "@/lib/content";

export default function Home() {
  const content = getSiteContent();

  return (
    <div className="ambient-hero mx-auto w-full max-w-6xl px-4 py-4 sm:py-5">
      <DashboardHero
        totalVocab={content.vocab.length}
        totalRules={content.rules.length}
        totalLessons={content.lessons.length}
      />

      <div className="mt-8">
        <NamesOfAllahTeaser />
      </div>

      <section className="mt-10">
        <header className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Choose your course</h2>
            <p className="text-sm text-muted-foreground">
              Start with reading foundations, then follow Level 1 or continue into Level 2.
            </p>
          </div>
          <Link
            href="/topics"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
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
      </section>

      <RefreshContentButton />
    </div>
  );
}
