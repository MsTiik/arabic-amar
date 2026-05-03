import Link from "next/link";

import { getRulesForLesson, getSiteContent, grammarLessonSlug } from "@/lib/content";

export const metadata = { title: "Grammar reference" };

const REFERENCE_PAGES = [
  {
    href: "/grammar/pronouns",
    title: "Pronouns",
    titleArabic: "الضمائر",
    description:
      "Detached and attached pronoun tables with usage notes and a Qur'ān example for each.",
    accent:
      "bg-[oklch(0.93_0.05_350)] text-[oklch(0.30_0.10_350)] dark:bg-[oklch(0.30_0.06_350)] dark:text-[oklch(0.85_0.08_350)]",
  },
  {
    href: "/grammar/conjugations",
    title: "Verb conjugations",
    titleArabic: "تَصْرِيف الأَفْعَال",
    description:
      "Past (Māḍī) and present / future (Muḍāriʿ) endings for every person and gender, side by side.",
    accent:
      "bg-[oklch(0.93_0.05_220)] text-[oklch(0.30_0.10_220)] dark:bg-[oklch(0.30_0.06_220)] dark:text-[oklch(0.85_0.08_220)]",
  },
  {
    href: "/grammar/plurals",
    title: "Plural forms",
    titleArabic: "الجَمْع",
    description:
      "Sound masculine, sound feminine, and broken plurals — when each applies and why broken plurals must be memorised.",
    accent:
      "bg-[oklch(0.93_0.04_60)] text-[oklch(0.30_0.10_60)] dark:bg-[oklch(0.30_0.06_60)] dark:text-[oklch(0.85_0.08_60)]",
  },
] as const;

export default function GrammarPage() {
  const content = getSiteContent();
  const lessonsWithRules = content.lessons.filter((l) => l.ruleIds.length > 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Grammar reference</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Three big reference tables on top, then per-lesson grammar pages
          underneath.
        </p>
      </header>

      <section aria-labelledby="reference-heading" className="mb-12">
        <h2
          id="reference-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Reference tables
        </h2>
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
              <h3 className="text-xl font-semibold tracking-tight">
                {p.title}
                <span
                  lang="ar"
                  dir="rtl"
                  className="ml-2 font-arabic text-base font-normal text-foreground-soft"
                >
                  {p.titleArabic}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <span className="mt-auto text-xs font-medium text-primary group-hover:underline">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="lessons-heading">
        <h2
          id="lessons-heading"
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Rules by lesson
        </h2>
        {lessonsWithRules.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No grammar rules captured yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessonsWithRules.map((lesson) => {
              const rules = getRulesForLesson(lesson.id);
              const slug = grammarLessonSlug(lesson);
              return (
                <Link
                  key={lesson.id}
                  href={`/grammar/lessons/${slug}`}
                  className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30 hover:bg-muted focus-ring sm:p-6"
                >
                  <span className="self-start rounded-full bg-background-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-soft">
                    Lesson {lesson.number}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {lesson.title}
                    {lesson.titleArabic ? (
                      <span
                        lang="ar"
                        dir="rtl"
                        className="ml-2 font-arabic text-base font-normal text-foreground-soft"
                      >
                        {lesson.titleArabic}
                      </span>
                    ) : null}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {rules.length} {rules.length === 1 ? "rule" : "rules"}
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-foreground-soft">
                    {rules.slice(0, 4).map((r) => (
                      <li key={r.id} className="flex gap-2 text-pretty">
                        <span aria-hidden="true" className="text-muted-foreground">•</span>
                        <span className="line-clamp-1">{r.title}</span>
                      </li>
                    ))}
                    {rules.length > 4 ? (
                      <li className="text-xs text-muted-foreground">
                        + {rules.length - 4} more
                      </li>
                    ) : null}
                  </ul>
                  <span className="mt-auto pt-2 text-xs font-medium text-primary group-hover:underline">
                    Open lesson grammar →
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
