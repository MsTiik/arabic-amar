import Link from "next/link";

import { ConjugationTable } from "@/components/conjugation-table";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Verb conjugations" };

export default function ConjugationsPage() {
  const content = getSiteContent();
  const past = content.conjugations.filter((c) => c.tense === "past");
  const presentFuture = content.conjugations.filter(
    (c) => c.tense === "present-future",
  );
  const intro = content.grammarIntros.find((g) => g.section === "conjugations");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link
            href="/grammar"
            className="hover:text-foreground hover:underline"
          >
            Grammar reference
          </Link>{" "}
          / Verb conjugations
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Verb conjugations (
          <span lang="ar" dir="rtl">
            تَصْرِيف الأَفْعَال
          </span>
          )
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Past tense (<span lang="ar-Latn" className="italic">Māḍī</span>) and
          present / future tense (
          <span lang="ar-Latn" className="italic">Muḍāriʿ</span>) endings for
          every person and gender, side by side. Switch tense with the tabs.
        </p>
      </header>

      {intro && intro.paragraphs.length > 0 ? (
        <section className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            About the tenses
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-foreground-soft sm:text-base">
            {intro.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      <ConjugationTable past={past} presentFuture={presentFuture} />
    </div>
  );
}
