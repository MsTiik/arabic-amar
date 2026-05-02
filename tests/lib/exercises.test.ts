import { describe, expect, test } from "vitest";
import {
  checkFillBlankAnswer,
  checkMatchPairsAnswer,
  checkOrderingAnswer,
  makeClozeDeck,
  makeConnectingLettersDeck,
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

  test("filters out examples with whitespace-only english", () => {
    const rules: GrammarRule[] = [
      {
        id: "r1",
        title: "Whitespace rule",
        body: "",
        examples: [
          { arabic: "هذا رأس", english: "   " },
          { arabic: "هذا وجه", english: "this is a face" },
          { arabic: "هذه عين", english: "this is an eye" },
          { arabic: "هل عين", english: "is this an eye?" },
          { arabic: "هذا أنف", english: "this is a nose" },
        ],
        topicSlugs: [],
        lessonId: "l1",
      },
    ];
    const deck = makeClozeDeck(rules, [], { id: "c", title: "Cloze" });
    for (const q of deck.questions) {
      expect(q.prompt.trim().length).toBeGreaterThan(0);
    }
  });

  test("includes promptHint translit when every visible word is in vocab", () => {
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
    const vocab: VocabEntry[] = [
      { ...vocabFixture("هذا", "this is (m)"), pronunciation: "hādhā" },
    ];
    const deck = makeClozeDeck(rules, vocab, { id: "c", title: "Cloze" });
    const hadhaCloze = deck.questions.find((q) => q.clozeBefore === "هذا");
    expect(hadhaCloze?.promptHint).toBe("hādhā");
  });
});

describe("makeConnectingLettersDeck", () => {
  const vocab: VocabEntry[] = [
    vocabFixture("كتاب", "book"),
    vocabFixture("قلم", "pen"),
    vocabFixture("بيت", "house"),
    vocabFixture("ولد", "boy"),
    vocabFixture("بنت", "girl"),
    vocabFixture("ماء", "water"),
  ];

  test("produces multi-letter words with disconnected prompts", () => {
    const deck = makeConnectingLettersDeck(vocab, {
      id: "cnx",
      title: "Connect",
      count: 4,
    });
    expect(deck.questions.length).toBe(4);
    for (const q of deck.questions) {
      expect(q.kind).toBe("connecting-letters");
      // promptArabic is space-separated letter sequence — must contain at
      // least one space (so the renderer can't shape them together).
      expect(q.promptArabic).toMatch(/\s/);
      expect(q.options?.length).toBe(4);
      expect(q.options?.some((o) => o.id === q.correctAnswerId)).toBe(true);
    }
  });

  test("returns nothing with too little vocab", () => {
    const deck = makeConnectingLettersDeck([], { id: "x", title: "x" });
    expect(deck.questions).toEqual([]);
  });

  test("rejects single-letter words", () => {
    const tinyVocab: VocabEntry[] = [
      vocabFixture("ا", "alif"),
      vocabFixture("ب", "ba"),
      vocabFixture("ت", "ta"),
      vocabFixture("ث", "tha"),
    ];
    const deck = makeConnectingLettersDeck(tinyVocab, {
      id: "x",
      title: "x",
    });
    expect(deck.questions).toEqual([]);
  });
});
