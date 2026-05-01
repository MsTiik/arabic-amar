import { ArabicText } from "@/components/arabic-text";
import { cn } from "@/lib/cn";
import type { GrammarRule } from "@/lib/types";
import { stripBodyPrefix } from "@/lib/rule-shape";

interface Props {
  rule: GrammarRule;
  className?: string;
}

/**
 * Long-form prose rule with no example list — rendered as an article with a
 * pull-quote on the first paragraph and inline term callouts for any
 * `(arabic - transliteration)` parentheticals.
 */
export function ExplainerCard({ rule, className }: Props) {
  const body = stripBodyPrefix(rule.body);
  const paragraphs = body.split(/\n\n+/).filter((p) => p.trim().length > 0);
  if (paragraphs.length === 0) return null;

  const [lead, ...rest] = paragraphs;

  return (
    <article
      className={cn(
        "rounded-2xl border border-border border-l-4 border-l-accent-gold bg-card p-5 shadow-sm sm:p-6",
        className,
      )}
    >
      <header className="mb-3">
        <h3 className="text-lg font-semibold tracking-tight text-balance sm:text-xl">
          {rule.title}
        </h3>
      </header>

      <blockquote className="mb-4 border-l-4 border-accent-gold/60 bg-accent-gold-soft/30 px-4 py-3 text-base italic text-foreground sm:text-lg">
        {renderProseWithCallouts(lead)}
      </blockquote>

      {rest.length > 0 ? (
        <div className="space-y-3 text-sm leading-relaxed text-foreground-soft sm:text-base">
          {rest.map((p, i) => (
            <p key={i} className="text-pretty">
              {renderProseWithCallouts(p)}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  );
}

/**
 * Renders a paragraph turning `(arabic - transliteration)` into a small
 * callout pill, while leaving the rest of the prose alone.
 */
function renderProseWithCallouts(text: string): React.ReactNode {
  const re = /\(([\u0600-\u06FF\u064B-\u065F\u0670\u06D6-\u06ED\u0640]+)\s*-\s*([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  text.replace(re, (match, ar, latin, offset: number) => {
    if (offset > lastIndex) {
      parts.push(renderInlineArabic(text.slice(lastIndex, offset), key++));
    }
    parts.push(
      <span
        key={key++}
        className="inline-flex items-center gap-1.5 rounded-md border border-accent-gold/40 bg-accent-gold-soft/40 px-1.5 py-0.5 align-baseline text-xs not-italic"
      >
        <ArabicText variant="inline" className="text-base">
          {ar}
        </ArabicText>
        <span lang="ar-Latn" className="italic text-foreground-soft">
          {latin.trim()}
        </span>
      </span>,
    );
    lastIndex = offset + match.length;
    return match;
  });
  if (lastIndex < text.length) {
    parts.push(renderInlineArabic(text.slice(lastIndex), key++));
  }
  return parts.length > 0 ? parts : renderInlineArabic(text, 0);
}

/** Inline Arabic-aware text (matches the renderer used in RuleCard). */
function renderInlineArabic(text: string, baseKey: number): React.ReactNode {
  const parts = text.split(
    /([\u0600-\u06FF\u064B-\u065F\u0670\u06D6-\u06ED][\u0600-\u06FF\u064B-\u065F\u0670\u06D6-\u06ED\s\u0640]*)/u,
  );
  return parts.map((p, i) => {
    if (!p) return null;
    if (/[\u0600-\u06FF]/.test(p)) {
      return (
        <ArabicText
          key={`${baseKey}-${i}`}
          variant="inline"
          className="mx-1 align-baseline text-lg"
        >
          {p}
        </ArabicText>
      );
    }
    return <span key={`${baseKey}-${i}`}>{p}</span>;
  });
}
