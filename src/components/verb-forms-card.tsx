import { cn } from "@/lib/cn";
import type { GrammarRule } from "@/lib/types";
import { ArabicText } from "./arabic-text";
import { CollapsibleExamples } from "./collapsible-examples";

interface Props {
  rule: GrammarRule;
  className?: string;
}

const TENSE_STYLES: Record<
  string,
  { bg: string; border: string; label: string }
> = {
  past: {
    bg: "bg-tense-past",
    border: "border-tense-past-accent/40",
    label: "text-tense-past-accent",
  },
  present: {
    bg: "bg-tense-present",
    border: "border-tense-present-accent/40",
    label: "text-tense-present-accent",
  },
  command: {
    bg: "bg-tense-command",
    border: "border-tense-command-accent/40",
    label: "text-tense-command-accent",
  },
  masdar: {
    bg: "bg-tense-masdar",
    border: "border-tense-masdar-accent/40",
    label: "text-tense-masdar-accent",
  },
};

function getTenseKey(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("past") || l.includes("māḍī")) return "past";
  if (l.includes("present") || l.includes("muḍāriʿ")) return "present";
  if (l.includes("command") || l.includes("amr")) return "command";
  return "masdar";
}

/**
 * Renders verb conjugation rules with tense-labelled parts (Past, Present,
 * Command, Masdar) in a spacious full-width layout. Each tense column is
 * color-coded for quick visual identification.
 */
export function VerbFormsCard({ rule, className }: Props) {
  const tenseLabels =
    rule.examples[0]?.parts?.map((p) => ({
      label: p.label ?? "",
      key: getTenseKey(p.label ?? ""),
    })) ?? [];

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

      {tenseLabels.length > 0 ? (
        <div className="mt-4 hidden lg:grid lg:grid-cols-4 gap-3">
          {tenseLabels.map(({ label, key }, i) => {
            const style = TENSE_STYLES[key] ?? TENSE_STYLES.masdar;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-md px-3 py-1.5 text-center",
                  style.bg,
                  "border",
                  style.border,
                )}
              >
                <p
                  className={cn(
                    "text-xs font-bold uppercase tracking-wide",
                    style.label,
                  )}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      {rule.examples.length > 0 ? (
        <div className="mt-3">
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
                    {ex.parts.map((part, partIndex) => {
                      const tenseKey = getTenseKey(part.label ?? "");
                      const style =
                        TENSE_STYLES[tenseKey] ?? TENSE_STYLES.masdar;
                      return (
                        <div
                          key={partIndex}
                          className={cn(
                            "rounded-md border px-3 py-2.5",
                            style.bg,
                            style.border,
                          )}
                        >
                          <p
                            className={cn(
                              "text-xs font-semibold uppercase tracking-wide lg:hidden",
                              style.label,
                            )}
                          >
                            {part.label}
                          </p>
                          {part.arabic ? (
                            <ArabicText
                              variant="display"
                              className="mt-1.5 text-2xl lg:mt-0 lg:text-3xl"
                            >
                              {part.arabic}
                            </ArabicText>
                          ) : null}
                          {part.english ? (
                            <p className="mt-1 text-sm text-foreground-soft">
                              {part.english}
                            </p>
                          ) : null}
                        </div>
                      );
                    })}
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
