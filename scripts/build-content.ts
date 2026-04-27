/**
 * Fetches the Google Doc, parses it, and writes `content/content.json`.
 *
 * Run via:
 *   npm run content:build              # fetch from Google + parse
 *   npm run content:build -- --local   # parse a local docx (env: LOCAL_DOCX_PATH)
 */

import fs from "node:fs/promises";
import path from "node:path";

import { parseDocxBuffer } from "../src/lib/parser";
import { fetchDocxBytes, getDocId, getDocUrl } from "../src/lib/source";

const OUTPUT_PATH = path.resolve(process.cwd(), "content", "content.json");

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
  const { content, warnings } = await parseDocxBuffer(buf, { verbose: true });

  if (warnings.length > 0) {
    console.warn(`[content] parser produced ${warnings.length} warning(s):`);
    for (const w of warnings) console.warn("   -", w);
  }

  console.log(`[content] lessons=${content.lessons.length} topics=${content.topics.length}`);
  console.log(`[content] vocab=${content.vocab.length} rules=${content.rules.length}`);

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(content, null, 2) + "\n", "utf8");
  console.log(`[content] wrote ${OUTPUT_PATH}`);
}

void main().catch((err) => {
  console.error("[content] build failed:", err);
  process.exit(1);
});
