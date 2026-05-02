"use client";

import { useMemo, useState } from "react";

import { ArabicText } from "@/components/arabic-text";
import { LetterSpeakerButton } from "@/components/letter-speaker-button";
import { SUN_MOON_EXAMPLES, classifySunMoon } from "@/data/foundations";
import { cn } from "@/lib/cn";

/** Tap-a-noun demo: user picks a noun, site shows the ’al-’ form, the
 *  pronunciation (with or without assimilation), and an explanation. */
export function SunMoonDemo() {
  const [selected, setSelected] = useState(SUN_MOON_EXAMPLES[0].slug);

  const example = useMemo(
    () => SUN_MOON_EXAMPLES.find((e) => e.slug === selected) ?? SUN_MOON_EXAMPLES[0],
    [selected],
  );

  // Pull the first letter of the bare noun to show classification.
  const firstLetter = example.arabic.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")[0];
  const category = classifySunMoon(firstLetter);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">
          Tap a noun to see ’al-’ in action
        </h3>
        <span className="text-xs text-muted-foreground">
          {SUN_MOON_EXAMPLES.length} examples
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {SUN_MOON_EXAMPLES.map((e) => (
          <button
            key={e.slug}
            type="button"
            onClick={() => setSelected(e.slug)}
            className={cn(
              "rounded-md border px-2.5 py-1.5 text-sm transition-colors focus-ring",
              selected === e.slug
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background-soft text-foreground-soft hover:bg-muted",
            )}
          >
            <ArabicText variant="inline" as="span" className="text-base">
              {e.arabic}
            </ArabicText>
            <span className="ml-2 text-xs text-muted-foreground">
              ({e.gloss})
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-background-soft p-4 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Bare noun
          </div>
          <div className="my-2 font-arabic-display text-3xl" lang="ar" dir="rtl">
            {example.arabic}
          </div>
          <div className="text-xs italic text-foreground-soft">
            {example.translit.replace(/^(al|as|at|ash|ar|an|ad|adh|az|aẓ|aṭ|aṣ|ath)-/, "")}
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Plus ’al-’ prefix
          </div>
          <div className="my-2 font-arabic-display text-3xl" lang="ar" dir="rtl">
            {example.arabicWithAl}
          </div>
          <div className="flex items-center justify-center gap-2 text-xs italic text-foreground-soft">
            <span>{example.translit}</span>
            <LetterSpeakerButton
              text={example.arabicWithAl}
              ariaLabel={`Play pronunciation of ${example.translit}`}
              size="sm"
            />
          </div>
        </div>

        <div
          className={cn(
            "rounded-xl border p-4 text-center",
            category === "sun"
              ? "border-accent-gold/50 bg-accent-gold-soft"
              : "border-primary/30 bg-primary/5",
          )}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            First letter
          </div>
          <div className="my-2 font-arabic-display text-3xl" lang="ar" dir="rtl">
            {firstLetter}
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider">
            {category === "sun" ? "Sun letter" : "Moon letter"}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background-soft p-4 text-sm text-muted-foreground">
        {category === "sun" ? (
          <p>
            <strong className="font-semibold text-foreground">Sun-letter rule:</strong>{" "}
            the <span className="font-arabic">ل</span> of{" "}
            <span className="font-arabic">الـ</span> is silent. The first
            letter of the noun is doubled (a shadda sits on it). Pronounce
            {" \u201c"}
            <strong className="text-foreground">{example.translit}</strong>
            {"\u201d, not \u201cal-"}
            {example.translit.replace(/^[^-]+-/, "")}
            {"\u201d."}
          </p>
        ) : (
          <p>
            <strong className="font-semibold text-foreground">Moon-letter rule:</strong>{" "}
            the <span className="font-arabic">ل</span> of{" "}
            <span className="font-arabic">الـ</span> is clearly pronounced.
            The lām takes a sukūn, the following letter starts normally.
            Pronounce{" \u201c"}
            <strong className="text-foreground">{example.translit}</strong>
            {"\u201d."}
          </p>
        )}
      </div>
    </div>
  );
}
