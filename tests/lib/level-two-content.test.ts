import { describe, expect, test } from "vitest";

import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_ACTION_SENTENCES,
  LEVEL_TWO_CLASSROOM_VOCABULARY,
  LEVEL_TWO_KHALIDS_HOUSE,
  LEVEL_TWO_READINGS,
  LEVEL_TWO_MARKETPLACE_ORDERING,
  LEVEL_TWO_MARKETPLACE_QUESTIONS,
  LEVEL_TWO_MARKETPLACE_READING,
  LEVEL_TWO_MATCHING_PHRASES,
} from "../../src/data/level-two-lessons";
import { VERB_FAMILIES } from "../../src/data/verb-families";
import { LEVEL_TWO_VOCAB_SETS, LEVEL_TWO_VOCAB_THEMES } from "../../src/data/level-two-vocab-sets";
import { LEVEL_TWO_KHALIDS_HOUSE_ROOMS } from "../../src/data/level-two-khalids-house-rooms";
import { LEVEL_TWO_MASJID_AL_HARAM } from "../../src/data/level-two-masjid-al-haram";
import { LEVEL_TWO_UMAR_STORY } from "../../src/data/level-two-umar-story";
import { LEVEL_TWO_LESSON_NOTES } from "../../src/data/level-two-lesson-notes";
import { validateLevelTwoPublishedContent } from "../../src/lib/level-two-content";

describe("published Level 2 content", () => {
  test("passes the publication accuracy gate", () => {
    expect(validateLevelTwoPublishedContent()).toEqual([]);
  });

  test("flags reading sections that do not cover their sentences", () => {
    const reading = {
      ...LEVEL_TWO_KHALIDS_HOUSE_ROOMS,
      sections: LEVEL_TWO_KHALIDS_HOUSE_ROOMS.sections?.slice(0, 1),
    };

    expect(validateLevelTwoPublishedContent([reading])).toContainEqual({
      location: "reading.khalids-house-rooms",
      message: "Section sentences must cover the reading sentences in the same order.",
    });
  });

  test("groups Bayt to Masjid under the Home and Places theme", () => {
    expect(LEVEL_TWO_VOCAB_THEMES.map((theme) => theme.slug)).toEqual(["home-and-places"]);
    expect(LEVEL_TWO_VOCAB_THEMES[0].sets.map((set) => set.slug)).toEqual(["bayt-to-masjid"]);
  });

  test("keeps every Bayt to Masjid card and example sentence", () => {
    const set = LEVEL_TWO_VOCAB_SETS.find((entry) => entry.slug === "bayt-to-masjid");
    expect(set?.words.map((word) => word.id)).toEqual([
      "bayt", "kabir", "jamil", "shari", "hadiqa", "wasi", "hawla",
      "yartafiu", "shajara", "yatakawwanu", "tabiq", "qarib", "masjid",
    ]);
    expect(set?.words.flatMap((word) => word.sentences)).toHaveLength(33);
    for (const word of set?.words ?? []) expect(word.sentences.length).toBeGreaterThan(0);
  });

  test("keeps the reviewed source sections complete", () => {
    expect(LEVEL_TWO_CLASSROOM_VOCABULARY).toHaveLength(26);
    expect(LEVEL_TWO_MARKETPLACE_QUESTIONS).toHaveLength(11);
    expect(LEVEL_TWO_MARKETPLACE_READING).toHaveLength(4);
    expect(LEVEL_TWO_MARKETPLACE_READING.flatMap((sentence) => sentence.tokens)).toHaveLength(39);
    expect(LEVEL_TWO_KHALIDS_HOUSE.sentences).toHaveLength(9);
    expect(LEVEL_TWO_KHALIDS_HOUSE.questions).toHaveLength(8);
    expect(LEVEL_TWO_READINGS).toHaveLength(4);
    expect(LEVEL_TWO_MASJID_AL_HARAM.sentences).toHaveLength(13);
    expect(LEVEL_TWO_MASJID_AL_HARAM.questions).toHaveLength(12);
    expect(LEVEL_TWO_MASJID_AL_HARAM.drills?.map((drill) => drill.kind)).toEqual(["match", "order", "correct"]);
    const [matching, ordering, corrections] = LEVEL_TWO_MASJID_AL_HARAM.drills ?? [];
    expect(matching?.kind === "match" && matching.pairs).toHaveLength(8);
    expect(ordering?.kind === "order" && ordering.items).toHaveLength(10);
    expect(corrections?.kind === "correct" && corrections.items.map((item) => item.number)).toEqual([1, 2, 3, 4, 5, 8, 9, 10, 11]);
    if (ordering?.kind === "order") {
      for (const item of ordering.items) {
        // Building the suggested sentence from the chips must give the same words, bar joined وَ.
        const built = item.order.map((index) => item.jumbled[index].arabic).join(" ");
        const answer = item.answer.tokens.map((token) => token.arabic).join(" ");
        expect(built.replace(/وَ /g, "وَ")).toBe(answer);
      }
    }
    expect(LEVEL_TWO_MASJID_AL_HARAM.wordList).toHaveLength(59);
    const haramSentenceIds = LEVEL_TWO_MASJID_AL_HARAM.sentences.map((sentence) => sentence.id);
    for (const question of LEVEL_TWO_MASJID_AL_HARAM.questions) {
      expect(haramSentenceIds).toContain(question.sentenceId);
    }
    expect(LEVEL_TWO_KHALIDS_HOUSE_ROOMS.sections).toHaveLength(3);
    expect(LEVEL_TWO_KHALIDS_HOUSE_ROOMS.sentences).toHaveLength(12);
    expect(LEVEL_TWO_KHALIDS_HOUSE_ROOMS.sentences.flatMap((sentence) => sentence.tokens)).toHaveLength(147);
    expect(LEVEL_TWO_KHALIDS_HOUSE_ROOMS.phrases).toHaveLength(9);
    const sentenceIds = LEVEL_TWO_KHALIDS_HOUSE.sentences.map((sentence) => sentence.id);
    for (const question of LEVEL_TWO_KHALIDS_HOUSE.questions) {
      expect(sentenceIds).toContain(question.sentenceId);
    }
    expect(LEVEL_TWO_MATCHING_PHRASES).toHaveLength(9);
    expect(LEVEL_TWO_MARKETPLACE_ORDERING).toHaveLength(9);
    expect(LEVEL_TWO_ACTIONS).toHaveLength(27);
    expect(LEVEL_TWO_ACTION_SENTENCES).toHaveLength(11);
    expect(VERB_FAMILIES.filter((family) => family.levelTwoSourcePage !== undefined)).toHaveLength(5);
    expect(VERB_FAMILIES.filter((family) => family.levelTwoLesson !== undefined)).toHaveLength(19);
    expect(VERB_FAMILIES.filter((family) => family.levelTwoOrder !== undefined)).toHaveLength(24);
  });

  test("keeps the ʿUmar story sheet word for word, with its six questions", () => {
    const story = LEVEL_TWO_UMAR_STORY;
    expect(story.sentences).toHaveLength(11);
    expect(story.questions).toHaveLength(6);
    const text = (index: number) =>
      story.sentences[index].tokens
        .map((token) => `${token.punctuationBefore ?? ""}${token.arabic}${token.punctuationAfter ?? ""}`)
        .join(" ");
    expect(text(0)).toBe(
      "خَرَجَ سَيِّدُنا عُمَرُ بْنُ الخَطّابِ (رَضِيَ اللهُ عَنْهُ) مِنْ بَيْتِهِ، يَمْشي في شَوارِعِ المَدينَةِ في اللَّيْلِ،",
    );
    expect(text(3)).toBe("فَقالَتِ المَرْأَةُ: في الإِناءِ ماءٌ وَحِجارَةٌ.");
    expect(text(9)).toBe("وَوَضَعَ الدَّقيقَ وَالزَّيْتَ في الإِناءِ، وَطَبَخَ (وَصَنَعَ) خُبْزًا، وَأَطْعَمَ الأَوْلادَ.");
    expect(text(10)).toBe("فَقالَتِ المَرْأَةُ: جَزاكَ اللهُ خَيْرًا، أَنْتَ الخَليفَةُ حَقًّا لا عُمَرُ.");
    const sentenceIds = story.sentences.map((sentence) => sentence.id);
    for (const question of story.questions) expect(sentenceIds).toContain(question.sentenceId);
    // In question 3 the water and stones are objects of وَضَعَتْ, so they take fatḥatayn.
    expect(story.questions[2].question.tokens.map((token) => token.arabic)).toContain("مَاءً");
  });

  test("shows the story inside Lesson 15, which lives in Home and Places", () => {
    const lesson = LEVEL_TWO_LESSON_NOTES.find((notes) => notes.slug === "daily-actions-at-home");
    expect(lesson?.lesson).toBe(15);
    const blocks = lesson?.sections.flatMap((section) => section.blocks) ?? [];
    expect(blocks.filter((block) => block.kind === "reading").map((block) => block.kind === "reading" && block.slug)).toEqual([
      LEVEL_TWO_UMAR_STORY.slug,
    ]);
    expect(LEVEL_TWO_VOCAB_THEMES[0].readingSlugs).toContain("daily-actions-at-home");
    const table = (id: string) => blocks.find((block) => block.kind === "table" && block.id === id);
    const rows = (id: string) => {
      const block = table(id);
      return block?.kind === "table" ? block.rows : [];
    };
    expect(rows("home-words-table")).toHaveLength(7);
    expect(rows("lesson-verbs")).toHaveLength(17);
  });

  test("flags a lesson reading block that names no reading", () => {
    const lesson = LEVEL_TWO_LESSON_NOTES.find((notes) => notes.slug === "daily-actions-at-home")!;
    const issues = validateLevelTwoPublishedContent(LEVEL_TWO_READINGS.filter((reading) => reading.slug !== LEVEL_TWO_UMAR_STORY.slug));
    expect(issues.some((issue) => issue.location.startsWith(`lesson-notes.${lesson.slug}.story.umar-reading`))).toBe(true);
  });

  test("adds the teacher’s five near-and-far examples to the qarīb card", () => {
    const qarib = LEVEL_TWO_VOCAB_SETS.flatMap((set) => set.words).find((word) => word.id === "qarib");
    expect(qarib?.sentences.slice(-5).map((sentence) => sentence.english)).toEqual([
      "The pen is near the book and far from the ruler.",
      "The teacher is near the board and far from the students.",
      "The car is near the tree and far from the house.",
      "Pakistan is near Iran and far from Egypt.",
      "The Muslim is close to Allah and far from Satan.",
    ]);
  });

  test("does not reintroduce the two inaccurate regularised plurals", () => {
    const forms = LEVEL_TWO_CLASSROOM_VOCABULARY.flatMap((entry) => [
      entry.arabic,
      entry.pluralArabic ?? "",
    ]);

    expect(forms).toContain("مَمَاحٍ");
    expect(forms).toContain("مَبَارٍ");
    expect(forms).not.toContain("مِمْحَات");
    expect(forms).not.toContain("مِبْرَايَات");
  });
});
