import { describe, expect, test } from "vitest";

import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_CLASSROOM_VOCABULARY,
  LEVEL_TWO_KHALIDS_HOUSE,
  LEVEL_TWO_READINGS,
  LEVEL_TWO_MARKETPLACE_READING,
  drillSentences,
} from "../../src/data/level-two-lessons";
import { LEVEL_TWO_KHALIDS_HOUSE_ROOMS } from "../../src/data/level-two-khalids-house-rooms";
import { LEVEL_TWO_MASJID_AL_HARAM } from "../../src/data/level-two-masjid-al-haram";
import { LEVEL_TWO_UMAR_STORY } from "../../src/data/level-two-umar-story";
import {
  LEVEL_TWO_LESSON_NOTES,
  arabicWords,
  lessonNoteExerciseArabic,
  lessonNoteItems,
  lessonNoteProse,
} from "../../src/data/level-two-lesson-notes";
import {
  LEVEL_TWO_GRAMMAR_SHEETS,
  chartForms,
  plainArabic,
} from "../../src/data/level-two-grammar";
import { LEVEL_TWO_VOCAB_SETS } from "../../src/data/level-two-vocab-sets";
import { VERB_FAMILIES } from "../../src/data/verb-families";
import { getSiteContent } from "../../src/lib/content";
import { foldedSearchMatches, foldForSearch } from "../../src/lib/diacritics";
import {
  cliticFreeArabicForms,
  getLevelTwoVocabularyEntries,
  getVocabularyBankContent,
} from "../../src/lib/vocabulary-bank";

describe("Level 2 vocabulary bank coverage", () => {
  const levelTwoEntries = getLevelTwoVocabularyEntries();
  const bank = getVocabularyBankContent(getSiteContent());

  function expectArabicInLevelTwoBank(arabic: string) {
    const folded = foldForSearch(arabic);
    expect(
      levelTwoEntries.some((entry) =>
        entry.arabicFolded.split(/\s*\/\s*/).includes(folded),
      ),
      `Expected ${arabic} in the derived Level 2 vocabulary`,
    ).toBe(true);
    expect(
      bank.vocab.some((entry) =>
        entry.arabicFolded.split(/\s*\/\s*/).includes(folded),
      ),
      `Expected ${arabic} in the complete vocabulary bank`,
    ).toBe(true);
  }

  test("includes every reviewed classroom singular and plural", () => {
    for (const entry of LEVEL_TWO_CLASSROOM_VOCABULARY) {
      expectArabicInLevelTwoBank(entry.arabic);
      if (entry.pluralArabic) expectArabicInLevelTwoBank(entry.pluralArabic);
    }
  });

  test("includes every present-tense action", () => {
    for (const action of LEVEL_TWO_ACTIONS) {
      expectArabicInLevelTwoBank(action.arabic);
    }
  });

  test("includes every marketplace reading token", () => {
    for (const token of LEVEL_TWO_MARKETPLACE_READING.flatMap(
      (sentence) => sentence.tokens,
    )) {
      expectArabicInLevelTwoBank(token.arabic);
    }
  });

  test("includes every word in Khalid’s house, its questions and answers", () => {
    for (const sentence of [
      ...LEVEL_TWO_KHALIDS_HOUSE.sentences,
      ...LEVEL_TWO_KHALIDS_HOUSE.questions.flatMap((question) => [question.question, question.answer]),
    ]) {
      for (const token of sentence.tokens) expectArabicInLevelTwoBank(token.arabic);
    }
  });

  test("includes every token in the sectioned reading and each useful phrase", () => {
    for (const token of LEVEL_TWO_KHALIDS_HOUSE_ROOMS.sections!.flatMap((section) =>
      section.sentences.flatMap((sentence) => sentence.tokens),
    )) {
      expectArabicInLevelTwoBank(token.arabic);
    }
    for (const phrase of LEVEL_TWO_KHALIDS_HOUSE_ROOMS.phrases ?? []) {
      expectArabicInLevelTwoBank(phrase.arabic);
    }

    expect(bank.topics.map((topic) => topic.slug)).toContain(
      "level-2-khalids-house-rooms-reading",
    );
    expect(LEVEL_TWO_READINGS.map((reading) => reading.slug)).toContain(
      "khalids-house-rooms",
    );
  });

  test("includes every word in the Masjid al-Haram reading, exercises and word list", () => {
    const reading = LEVEL_TWO_MASJID_AL_HARAM;
    for (const sentence of [
      reading.instruction!,
      reading.questionsHeading!,
      ...(reading.drills ?? []).flatMap(drillSentences),
      ...reading.sentences,
      ...reading.questions.flatMap((question) => [question.question, question.answer]),
    ]) {
      for (const token of sentence.tokens) expectArabicInLevelTwoBank(token.arabic);
    }
    expect(reading.wordList).toHaveLength(59);
    for (const word of reading.wordList ?? []) expectArabicInLevelTwoBank(word.arabic);

    expect(LEVEL_TWO_READINGS.map((candidate) => candidate.slug)).toContain("masjid-al-haram");
    expect(bank.topics.map((topic) => topic.slug)).toContain("level-2-masjid-al-haram-reading");

    const matches = (query: string) =>
      bank.vocab.filter((entry) =>
        entry.topicSlugs.includes("level-2-masjid-al-haram-reading") &&
        [entry.arabicFolded, foldForSearch(entry.pronunciation ?? ""), foldForSearch(entry.english)].some((value) =>
          value.includes(foldForSearch(query)),
        ),
      );
    expect(matches("ثريات").map((entry) => entry.english)).toContain("chandeliers");
    expect(matches("thurayyat").map((entry) => entry.arabic)).toContain("ثُرَيَّاتٌ");
    expect(matches("chandeliers").map((entry) => entry.arabic)).toContain("ثُرَيَّاتٌ");
    expect(matches("زمزم").map((entry) => entry.english)).toContain("Zamzam");
    expect(matches("yatufu").map((entry) => entry.arabic)).toContain("يَطُوفُ");
    expect(matches("pilgrims").map((entry) => entry.arabic)).toContain("الْحُجَّاجُ");
    expect(matches("فنادق").map((entry) => entry.pronunciation)).toContain("fanādiq");
    expect(matches("wallet").map((entry) => entry.arabic)).toContain("الْمِحْفَظَةِ");
    expect(matches("sunburu").map((entry) => entry.arabic)).toContain("صُنْبُورُ");
    expect(matches("قبيح").map((entry) => entry.english)).toContain("ugly");
    expect(matches("رتب").map((entry) => entry.english)).toContain("arrange (command)");
  });

  test.each(LEVEL_TWO_LESSON_NOTES.map((notes) => [notes.slug, notes] as const))(
    "lists every Arabic word in the %s lesson notes on its own",
    (_slug, notes) => {
      const standalone = new Set<string>();
      // Only this lesson's own entries count, so a word can't pass on a gloss
      // that belongs to (and may later vanish from) another lesson.
      for (const entry of levelTwoEntries.filter((candidate) =>
        candidate.topicSlugs.includes(`level-2-${notes.slug}`),
      )) {
        for (const part of entry.arabicFolded.split(/\s*\/\s*/)) standalone.add(part.trim());
        for (const form of entry.arabicSearchForms ?? []) standalone.add(form);
      }
      const words = new Set<string>();
      for (const { item } of lessonNoteItems(notes)) for (const word of arabicWords(item.arabic)) words.add(word);
      for (const text of lessonNoteProse(notes)) for (const word of arabicWords(text)) words.add(word);
      for (const text of lessonNoteExerciseArabic(notes)) for (const word of arabicWords(text)) words.add(word);
      const missing = [...words].filter((word) => {
        const folded = foldForSearch(word).replace(/\u0640/g, "");
        // Single letters (root letters, ة, ي) are spelling notes, not vocabulary.
        if (folded.length < 2) return false;
        return !standalone.has(foldForSearch(word));
      });
      expect(missing, `Add these to sentenceWords: ${missing.join(" ")}`).toEqual([]);

      expect(bank.topics.map((topic) => topic.slug)).toContain(`level-2-${notes.slug}`);
    },
  );

  test("finds Lesson 13 words by Arabic, transliteration and English", () => {
    const topic = bank.vocab.filter((entry) => entry.topicSlugs.includes("level-2-getting-to-know-each-other"));
    const matches = (query: string) =>
      topic.filter((entry) =>
        [entry.arabicFolded, foldForSearch(entry.pronunciation ?? ""), foldForSearch(entry.english)].some((value) =>
          value.includes(foldForSearch(query)),
        ),
      );
    expect(matches("صينية").map((entry) => entry.english)).toContain("Chinese (f.)");
    expect(matches("siniyyatun").map((entry) => entry.arabic)).toContain("صِينِيَّةٌ");
    expect(matches("two bags").map((entry) => entry.arabic)).toContain("حَقِيبَتَانِ");
    expect(matches("warā").map((entry) => entry.arabic)).toContain("وَرَاءَ");
    expect(matches("what is your name").map((entry) => entry.arabic)).toContain("مَا اسْمُكَ؟");
    expect(matches("the ball").map((entry) => entry.arabic)).toContain("الكُرَةُ");
    // Deliberately wrong options are shown in exercises but never become bank entries.
    expect(topic.some((entry) => entry.english.startsWith("✗"))).toBe(false);
    expect(topic.map((entry) => entry.arabic)).not.toContain("ثَلَاثُ أَقْلَامٍ");
  });

  test("finds every Lesson 14 noun and plural by Arabic, transliteration and English", () => {
    const topic = bank.vocab.filter((entry) => entry.topicSlugs.includes("level-2-vocabulary-of-the-home"));
    const search = (query: string) => {
      const folded = foldForSearch(query);
      return topic.filter((entry) =>
        [entry.arabicFolded, ...(entry.arabicSearchForms ?? []), foldForSearch(entry.pronunciation ?? ""), foldForSearch(entry.english)].some(
          (value) => foldedSearchMatches(value, folded, { exactArabic: true }),
        ),
      );
    };
    // [singular, transliteration, English, plural, plural transliteration] as on the board.
    const nouns = [
      ["غُرْفَة", "ghurfah", "room", "غُرَف", "ghuraf"],
      ["مَكَان", "makān", "place", "أَمَاكِن", "amākin"],
      ["مَطْبَخ", "maṭbakh", "kitchen", "مَطَابِخ", "maṭābikh"],
      ["حَمَّام", "ḥammām", "bathroom", "حَمَّامَات", "ḥammāmāt"],
      ["طَعَام", "ṭaʿām", "food", "أَطْعِمَة", "aṭʿimah"],
      ["سُلَّم", "sullam", "stairs, staircase, ladder", "سَلَالِم", "salālim"],
      ["أَرِيكَة", "arīkah", "sofa, couch", "أَرَائِك", "arāʾik"],
      ["مِنْضَدَة", "minḍadah", "table (side or coffee table)", "مَنَاضِد", "manāḍid"],
      ["تِلْفَاز", "tilfāz", "television", "تِلْفَازَات", "tilfāzāt"],
      ["سَجَّادَة", "sajjādah", "carpet, rug, prayer mat", "سَجَاجِيد", "sajājīd"],
      ["زَهْرِيَّة", "zahriyyah", "vase", "زَهْرِيَّات", "zahriyyāt"],
      ["ثُرَيَّا", "thurayyā", "chandelier", "ثُرَيَّات", "thurayyāt"],
      ["سَقْف", "saqf", "ceiling, roof", "أَسْقُف", "asquf"],
      ["مَائِدَة", "māʾidah", "dining table, table spread with food", "مَوَائِد", "mawāʾid"],
      ["طَبَق", "ṭabaq", "plate, dish", "أَطْبَاق", "aṭbāq"],
      ["شَوْكَة", "shawkah", "fork (also: thorn)", "شُوَك", "shuwak"],
      ["مِلْعَقَة", "milʿaqah", "spoon", "مَلَاعِق", "malāʿiq"],
      ["سَرِير", "sarīr", "bed", "أَسِرَّة", "asirrah"],
      ["خِزَانَة", "khizānah", "cupboard, wardrobe, safe", "خَزَائِن", "khazāʾin"],
      ["شَمَّاعَة", "shammāʿah", "clothes hanger, coat rack", "شَمَّاعَات", "shammāʿāt"],
      ["وِسَادَة", "wisādah", "pillow, cushion", "وَسَائِد", "wasāʾid"],
      ["بَطَّانِيَّة", "baṭṭāniyyah", "blanket", "بَطَاطِين", "baṭāṭīn"],
      ["مِرْآة", "mirʾāh", "mirror", "مَرَايَا", "marāyā"],
      ["مُكَيِّف", "mukayyif", "air conditioner", "مُكَيِّفَات", "mukayyifāt"],
      ["شُرْفَة", "shurfah", "balcony", "شُرُفَات", "shurufāt"],
      ["سِتَار", "sitār", "curtain", "سَتَائِر", "satāʾir"],
    ] as const;
    expect(nouns).toHaveLength(26);
    for (const [arabic, transliteration, english, plural, pluralTransliteration] of nouns) {
      // Typed without vowel marks, as a learner would.
      expect(search(plainArabic(arabic)).map((entry) => entry.english), arabic).toContain(english);
      expect(search(plainArabic(plural)).length, plural).toBeGreaterThan(0);
      // Identical entries from other lessons merge, so compare without vowel marks.
      const found = (query: string) => search(query).map((entry) => entry.arabicFolded).join(" / ").split(/\s*\/\s*/);
      expect(found(transliteration), transliteration).toContain(foldForSearch(arabic));
      expect(found(pluralTransliteration), pluralTransliteration).toContain(foldForSearch(plural));
      expect(found(english), english).toContain(foldForSearch(arabic));
    }
    // Extra words, verb forms and opposites from the board.
    const searchFolded = (query: string) => search(query).map((entry) => entry.arabicFolded);
    expect(searchFolded("fridge"), "fridge").toContain(foldForSearch("ثَلَّاجَة"));
    expect(searchFolded("toothbrush"), "toothbrush").toContain(foldForSearch("فُرْشَاةُ الأَسْنَانِ"));
    expect(search("ستار").map((entry) => entry.english)).toContain("curtain");
    expect(search("الثلاجة").map((entry) => entry.english)).toContain("the fridge");
    expect(searchFolded("thallajah"), "thallajah").toContain(foldForSearch("ثَلَّاجَة"));
    expect(searchFolded("he bade farewell"), "he bade farewell").toContain(foldForSearch("وَدَّعَ"));
    expect(search("نم").map((entry) => entry.english)).toContain("sleep!");
    expect(searchFolded("istayqaza"), "istayqaza").toContain(foldForSearch("اِسْتَيْقَظَ"));
    expect(searchFolded("heavy"), "heavy").toContain(foldForSearch("ثَقِيل"));
    expect(searchFolded("khafif"), "khafif").toContain(foldForSearch("خَفِيف"));
    expect(searchFolded("bedroom"), "bedroom").toContain(foldForSearch("غُرْفَةُ النَّوْمِ"));
    expect(searchFolded("the Ever-Living"), "the Ever-Living").toContain(foldForSearch("الحَيُّ"));
    expect(topic.some((entry) => entry.english.startsWith("✗"))).toBe(false);
  });

  test("finds Lesson 15 words and verbs by Arabic, transliteration and English", () => {
    const topic = bank.vocab.filter((entry) => entry.topicSlugs.includes("level-2-daily-actions-at-home"));
    const search = (query: string) => {
      const folded = foldForSearch(query);
      return topic.filter((entry) =>
        [entry.arabicFolded, ...(entry.arabicSearchForms ?? []), foldForSearch(entry.pronunciation ?? ""), foldForSearch(entry.english)].some(
          (value) => foldedSearchMatches(value, folded, { exactArabic: true }),
        ),
      );
    };
    const arabicOf = (query: string) => search(query).map((entry) => entry.arabicFolded).join(" / ").split(/\s*\/\s*/);
    // [Arabic, transliteration, English] for the seven home words and the seventeen verbs.
    const words = [
      ["رَفّ", "raff", "shelf"], ["رُفُوف", "rufūf", "shelves"], ["مَوْقِد", "mawqid", "stove"],
      ["ثَلَّاجَة", "thallājah", "fridge"], ["حَوْض", "ḥawḍ", "sink"], ["سَلَّةُ مُهْمَلَات", "sallatu muhmalāt", "waste basket"],
      ["غَسَّالَة", "ghassālah", "washing machine"], ["صُنْبُور", "ṣunbūr", "tap"], ["صَنَابِير", "ṣanābīr", "taps"],
      ["طَبَخَ", "ṭabakha", "he cooked"], ["يَطْبُخُ", "yaṭbukhu", "he cooks"], ["أَشْعَلَ", "ashʿala", "he lit"],
      ["يُشْعِلُ", "yushʿilu", "he lights"], ["يُنَظِّفُ", "yunaẓẓifu", "he cleans"], ["يُجَهِّزُ", "yujahhizu", "he prepares"],
      ["يَسْتَيْقِظُ", "yastayqiẓu", "he wakes up"], ["يُرَتِّبُ", "yurattibu", "he tidies"], ["يُعَلِّقُ", "yuʿalliqu", "he hangs"],
      ["يَلْبَسُ", "yalbasu", "he wears"], ["يَسْتَحِمُّ", "yastaḥimmu", "he bathes"], ["يَنْشُرُ", "yanshuru", "he spreads out"],
      ["يَصْعَدُ", "yaṣʿadu", "he goes up"], ["يَفْرِشُ", "yafrishu", "he spreads"], ["يُذَاكِرُ", "yudhākiru", "he studies"],
      ["كِبْرِيت", "kibrīt", "match"], ["صَابُون", "ṣābūn", "soap"], ["خَلِيفَة", "khalīfah", "caliph"],
      ["حِجَارَة", "ḥijārah", "stones"], ["دَقِيق", "daqīq", "flour"], ["يُطْعِمُ", "yuṭʿimu", "he feeds"],
    ] as const;
    for (const [arabic, transliteration, english] of words) {
      expect(search(plainArabic(arabic)).length, arabic).toBeGreaterThan(0);
      expect(arabicOf(transliteration), transliteration).toContain(foldForSearch(arabic));
      expect(arabicOf(english), english).toContain(foldForSearch(arabic));
    }
    expect(search("what is he doing").length + search("mādhā yafʿalu").length).toBeGreaterThan(0);
    expect(topic.some((entry) => entry.english.startsWith("✗"))).toBe(false);
  });

  test("includes every word of the ʿUmar story, its questions and answers", () => {
    const story = LEVEL_TWO_UMAR_STORY;
    for (const sentence of [
      story.instruction!,
      story.questionsHeading!,
      ...story.sentences,
      ...story.questions.flatMap((question) => [question.question, question.answer]),
    ]) {
      for (const token of sentence.tokens) expectArabicInLevelTwoBank(token.arabic);
    }
    const topic = bank.vocab.filter((entry) => entry.topicSlugs.includes("level-2-umar-and-the-woman-with-the-pot-reading"));
    const find = (query: string) =>
      topic.filter((entry) =>
        [entry.arabicFolded, ...(entry.arabicSearchForms ?? []), foldForSearch(entry.pronunciation ?? ""), foldForSearch(entry.english)].some(
          (value) => value.includes(foldForSearch(query)),
        ),
      );
    expect(find("حجارة").map((entry) => entry.english)).toContain("and stones");
    expect(find("ḥijāratun").map((entry) => entry.arabic)).toContain("وَحِجارَةٌ");
    expect(find("flour").map((entry) => entry.arabic)).toContain("دَقيقًا");
    expect(find("the caliph").map((entry) => entry.arabic)).toContain("الخَليفَةُ");
    expect(find("خليفة").map((entry) => entry.english)).toContain("a caliph");
  });

  test.each([
    ["وَسَجّادَةٌ", "wa-sajjādatun", ["سجادة"]],
    ["وَلِلْغُرْفَةِ", "wa-li-l-ghurfati", ["للغرفة", "غرفة"]],
    ["لِلطَّعامِ", "li-ṭ-ṭaʿāmi", ["طعام"]],
    ["الصّابونُ", "aṣ-ṣābūnu", ["صابون"]],
    ["وَالشّامبو", "wa-sh-shāmbū", ["الشامبو", "شامبو"]],
    ["وَوِسادَةٌ", "wa-wisādatun", ["وسادة"]],
    ["خالِدٍ", "khālidin", []],
    ["لِلْبَيْتِ", "lil-bayti", []],
    ["اسْتِقْبالٍ", "stiqbālin", []],
  ])("derives clitic-free Arabic forms for %s", (arabic, transliteration, expected) => {
    expect(cliticFreeArabicForms(arabic, transliteration)).toEqual(expected);
  });

  test("searches clitic-free Arabic forms without changing the displayed Arabic key", () => {
    const rug = bank.vocab.find((entry) => entry.arabic === "وَسَجّادَةٌ");
    expect(rug?.arabicSearchForms).toContain("سجادة");
    expect(
      [rug?.arabicFolded ?? "", ...(rug?.arabicSearchForms ?? [])].some((value) =>
        foldedSearchMatches(value, foldForSearch("سجادة"), { exactArabic: true }),
      ),
    ).toBe(true);
    expect(rug?.arabicFolded).toBe(foldForSearch("وَسَجّادَةٌ"));

    for (const query of ["sajjada", "rug"]) {
      expect(
        [
          rug?.arabicFolded ?? "",
          foldForSearch(rug?.pronunciation ?? ""),
          foldForSearch(rug?.english ?? ""),
        ].some((value) => value.includes(foldForSearch(query))),
      ).toBe(true);
    }
  });

  test("includes the four core forms from every Level 2 verb family", () => {
    for (const family of VERB_FAMILIES.filter(
      (entry) => entry.levelTwoOrder !== undefined,
    )) {
      for (const form of Object.values(family.forms)) {
        expectArabicInLevelTwoBank(form.arabic);
      }
    }
  });

  test("includes every related form and opposite from the Level 2 verb families", () => {
    for (const family of VERB_FAMILIES.filter(
      (entry) => entry.levelTwoOrder !== undefined,
    )) {
      for (const form of family.relatedForms ?? []) expectArabicInLevelTwoBank(form.arabic);
      if (family.opposite) expectArabicInLevelTwoBank(family.opposite.arabic);
    }
  });

  test("includes every word and chart form from the Level 2 grammar sheets", () => {
    for (const sheet of LEVEL_TWO_GRAMMAR_SHEETS) {
      for (const example of sheet.markers.flatMap((marker) => marker.examples)) {
        expectArabicInLevelTwoBank(plainArabic(example.arabic));
      }
      for (const pair of sheet.pairs) {
        expectArabicInLevelTwoBank(pair.masculine.arabic);
        expectArabicInLevelTwoBank(plainArabic(pair.feminine.arabic));
      }
      for (const word of sheet.demonstrativeWords) expectArabicInLevelTwoBank(word.arabic);
      for (const person of sheet.persons) expectArabicInLevelTwoBank(person.pronoun.arabic);
      for (const verb of [sheet.modelVerb, ...sheet.chartVerbs]) {
        for (const form of chartForms(verb, sheet.persons)) {
          expectArabicInLevelTwoBank(plainArabic(form.arabic));
        }
      }
      for (const option of sheet.practice.flatMap((question) => question.options)) {
        expectArabicInLevelTwoBank(option.arabic);
      }
      for (const word of sheet.sentenceWords) expectArabicInLevelTwoBank(word.arabic);
    }
  });

  test("finds new verb-family and grammar words by Arabic, transliteration, and English", () => {
    const matches = (query: string) => {
      const folded = foldForSearch(query);
      return bank.vocab.filter((entry) =>
        [entry.arabicFolded, foldForSearch(entry.pronunciation ?? ""), foldForSearch(entry.english)]
          .some((field) => field.includes(folded)),
      );
    };
    expect(matches("he weighs").map((entry) => entry.arabic)).toContain("يَزِنُ");
    expect(matches("yazinu").map((entry) => entry.arabic)).toContain("يَزِنُ");
    expect(matches("يزن").map((entry) => entry.english)).toContain("he weighs");
    expect(matches("you (f.) study").map((entry) => entry.arabic)).toContain("تَدْرُسِينَ");
    expect(matches("tadrusina").map((entry) => entry.arabic)).toContain("تَدْرُسِينَ");
    expect(matches("صحراء").map((entry) => entry.english)).toContain("desert");
    expect(matches("تشرح").map((entry) => entry.english)).toContain("she explains");
    expect(matches("tashrahu").map((entry) => entry.arabic)).toContain("تَشْرَحُ");
    expect(matches("المشتري").map((entry) => entry.english)).toContain("the buyer");
    expect(matches("homework").map((entry) => entry.arabic)).toContain("وَاجِبٌ");
    expect(bank.topics.map((topic) => topic.slug)).toContain("level-2-masculine-and-feminine");
    expect(matches("a wall").map((entry) => entry.arabic)).toContain("سُورٌ");
    expect(matches("murtafiun").map((entry) => entry.arabic)).toContain("مُرْتَفِعٌ");
    expect(matches("حديقة").map((entry) => entry.english)).toContain("a garden");
    expect(matches("بعيدة").map((entry) => entry.english)).toContain("and far (f.)");
    expect(bank.topics.map((topic) => topic.slug)).toContain("level-2-khalids-house-reading");
    const khalidTopic = bank.vocab.filter((entry) => entry.topicSlugs.includes("level-2-khalids-house-reading"));
    for (const pronunciation of ["al-baytu", "al-bayti", "thalāthati", "thalāthatu", "Muḥammad", "Iqbāl"]) {
      expect(khalidTopic.map((entry) => entry.pronunciation)).toContain(pronunciation);
    }
  });

  test("includes every form, headword, and sentence word from the vocabulary sets", () => {
    for (const set of LEVEL_TWO_VOCAB_SETS) {
      for (const word of set.words) {
        expectArabicInLevelTwoBank(word.headword.arabic);
        for (const item of word.forms.flatMap((form) => form.items)) {
          expectArabicInLevelTwoBank(item.arabic);
        }
        for (const token of word.sentences.flatMap((sentence) => sentence.tokens)) {
          expectArabicInLevelTwoBank(token.arabic.replace(/[()]/g, ""));
        }
      }
    }
  });

  test("finds Bayt to Masjid words by Arabic, transliteration, and English", () => {
    const matches = (query: string) => {
      const folded = foldForSearch(query);
      return bank.vocab.filter((entry) =>
        [entry.arabicFolded, foldForSearch(entry.pronunciation ?? ""), foldForSearch(entry.english)]
          .some((field) => field.includes(folded)),
      );
    };
    expect(matches("continents").map((entry) => entry.arabic)).toContain("قَارَّاتٍ");
    expect(matches("qarrat").map((entry) => entry.arabic)).toContain("قَارَّاتٍ");
    expect(matches("قارات").map((entry) => entry.english)).toContain("continents");
    expect(matches("hadaiq").map((entry) => entry.arabic)).toContain("حَدَائِق");
    expect(matches("prostration").map((entry) => entry.arabic)).toContain("سُجُود");
    expect(matches("مسجد").some((entry) => entry.topicSlugs.includes("level-2-home-and-places"))).toBe(true);
  });

  test("lists Home and Places as its own vocabulary-bank topics", () => {
    const slugs = bank.topics.map((topic) => topic.slug);
    expect(slugs).toContain("level-2-home-and-places");
    expect(slugs).toContain("level-2-home-and-places-sentences");
  });

  test("finds he takes by English and transliteration", () => {
    const takes = bank.vocab.find((entry) => entry.english === "he takes");

    expect(takes?.arabic).toBe("يَأْخُذُ");
    expect(foldForSearch(takes?.pronunciation ?? "")).toContain("yakhudhu");
  });

  test("preserves Level 2 meanings when the same Arabic appears in an earlier lesson", () => {
    expect(
      bank.vocab.some(
        (entry) => entry.arabic === "كَتَبَ" && entry.english === "he wrote",
      ),
    ).toBe(true);
  });
});
