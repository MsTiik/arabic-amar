import type { GrammarRule } from "@/lib/types";
import { leadingArabicWord, stripBodyPrefix } from "@/lib/rule-shape";
import { ArabicText } from "./arabic-text";
import { CollapsibleExamples } from "./collapsible-examples";
import { cn } from "@/lib/cn";

interface Props {
  rule: GrammarRule;
  className?: string;
}

interface Pair {
  /** The trailing noun stripped of the leading demonstrative, e.g. "رأس". */
  noun: string;
  /** Full Arabic sentence as written, e.g. "هذا رأس". */
  sentence: string;
  /** English meaning of the sentence, e.g. "this is a head". */
  english?: string;
}

/**
 * Renderer for "(token) + noun = sentence" rules with many parallel
 * examples, like body-parts "Masculine = هذا" / "Feminine = هذه".
 *
 * Layout:
 *   - Pattern row: (token) + noun = "this is a (noun)"
 *   - Examples grid (dense 3-col), all visible up to N=12, expandable beyond
 */
export function DemonstrativePairCard({ rule, className }: Props) {
  const intro = rule.examples.find(
    (ex) => !(ex.arabic ?? "").trim() && (ex.english ?? "").trim(),
  );
  const sentenceExamples = rule.examples.filter(
    (ex) => (ex.arabic ?? "").trim().length > 0,
  );

  // Demonstrative is the leading word of the first sentence example. Falls
  // back to the body's memorise token if the body shape is recognised.
  const memorise = stripBodyPrefix(rule.body);
  const fromExample =
    sentenceExamples.length > 0 ? leadingArabicWord(sentenceExamples[0].arabic) : "";
  const token = fromExample || memorise;

  const pairs: Pair[] = sentenceExamples.map((ex) => {
    const sentence = (ex.arabic ?? "").trim();
    const noun = stripLeadingToken(sentence, token).trim();
    return { sentence, noun, english: (ex.english ?? "").trim() || undefined };
  });

  if (pairs.length === 0) return null;

  const usageNote = (intro?.english ?? "").trim();

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
        {usageNote ? (
          <p className="mt-1 text-sm text-muted-foreground">{usageNote}</p>
        ) : null}
      </header>

      {/* Pattern */}
      <section aria-labelledby={`${rule.id}__pattern`} className="mb-5">
        <h4
          id={`${rule.id}__pattern`}
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Pattern
        </h4>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background-soft px-4 py-3 sm:px-5 sm:py-4">
          <TokenChip token={token} label="Demonstrative" />
          <Plus />
          <NounChip />
          <Eq />
          <span className="text-sm italic text-muted-foreground">
            “this is a (noun)”
          </span>
        </div>
      </section>

      {/* Examples */}
      <section aria-labelledby={`${rule.id}__examples`}>
        <h4
          id={`${rule.id}__examples`}
          className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Examples ({pairs.length})
        </h4>
        <CollapsibleExamples
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3"
          initialVisible={12}
        >
          {pairs.map((pair, i) => (
            <li
              key={i}
              className="flex flex-col gap-0.5 rounded-lg border border-border bg-background-soft px-2.5 py-2"
            >
              <ArabicText variant="display" className="text-lg sm:text-xl">
                {pair.sentence}
              </ArabicText>
              {pair.english ? (
                <p className="text-xs text-muted-foreground">{pair.english}</p>
              ) : null}
            </li>
          ))}
        </CollapsibleExamples>
      </section>
    </article>
  );
}

function TokenChip({ token, label }: { token: string; label: string }) {
  return (
    <span className="inline-flex flex-col items-center rounded-lg border border-accent-gold/50 bg-accent-gold-soft/40 px-3 py-1.5">
      <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {token ? (
        <ArabicText variant="display" className="text-xl sm:text-2xl">
          {token}
        </ArabicText>
      ) : null}
    </span>
  );
}

function NounChip() {
  return (
    <span className="inline-flex flex-col items-center rounded-lg border border-border bg-card px-3 py-1.5">
      <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
        Noun
      </span>
      <span className="text-base italic text-foreground-soft sm:text-lg">(any)</span>
    </span>
  );
}

function Plus() {
  return (
    <span aria-hidden="true" className="text-2xl text-muted-foreground">
      +
    </span>
  );
}

function Eq() {
  return (
    <span aria-hidden="true" className="text-2xl text-muted-foreground">
      =
    </span>
  );
}

/** Removes a leading Arabic token from the sentence if present. */
function stripLeadingToken(sentence: string, token: string): string {
  if (!token) return sentence;
  const re = new RegExp(`^${escapeRe(token)}\\s+`);
  return sentence.replace(re, "");
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
