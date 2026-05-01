import type { GrammarRule } from "./types";
import { isPatternWalkthrough } from "./rule-table-parser";

/**
 * Visual shape a rule should be rendered as. Detection is structural so
 * future rules pulled from the doc are routed automatically without needing
 * code changes for every new entry.
 */
export type RuleShape =
  | "pattern-walkthrough" // Numbers / Time: Pattern → Worked-example → Result
  | "demonstrative-pair" // body-parts: هذا/هذه + noun template, many parallel examples
  | "explainer" //          long prose, no examples (e.g. "'This is' in the Arabic Language")
  | "free-form"; //         everything else: short body + flat examples list

/** ≥ this many parallel examples qualifies as a demonstrative-pair shape. */
const PAIR_MIN_EXAMPLES = 5;

/** Body length above which a prose-only rule is rendered as an Explainer. */
const EXPLAINER_MIN_BODY = 200;

const PAIR_BODY_RE = /\*\*(?:What to Memorise|Pattern to Memorise|Rule):\*\*/i;

/**
 * Picks the renderer for a rule. Rules with `• Component =` bullets in their
 * examples are pattern walkthroughs (Numbers / Time). Rules whose examples
 * are mostly parallel sentences sharing a common Arabic prefix
 * (هذا + noun, هذه + noun, …) are demonstrative pairs. Rules with no
 * examples but a long prose body are explainers. Everything else is the
 * default free-form RuleCard.
 */
export function getRuleShape(rule: GrammarRule): RuleShape {
  if (isPatternWalkthrough(rule)) return "pattern-walkthrough";

  if (isDemonstrativePair(rule)) return "demonstrative-pair";

  if (rule.examples.length === 0 && (rule.body ?? "").trim().length >= EXPLAINER_MIN_BODY) {
    return "explainer";
  }

  return "free-form";
}

/**
 * True when the rule encodes a "(token) + noun = (sentence)" pattern with
 * many parallel example rows. Detection: the body starts with a "What to
 * Memorise:" / "Pattern to Memorise:" prefix AND ≥5 of the examples share a
 * common leading Arabic word (the demonstrative).
 */
export function isDemonstrativePair(rule: GrammarRule): boolean {
  if (!PAIR_BODY_RE.test(rule.body ?? "")) return false;

  const sentences = rule.examples.filter((ex) => (ex.arabic ?? "").trim().length > 0);
  if (sentences.length < PAIR_MIN_EXAMPLES) return false;

  const prefix = leadingArabicWord(sentences[0].arabic);
  if (!prefix) return false;

  const matching = sentences.filter(
    (ex) => leadingArabicWord(ex.arabic) === prefix,
  ).length;
  return matching / sentences.length >= 0.8;
}

/** First whitespace-delimited word of an Arabic string, or "" if none. */
export function leadingArabicWord(text: string): string {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^[\u0600-\u06FF\u064B-\u065F\u0670\u06D6-\u06ED\u0640]+/u);
  return match ? match[0] : "";
}

/** Strip the `**What to Memorise:**` / `**Rule:**` prefix from a rule body. */
export function stripBodyPrefix(body: string): string {
  return (body ?? "").replace(/^\s*\*\*[^*]+\*\*\s*/, "").trim();
}
