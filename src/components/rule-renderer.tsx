import type { GrammarRule } from "@/lib/types";
import { getRuleShape } from "@/lib/rule-shape";

import { DemonstrativePairCard } from "./demonstrative-pair-card";
import { ExplainerCard } from "./explainer-card";
import { RuleCard } from "./rule-card";
import { RuleTableCard } from "./rule-table-card";

interface Props {
  rule: GrammarRule;
  className?: string;
}

/**
 * Picks the appropriate visual treatment for a rule based on its shape.
 * Wraps the shape-specific renderers so callers don't have to repeat the
 * routing logic.
 */
export function RuleRenderer({ rule, className }: Props) {
  const shape = getRuleShape(rule);
  switch (shape) {
    case "pattern-walkthrough":
      return <RuleTableCard rule={rule} className={className} />;
    case "demonstrative-pair":
      return <DemonstrativePairCard rule={rule} className={className} />;
    case "explainer":
      return <ExplainerCard rule={rule} className={className} />;
    case "free-form":
    default:
      return <RuleCard rule={rule} className={className} />;
  }
}

/** Returns true when the rule renders full-width (spans both columns). */
export function ruleSpansFullWidth(rule: GrammarRule): boolean {
  const shape = getRuleShape(rule);
  return shape === "pattern-walkthrough" || shape === "explainer";
}
