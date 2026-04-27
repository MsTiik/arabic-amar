import Link from "next/link";

import { RuleCard } from "@/components/rule-card";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Grammar reference" };

export default function GrammarPage() {
  const content = getSiteContent();
  const lessonsWithRules = content.lessons.filter((l) => l.ruleIds.length > 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Grammar reference</h1>
        <p className="text-sm text-muted-foreground">
          Quick reference of every rule and pattern from the AMAR notes — searchable by
          lesson.
        </p>
      </header>

      <nav
        aria-label="Grammar lesson jump"
        className="sticky top-24 z-10 mb-6 -mx-4 flex flex-wrap gap-1 overflow-x-auto bg-background/85 px-4 py-2 backdrop-blur"
      >
        {lessonsWithRules.map((l) => (
          <a
            key={l.id}
            href={`#lesson-${l.id}`}
            className="rounded-full border border-border bg-background-soft px-3 py-1 text-xs font-medium hover:bg-muted focus-ring"
          >
            Lesson {l.number}: {l.title}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {lessonsWithRules.map((lesson) => {
          const rules = content.rules.filter((r) => r.lessonId === lesson.id);
          return (
            <section key={lesson.id} id={`lesson-${lesson.id}`}>
              <header className="mb-3 flex items-baseline justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Lesson {lesson.number}: {lesson.title}
                </h2>
                <Link
                  href={`/topics/${lesson.topicSlugs[0]}`}
                  className="text-sm text-primary hover:underline"
                >
                  Open lesson →
                </Link>
              </header>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {rules.map((r) => (
                  <RuleCard key={r.id} rule={r} />
                ))}
              </div>
            </section>
          );
        })}
        {lessonsWithRules.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No grammar rules captured yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
