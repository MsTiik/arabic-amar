import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_CLASSROOM_VOCABULARY,
  LEVEL_TWO_MARKETPLACE_READING,
} from "@/data/level-two-lessons";
import {
  LEVEL_TWO_VOCAB_THEMES,
  VOCAB_SET_FORM_LABELS,
  type LevelTwoVocabTheme,
  type VocabSetItem,
} from "@/data/level-two-vocab-sets";
import { LEVEL_TWO_GRAMMAR_SHEETS, chartForms, plainArabic } from "@/data/level-two-grammar";
import type { LevelTwoGrammarSheet } from "@/data/level-two-grammar";
import { VERB_FAMILIES, VERB_FORM_KEYS } from "@/data/verb-families";
import { foldForSearch } from "@/lib/diacritics";
import type { SiteContent, Topic, VocabEntry } from "@/lib/types";

export function vocabThemeTopicSlug(theme: Pick<LevelTwoVocabTheme, "slug">): string {
  return `level-2-${theme.slug}`;
}

export function vocabThemeSentenceTopicSlug(theme: Pick<LevelTwoVocabTheme, "slug">): string {
  return `level-2-${theme.slug}-sentences`;
}

export function grammarSheetTopicSlug(sheet: Pick<LevelTwoGrammarSheet, "slug">): string {
  return `level-2-${sheet.slug}`;
}

const LEVEL_TWO_TOPICS: readonly { slug: string; name: string }[] = [
  {
    slug: "level-2-classroom",
    name: "Level 2 · Classroom vocabulary",
  },
  {
    slug: "level-2-actions",
    name: "Level 2 · Present-tense actions",
  },
  {
    slug: "level-2-verb-families",
    name: "Level 2 · Verb families",
  },
  {
    slug: "level-2-marketplace-reading",
    name: "Level 2 · Marketplace reading",
  },
  ...LEVEL_TWO_GRAMMAR_SHEETS.map((sheet) => ({
    slug: grammarSheetTopicSlug(sheet),
    name: `Level 2 · ${sheet.title}`,
  })),
  ...LEVEL_TWO_VOCAB_THEMES.flatMap((theme) => [
    { slug: vocabThemeTopicSlug(theme), name: `Level 2 · ${theme.title}` },
    { slug: vocabThemeSentenceTopicSlug(theme), name: `Level 2 · ${theme.title} sentence words` },
  ]),
];

interface LevelTwoBankWord {
  id: string;
  arabic: string;
  pronunciation: string;
  english: string;
  category: string;
  subCategory?: string;
  gender?: VocabEntry["gender"];
  topicSlug: string;
}

const FORM_LABELS = {
  past: "Past",
  present: "Present",
  command: "Command",
  masdar: "Verbal noun",
} as const;

function toVocabEntry(word: LevelTwoBankWord): VocabEntry {
  return {
    id: `level-2__${word.id}`,
    arabic: word.arabic,
    arabicFolded: foldForSearch(word.arabic),
    pronunciation: word.pronunciation,
    english: word.english,
    category: word.category,
    subCategory: word.subCategory,
    gender: word.gender,
    isExtra: false,
    topicSlugs: [word.topicSlug],
    lessonId: word.topicSlug,
  };
}

function grammarSheetBankWords(sheet: LevelTwoGrammarSheet): LevelTwoBankWord[] {
  const topicSlug = grammarSheetTopicSlug(sheet);
  const category = `Level 2 grammar · ${sheet.title}`;
  const words: LevelTwoBankWord[] = [];
  const push = (id: string, subCategory: string, item: { arabic: string; transliteration: string; english: string }) =>
    words.push({
      id: `grammar__${sheet.slug}__${id}`,
      arabic: plainArabic(item.arabic),
      pronunciation: item.transliteration,
      english: item.english,
      category,
      subCategory,
      topicSlug,
    });

  for (const marker of sheet.markers) {
    for (const [index, example] of marker.examples.entries()) {
      push(`${marker.id}-${index + 1}`, `Feminine ending ${marker.symbol}`, example);
    }
  }
  for (const [index, pair] of sheet.pairs.entries()) {
    push(`pair-${index + 1}-m`, "Masculine and feminine pairs", pair.masculine);
    push(`pair-${index + 1}-f`, "Masculine and feminine pairs", pair.feminine);
  }
  for (const word of sheet.demonstrativeWords) {
    push(`word-${word.transliteration}`, "This is… · who or what", word);
  }
  for (const person of sheet.persons) push(`pronoun-${person.id}`, "Pronouns", person.pronoun);
  for (const verb of [sheet.modelVerb, ...sheet.chartVerbs]) {
    for (const form of chartForms(verb, sheet.persons)) {
      push(`verb-${verb.id}-${form.person.id}`, `Verb chart · ${verb.english}`, form);
    }
  }
  return words;
}

/**
 * Every standalone word or form taught in the reviewed Level 2 material.
 * Keeping this derived from the lesson data means new Level 2 additions are
 * automatically searchable in the vocabulary bank.
 */
export function getLevelTwoVocabularyEntries(): VocabEntry[] {
  const words: LevelTwoBankWord[] = [];

  for (const entry of LEVEL_TWO_CLASSROOM_VOCABULARY) {
    const hasPlural = Boolean(entry.pluralArabic && entry.pluralTransliteration);
    words.push({
      id: `classroom__${entry.id}`,
      arabic: hasPlural ? `${entry.arabic} / ${entry.pluralArabic}` : entry.arabic,
      pronunciation: hasPlural
        ? `${entry.transliteration} / ${entry.pluralTransliteration}`
        : entry.transliteration,
      english: hasPlural ? `${entry.english} (singular / plural)` : entry.english,
      category: "Level 2 classroom vocabulary",
      subCategory: "Classroom words",
      gender: entry.gender,
      topicSlug: "level-2-classroom",
    });
  }

  for (const action of LEVEL_TWO_ACTIONS) {
    words.push({
      id: `action__${action.id}`,
      arabic: action.arabic,
      pronunciation: action.transliteration,
      english: action.english,
      category: "Level 2 present-tense actions",
      subCategory: "Present tense · he",
      topicSlug: "level-2-actions",
    });
  }

  for (const family of VERB_FAMILIES.filter(
    (entry) => entry.levelTwoOrder !== undefined,
  )) {
    for (const formKey of VERB_FORM_KEYS) {
      const form = family.forms[formKey];
      words.push({
        id: `verb-family__${family.id}__${formKey}`,
        arabic: form.arabic,
        pronunciation: form.transliteration,
        english: form.english,
        category: "Level 2 verb families",
        subCategory: `${family.meaning} · ${FORM_LABELS[formKey]}`,
        topicSlug: "level-2-verb-families",
      });
    }

    for (const [index, form] of (family.relatedForms ?? []).entries()) {
      words.push({
        id: `verb-family__${family.id}__related-${index + 1}`,
        arabic: form.arabic,
        pronunciation: form.transliteration,
        english: form.english,
        category: "Level 2 verb families",
        subCategory: `${family.meaning} · ${form.label}`,
        topicSlug: "level-2-verb-families",
      });
    }

    if (family.opposite) {
      words.push({
        id: `verb-family__${family.id}__opposite`,
        arabic: family.opposite.arabic,
        pronunciation: family.opposite.transliteration,
        english: family.opposite.english,
        category: "Level 2 verb families",
        subCategory: `${family.meaning} · Opposite`,
        topicSlug: "level-2-verb-families",
      });
    }

    if (family.relatedNameOfAllah) {
      words.push({
        id: `verb-family__${family.id}__name-of-allah`,
        arabic: family.relatedNameOfAllah.arabic,
        pronunciation: family.relatedNameOfAllah.transliteration,
        english: family.relatedNameOfAllah.english,
        category: "Level 2 verb families",
        subCategory: `${family.meaning} · Related Name of Allah`,
        topicSlug: "level-2-verb-families",
      });
    }
  }

  for (const sentence of LEVEL_TWO_MARKETPLACE_READING) {
    for (const [index, token] of sentence.tokens.entries()) {
      words.push({
        id: `marketplace__${sentence.id}__${index + 1}`,
        arabic: token.arabic,
        pronunciation: token.transliteration,
        english: token.english,
        category: "Level 2 marketplace reading",
        subCategory:
          token.kind === "verb"
            ? "Action"
            : token.kind === "noun"
              ? "Person or thing"
              : "Connecting word",
        topicSlug: "level-2-marketplace-reading",
      });
    }
  }

  for (const sheet of LEVEL_TWO_GRAMMAR_SHEETS) words.push(...grammarSheetBankWords(sheet));

  for (const theme of LEVEL_TWO_VOCAB_THEMES) words.push(...vocabThemeBankWords(theme));

  return words.map(toVocabEntry);
}

/** Every form on a theme's word cards, plus each distinct word in their sentences. */
function vocabThemeBankWords(theme: LevelTwoVocabTheme): LevelTwoBankWord[] {
  const words: LevelTwoBankWord[] = [];
  const seenForms = new Set<string>();
  const seenArabic = new Set<string>();
  const seenTokens = new Set<string>();
  const category = `Level 2 · ${theme.title}`;

  const addForm = (item: VocabSetItem, id: string, subCategory: string) => {
    const key = `${foldForSearch(item.arabic)}\u0000${foldForSearch(item.english)}`;
    if (seenForms.has(key)) return;
    seenForms.add(key);
    seenArabic.add(foldForSearch(item.arabic));
    words.push({
      id,
      arabic: item.arabic,
      pronunciation: item.transliteration,
      english: item.english,
      category,
      subCategory,
      topicSlug: vocabThemeTopicSlug(theme),
    });
  };

  for (const set of theme.sets) {
    for (const word of set.words) {
      const name = `${set.title} · ${word.headword.transliteration}`;
      for (const form of word.forms) {
        for (const [index, item] of form.items.entries()) {
          addForm(
            item,
            `${set.slug}__${word.id}__${form.role}__${index + 1}`,
            `${name} · ${VOCAB_SET_FORM_LABELS[form.role].english}`,
          );
        }
      }
      if (!seenArabic.has(foldForSearch(word.headword.arabic))) {
        addForm(word.headword, `${set.slug}__${word.id}__headword`, `${name} · Headword`);
      }
    }
  }

  for (const set of theme.sets) {
    for (const word of set.words) {
      for (const sentence of word.sentences) {
        for (const [index, token] of sentence.tokens.entries()) {
          const arabic = token.arabic.replace(/[()]/g, "");
          const folded = foldForSearch(arabic);
          if (seenArabic.has(folded) || seenTokens.has(folded)) continue;
          seenTokens.add(folded);
          words.push({
            id: `${set.slug}__sentence__${sentence.id}__${index + 1}`,
            arabic,
            pronunciation: token.transliteration.replace(/[()]/g, ""),
            english: token.english,
            category,
            subCategory: `${set.title} · Example sentence · ${word.headword.transliteration}`,
            topicSlug: vocabThemeSentenceTopicSlug(theme),
          });
        }
      }
    }
  }

  return words;
}

/** Merge Level 2 into the vocabulary-only view without changing practice decks. */
export function getVocabularyBankContent(base: SiteContent): {
  vocab: VocabEntry[];
  topics: Topic[];
} {
  const vocab = base.vocab.map((entry) => ({
    ...entry,
    topicSlugs: [...entry.topicSlugs],
  }));
  const entryKey = (entry: VocabEntry) =>
    [
      entry.arabicFolded,
      foldForSearch(entry.pronunciation ?? ""),
      foldForSearch(entry.english),
    ].join("\u0000");
  const entryIndexByContent = new Map(
    vocab.map((entry, index) => [entryKey(entry), index]),
  );

  for (const entry of getLevelTwoVocabularyEntries()) {
    const key = entryKey(entry);
    const existingIndex = entryIndexByContent.get(key);
    if (existingIndex === undefined) {
      entryIndexByContent.set(key, vocab.length);
      vocab.push(entry);
      continue;
    }

    const existing = vocab[existingIndex];
    existing.topicSlugs = [
      ...new Set([...existing.topicSlugs, ...entry.topicSlugs]),
    ];
  }

  const firstLevelTwoOrder =
    Math.max(0, ...base.topics.map((topic) => topic.order)) + 1;
  const topics: Topic[] = [
    ...base.topics.map((topic) => ({ ...topic })),
    ...LEVEL_TWO_TOPICS.map((topic, index) => ({
      ...topic,
      order: firstLevelTwoOrder + index,
      lessonIds: [topic.slug],
      vocabCount: vocab.filter((entry) => entry.topicSlugs.includes(topic.slug)).length,
      ruleCount: 0,
      conversationCount: 0,
    })),
  ];

  return { vocab, topics };
}
