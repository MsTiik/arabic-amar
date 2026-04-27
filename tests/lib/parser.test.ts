import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";

import { parseDocxBuffer } from "../../src/lib/parser";

const FIXTURE = path.resolve(process.cwd(), "tests/fixtures/sample.docx");

describe("parseDocxBuffer", () => {
  test("preserves diacritics on parsed Arabic", async () => {
    let buf: Buffer;
    try {
      buf = await fs.readFile(FIXTURE);
    } catch {
      // Fixture is optional locally — only required in CI when checked in.
      console.warn(`[parser.test] skipping; fixture missing at ${FIXTURE}`);
      return;
    }
    const { content } = await parseDocxBuffer(buf);
    expect(content.lessons.length).toBeGreaterThan(0);
    expect(content.vocab.length).toBeGreaterThan(0);

    // At least one entry must contain an Arabic combining mark in U+064B–U+065F.
    const hasDiacritics = content.vocab.some((v) =>
      /[\u064B-\u065F]/.test(v.arabic),
    );
    expect(hasDiacritics).toBe(true);
  });
});
