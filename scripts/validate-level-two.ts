import { validateLevelTwoPublishedContent } from "../src/lib/level-two-content";

const issues = validateLevelTwoPublishedContent();

if (issues.length > 0) {
  console.error(`[level-2] validation failed with ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue.location}: ${issue.message}`);
  process.exit(1);
}

console.log("[level-2] validation passed: all published items are traceable and structurally complete.");
