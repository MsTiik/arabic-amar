import Link from "next/link";

import { FoundationsBadge } from "@/components/foundations-badge";
import { SunMoonDemo } from "@/components/sun-moon-demo";
import { SUN_LETTERS, MOON_LETTERS, ALPHABET } from "@/data/foundations";

export const metadata = { title: "Sun & moon letters · Foundations" };

const lookup = Object.fromEntries(ALPHABET.map((l) => [l.forms.isolated, l]));

export default function SunMoonPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href="/read"
          className="text-sm text-muted-foreground hover:text-foreground focus-ring"
        >
          ← Back to Foundations
        </Link>
      </div>

      <header className="mb-8">
        <div className="mb-3">
          <FoundationsBadge />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Sun & moon letters
          <span
            lang="ar"
            dir="rtl"
            className="ml-3 font-arabic text-2xl font-normal text-foreground-soft"
          >
            الحُرُوف الشَّمْسِيَّة وَالقَمَرِيَّة
          </span>
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Arabic has one definite article: <span className="font-arabic">الـ</span>{" "}
          (al-), meaning “the”. How it’s pronounced depends entirely on the
          first letter of the noun it attaches to. The 28 letters split cleanly
          in half — 14 “sun” letters that swallow the lām, and 14 “moon”
          letters that keep it intact.
        </p>
      </header>

      <section className="mb-8 grid gap-4 lg:grid-cols-2">
        <RuleCard
          tone="sun"
          title="Sun-letter rule"
          titleArabic="الحُرُوف الشَّمْسِيَّة"
          example={{
            bare: "شَمْس",
            withAl: "الشَّمْس",
            translit: "ash-shams",
            gloss: "the sun",
          }}
          description="The lām of ’al-’ is silent. The first letter of the noun is doubled (shaddah). ’al-shams’ is read ’ash-shams’."
        />
        <RuleCard
          tone="moon"
          title="Moon-letter rule"
          titleArabic="الحُرُوف القَمَرِيَّة"
          example={{
            bare: "قَمَر",
            withAl: "الْقَمَر",
            translit: "al-qamar",
            gloss: "the moon",
          }}
          description="The lām of ’al-’ is clearly pronounced (sukūn on the lām). The noun’s first letter starts normally. ’al-qamar’ stays ’al-qamar’."
        />
      </section>

      <section className="mb-10 grid gap-4 lg:grid-cols-2">
        <LetterGridCard
          title="The 14 sun letters"
          subtitle="ash-shamsiyyah — assimilate the lām"
          tone="sun"
          letters={SUN_LETTERS}
        />
        <LetterGridCard
          title="The 14 moon letters"
          subtitle="al-qamariyyah — keep the lām"
          tone="moon"
          letters={MOON_LETTERS}
        />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Try it yourself
        </h2>
        <SunMoonDemo />
      </section>

      <section className="mb-2 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground sm:p-6">
        <h2 className="mb-2 text-base font-semibold text-foreground">
          Why the names?
        </h2>
        <p>
          The two classic words used to illustrate the rule are{" "}
          <span className="font-arabic">الشَّمْس</span> (“the sun”,{" "}
          <em>ash-shams</em>) and <span className="font-arabic">القَمَر</span>{" "}
          (“the moon”, <em>al-qamar</em>). The sun-letter group is named after
          the first and the moon-letter group after the second. It’s just
          terminology — there’s no deeper astronomy involved.
        </p>
      </section>
    </div>
  );
}

function RuleCard({
  tone,
  title,
  titleArabic,
  example,
  description,
}: {
  tone: "sun" | "moon";
  title: string;
  titleArabic: string;
  example: { bare: string; withAl: string; translit: string; gloss: string };
  description: string;
}) {
  const border = tone === "sun" ? "border-accent-gold/40" : "border-primary/25";
  const bg = tone === "sun" ? "bg-accent-gold-soft" : "bg-primary/5";
  return (
    <article className={`rounded-2xl border bg-card p-5 sm:p-6 ${border}`}>
      <h3 className="text-lg font-semibold tracking-tight">
        {title}
        <span
          lang="ar"
          dir="rtl"
          className="ml-2 font-arabic text-base font-normal text-foreground-soft"
        >
          {titleArabic}
        </span>
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className={`mt-4 rounded-xl ${bg} p-4`}>
        <div
          className="flex items-center justify-center gap-3"
          lang="ar"
          dir="rtl"
        >
          <span className="font-arabic-display text-3xl text-foreground-soft line-through decoration-muted-foreground/40">
            {example.bare}
          </span>
          <span className="text-muted-foreground" dir="ltr">
            →
          </span>
          <span className="font-arabic-display text-4xl">
            {example.withAl}
          </span>
        </div>
        <div className="mt-2 text-center text-xs italic text-foreground-soft">
          {example.translit} — {example.gloss}
        </div>
      </div>
    </article>
  );
}

function LetterGridCard({
  title,
  subtitle,
  tone,
  letters,
}: {
  title: string;
  subtitle: string;
  tone: "sun" | "moon";
  letters: readonly string[];
}) {
  const border = tone === "sun" ? "border-accent-gold/40" : "border-primary/25";
  const letterBorder =
    tone === "sun" ? "border-accent-gold/30" : "border-primary/20";
  return (
    <article className={`rounded-2xl border bg-card p-5 ${border}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      <div
        className="mt-3 grid grid-cols-7 gap-1.5"
        lang="ar"
        dir="rtl"
      >
        {letters.map((l) => {
          const entry = lookup[l];
          return (
            <div
              key={l}
              className={`rounded-md border ${letterBorder} bg-background-soft px-1 py-2 text-center`}
              title={entry?.name ?? l}
            >
              <div className="font-arabic-display text-xl">{l}</div>
              {entry ? (
                <div className="text-[9px] italic text-muted-foreground" dir="ltr">
                  {entry.name}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </article>
  );
}
