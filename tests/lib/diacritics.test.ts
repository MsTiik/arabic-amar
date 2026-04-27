import { describe, expect, test } from "vitest";
import { foldForSearch, stripDiacritics } from "../../src/lib/diacritics";

describe("stripDiacritics", () => {
  test("removes fatha/damma/kasra/sukun/tanween/shadda", () => {
    expect(stripDiacritics("رَأْسٌ")).toBe("رأس");
    expect(stripDiacritics("هٰذَا")).toBe("هذا");
    expect(stripDiacritics("بِسْمِ اللهِ")).toBe("بسم الله");
  });

  test("does not mangle plain Arabic text", () => {
    expect(stripDiacritics("شعر")).toBe("شعر");
  });
});

describe("foldForSearch", () => {
  test("matches Arabic regardless of tashkeel", () => {
    const folded = foldForSearch("هٰذَا");
    expect(foldForSearch("هذا")).toBe(folded);
  });

  test("normalizes Latin macrons + lowercases", () => {
    expect(foldForSearch("Raʾsun")).toBe("rasun");
    expect(foldForSearch("Hādhā")).toBe("hadha");
  });
});
