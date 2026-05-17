/**
 * Fetches the Google Doc, parses it, and writes `content/content.json`.
 *
 * Run via:
 *   npm run content:build              # fetch from Google + parse
 *   npm run content:build -- --local   # parse a local docx (env: LOCAL_DOCX_PATH)
 */

import fs from "node:fs/promises";
import path from "node:path";

import { createContentQaReport } from "../src/lib/content-qa";
import { parseDocxBuffer } from "../src/lib/parser";
import {
  applySpellingFixes,
  correctConjugationLabels,
  dedupeLongRepeatedEnglish,
  fillIslamicMonthGlosses,
  splitMarketplaceAndColours,
} from "../src/lib/post-process";
import { fetchDocxBytes, getDocId, getDocUrl } from "../src/lib/source";

const OUTPUT_PATH = path.resolve(process.cwd(), "content", "content.json");
const QA_OUTPUT_PATH = path.resolve(process.cwd(), "content", "content-qa.json");

async function loadBuffer(): Promise<Buffer> {
  const localPath = process.env.LOCAL_DOCX_PATH;
  if (localPath) {
    console.log(`[content] reading local docx from ${localPath}`);
    return await fs.readFile(localPath);
  }
  const docId = getDocId();
  console.log(`[content] fetching ${getDocUrl(docId)}`);
  const ab = await fetchDocxBytes(docId);
  return Buffer.from(ab);
}

async function main(): Promise<void> {
  const buf = await loadBuffer();
  const { content: raw, warnings } = await parseDocxBuffer(buf, { verbose: true });
  const transformed = splitMarketplaceAndColours(
    correctConjugationLabels(
      fillIslamicMonthGlosses(applySpellingFixes(dedupeLongRepeatedEnglish(raw))),
    ),
  );
  const content = transformed.content;
  for (const warning of transformed.warnings) {
    warnings.push({
      code: "content-transform-warning",
      message: warning,
      severity: "warning",
    });
  }

  if (warnings.length > 0) {
    console.warn(`[content] parser produced ${warnings.length} warning(s):`);
    for (const warning of warnings) console.warn("   -", warning.message);
  }

  console.log(`[content] lessons=${content.lessons.length} topics=${content.topics.length}`);
  console.log(`[content] vocab=${content.vocab.length} rules=${content.rules.length}`);
  const totalNotes = content.topics.reduce((n, t) => n + (t.notes?.length ?? 0), 0);
  if (totalNotes > 0) {
    console.log(`[content] lifted ${totalNotes} repeated explanation(s) into topic notes`);
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(content, null, 2) + "\n", "utf8");
  const qaReport = createContentQaReport(content, warnings, content.fetchedAt);
  await fs.writeFile(QA_OUTPUT_PATH, JSON.stringify(qaReport, null, 2) + "\n", "utf8");
  console.log(`[content] wrote ${OUTPUT_PATH}`);
  console.log(
    `[content] QA issues=${qaReport.totals.issues} (${qaReport.issues
      .map((issue) => `${issue.code}:${issue.count}`)
      .join(", ")})`,
  );
  console.log(`[content] wrote ${QA_OUTPUT_PATH}`);
}

void main().catch((err) => {
  console.error("[content] build failed:", err);
  process.exit(1);
});
