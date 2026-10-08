import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <div className="ambient-hero mx-auto w-full max-w-6xl px-4 py-5 sm:py-7">
      <DashboardHero
        totalVocab={content.vocab.length}
        totalRules={content.rules.length}
        totalLessons={content.lessons.length}
      />

      <div className="mt-10">
        <NamesOfAllahTeaser />
      </div>

      <section className="mt-12">
        <header className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Courses</p>
            <h2 className="font-display mt-1 text-[1.75rem] leading-tight">Choose your course</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start with reading foundations, then follow Level 1 or continue into Level 2.
            </p>
          </div>
          <Link
            href="/topics"
            className="btn btn-secondary btn-sm shrink-0 focus-ring"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
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
