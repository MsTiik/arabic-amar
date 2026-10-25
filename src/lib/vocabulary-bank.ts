import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_CLASSROOM_VOCABULARY,
  LEVEL_TWO_MARKETPLACE_READING,
} from "@/data/level-two-lessons";
import {
  LEVEL_TWO_VOCAB_SETS,
  VOCAB_SET_FORM_LABELS,
  type LevelTwoVocabSet,
  type VocabSetItem,
} from "@/data/level-two-vocab-sets";
import { VERB_FAMILIES, VERB_FORM_KEYS } from "@/data/verb-families";
import { foldForSearch } from "@/lib/diacritics";
import type { SiteContent, Topic, VocabEntry } from "@/lib/types";

export function vocabSetTopicSlug(set: Pick<LevelTwoVocabSet, "slug">): string {
  return `level-2-${set.slug}`;
}

export function vocabSetSentenceTopicSlug(set: Pick<LevelTwoVocabSet, "slug">): string {
  return `level-2-${set.slug}-sentences`;
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
  ...LEVEL_TWO_VOCAB_SETS.flatMap((set) => [
    { slug: vocabSetTopicSlug(set), name: `Level 2 · ${set.title}` },
    { slug: vocabSetSentenceTopicSlug(set), name: `Level 2 · ${set.title} sentence words` },
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

  for (const set of LEVEL_TWO_VOCAB_SETS) words.push(...vocabSetBankWords(set));

  return words.map(toVocabEntry);
}

/** Every form on a vocabulary-set card, plus each distinct word in its sentences. */
function vocabSetBankWords(set: LevelTwoVocabSet): LevelTwoBankWord[] {
  const words: LevelTwoBankWord[] = [];
  const seenForms = new Set<string>();
  const seenArabic = new Set<string>();
  const category = `Level 2 · ${set.title}`;

  const addForm = (item: VocabSetItem, id: string, subCategory: string) => {
    const key = `${foldForSearch(item.arabic)}\u0000${foldForSearch(item.english)}`;
    if (seenForms.has(key)) return;
    seenForms.add(key);
    seenArabic.add(foldForSearch(item.arabic));
    words.push({
      id: `${set.slug}__${id}`,
      arabic: item.arabic,
      pronunciation: item.transliteration,
      english: item.english,
      category,
      subCategory,
      topicSlug: vocabSetTopicSlug(set),
    });
  };

  for (const word of set.words) {
    const name = word.headword.transliteration;
    for (const form of word.forms) {
      for (const [index, item] of form.items.entries()) {
        addForm(
          item,
          `${word.id}__${form.role}__${index + 1}`,
          `${name} · ${VOCAB_SET_FORM_LABELS[form.role].english}`,
        );
      }
    }
    if (!seenArabic.has(foldForSearch(word.headword.arabic))) {
      addForm(word.headword, `${word.id}__headword`, `${name} · Headword`);
    }
  }

  const seenTokens = new Set<string>();
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
          subCategory: `Example sentence · ${word.headword.transliteration}`,
          topicSlug: vocabSetSentenceTopicSlug(set),
        });
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
