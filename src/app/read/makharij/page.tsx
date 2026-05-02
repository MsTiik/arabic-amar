import Link from "next/link";

import { FoundationsBadge } from "@/components/foundations-badge";
import { MAKHRAJ_ZONES } from "@/data/foundations";

export const metadata = { title: "Makhārij · Foundations" };

export default function MakharijPage() {
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
          Makhārij — articulation points
          <span
            lang="ar"
            dir="rtl"
            className="ml-3 font-arabic text-2xl font-normal text-foreground-soft"
          >
            مَخَارِج الحُرُوف
          </span>
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Every Arabic letter has a precise origin point in the mouth, throat,
          or nose — the <em>makhraj</em>. Classical scholars identify 17
          specific points grouped under 5 major zones. Mastering these is the
          foundation of tajwīd: two letters with the same makhraj but different
          <em> ṣifāt </em>
          (characteristics) are genuinely different letters, and getting them
          right preserves the meaning of the Qur’ān.
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-primary/25 bg-primary/5 p-5 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
          The 5 zones
        </h2>
        <div className="grid gap-2 sm:grid-cols-5">
          {MAKHRAJ_ZONES.map((z) => (
            <a
              key={z.slug}
              href={`#${z.slug}`}
              className="rounded-xl border border-border bg-card px-3 py-2 text-center text-xs transition-colors hover:bg-muted focus-ring"
            >
              <div className="font-arabic text-sm">{z.nameArabic}</div>
              <div className="mt-0.5 italic text-foreground-soft" dir="ltr">
                {z.name.split("(")[0].trim()}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        {MAKHRAJ_ZONES.map((zone) => (
          <article
            key={zone.slug}
            id={zone.slug}
            className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold tracking-tight">
                {zone.name}
                <span
                  lang="ar"
                  dir="rtl"
                  className="ml-2 font-arabic text-base font-normal text-foreground-soft"
                >
                  {zone.nameArabic}
                </span>
              </h3>
              <span className="text-xs text-muted-foreground">
                {zone.letters.length} letter
                {zone.letters.length === 1 ? "" : "s"}
              </span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{zone.description}</p>

            <div className="mt-4 flex flex-wrap gap-1.5" lang="ar" dir="rtl">
              {zone.letters.map((l) => (
                <span
                  key={l}
                  className="inline-flex min-w-9 items-center justify-center rounded-md border border-border bg-background-soft px-2 py-1.5 font-arabic-display text-2xl"
                >
                  {l}
                </span>
              ))}
            </div>

            {zone.subPoints.length > 1 ? (
              <div className="mt-5 space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Sub-points within this zone
                </div>
                {zone.subPoints.map((sp, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-background-soft p-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="text-sm font-semibold">{sp.name}</h4>
                      <div
                        className="flex flex-wrap gap-1"
                        lang="ar"
                        dir="rtl"
                      >
                        {sp.letters.map((l) => (
                          <span
                            key={l}
                            className="inline-flex min-w-7 items-center justify-center rounded border border-border bg-card px-1.5 py-0.5 font-arabic-display text-lg"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {sp.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="mb-2 text-base font-semibold text-foreground">
          A note on practice
        </h2>
        <p>
          Written descriptions only go so far with makhārij — the actual
          position of the tongue or the depth of a throat sound is best learned
          from a qualified teacher who can correct you in real time. Use this
          page as an overview and a vocabulary reference, and seek in-person or
          video instruction from a reciter for real practice.
        </p>
      </section>
    </div>
  );
}
