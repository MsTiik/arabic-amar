import { CurriculumLevelCard } from "@/components/curriculum-level-card";
import { FoundationsCard } from "@/components/foundations-card";
import { CURRICULUM_LEVELS } from "@/data/curriculum";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Lessons" };

export default function TopicsPage() {
  const content = getSiteContent();
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
    </div>
  );
}
