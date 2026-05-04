import { describe, expect, test } from "vitest";
import { foldedSearchMatches, foldForSearch, stripDiacritics } from "../../src/lib/diacritics";

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

describe("foldedSearchMatches", () => {
  test("matches Arabic tokens exactly when requested", () => {
    expect(foldedSearchMatches(foldForSearch("هٰذَا"), foldForSearch("هذا"), { exactArabic: true })).toBe(
      true,
    );
    expect(
      foldedSearchMatches(foldForSearch("هَذَانِ"), foldForSearch("هذا"), { exactArabic: true }),
    ).toBe(false);
  });

  test("matches multi-word Arabic phrases by adjacent tokens", () => {
    expect(
      foldedSearchMatches(foldForSearch("حُجْرَةُ الدِّرَاسَة"), foldForSearch("حجرة الدراسة"), {
        exactArabic: true,
      }),
    ).toBe(true);
    expect(
      foldedSearchMatches(foldForSearch("ذُو القَعْدَة"), foldForSearch("ذو القعدة"), {
        exactArabic: true,
      }),
    ).toBe(true);
    expect(
      foldedSearchMatches(foldForSearch("هَذَا"), foldForSearch("هذا الدراسة"), {
        exactArabic: true,
      }),
    ).toBe(false);
  });

  test("allows Arabic prefix matching only when requested", () => {
    expect(foldedSearchMatches(foldForSearch("هَذَا"), foldForSearch("هذ"), { exactArabic: true })).toBe(
      false,
    );
    expect(
      foldedSearchMatches(foldForSearch("هَذَا"), foldForSearch("هذ"), {
        exactArabic: true,
        allowArabicPrefix: true,
      }),
    ).toBe(true);
  });

  test("keeps substring matching for transliteration and English", () => {
    expect(foldedSearchMatches(foldForSearch("hādhā"), foldForSearch("had"))).toBe(true);
    expect(foldedSearchMatches(foldForSearch("this (m)"), foldForSearch("thi"))).toBe(true);
  });
});
