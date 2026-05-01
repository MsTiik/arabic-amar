import Link from "next/link";
import { notFound } from "next/navigation";

import { RuleRenderer } from "@/components/rule-renderer";
import {
  getLessonByGrammarSlug,
  getRulesForLesson,
  getSiteContent,
  grammarLessonSlug,
} from "@/lib/content";

export function generateStaticParams() {
  return getSiteContent()
    .lessons.filter((l) => l.ruleIds.length > 0)
    .map((l) => ({ slug: grammarLessonSlug(l) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonByGrammarSlug(slug);
  if (!lesson) return {};
  return { title: `${lesson.title} grammar` };
}

export default async function GrammarLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonByGrammarSlug(slug);
  if (!lesson) notFound();

  const rules = getRulesForLesson(lesson.id);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link href="/grammar" className="hover:text-foreground hover:underline">
            Grammar reference
          </Link>{" "}
          / Lesson {lesson.number}
        </p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {lesson.title}
            {lesson.titleArabic ? (
              <span
                lang="ar"
                dir="rtl"
                className="ml-3 font-arabic text-2xl font-normal text-foreground-soft"
              >
                {lesson.titleArabic}
              </span>
            ) : null}
          </h1>
          <Link
            href={`/topics/${lesson.topicSlugs[0]}`}
            className="text-sm text-primary hover:underline"
          >
            Open lesson page →
          </Link>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {rules.length} grammar {rules.length === 1 ? "rule" : "rules"} for this lesson.
        </p>
      </header>

      <div className="flex gap-8">
        <aside
          aria-label="Rules in this lesson"
          className="hidden w-56 shrink-0 lg:block"
        >
          <nav className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-border bg-card p-3">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rules
            </p>
            <ol className="space-y-1">
              {rules.map((r, i) => (
                <li key={r.id}>
                  <a
                    href={`#${r.id}`}
                    className="block rounded-lg px-2 py-1.5 text-sm leading-snug text-foreground-soft hover:bg-muted focus-ring"
                  >
                    <span className="mr-1 text-xs text-muted-foreground">
                      {i + 1}.
                    </span>
                    {r.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Mobile chip-row TOC (hidden once the rail kicks in at lg). */}
          <nav
            aria-label="Rules jump"
            className="-mx-4 mb-6 flex flex-wrap gap-1 overflow-x-auto bg-background/85 px-4 py-2 lg:hidden"
          >
            {rules.map((r, i) => (
              <a
                key={r.id}
                href={`#${r.id}`}
                className="rounded-full border border-border bg-background-soft px-3 py-1 text-xs font-medium text-foreground-soft hover:bg-muted focus-ring"
              >
                {i + 1}. {r.title}
              </a>
            ))}
          </nav>

          {rules.length === 0 ? (
            <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              No grammar rules in this lesson yet.
            </p>
          ) : (
            <div className="space-y-6">
              {rules.map((rule) => (
                <section key={rule.id} id={rule.id} className="scroll-mt-24">
                  <RuleRenderer rule={rule} />
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
