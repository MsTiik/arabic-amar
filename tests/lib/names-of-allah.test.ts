import { describe, expect, test } from "vitest";

import { NAMES_OF_ALLAH } from "../../src/data/names-of-allah";
import {
  buildNamesOfAllahFlashcardDeck,
  nameOfAllahSourceLabel,
  nameOfAllahWordId,
  NAMES_OF_ALLAH_TOPIC_SLUG,
  NAMES_OF_ALLAH_VOCAB,
  NAMES_OF_ALLAH_WORD_IDS,
  summarizeNamesOfAllahProgress,
} from "../../src/lib/names-of-allah";
import type { UserProgress } from "../../src/lib/types";

function emptyProgress(): UserProgress {
  return {
    version: 1,
    startedAt: "2026-01-01T00:00:00.000Z",
    streak: {
      count: 0,
      lastDay: "",
      freezesAvailable: 2,
      lastFreezeRegenAt: "2026-01-01",
    },
    daily: {
      goalCards: 20,
      today: { date: "2026-01-01", cardsSeen: 0, correct: 0 },
    },
    words: {},
    topics: {},
  };
}

describe("Names of Allah data", () => {
  test("includes 99 entries with required study fields and sources", () => {
    expect(NAMES_OF_ALLAH).toHaveLength(99);
    expect(new Set(NAMES_OF_ALLAH.map((name) => name.id)).size).toBe(99);

    for (const name of NAMES_OF_ALLAH) {
      expect(name.arabic.trim()).not.toBe("");
      expect(name.transliteration.trim()).not.toBe("");
      expect(name.shortMeaning.trim()).not.toBe("");
      expect(name.explanation.trim().length).toBeGreaterThan(24);
      expect(name.sources.length).toBeGreaterThan(0);
      expect(name.sources.some((source) => source.type === "hadith")).toBe(
        true,
      );

      for (const source of name.sources) {
        if (source.type === "quran") {
          expect(source.reference).toMatch(/^Qur'an \d+:\d+$/);
          expect(source.url).toMatch(/^https:\/\/quran\.com\/\d+\/\d+$/);
        } else {
          expect(source.reference).toBe(
            "Jami' at-Tirmidhi 3507 enumeration (da'if grade)",
          );
          expect(source.url).toBe("https://sunnah.com/tirmidhi:3507");
        }
      }
    }
  });

  test("maps names into stable progress-tracked vocabulary ids", () => {
    expect(NAMES_OF_ALLAH_VOCAB).toHaveLength(NAMES_OF_ALLAH.length);
    expect(NAMES_OF_ALLAH_WORD_IDS).toHaveLength(NAMES_OF_ALLAH.length);

    for (const [index, name] of NAMES_OF_ALLAH.entries()) {
      const vocab = NAMES_OF_ALLAH_VOCAB[index];
      expect(vocab).toMatchObject({
        id: nameOfAllahWordId(name),
        arabic: name.arabic,
        pronunciation: name.transliteration,
        english: name.shortMeaning,
        category: "Names of Allah",
        topicSlugs: [NAMES_OF_ALLAH_TOPIC_SLUG],
        lessonId: "names-of-allah",
      });
      expect(vocab.arabicFolded.trim()).not.toBe("");
    }
  });

  test("builds flashcards with transliteration, explanation, and source labels", () => {
    const deck = buildNamesOfAllahFlashcardDeck();

    expect(deck.title).toBe("Names of Allah");
    expect(deck.questions).toHaveLength(NAMES_OF_ALLAH.length);

    for (const [index, question] of deck.questions.entries()) {
      const name = NAMES_OF_ALLAH[index];
      expect(question).toMatchObject({
        kind: "flashcard",
        wordId: nameOfAllahWordId(name),
        prompt: name.shortMeaning,
        promptArabic: name.arabic,
        promptHint: name.transliteration,
        answerDetail: name.explanation,
        sourceLabel: nameOfAllahSourceLabel(name),
        showAudio: false,
      });
    }
  });
});

describe("Names of Allah progress summary", () => {
  test("counts familiar and mastered names as known", () => {
    const progress = emptyProgress();
    progress.words[NAMES_OF_ALLAH_WORD_IDS[0]] = {
      attempts: 3,
      correct: 3,
      streak: 3,
      mastery: 2,
      lastSeen: "2026-01-01T00:00:00.000Z",
      nextDue: "2026-01-04T00:00:00.000Z",
    };
    progress.words[NAMES_OF_ALLAH_WORD_IDS[1]] = {
      attempts: 5,
      correct: 5,
      streak: 5,
      mastery: 3,
      lastSeen: "2026-01-01T00:00:00.000Z",
      nextDue: "2026-01-08T00:00:00.000Z",
    };
    progress.words[NAMES_OF_ALLAH_WORD_IDS[2]] = {
      attempts: 1,
      correct: 1,
      streak: 1,
      mastery: 1,
      lastSeen: "2026-01-01T00:00:00.000Z",
      nextDue: "2026-01-02T00:00:00.000Z",
    };

    expect(summarizeNamesOfAllahProgress(progress)).toEqual({
      total: 99,
      known: 2,
      mastered: 1,
      familiar: 1,
      learning: 1,
      new: 96,
    });
  });
});
