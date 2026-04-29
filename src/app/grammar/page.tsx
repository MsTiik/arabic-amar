import Link from "next/link";

import { RuleCard } from "@/components/rule-card";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Grammar reference" };

const REFERENCE_PAGES = [
  {
    href: "/grammar/pronouns",
    title: "Pronouns",
    titleArabic: "الضمائر",
    description:
      "Detached and attached pronoun tables with usage notes and a Qur'ān example for each.",
    accent: "bg-[oklch(0.93_0.05_350)] text-[oklch(0.30_0.10_350)]",
  },
  {
    href: "/grammar/conjugations",
    title: "Verb conjugations",
    titleArabic: "تَصْرِيف الأَفْعَال",
    description:
      "Past (Māḍī) and present / future (Muḍāriʿ) endings for every person and gender, side by side.",
    accent: "bg-[oklch(0.93_0.05_220)] text-[oklch(0.30_0.10_220)]",
  },
  {
    href: "/grammar/plurals",
    title: "Plural forms",
    titleArabic: "الجَمْع",
    description:
      "Sound masculine, sound feminine, and broken plurals — when each applies and why broken plurals must be memorised.",
    accent: "bg-[oklch(0.93_0.04_60)] text-[oklch(0.30_0.10_60)]",
  },
] as const;

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

      <section aria-label="Reference pages" className="mb-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REFERENCE_PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30 hover:bg-muted focus-ring sm:p-6"
            >
              <span
                className={
                  "self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider " +
                  p.accent
                }
              >
                Reference
              </span>
              <h2 className="text-xl font-semibold tracking-tight">
                {p.title}
                <span
                  lang="ar"
                  dir="rtl"
                  className="ml-2 font-arabic text-base font-normal text-foreground-soft"
                >
                  {p.titleArabic}
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <span className="mt-auto text-xs font-medium text-primary group-hover:underline">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <h2 className="mb-3 text-lg font-semibold tracking-tight">
        Rules by lesson
      </h2>

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
