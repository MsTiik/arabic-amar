import Link from "next/link";

import { ArabicText } from "@/components/arabic-text";
import { FoundationsBadge } from "@/components/foundations-badge";
import { LetterSpeakerButton } from "@/components/letter-speaker-button";
import { MADD_LETTERS } from "@/data/foundations";

export const metadata = { title: "Long vowels (Madd) · Read Qur’ān" };

export default function MaddPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href="/read"
          className="text-sm text-muted-foreground hover:text-foreground focus-ring"
        >
          ← Back to Read Qur’ān
        </Link>
      </div>

      <header className="mb-8">
        <div className="mb-3">
          <FoundationsBadge />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Long vowels — Madd
          <span
            lang="ar"
            dir="rtl"
            className="ml-3 font-arabic text-2xl font-normal text-foreground-soft"
          >
            حُرُوف المَدّ
          </span>
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Three letters — <span className="font-arabic text-base">ا</span>,{" "}
          <span className="font-arabic text-base">و</span>, and{" "}
          <span className="font-arabic text-base">ي</span> — can act as
          elongation letters when they carry a sukūn and are preceded by a
          matching short vowel. Their sound is held for <strong>2 counts</strong>{" "}
          in normal recitation (longer in specific tajwīd contexts).
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
          The rule at a glance
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {MADD_LETTERS.map((m) => (
            <div
              key={m.slug}
              className="rounded-xl border border-primary/20 bg-card p-4 text-center sm:p-5"
            >
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {m.precededBy} +{" "}
                <ArabicText variant="inline" as="span" className="text-lg">
                  {m.letter}ْ
                </ArabicText>
              </div>
              <div
                className="font-arabic-display text-5xl leading-tight sm:text-6xl"
                lang="ar"
                dir="rtl"
              >
                {m.longForm}
              </div>
              <div className="mt-2 text-sm italic text-foreground-soft">
                {m.longTranslit} (2 counts)
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {MADD_LETTERS.map((m) => (
          <article
            key={m.slug}
            className="rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold tracking-tight">
                {m.name}
                <span
                  lang="ar"
                  dir="rtl"
                  className="ml-2 font-arabic text-base font-normal text-foreground-soft"
                >
                  {m.nameArabic}
                </span>
              </h3>
              <span className="text-xs text-muted-foreground">
                Preceded by {m.precededBy}
              </span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CompareBlock
                title="Short"
                syllable={m.shortForm}
                translit={m.shortTranslit}
                counts="1 count"
                tone="muted"
              />
              <CompareBlock
                title="Long (madd)"
                syllable={m.longForm}
                translit={m.longTranslit}
                counts="2 counts"
                tone="gold"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-background-soft px-3 py-2">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Qur’ānic example
                </span>
                <div className="mt-1">
                  <ArabicText variant="display" as="span" className="text-2xl">
                    {m.example.arabic}
                  </ArabicText>
                  <span className="ml-2 text-xs italic text-foreground-soft">
                    {m.example.translit}
                  </span>
                  <span className="ml-2 text-[11px] text-muted-foreground">
                    — {m.example.gloss}
                  </span>
                  {m.example.citation ? (
                    <div className="text-[10px] text-muted-foreground">
                      {m.example.citation}
                    </div>
                  ) : null}
                </div>
              </div>
              <LetterSpeakerButton
                text={m.example.arabic}
                ariaLabel={`Play pronunciation of ${m.example.translit}`}
                size="sm"
              />
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="mb-2 text-base font-semibold text-foreground">
          Beyond the basic 2-count madd
        </h2>
        <p>
          Quranic recitation distinguishes several advanced types of madd
          (madd muttaṣil, munfaṣil, ʿāriḍ li-s-sukūn, lāzim, badal) that may
          be held for 4 or 6 counts. Those rules are covered under tajwīd —
          outside the scope of this reference page. For now, any madd letter
          you encounter can be safely held for 2 counts.
        </p>
      </section>
    </div>
  );
}

function CompareBlock({
  title,
  syllable,
  translit,
  counts,
  tone,
}: {
  title: string;
  syllable: string;
  translit: string;
  counts: string;
  tone: "gold" | "muted";
}) {
  const border = tone === "gold" ? "border-accent-gold/40" : "border-border";
  const bg = tone === "gold" ? "bg-accent-gold-soft" : "bg-background-soft";
  return (
    <div className={`rounded-xl border ${border} ${bg} p-4 text-center`}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div
        className="my-2 font-arabic-display text-4xl"
        lang="ar"
        dir="rtl"
      >
        {syllable}
      </div>
      <div className="text-xs italic text-foreground-soft">{translit}</div>
      <div className="text-[10px] text-muted-foreground">{counts}</div>
    </div>
  );
}
