import { describe, expect, test } from "vitest";

import { LEVEL_TWO_ACTIONS } from "../../src/data/level-two-lessons";
import { VERB_FAMILIES } from "../../src/data/verb-families";
import { getSiteContent } from "../../src/lib/content";
import { foldForSearch } from "../../src/lib/diacritics";
import { makeFlashcardDeck, makeMultipleChoiceDeck } from "../../src/lib/exercises";
import {
  buildDailyPathPlan,
  getNewWordIds,
  matchesNewWordSource,
  mergeProgress,
} from "../../src/lib/progress";
import {
  LEVEL_TWO_DECKS,
  LEVEL_TWO_DECK_LIST,
  getLevelTwoStudyCards,
  getStudyContent,
  levelTwoDeckForPage,
} from "../../src/lib/study-cards";
import type { UserProgress } from "../../src/lib/types";
import { getVocabularyBankContent } from "../../src/lib/vocabulary-bank";

const content = getSiteContent();
const study = getStudyContent(content);
const cards = getLevelTwoStudyCards();
const levelTwoFamilies = VERB_FAMILIES.filter((family) => family.levelTwoOrder !== undefined);

function deckCards(slug: string) {
  return study.vocab.filter((entry) => entry.topicSlugs.includes(slug));
}

function cardFor(arabic: string) {
  return study.vocab.find((entry) => entry.arabic === arabic || entry.arabic.startsWith(`${arabic} /`));
}

function makeProgress(extra: Partial<UserProgress> = {}): UserProgress {
  return {
    version: 1,
    startedAt: "2026-01-01T00:00:00.000Z",
    streak: { count: 0, lastDay: "", freezesAvailable: 2, lastFreezeRegenAt: "2026-01-01" },
    daily: { goalCards: 20, today: { date: "2026-01-01", cardsSeen: 0, correct: 0 } },
    words: {},
    topics: {},
    ...extra,
  };
}

describe("Level 2 flashcards", () => {
  test("every Level 2 deck has cards and every card has a unique id", () => {
    for (const deck of LEVEL_TWO_DECK_LIST) expect(deckCards(deck.slug).length).toBeGreaterThan(10);
    expect(new Set(study.vocab.map((entry) => entry.id)).size).toBe(study.vocab.length);
    expect(study.topics.filter((topic) => topic.slug.startsWith("level-2-deck-")).map((topic) => topic.href)).toEqual(
      LEVEL_TWO_DECK_LIST.map((deck) => deck.href),
    );
  });

  test("each Level 2 verb is one card holding its past, present, command and verbal noun", () => {
    for (const family of levelTwoFamilies) {
      const card = cards.find((entry) => entry.id === `level-2-card__verb__${family.id}`);
      expect(card, family.id).toBeDefined();
      expect(card?.arabic).toBe(family.forms.past.arabic);
      expect(card?.cardForms?.map((form) => form.arabic)).toEqual([
        family.forms.past.arabic,
        family.forms.present.arabic,
        family.forms.command.arabic,
        family.forms.masdar.arabic,
      ]);
      expect(card?.cardNotes?.[0]).toBe(`Root ${family.root}`);
      // The other forms are not cards of their own.
      for (const form of [family.forms.present, family.forms.command]) {
        expect(cards.some((entry) => entry.arabic === form.arabic)).toBe(false);
      }
    }
  });

  test("a present-tense action that is also a verb family shares the family's card", () => {
    const write = LEVEL_TWO_ACTIONS.find((action) => action.id === "write");
    expect(write).toBeDefined();
    const card = cards.find((entry) => entry.id === "level-2-card__verb__kataba");
    expect(card?.topicSlugs.slice(0, 2)).toEqual([LEVEL_TWO_DECKS.verbFamilies.slug, LEVEL_TWO_DECKS.actionVerbs.slug]);
    expect(deckCards(LEVEL_TWO_DECKS.actionVerbs.slug)).toHaveLength(LEVEL_TWO_ACTIONS.length);
  });

  test("words from the same root with their own meaning get their own cards", () => {
    const library = cardFor("مَكْتَبَة") ?? cardFor("مَكْتَبَةٌ");
    expect(library).toBeDefined();
    const book = cards.find((entry) => entry.arabic.startsWith("كِتَابٌ"));
    expect(book?.arabic).toBe("كِتَابٌ / كُتُبٌ");
    expect(book?.cardNotes).toContain("Root ك-ت-ب, like كَتَبَ (to write)");
  });

  test("nouns carry their plural on the same card", () => {
    const home = deckCards(LEVEL_TWO_DECKS.homeAndPlaces.slug);
    for (const pair of ["غُرْفَة / غُرَف", "مِلْعَقَة / مَلَاعِق", "سِتَار / سَتَائِر", "بَيْت / بُيُوت"]) {
      expect(home.some((entry) => entry.arabic === pair), pair).toBe(true);
    }
    expect(home.some((entry) => entry.arabic === "غُرَف")).toBe(false);
  });

  test("a word Level 1 already teaches keeps its Level 1 card and joins the Level 2 deck", () => {
    const mosque = study.vocab.filter((entry) => foldForSearch(entry.arabic).startsWith("مسجد /"));
    expect(mosque).toHaveLength(1);
    expect(mosque[0].id.startsWith("level-2-card__")).toBe(false);
    expect(mosque[0].topicSlugs).toContain(LEVEL_TWO_DECKS.homeAndPlaces.slug);
    // The site content itself is not changed.
    expect(content.vocab.find((entry) => entry.id === mosque[0].id)?.topicSlugs).not.toContain(
      LEVEL_TWO_DECKS.homeAndPlaces.slug,
    );
  });

  test("every Arabic form on a flashcard is searchable in the vocabulary bank", () => {
    const bank = getVocabularyBankContent(content);
    const folded = new Set(bank.vocab.flatMap((entry) => [entry.arabicFolded, ...(entry.arabicSearchForms ?? [])]));
    const parts = (arabic: string) => arabic.split(/\s*\/\s*/).map(foldForSearch);
    const missing = cards.flatMap((card) =>
      [card.arabic, ...(card.cardForms ?? []).map((form) => form.arabic)]
        .flatMap(parts)
        .filter((form) => !folded.has(form) && ![...folded].some((entry) => entry.split(/\s*\/\s*/).includes(form))),
    );
    expect(missing).toEqual([]);
  });

  test("Lesson 15 words are flashcards in the Home and Places deck", () => {
    const home = deckCards(LEVEL_TWO_DECKS.homeAndPlaces.slug);
    const inHome = (arabic: string) => home.find((entry) => entry.arabic === arabic || entry.arabic.startsWith(`${arabic} /`));
    // The seven home words, each with its plural.
    for (const pair of ["رَفّ / رُفُوف / أَرْفُف", "مَوْقِد / مَوَاقِد", "حَوْض / أَحْوَاض", "غَسَّالَة / غَسَّالَات", "صُنْبُور / صَنَابِير"]) {
      expect(inHome(pair)?.arabic, pair).toBe(pair);
    }
    expect(inHome("سَلَّةُ مُهْمَلَات")).toBeDefined();
    // A new verb is one card with its past and present.
    const cook = inHome("طَبَخَ");
    expect(cook?.english).toBe("to cook");
    expect(cook?.cardForms?.map((form) => form.arabic)).toEqual(["طَبَخَ", "يَطْبُخُ"]);
    // A verb Level 2 already teaches keeps its card: نَامَ is still the verb-family card.
    const sleep = cards.find((entry) => entry.id === "level-2-card__verb__nama");
    expect(sleep?.topicSlugs).toContain(LEVEL_TWO_DECKS.homeAndPlaces.slug);
    expect(cards.filter((entry) => entry.cardForms?.some((form) => form.arabic === "يَنَامُ"))).toHaveLength(1);
    // A present-tense action gains its past: يُذَاكِرُ becomes ذَاكَرَ / يُذَاكِرُ.
    expect(cards.find((entry) => entry.cardForms?.some((form) => form.arabic === "يُذَاكِرُ"))?.arabic).toBe("ذَاكَرَ");
    // اِسْتَيْقَظَ is taught in Lesson 14 (as an opposite) and Lesson 15: one card.
    expect(cards.filter((entry) => entry.cardForms?.some((form) => form.arabic === "اِسْتَيْقَظَ"))).toHaveLength(1);
    // Story words and verbs.
    for (const word of ["خَلِيفَة / خُلَفَاء", "إِنَاء / آنِيَة", "حَجَر / حِجَارَة", "دَقِيق", "خُبْز", "جَزَاكَ اللهُ خَيْرًا"]) {
      expect(inHome(word), word).toBeDefined();
    }
    expect(inHome("أَطْعَمَ")?.cardForms?.map((form) => form.arabic)).toEqual(["أَطْعَمَ", "يُطْعِمُ"]);
  });

  test("the extra words in Lessons 14 and 15 and the Masjid al-Haram word list are flashcards", () => {
    const home = deckCards(LEVEL_TWO_DECKS.homeAndPlaces.slug).map((entry) => foldForSearch(entry.arabic));
    const has = (arabic: string) => home.some((entry) => entry.split(/\s*\/\s*/).includes(foldForSearch(arabic)));
    for (const word of ["شَقَّة", "فُرْشَاة", "وَرْد", "حُجْرَة", "هَوَاء", "كِيلُوجْرَام", "كِبْرِيت", "صَابُون", "ظِلّ", "سَجَدَ", "وَدَّعَ"]) {
      expect(has(word), word).toBe(true);
    }
    for (const word of ["فُنْدُقٍ", "بِئْرُ", "سَطْحِ", "ثَمَنُ", "الْكَعْبَةُ"]) expect(has(word), word).toBe(true);
    // Verb forms in the word list stay on their verb's card.
    expect(cards.some((entry) => entry.arabic === "يَتَكَوَّنُ")).toBe(false);
  });

  test("Masculine and feminine has its own deck", () => {
    const deck = deckCards(LEVEL_TWO_DECKS.masculineFeminine.slug);
    const arabic = deck.map((entry) => entry.arabic);
    for (const word of ["طَالِبَة", "صَحْرَاء", "لَيْلَى", "هَذِهِ", "هِيَ", "أَنْتَ", "أَنْتِ", "أَنَا"]) {
      expect(arabic, word).toContain(word);
    }
    // Chart verbs: a verb Level 2 already teaches joins the deck; a new one is its he-form.
    expect(deck.some((entry) => entry.id === "level-2-card__verb__kataba")).toBe(true);
    const study = deck.find((entry) => entry.arabic === "يَدْرُسُ");
    expect(study?.english).toBe("he studies");
    expect(study?.cardNotes).toContain("you (f.): تَدْرُسِينَ (you (f.) study)");
    expect(levelTwoDeckForPage("/grammar/masculine-and-feminine")).toBe(LEVEL_TWO_DECKS.masculineFeminine);
  });

  test("each Level 2 topic page with words links to its deck", () => {
    expect(levelTwoDeckForPage("/levels/level-2/home-and-places")).toBe(LEVEL_TWO_DECKS.homeAndPlaces);
    expect(levelTwoDeckForPage("/levels/level-2/marketplace-reading")).toBeUndefined();
  });
});

describe("Level 2 flashcards in exercises", () => {
  const verb = cards.find((entry) => entry.id === "level-2-card__verb__kataba")!;

  test("a verb flashcard shows every form, with each form's meaning on the back", () => {
    const [question] = makeFlashcardDeck([verb], { id: "t", title: "t" }).questions;
    expect(question.promptArabic).toBe("كَتَبَ · يَكْتُبُ · اُكْتُبْ · كِتَابَة");
    expect(question.audioArabic).toBe("كَتَبَ");
    expect(question.answerForms?.map((form) => form.english)).toEqual(["he wrote", "he writes", "write!", "writing"]);
    expect(question.answerNotes?.[0]).toBe("Root ك-ت-ب");
  });

  test("an English-to-Arabic quiz asks for one form and offers the verb's own forms", () => {
    for (let seed = 0; seed < 4; seed++) {
      const [question] = makeMultipleChoiceDeck([verb], study.vocab, "en-to-ar", { id: "t", title: "t" }, seed).questions;
      const form = verb.cardForms![seed];
      expect(question.prompt).toBe(`${form.label} of “to write”`);
      expect(question.options?.map((option) => option.text).sort()).toEqual(verb.cardForms!.map((f) => f.arabic).sort());
      expect(question.options?.find((option) => option.id === question.correctAnswerId)?.text).toBe(form.arabic);
    }
  });

  test("an Arabic-to-English quiz alternates between naming the form and asking its meaning", () => {
    const [formQuestion] = makeMultipleChoiceDeck([verb], study.vocab, "ar-to-en", { id: "t", title: "t" }, 2).questions;
    expect(formQuestion.prompt).toBe("Command of “to write”");
    expect(formQuestion.options?.map((option) => option.text).sort()).toEqual(verb.cardForms!.map((f) => f.arabic).sort());
  });

  test("an Arabic-to-English quiz shows one form and asks its meaning", () => {
    const [question] = makeMultipleChoiceDeck([verb], study.vocab, "ar-to-en", { id: "t", title: "t" }, 1).questions;
    expect(question.promptArabic).toBe("يَكْتُبُ");
    expect(question.options).toHaveLength(4);
    expect(new Set(question.options?.map((option) => option.text)).size).toBe(4);
    expect(question.options?.find((option) => option.id === question.correctAnswerId)?.text).toBe("he writes");
  });
});

describe("choosing where new words come from", () => {
  const levelTwoCard = study.vocab.find((entry) => entry.id === "level-2-card__verb__kataba")!;
  const levelOneCard = study.vocab.find((entry) => !entry.topicSlugs.some((slug) => slug.startsWith("level-2-")))!;

  test("matches words by level or by deck", () => {
    expect(matchesNewWordSource(levelTwoCard, undefined)).toBe(true);
    expect(matchesNewWordSource(levelTwoCard, "level-2")).toBe(true);
    expect(matchesNewWordSource(levelTwoCard, "level-1")).toBe(false);
    expect(matchesNewWordSource(levelOneCard, "level-1")).toBe(true);
    expect(matchesNewWordSource(levelOneCard, "level-2")).toBe(false);
    expect(matchesNewWordSource(levelTwoCard, LEVEL_TWO_DECKS.actionVerbs.slug)).toBe(true);
    expect(matchesNewWordSource(levelTwoCard, LEVEL_TWO_DECKS.homeAndPlaces.slug)).toBe(false);
  });

  test("new words come from the chosen deck, and the lesson step opens its topic page", () => {
    const progress = makeProgress({ newWordSource: LEVEL_TWO_DECKS.homeAndPlaces.slug });
    const ids = getNewWordIds(progress, study.vocab);
    expect(ids).toHaveLength(deckCards(LEVEL_TWO_DECKS.homeAndPlaces.slug).length);
    const plan = buildDailyPathPlan(progress, study.vocab, study.topics);
    expect(plan.nextTopic?.slug).toBe(LEVEL_TWO_DECKS.homeAndPlaces.slug);
    expect(plan.steps.find((step) => step.id === "lesson")?.href).toBe("/levels/level-2/home-and-places");
    expect(plan.steps.find((step) => step.id === "new")?.description).toContain("Home and Places");
  });

  test("without a choice, new words follow course order, Level 1 first", () => {
    const ids = getNewWordIds(makeProgress(), study.vocab);
    expect(ids[0]).toBe(content.vocab.find((entry) => !entry.isExtra)?.id);
    expect(ids).toContain(levelTwoCard.id);
  });

  test("the choice survives syncing between devices", () => {
    const local = makeProgress();
    const remote = makeProgress({ newWordSource: "level-2" });
    expect(mergeProgress(local, remote).newWordSource).toBe("level-2");
    expect(mergeProgress(makeProgress({ newWordSource: "level-1" }), remote).newWordSource).toBe("level-1");
    expect(mergeProgress(local, makeProgress()).newWordSource).toBeUndefined();
  });
});
