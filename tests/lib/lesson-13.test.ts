import { describe, expect, test } from "vitest";

import { LEVEL_TWO_LESSON_13 } from "../../src/data/level-two-lesson-13";
import { LESSON_13_QURAN } from "../../src/data/level-two-lesson-13-quran";
import { LEVEL_TWO_MASJID_AL_HARAM } from "../../src/data/level-two-masjid-al-haram";
import { mistakeRange } from "../../src/lib/mistake-range";
import { foldForSearch } from "../../src/lib/diacritics";
import { getLevelTwoVocabularyEntries } from "../../src/lib/vocabulary-bank";
import fixture from "../fixtures/quran-ayahs.json";

const AYAHS: Record<string, string> = fixture.ayahs;

describe("Lesson 13 Qur’an excerpts", () => {
  const examples = Object.values(LESSON_13_QURAN).flat();

  test("every excerpt is copied word for word from its ayah", () => {
    expect(examples.length).toBeGreaterThan(10);
    for (const example of examples) {
      const ayah = AYAHS[`${example.surah}:${example.ayah}`];
      expect(ayah, `${example.surah}:${example.ayah} missing from the fixture`).toBeDefined();
      const words = example.text.replace(/[[\]]/g, "").replace(/…/g, "").trim().split(/\s+/);
      const ayahWords = ayah.split(" ").map((word) => word.replace(/[ۖ-ۜ]+$/, ""));
      const start = ayahWords.indexOf(words[0]);
      expect(start, `${example.surah}:${example.ayah} starts with a word not in the ayah`).toBeGreaterThanOrEqual(0);
      expect(ayahWords.slice(start, start + words.length)).toEqual(words);
      // … marks exactly where the excerpt is cut.
      expect(example.text.startsWith("…")).toBe(start > 0);
      expect(example.text.endsWith("…")).toBe(start + words.length < ayahWords.length);
    }
  });

  test("each excerpt highlights one span and glosses it for the vocabulary bank", () => {
    const bank = getLevelTwoVocabularyEntries();
    for (const example of examples) {
      expect(example.text.match(/\[[^\]]+\]/g)).toHaveLength(1);
      expect(
        bank.some((entry) => entry.arabicFolded === foldForSearch(example.focus.arabic)),
        `${example.focus.arabic} should be in the vocabulary bank`,
      ).toBe(true);
    }
  });

  test("every section of the lesson ends with its Qur’an examples", () => {
    for (const [sectionId, items] of Object.entries(LESSON_13_QURAN)) {
      const section = LEVEL_TWO_LESSON_13.sections.find((candidate) => candidate.id === sectionId);
      expect(section, sectionId).toBeDefined();
      const last = section!.blocks.at(-1)!;
      expect(last.kind).toBe("quran");
      expect(last.kind === "quran" && last.items).toEqual(items);
    }
  });
});

describe("spot the mistake", () => {
  const drill = LEVEL_TWO_MASJID_AL_HARAM.drills?.find((candidate) => candidate.kind === "correct");

  test("finds exactly the board words the correction changes", () => {
    expect(drill?.kind).toBe("correct");
    if (drill?.kind !== "correct") return;
    const wrongWords = drill.items.map((item) => {
      const [from, to] = mistakeRange(item.question, item.answer);
      expect(to, item.id).toBeGreaterThan(from);
      return item.question.tokens.slice(from, to).map((token) => token.arabic).join(" ");
    });
    expect(wrongWords).toEqual([
      "الْمَاءُ",
      "تِسْعِ",
      "خِزَانَةِ الْمَلَابِسِ",
      "غُرْفَةِ النَّوْمِ",
      "الْمَوَاقِدِ",
      "فَوْقَ",
      "تَحْتَ",
      "الثَّلَّاجَةِ",
      "الْحَمَّامِ",
    ]);
  });
});
