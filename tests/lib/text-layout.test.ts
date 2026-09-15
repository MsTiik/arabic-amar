import { describe, expect, test } from "vitest";

import {
  arabicDisplaySize,
  englishDisplaySize,
  flashcardSceneSize,
  visibleArabicLength,
} from "../../src/lib/text-layout";

describe("responsive display sizing", () => {
  test("does not count tashkeel as separate visible letters", () => {
    const longPair = "أَدَاة مَكْتَبِيَّة / أَدَوَات مَكْتَبِيَّة";

    expect(longPair.length).toBe(43);
    expect(visibleArabicLength(longPair)).toBe(26);
    expect(arabicDisplaySize(longPair)).toBe("text-4xl sm:text-6xl");
  });

  test("gives long paired forms a roomier flashcard", () => {
    expect(
      flashcardSceneSize(
        "حُجْرَةُ الدِّرَاسَة / حُجَرُ الدِّرَاسَة",
        "classroom / classrooms",
      ),
    ).toBe("h-64 sm:h-96");
  });

  test("keeps the longest current English card at a readable size", () => {
    expect(
      englishDisplaySize(
        "Jumādā al-ākhirah / Jumādā ath-thāniyah (6th Hijri month)",
      ),
    ).toBe("text-2xl sm:text-4xl");
  });
});
