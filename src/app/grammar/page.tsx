import Link from "next/link";

import { getRulesForLesson, getSiteContent, grammarLessonSlug } from "@/lib/content";
import { getLessonIdentity } from "@/lib/lesson-identity";

export const metadata = { title: "Grammar reference" };

const REFERENCE_PAGES = [
  {
    href: "/grammar/pronouns",
    title: "Pronouns",
    titleArabic: "الضمائر",
    description:
      "Detached and attached pronoun tables with usage notes and a Qur'ān example for each.",
    accent: "bg-accent-rose-soft text-accent-rose",
  },
  {
    href: "/grammar/conjugations",
    title: "Verb conjugations",
    titleArabic: "تَصْرِيف الأَفْعَال",
    description:
      "Past (Māḍī), present / future (Muḍāriʿ), and command (Amr) forms side by side.",
    accent: "bg-accent-sky-soft text-accent-sky",
  },
  {
    href: "/grammar/plurals",
    title: "Plural forms",
    titleArabic: "الجَمْع",
    description:
      "Sound masculine, sound feminine, and broken plurals — when each applies and why broken plurals must be memorised.",
    accent: "bg-accent-amber-soft text-accent-amber",
  },
] as const;

export default function GrammarPage() {
  const content = getSiteContent();
  const lessonsWithRules = content.lessons.filter((l) => l.ruleIds.length > 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Grammar reference</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Three big reference tables on top, then per-lesson grammar pages
          underneath.
        </p>
      </header>

      <section aria-labelledby="reference-heading" className="mb-12">
        <h2
          id="reference-heading"
          className="section-label mb-3"
        >
          Reference tables
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REFERENCE_PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group card-raised hover-lift flex flex-col gap-2 rounded-2xl p-5 focus-ring sm:p-6"
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
          className="section-label mb-3"
        >
          Rules by lesson
        </h2>
        {lessonsWithRules.length === 0 ? (
          <p className="card-raised rounded-2xl p-6 text-sm text-muted-foreground">
            No grammar rules captured yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessonsWithRules.map((lesson) => {
              const rules = getRulesForLesson(lesson.id);
              const slug = grammarLessonSlug(lesson);
              const identity = getLessonIdentity(lesson.topicSlugs[0] ?? "");
              const Icon = identity.icon;
              return (
                <Link
                  key={lesson.id}
                  href={`/grammar/lessons/${slug}`}
                  className="group card-raised hover-lift flex flex-col gap-2 rounded-2xl p-5 focus-ring sm:p-6"
                >
                  <span
                    className={`flex items-center gap-1.5 self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${identity.chip}`}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
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
