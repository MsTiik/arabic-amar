import Link from "next/link";

import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Plural forms" };

const TYPE_BADGES: Record<string, string> = {
  "Sound plural (masculine)":
    "bg-[oklch(0.92_0.04_220)] text-[oklch(0.30_0.10_220)]",
  "Sound plural (feminine)":
    "bg-[oklch(0.93_0.05_350)] text-[oklch(0.30_0.10_350)]",
  "Broken plural":
    "bg-[oklch(0.93_0.04_60)] text-[oklch(0.30_0.10_60)]",
};

export default function PluralsPage() {
  const content = getSiteContent();
  const intro = content.grammarIntros.find((g) => g.section === "plurals");
  const forms = content.pluralForms;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link
            href="/grammar"
            className="hover:text-foreground hover:underline"
          >
            Grammar reference
          </Link>{" "}
          / Plural forms
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Plural forms (الجَمْع)
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          The three ways Arabic forms plurals: two predictable &ldquo;sound&rdquo;
          patterns plus the &ldquo;broken&rdquo; pattern that has to be
          memorised word by word.
        </p>
      </header>

      {intro && intro.paragraphs.length > 0 ? (
        <section className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Why three systems?
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-foreground-soft sm:text-base">
            {intro.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      {forms.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          No plural rules captured yet — try refreshing from the source doc.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {forms.map((f) => (
            <article
              key={f.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <span
                className={
                  "self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider " +
                  (TYPE_BADGES[f.type] ??
                    "bg-background-soft text-foreground-soft")
                }
              >
                {f.type}
              </span>

              {f.howToForm ? (
                <p className="text-base font-medium text-foreground">
                  {f.howToForm}
                </p>
              ) : null}

              {f.rule ? (
                <p className="text-sm leading-relaxed text-foreground-soft">
                  {f.rule}
                </p>
              ) : null}

              {f.examples.length > 0 ? (
                <div className="mt-1 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Examples
                  </p>
                  <ul className="space-y-2">
                    {f.examples.map((ex, i) => (
                      <li
                        key={i}
                        className="rounded-xl bg-background-soft p-3"
                      >
                        <p
                          className="font-arabic text-lg leading-relaxed text-foreground sm:text-xl"
                          lang="ar"
                          dir="rtl"
                        >
                          {ex.arabic}
                        </p>
                        {ex.english ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {ex.english}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
