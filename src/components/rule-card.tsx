import { cn } from "@/lib/cn";
import type { GrammarRule } from "@/lib/types";
import { ArabicText } from "./arabic-text";
import { CollapsibleExamples } from "./collapsible-examples";

interface Props {
  rule: GrammarRule;
  className?: string;
}

export function RuleCard({ rule, className }: Props) {
  return (
    <article
      className={cn(
        "rounded-2xl border-l-4 border-accent-gold bg-card p-5 shadow-sm",
        "border border-l-4 border-l-accent-gold border-border",
        className,
      )}
    >
      <header>
        <h3 className="text-lg font-semibold text-balance">{rule.title}</h3>
      </header>
      {rule.body ? (
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-foreground-soft">
          {rule.body.split("\n\n").map((para, i) => (
            <p key={i} className="text-pretty">
              {renderInlineArabic(para)}
            </p>
          ))}
        </div>
      ) : null}
      {rule.examples.length > 0 ? (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Examples
          </h4>
          <CollapsibleExamples
            className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3"
            initialVisible={12}
          >
            {rule.examples.map((ex, i) => (
              <li
                key={i}
                className="flex flex-col gap-0.5 rounded-lg border border-border bg-background-soft px-2.5 py-2"
              >
                {ex.parts?.length ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {ex.parts.map((part, partIndex) => (
                      <div
                        key={partIndex}
                        className="rounded-md border border-border/70 bg-card/70 p-2"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {part.label}
                        </p>
                        {part.arabic ? (
                          <ArabicText variant="display" className="mt-1 text-xl sm:text-2xl">
                            {part.arabic}
                          </ArabicText>
                        ) : null}
                        {part.english ? (
                          <p className="text-xs text-foreground-soft">
                            {renderInlineArabic(part.english)}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : ex.arabic ? (
                  <ArabicText variant="display" className="text-xl sm:text-2xl">
                    {ex.arabic}
                  </ArabicText>
                ) : null}
                {ex.pronunciation ? (
                  <p className="text-xs text-foreground-soft" lang="ar-Latn">
                    {ex.pronunciation}
                  </p>
                ) : null}
                {ex.english ? (
                  <p className="text-xs text-muted-foreground">
                    {renderInlineArabic(ex.english)}
                  </p>
                ) : null}
              </li>
            ))}
          </CollapsibleExamples>
        </div>
      ) : null}
    </article>
  );
}

/**
 * Render a string that may contain mixed English and Arabic, wrapping any contiguous
 * Arabic span in a properly RTL/lang-tagged element so the diacritic-positioning and
 * font-feature-settings apply to the Arabic but not the English.
 */
function renderInlineArabic(text: string): React.ReactNode {
  const parts = text.split(/([\u0600-\u06FF\u064B-\u065F\u0670\u06D6-\u06ED][\u0600-\u06FF\u064B-\u065F\u0670\u06D6-\u06ED\s\u0640]*)/u);
  return parts.map((p, i) => {
    if (!p) return null;
    if (/[\u0600-\u06FF]/.test(p)) {
      return (
        <ArabicText
          key={i}
          variant="inline"
          className="mx-1 text-lg align-baseline"
        >
          {p}
        </ArabicText>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
