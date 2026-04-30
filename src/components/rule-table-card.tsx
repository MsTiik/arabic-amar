import { cn } from "@/lib/cn";
import type { GrammarRule } from "@/lib/types";
import { parseRuleTable } from "@/lib/rule-table-parser";
import { ArabicText } from "./arabic-text";

interface Props {
  rule: GrammarRule;
  className?: string;
}

/**
 * Renders a Pattern → Worked-example → Result walkthrough for the
 * "rule-table" entries used by the Numbers and Time lessons. Falls back to
 * a generic two-section layout if the parser can't pull out structured
 * components for some reason.
 */
export function RuleTableCard({ rule, className }: Props) {
  const parsed = parseRuleTable(rule);

  return (
    <article
      className={cn(
        "rounded-2xl border border-border border-l-4 border-l-accent-gold bg-card p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <header className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-balance sm:text-xl">
          {rule.title}
        </h3>
      </header>

      {/* Pattern */}
      {(parsed.patternEnglish || parsed.patternArabic) ? (
        <section aria-labelledby={`${rule.id}__pattern`} className="mb-5">
          <h4
            id={`${rule.id}__pattern`}
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Pattern
          </h4>
          <div className="rounded-xl border border-border bg-background-soft px-4 py-3 sm:px-5 sm:py-4">
            {parsed.patternEnglish ? (
              <p className="text-base leading-relaxed text-foreground sm:text-lg">
                {renderInlineArabic(parsed.patternEnglish)}
              </p>
            ) : null}
            {parsed.patternArabic ? (
              <ArabicText
                variant="display"
                className="mt-1 text-lg sm:text-xl"
              >
                {parsed.patternArabic}
              </ArabicText>
            ) : null}
            {parsed.patternNote ? (
              <p className="mt-3 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground-soft">Note: </span>
                {renderInlineArabic(parsed.patternNote)}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Worked example */}
      {parsed.components.length > 0 ? (
        <section aria-labelledby={`${rule.id}__example`} className="mb-5">
          <h4
            id={`${rule.id}__example`}
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Worked example
            {parsed.exampleLabel ? (
              <span className="ml-2 font-normal text-foreground-soft normal-case tracking-normal">
                — {parsed.exampleLabel}
              </span>
            ) : null}
          </h4>
          <div className="flex flex-wrap items-stretch gap-2">
            {parsed.components.map((c, i) => (
              <div key={i} className="flex items-stretch gap-2">
                {i > 0 ? (
                  <span
                    aria-hidden="true"
                    className="self-center text-2xl text-muted-foreground"
                  >
                    +
                  </span>
                ) : null}
                <ComponentChip component={c} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Result */}
      {parsed.result.arabic ? (
        <section aria-labelledby={`${rule.id}__result`}>
          <h4
            id={`${rule.id}__result`}
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Result
          </h4>
          <div className="rounded-xl border border-accent-gold/40 bg-accent-gold-soft/40 px-4 py-4 sm:px-5">
            <ArabicText variant="display" className="text-2xl sm:text-3xl">
              {parsed.result.arabic}
            </ArabicText>
            {parsed.result.pronunciation ? (
              <p
                lang="ar-Latn"
                className="mt-2 text-sm italic text-foreground-soft sm:text-base"
              >
                {parsed.result.pronunciation}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {parsed.notes.length > 0 ? (
        <ul className="mt-4 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
          {parsed.notes.map((n, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden="true">ⓘ</span>
              <span>{renderInlineArabic(n)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function ComponentChip({ component }: { component: { label: string; arabic: string; caveat?: string } }) {
  return (
    <div className="flex min-w-[7.5rem] flex-col rounded-xl border border-border bg-background-soft px-3 py-2 sm:min-w-[8.5rem] sm:px-4 sm:py-3">
      <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {component.label}
      </span>
      {component.arabic ? (
        <ArabicText variant="display" className="mt-0.5 text-xl sm:text-2xl">
          {component.arabic}
        </ArabicText>
      ) : null}
      {component.caveat ? (
        <span className="mt-1 text-xs text-foreground-soft">
          {renderInlineArabic(component.caveat)}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Render a string that may contain mixed English and Arabic, wrapping any
 * contiguous Arabic span in a properly RTL/lang-tagged element so the
 * diacritic-positioning and font-feature-settings apply to the Arabic but
 * not the English.
 */
function renderInlineArabic(text: string): React.ReactNode {
  const parts = text.split(
    /([\u0600-\u06FF\u064B-\u065F\u0670\u06D6-\u06ED][\u0600-\u06FF\u064B-\u065F\u0670\u06D6-\u06ED\s\u0640]*)/u,
  );
  return parts.map((p, i) => {
    if (!p) return null;
    if (/[\u0600-\u06FF]/.test(p)) {
      return (
        <ArabicText
          key={i}
          variant="inline"
          className="mx-1 align-baseline text-lg"
        >
          {p}
        </ArabicText>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
