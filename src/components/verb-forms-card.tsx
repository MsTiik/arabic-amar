import { cn } from "@/lib/cn";
import type { GrammarRule } from "@/lib/types";
import { ArabicText } from "./arabic-text";
import { CollapsibleExamples } from "./collapsible-examples";

interface Props {
  rule: GrammarRule;
  className?: string;
}

/**
 * Renders verb conjugation rules with tense-labelled parts (Past, Present,
 * Command, Masdar) in a spacious full-width layout. Each verb gets a row-like
 * card with all four tense forms side by side.
 */
export function VerbFormsCard({ rule, className }: Props) {
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
      {rule.examples.length > 0 ? (
        <div className="mt-4">
          <CollapsibleExamples
            className="grid grid-cols-1 gap-3"
            initialVisible={rule.examples.length}
          >
            {rule.examples.map((ex, i) => (
              <li
                key={i}
                className="rounded-lg border border-border bg-background-soft p-3"
              >
                {ex.parts?.length ? (
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {ex.parts.map((part, partIndex) => (
                      <div
                        key={partIndex}
                        className="rounded-md border border-border/70 bg-card/70 px-3 py-2.5"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {part.label}
                        </p>
                        {part.arabic ? (
                          <ArabicText variant="display" className="mt-1.5 text-2xl lg:text-3xl">
                            {part.arabic}
                          </ArabicText>
                        ) : null}
                        {part.english ? (
                          <p className="mt-1 text-sm text-foreground-soft">
                            {part.english}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </CollapsibleExamples>
        </div>
      ) : null}
    </article>
  );
}
