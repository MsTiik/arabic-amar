import { LEVEL_TWO_KHALIDS_HOUSE_ROOMS } from "@/data/level-two-khalids-house-rooms";
import { LEVEL_TWO_ACTIONS } from "@/data/level-two-lessons";
import {
  LEVEL_TWO_LESSON_NOTES,
  isNoteItem,
  type NoteCell,
  type NoteItem,
} from "@/data/level-two-lesson-notes";
import {
  LEVEL_TWO_VOCAB_THEMES,
  type VocabSetItem,
  type VocabSetWord,
} from "@/data/level-two-vocab-sets";
import { VERB_FAMILIES, type VerbFamily } from "@/data/verb-families";
import { foldForSearch, stripDiacritics } from "@/lib/diacritics";
import type { CardForm, SiteContent, Topic, VocabEntry } from "@/lib/types";

/**
 * Level 2 flashcards.
 *
 * The vocabulary bank lists every word that appears anywhere in Level 2
 * (well over a thousand entries, including "and", "in" and every conjugated
 * form in the readings). Flashcards are a deliberate subset of it: the words a
 * lesson actually sets out to teach.
 *
 * - A verb is one card. Its past, present, command and verbal noun are learnt
 *   together; quizzes ask about one form at a time.
 * - A noun is one card with its plural (and, for people, its feminine).
 * - Words from the same root that have their own meaning (كِتَاب, مَكْتَبَة)
 *   get their own cards, with the root shown on the back.
 *
 * Each Level 2 topic is a deck. A word taught in two topics is one card in
 * both decks, so its progress is shared.
 */

export interface LevelTwoDeck {
  slug: string;
  name: string;
  /** The topic page the deck belongs to. */
  href: string;
}

export const LEVEL_TWO_DECK_PREFIX = "level-2-deck-";

export const LEVEL_TWO_DECKS = {
  actionVerbs: {
    slug: `${LEVEL_TWO_DECK_PREFIX}action-verbs`,
    name: "Level 2 · Action verbs",
    href: "/levels/level-2/actions-in-context",
  },
  verbFamilies: {
    slug: `${LEVEL_TWO_DECK_PREFIX}verb-families`,
    name: "Level 2 · Verb families",
    href: "/practice/verb-families",
  },
  homeAndPlaces: {
    slug: `${LEVEL_TWO_DECK_PREFIX}home-and-places`,
    name: "Level 2 · Home and Places",
    href: "/levels/level-2/home-and-places",
  },
  gettingToKnow: {
    slug: `${LEVEL_TWO_DECK_PREFIX}getting-to-know-each-other`,
    name: "Level 2 · Getting to know each other",
    href: "/levels/level-2/getting-to-know-each-other",
  },
} as const satisfies Record<string, LevelTwoDeck>;

export const LEVEL_TWO_DECK_LIST: readonly LevelTwoDeck[] = [
  LEVEL_TWO_DECKS.actionVerbs,
  LEVEL_TWO_DECKS.verbFamilies,
  LEVEL_TWO_DECKS.homeAndPlaces,
  LEVEL_TWO_DECKS.gettingToKnow,
];

/** The deck for a Level 2 topic page, if its words are on flashcards. */
export function levelTwoDeckForPage(href: string): LevelTwoDeck | undefined {
  return LEVEL_TWO_DECK_LIST.find((deck) => deck.href === href);
}

export function levelTwoDeckPracticeHref(deck: LevelTwoDeck, kind: "flashcard" | "mc" = "flashcard"): string {
  return `/practice?topic=${deck.slug}&kind=${kind}`;
}

const VERB_FORM_LABELS = {
  past: "Past",
  present: "Present",
  command: "Command",
  masdar: "Verbal noun",
} as const;

/** Related forms that are a word in their own right, not another form of the verb. */
const STANDALONE_RELATED_LABELS = new Set(["Related noun", "Related word", "Active participle"]);

interface Card {
  key: string;
  entry: VocabEntry;
}

/** The bare letters of the first form shown on a card, used to spot the same word taught twice. */
function wordKey(arabic: string): string {
  return stripDiacritics(arabic.split(/\s*\/\s*/)[0]).replace(/\s+/g, " ").trim();
}

function slugify(text: string): string {
  return foldForSearch(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function join(items: readonly { arabic: string }[]): string {
  return items.map((item) => item.arabic).join(" / ");
}

function joinTranslit(items: readonly { transliteration: string }[]): string {
  return items.map((item) => item.transliteration).join(" / ");
}

function gloss(item: { arabic: string; english: string }): string {
  return `${item.arabic} (${item.english})`;
}

class CardCollector {
  private readonly cards = new Map<string, Card>();

  add(
    key: string,
    deck: LevelTwoDeck,
    card: Omit<VocabEntry, "arabicFolded" | "isExtra" | "topicSlugs" | "lessonId" | "category">,
  ): void {
    const existing = this.cards.get(key);
    if (existing) {
      const entry = existing.entry;
      if (!entry.topicSlugs.includes(deck.slug)) entry.topicSlugs.push(deck.slug);
      // The same word taught again with more forms (e.g. now with its plural): show them all.
      if (!entry.cardForms && card.arabic.split("/").length > entry.arabic.split("/").length) {
        entry.arabic = card.arabic;
        entry.arabicFolded = foldForSearch(card.arabic);
        entry.pronunciation = card.pronunciation;
        entry.english = card.english;
      }
      const notes = [...(entry.cardNotes ?? []), ...(card.cardNotes ?? [])];
      if (notes.length) entry.cardNotes = [...new Set(notes)];
      return;
    }
    this.cards.set(key, {
      key,
      entry: {
        ...card,
        id: `level-2-card__${card.id}`,
        arabicFolded: foldForSearch(card.arabic),
        category: deck.name,
        isExtra: false,
        topicSlugs: [deck.slug],
        lessonId: deck.slug,
      },
    });
  }

  has(key: string): boolean {
    return this.cards.has(key);
  }

  addToDeck(key: string, deck: LevelTwoDeck): void {
    const existing = this.cards.get(key);
    if (existing && !existing.entry.topicSlugs.includes(deck.slug)) existing.entry.topicSlugs.push(deck.slug);
  }

  list(): Card[] {
    return [...this.cards.values()];
  }
}

const verbKey = (present: string) => `verb:${wordKey(present)}`;
const nounKey = (arabic: string) => `word:${wordKey(arabic)}`;

function addVerbFamily(cards: CardCollector, family: VerbFamily, deck: LevelTwoDeck): void {
  const forms: CardForm[] = (Object.keys(VERB_FORM_LABELS) as (keyof typeof VERB_FORM_LABELS)[]).map((key) => ({
    label: VERB_FORM_LABELS[key],
    arabic: family.forms[key].arabic,
    pronunciation: family.forms[key].transliteration,
    english: family.forms[key].english,
  }));
  const related = family.relatedForms ?? [];
  const sameRoot = related.filter((form) => STANDALONE_RELATED_LABELS.has(form.label));
  const otherForms = related.filter((form) => !STANDALONE_RELATED_LABELS.has(form.label));
  const notes = [
    `Root ${family.root}`,
    ...otherForms.map((form) => `${form.label}: ${gloss(form)}`),
    ...(family.opposite ? [`Opposite: ${gloss(family.opposite)}`] : []),
    ...(sameRoot.length ? [`Same root: ${sameRoot.map(gloss).join(", ")}`] : []),
  ];
  cards.add(verbKey(family.forms.present.arabic), deck, {
    id: `verb__${family.id}`,
    arabic: family.forms.past.arabic,
    pronunciation: family.forms.past.transliteration,
    english: family.meaning,
    subCategory: "Verb",
    cardForms: forms,
    cardNotes: notes,
  });

  for (const form of sameRoot) {
    cards.add(nounKey(form.arabic), deck, {
      id: `verb__${family.id}__${slugify(form.transliteration)}`,
      arabic: form.arabic,
      pronunciation: form.transliteration,
      english: form.english,
      subCategory: form.label,
      cardNotes: [`Root ${family.root}, like ${gloss({ arabic: family.forms.past.arabic, english: family.meaning })}`],
    });
  }
}

function addVocabSetWord(cards: CardCollector, setSlug: string, word: VocabSetWord, deck: LevelTwoDeck): void {
  const role = (name: string) => word.forms.filter((form) => form.role === name).flatMap((form) => form.items);
  const opposites = role("opposite");
  const others = role("other");
  const notes = [
    ...(opposites.length ? [`Opposite: ${opposites.map(gloss).join(", ")}`] : []),
    ...(others.length ? [`Related: ${others.map(gloss).join(", ")}`] : []),
  ];

  if (word.kind === "verb") {
    const present = role("present")[0] ?? word.headword;
    const key = verbKey(present.arabic);
    if (cards.has(key)) {
      cards.addToDeck(key, deck);
      return;
    }
    const forms: CardForm[] = (["past", "present", "command", "masdar"] as const).flatMap((name) =>
      role(name).slice(0, 1).map((item) => ({
        label: VERB_FORM_LABELS[name],
        arabic: item.arabic,
        pronunciation: item.transliteration,
        english: item.english,
      })),
    );
    const past = role("past")[0] ?? word.headword;
    cards.add(key, deck, {
      id: `${setSlug}__${word.id}`,
      arabic: past.arabic,
      pronunciation: past.transliteration,
      english: word.headword.english,
      subCategory: "Verb",
      ...(forms.length > 1 ? { cardForms: forms } : {}),
      cardNotes: notes,
    });
    return;
  }

  const shown: VocabSetItem[] = [...role("singular"), ...role("word"), ...role("plural")];
  const items = shown.length ? shown : [word.headword];
  const plural = role("plural")[0];
  cards.add(nounKey(items[0].arabic), deck, {
    id: `${setSlug}__${word.id}`,
    arabic: join(items),
    pronunciation: joinTranslit(items),
    english: plural ? `${word.headword.english} / ${plural.english}` : items.length > 1 ? items.map((item) => item.english).join(" / ") : word.headword.english,
    subCategory: word.kind,
    ...(notes.length ? { cardNotes: notes } : {}),
  });
}

function lessonTable(lessonSlug: string, tableId: string): readonly (readonly NoteCell[])[] {
  const notes = LEVEL_TWO_LESSON_NOTES.find((lesson) => lesson.slug === lessonSlug);
  for (const section of notes?.sections ?? []) {
    for (const block of section.blocks) {
      if (block.kind === "table" && block.id === tableId) return block.rows;
    }
  }
  throw new Error(`Level 2 flashcards: table "${tableId}" is missing from ${lessonSlug}`);
}

function cellItems(row: readonly NoteCell[]): NoteItem[] {
  return row.filter(isNoteItem);
}

function addItem(
  cards: CardCollector,
  id: string,
  deck: LevelTwoDeck,
  item: NoteItem,
  subCategory: string,
  notes: string[] = [],
): void {
  cards.add(nounKey(item.arabic), deck, {
    id,
    arabic: item.arabic,
    pronunciation: item.transliteration,
    english: item.english,
    subCategory,
    ...(notes.length ? { cardNotes: notes } : {}),
  });
}

/**
 * One card per singular, showing its plural, with the dual and pattern on the
 * back. Rows are [singular, plural] or [singular, dual, plural, pattern?].
 */
function addPluralRows(cards: CardCollector, lessonSlug: string, tableId: string, deck: LevelTwoDeck): void {
  for (const row of lessonTable(lessonSlug, tableId)) {
    const [singular, dual, plural, pattern] = row.length === 2 ? [row[0], undefined, row[1], undefined] : row;
    if (!isNoteItem(singular) || !isNoteItem(plural)) continue;
    const notes = [
      ...(isNoteItem(dual) ? [`Two: ${gloss(dual)}`] : []),
      ...(isNoteItem(pattern) ? [`Plural pattern: ${pattern.arabic}`] : []),
    ];
    addItem(
      cards,
      `${lessonSlug}__${slugify(singular.transliteration)}`,
      deck,
      {
        arabic: `${singular.arabic} / ${plural.arabic}`,
        transliteration: `${singular.transliteration} / ${plural.transliteration}`,
        english: `${singular.english} / ${plural.english}`,
      },
      "Singular and plural",
      notes,
    );
  }
}

function addFirstColumn(
  cards: CardCollector,
  lessonSlug: string,
  tableId: string,
  deck: LevelTwoDeck,
  subCategory: string,
): void {
  for (const row of lessonTable(lessonSlug, tableId)) {
    const [word, example] = row;
    if (!isNoteItem(word)) continue;
    const notes = isNoteItem(example) ? [`Example: ${example.arabic} (${example.english})`] : [];
    addItem(cards, `${lessonSlug}__${slugify(word.transliteration)}`, deck, word, subCategory, notes);
  }
}

function buildLevelTwoCards(): Card[] {
  const cards = new CardCollector();
  const { actionVerbs, verbFamilies, homeAndPlaces, gettingToKnow } = LEVEL_TWO_DECKS;

  // Verbs first, so the same verb met elsewhere joins this one card.
  const families = VERB_FAMILIES.filter((family) => family.levelTwoOrder !== undefined).sort(
    (a, b) => (a.levelTwoOrder ?? 0) - (b.levelTwoOrder ?? 0),
  );
  for (const family of families) addVerbFamily(cards, family, verbFamilies);

  for (const action of LEVEL_TWO_ACTIONS) {
    const key = verbKey(action.arabic);
    if (cards.has(key)) {
      cards.addToDeck(key, actionVerbs);
      continue;
    }
    cards.add(key, actionVerbs, {
      id: `action__${action.id}`,
      arabic: action.arabic,
      pronunciation: action.transliteration,
      english: action.english,
      subCategory: "Present tense",
      ...(action.note ? { cardNotes: [action.note] } : {}),
    });
  }

  // Home and Places: the word cards, Lesson 14 and the useful phrases from Khalid's house.
  const home = LEVEL_TWO_VOCAB_THEMES.find((theme) => theme.slug === "home-and-places");
  for (const set of home?.sets ?? []) {
    for (const word of set.words) addVocabSetWord(cards, set.slug, word, homeAndPlaces);
  }
  const lesson14 = "vocabulary-of-the-home";
  addPluralRows(cards, lesson14, "all-words", homeAndPlaces);
  for (const row of lessonTable(lesson14, "light-heavy")) {
    const [word, opposite] = cellItems(row);
    addItem(cards, `${lesson14}__${slugify(word.transliteration)}`, homeAndPlaces, word, "adjective", [`Opposite: ${gloss(opposite)}`]);
    addItem(cards, `${lesson14}__${slugify(opposite.transliteration)}`, homeAndPlaces, opposite, "adjective", [`Opposite: ${gloss(word)}`]);
  }
  addFirstColumn(cards, lesson14, "question-words", homeAndPlaces, "Question word");
  addFirstColumn(cards, lesson14, "place-words", homeAndPlaces, "Where things are");
  for (const phrase of LEVEL_TWO_KHALIDS_HOUSE_ROOMS.phrases ?? []) {
    addItem(
      cards,
      `${LEVEL_TWO_KHALIDS_HOUSE_ROOMS.slug}__${slugify(phrase.transliteration)}`,
      homeAndPlaces,
      { arabic: phrase.arabic, transliteration: phrase.transliteration, english: phrase.meaning },
      "Useful phrase",
      [`Literally: ${phrase.literal}`],
    );
  }

  // Getting to know each other (Lesson 13).
  const lesson13 = "getting-to-know-each-other";
  addPluralRows(cards, lesson13, "broken-plurals", gettingToKnow);
  addPluralRows(cards, lesson13, "sound-feminine", gettingToKnow);
  addFirstColumn(cards, lesson13, "lesson-vocabulary", gettingToKnow, "Lesson vocabulary");
  addFirstColumn(cards, lesson13, "positions", gettingToKnow, "Where things are");
  addFirstColumn(cards, lesson13, "number-forms", gettingToKnow, "Singular, dual, plural");
  for (const row of lessonTable(lesson13, "countries")) {
    const [, from, man, woman] = row;
    if (!isNoteItem(man) || !isNoteItem(woman)) continue;
    addItem(
      cards,
      `${lesson13}__${slugify(man.transliteration)}`,
      gettingToKnow,
      {
        arabic: `${man.arabic} / ${woman.arabic}`,
        transliteration: `${man.transliteration} / ${woman.transliteration}`,
        english: man.english.replace(/\s*\(m\.\)$/, " (m. / f.)"),
      },
      "Nationality",
      isNoteItem(from) ? [`${from.arabic} (${from.english})`] : [],
    );
  }
  for (const row of lessonTable(lesson13, "more-nationalities")) {
    for (const item of cellItems(row)) {
      addItem(cards, `${lesson13}__${slugify(item.transliteration)}`, gettingToKnow, item, "Country or nationality");
    }
  }

  return cards.list();
}

let cachedCards: Card[] | null = null;

/** The Level 2 flashcards, before they are merged with Level 1. */
export function getLevelTwoStudyCards(): VocabEntry[] {
  return buildLevelTwoCardsOnce().map((card) => card.entry);
}

const studyContentCache = new WeakMap<SiteContent, { vocab: VocabEntry[]; topics: Topic[] }>();

/**
 * Level 1 words plus the Level 2 flashcards, with one deck (topic) per Level 2
 * topic. A Level 2 card for a word Level 1 already teaches is not added again:
 * the Level 1 card joins the Level 2 deck, so the word keeps one progress record.
 */
export function getStudyContent(base: SiteContent): { vocab: VocabEntry[]; topics: Topic[] } {
  const cached = studyContentCache.get(base);
  if (cached) return cached;

  const vocab = base.vocab.map((entry) => ({ ...entry, topicSlugs: [...entry.topicSlugs] }));
  const levelOneByKey = new Map<string, VocabEntry>();
  for (const entry of vocab) {
    const key = wordKey(entry.arabic);
    if (!levelOneByKey.has(key)) levelOneByKey.set(key, entry);
  }

  // Each deck lists its cards in Level 2 order, including Level 1 cards it shares.
  const deckOrder = new Map<string, string[]>(LEVEL_TWO_DECK_LIST.map((deck) => [deck.slug, []]));
  for (const card of buildLevelTwoCardsOnce()) {
    const existing = card.key.startsWith("word:") ? levelOneByKey.get(card.key.slice("word:".length)) : undefined;
    const entry = existing ?? { ...card.entry, topicSlugs: [...card.entry.topicSlugs] };
    if (existing) {
      for (const slug of card.entry.topicSlugs) {
        if (!existing.topicSlugs.includes(slug)) existing.topicSlugs.push(slug);
      }
      if (card.entry.cardNotes?.length) {
        existing.cardNotes = [...new Set([...(existing.cardNotes ?? []), ...card.entry.cardNotes])];
      }
    } else {
      vocab.push(entry);
    }
    for (const slug of card.entry.topicSlugs) {
      const ids = deckOrder.get(slug);
      if (ids && !ids.includes(entry.id)) ids.push(entry.id);
    }
  }

  const firstOrder = Math.max(0, ...base.topics.map((topic) => topic.order)) + 1;
  const topics: Topic[] = [
    ...base.topics,
    ...LEVEL_TWO_DECK_LIST.map((deck, index) => ({
      slug: deck.slug,
      name: deck.name,
      href: deck.href,
      order: firstOrder + index,
      lessonIds: [deck.slug],
      wordIds: deckOrder.get(deck.slug) ?? [],
      vocabCount: deckOrder.get(deck.slug)?.length ?? 0,
      ruleCount: 0,
      conversationCount: 0,
    })),
  ];

  const result = { vocab, topics };
  studyContentCache.set(base, result);
  return result;
}

function buildLevelTwoCardsOnce(): Card[] {
  cachedCards ??= buildLevelTwoCards();
  return cachedCards;
}
