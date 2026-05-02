import { describe, expect, test } from "vitest";
import {
  checkFillBlankAnswer,
  checkMatchPairsAnswer,
  checkOrderingAnswer,
  makeClozeDeck,
  makeMatchPairsDeck,
  makeWhichLetterDeck,
  normalizeAnswers,
} from "../../src/lib/exercises";
import type { GrammarRule, MatchPair, VocabEntry } from "../../src/lib/types";

describe("normalizeAnswers", () => {
  test("strips macrons and case markers", () => {
    const got = normalizeAnswers("raʾsun");
    expect(got).toContain("rasun");
    expect(got).toContain("ras");
  });

  test("strips the ḥ/ṣ/ḍ/ṭ/ẓ Arabic transliteration markers", () => {
    const got = normalizeAnswers("ḥājibun");
    expect(got).toContain("hajibun");
    expect(got).toContain("hajib");
  });
});

describe("checkFillBlankAnswer", () => {
  const accepted = normalizeAnswers("raʾsun");

  test("accepts the original spelling", () => {
    expect(checkFillBlankAnswer("raʾsun", accepted)).toBe(true);
  });

  test("accepts the simplified spelling", () => {
    expect(checkFillBlankAnswer("rasun", accepted)).toBe(true);
    expect(checkFillBlankAnswer("ras", accepted)).toBe(true);
  });

  test("rejects nonsense", () => {
    expect(checkFillBlankAnswer("hand", accepted)).toBe(false);
  });
});

describe("checkOrderingAnswer", () => {
  test("accepts an exact match", () => {
    expect(checkOrderingAnswer(["a", "b", "c"], ["a", "b", "c"])).toBe(true);
  });
  test("rejects a swap", () => {
    expect(checkOrderingAnswer(["a", "c", "b"], ["a", "b", "c"])).toBe(false);
  });
});

function vocabFixture(arabic: string, english: string, lessonId = "l1"): VocabEntry {
  return {
    id: `vocab-${arabic}`,
    arabic,
    arabicFolded: arabic,
    pronunciation: arabic,
    english,
    category: "test",
    isExtra: false,
    topicSlugs: ["test"],
    lessonId,
  };
}

describe("makeMatchPairsDeck", () => {
  test("chunks vocab into rounds of 6 pairs by default", () => {
    const vocab = Array.from({ length: 14 }, (_, i) =>
      vocabFixture(`word-${i}`, `meaning ${i}`),
    );
    const deck = makeMatchPairsDeck(vocab, {
      id: "deck-test",
      title: "Test",
    });
    // 14 entries → rounds of 6, 6, 2 → drop the 2-pair round (handled below).
    // Implementation keeps the 2-pair round since pairs.length>=2 is OK.
    expect(deck.questions.length).toBe(3);
    expect(deck.questions[0].pairs?.length).toBe(6);
    expect(deck.questions[1].pairs?.length).toBe(6);
    expect(deck.questions[2].pairs?.length).toBe(2);
    for (const q of deck.questions) {
      expect(q.kind).toBe("match-pairs");
    }
  });

  test("returns no questions when there's nothing to match", () => {
    const deck = makeMatchPairsDeck([], { id: "x", title: "x" });
    expect(deck.questions).toEqual([]);
  });
});

describe("checkMatchPairsAnswer", () => {
  const pairs: MatchPair[] = [
    { id: "p-1", leftText: "a", rightText: "alpha" },
    { id: "p-2", leftText: "b", rightText: "beta" },
  ];
  test("accepts a fully correct mapping", () => {
    expect(
      checkMatchPairsAnswer({ "p-1": "p-1", "p-2": "p-2" }, pairs),
    ).toBe(true);
  });
  test("rejects a swap", () => {
    expect(
      checkMatchPairsAnswer({ "p-1": "p-2", "p-2": "p-1" }, pairs),
    ).toBe(false);
  });
  test("rejects a missing pair", () => {
    expect(checkMatchPairsAnswer({ "p-1": "p-1" }, pairs)).toBe(false);
  });
});

describe("makeWhichLetterDeck", () => {
  test("produces 12 cards by default with 4 options each", () => {
    const deck = makeWhichLetterDeck({ id: "wl", title: "WL" });
    expect(deck.questions.length).toBe(12);
    for (const q of deck.questions) {
      expect(q.kind).toBe("which-letter");
      expect(q.options?.length).toBe(4);
      expect(q.correctAnswerId).toBeDefined();
      // Correct option must be one of the four shown.
      expect(q.options?.some((o) => o.id === q.correctAnswerId)).toBe(true);
    }
  });

  test("isolated mode only shows isolated forms", () => {
    const deck = makeWhichLetterDeck({
      id: "wl",
      title: "WL",
      positions: "isolated",
      count: 5,
    });
    expect(deck.questions.length).toBe(5);
    for (const q of deck.questions) {
      // Isolated-form prompt does NOT include the "(initial form)" suffix.
      expect(q.prompt).toBe("Which letter is this?");
    }
  });
});

describe("makeClozeDeck", () => {
  test("blanks the last word and offers 4 options", () => {
    const rules: GrammarRule[] = [
      {
        id: "r1",
        title: "Test rule",
        body: "",
        examples: [
          { arabic: "هذا رأس", english: "this is a head" },
          { arabic: "هذا وجه", english: "this is a face" },
          { arabic: "هذه عين", english: "this is an eye" },
          { arabic: "هل عين", english: "is this an eye?" },
        ],
        topicSlugs: [],
        lessonId: "l1",
      },
    ];
    const vocab = [
      vocabFixture("شعر", "hair"),
      vocabFixture("جبين", "forehead"),
      vocabFixture("حاجب", "eyebrow"),
    ];
    const deck = makeClozeDeck(rules, vocab, { id: "c", title: "Cloze" });
    expect(deck.questions.length).toBeGreaterThan(0);
    for (const q of deck.questions) {
      expect(q.kind).toBe("cloze");
      expect(q.options?.length).toBe(4);
      expect(q.clozeBefore?.length ?? 0).toBeGreaterThan(0);
      expect(q.options?.some((o) => o.id === q.correctAnswerId)).toBe(true);
    }
  });

  test("returns nothing when no multi-word phrases exist", () => {
    const deck = makeClozeDeck([], [], { id: "c", title: "Cloze" });
    expect(deck.questions).toEqual([]);
  });
});
