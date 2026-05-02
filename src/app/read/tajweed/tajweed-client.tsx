"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { LetterSpeakerButton } from "@/components/letter-speaker-button";
import type { TajweedGroup, TajweedRule } from "@/data/foundations";

export function AdvancedTajweedToggle({ groups }: { groups: TajweedGroup[] }) {
  const [open, setOpen] = useState(false);
  if (groups.length === 0) return null;
  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-2xl border border-dashed border-accent-gold/50 bg-accent-gold-soft/30 px-5 py-4 text-left transition-colors hover:bg-accent-gold-soft/50 focus-ring"
        aria-expanded={open}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground-soft">
            Not urgent for a beginner
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-foreground sm:text-lg">
            {open ? "Hide" : "Show"} advanced rules ({groups.length})
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Mīm sākinah rules and heavy-vs-light letters. Learn these after
            you&rsquo;re comfortable with the core rules above.
          </p>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-foreground-soft" aria-hidden />
        ) : (
          <ChevronDown className="h-5 w-5 text-foreground-soft" aria-hidden />
        )}
      </button>

      {open ? (
        <div className="mt-6 space-y-8">
          {groups.map((group) => (
            <TajweedGroupCard key={group.slug} group={group} advanced />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function TajweedGroupCard({
  group,
  advanced,
}: {
  group: TajweedGroup;
  advanced?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 sm:p-6 ${
        advanced
          ? "border-dashed border-accent-gold/50 bg-accent-gold-soft/25"
          : "border-border bg-card"
      }`}
    >
      <header className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-semibold text-foreground">{group.title}</h3>
          <ArabicText variant="display" as="span" className="text-xl text-foreground-soft">
            {group.titleArabic}
          </ArabicText>
        </div>
        <p className="mt-2 text-sm text-foreground-soft">{group.intro}</p>
        <div className="mt-3 rounded-lg bg-background-soft px-3 py-2 text-xs text-foreground-soft">
          <span className="font-semibold text-foreground">Trigger: </span>
          {group.trigger}
        </div>
      </header>

      <div className="space-y-4">
        {group.rules.map((rule) => (
          <TajweedRuleRow key={rule.slug} rule={rule} />
        ))}
      </div>
    </article>
  );
}

function TajweedRuleRow({ rule }: { rule: TajweedRule }) {
  return (
    <div className="rounded-xl border border-border bg-background-soft/60 p-4">
      <header className="mb-2">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-base font-semibold text-foreground">{rule.name}</h4>
          <ArabicText variant="display" as="span" className="text-lg text-foreground-soft">
            {rule.nameArabic}
          </ArabicText>
        </div>
        <p className="mt-1 text-sm font-medium text-foreground">{rule.summary}</p>
      </header>
      <p className="mb-3 text-sm text-muted-foreground">{rule.explanation}</p>

      {rule.triggerLetters && rule.triggerLetters.length > 0 ? (
        <div className="mb-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Trigger letters
          </p>
          <div className="flex flex-wrap gap-1.5">
            {rule.triggerLetters.map((t) => (
              <span
                key={t.arabic + t.translit}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs"
              >
                <ArabicText variant="display" as="span" className="text-lg leading-none">
                  {t.arabic}
                </ArabicText>
                <span className="text-muted-foreground">{t.translit}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Example{rule.examples.length > 1 ? "s" : ""}
        </p>
        {rule.examples.map((ex, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2"
          >
            <div className="min-w-0">
              <ArabicText variant="display" as="span" className="text-xl sm:text-2xl">
                {ex.arabic}
              </ArabicText>
              <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-xs">
                <span className="italic text-foreground-soft">{ex.translit}</span>
                <span className="text-muted-foreground">— {ex.gloss}</span>
                {ex.citation ? (
                  <span className="text-[10px] text-muted-foreground">({ex.citation})</span>
                ) : null}
              </div>
            </div>
            <LetterSpeakerButton
              text={ex.arabic}
              ariaLabel={`Play pronunciation of ${ex.translit}`}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
