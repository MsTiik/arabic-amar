import type {
  ExerciseDeck,
  ExerciseKind,
  ExerciseQuestion,
  VocabEntry,
} from "./types";

/** Deterministic but per-deck shuffled order. */
function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const r = (s / 233280) * (i + 1);
    const j = Math.floor(r);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(
  pool: VocabEntry[],
  exclude: VocabEntry,
  count: number,
  seed: number,
): VocabEntry[] {
  const candidates = pool.filter((v) => v.id !== exclude.id);
  // Prefer same-category distractors when available.
  const sameCat = candidates.filter((v) => v.category === exclude.category);
  const others = candidates.filter((v) => v.category !== exclude.category);
  const ordered = shuffle(sameCat, seed).concat(shuffle(others, seed + 1));
  return ordered.slice(0, count);
}

/**
 * Some entries (e.g. Hijri month rows whose English column was a long
 * rowspanned explanation lifted to topic.notes) end up without a usable
 * English gloss. Skip those so flashcards/MC/fill don't show empty prompts
 * or blank option buttons.
 */
function withEnglish(vocab: VocabEntry[]): VocabEntry[] {
  return vocab.filter((v) => v.english && v.english.trim() !== "");
}

export function makeFlashcardDeck(
  vocab: VocabEntry[],
  opts: { id: string; title: string; topicSlug?: string; lessonId?: string },
): ExerciseDeck {
  const questions: ExerciseQuestion[] = withEnglish(vocab).map((v, idx) => ({
    id: `${v.id}__flash_${idx}`,
    kind: "flashcard",
    wordId: v.id,
    prompt: v.english,
    promptArabic: v.arabic,
    promptHint: v.pronunciation,
  }));
  return { ...opts, questions };
}

export function makeMultipleChoiceDeck(
  vocab: VocabEntry[],
  pool: VocabEntry[],
  direction: "en-to-ar" | "ar-to-en" | "translit-to-ar",
  opts: { id: string; title: string; topicSlug?: string; lessonId?: string },
): ExerciseDeck {
  const kindMap: Record<typeof direction, ExerciseKind> = {
    "en-to-ar": "multiple-choice-en-to-ar",
    "ar-to-en": "multiple-choice-ar-to-en",
    "translit-to-ar": "multiple-choice-translit-to-ar",
  };
  const kind = kindMap[direction];
  // Directions that depend on english need entries (and a distractor pool)
  // that actually have an english gloss; otherwise prompts/options render blank.
  const needsEnglish = direction === "en-to-ar" || direction === "ar-to-en";
  const sourceVocab = needsEnglish ? withEnglish(vocab) : vocab;
  const sourcePool = needsEnglish ? withEnglish(pool) : pool;
  const questions: ExerciseQuestion[] = sourceVocab.map((v, idx) => {
    const distractors = pickDistractors(sourcePool, v, 3, idx + 1);
    const allCandidates = [v, ...distractors];
    const shuffled = shuffle(allCandidates, idx + 7);
    const correctId = `opt-${v.id}`;
    let prompt = "";
    let promptArabic: string | undefined;
    let promptHint: string | undefined;
    let optionRender: (e: VocabEntry) => {
      text: string;
      isArabic: boolean;
      translit?: string;
    };

    if (direction === "en-to-ar") {
      prompt = v.english;
      promptHint = v.pronunciation;
      optionRender = (e) => ({
        text: e.arabic,
        isArabic: true,
        translit: e.pronunciation,
      });
    } else if (direction === "ar-to-en") {
      promptArabic = v.arabic;
      prompt = "What does this word mean?";
      promptHint = v.pronunciation;
      optionRender = (e) => ({ text: e.english, isArabic: false });
    } else {
      prompt = v.pronunciation;
      promptHint = v.english;
      // Intentionally NOT setting `translit` on options here: the prompt IS the
      // transliteration, so a per-option reveal would let the user click each
      // option's hint until one matches the prompt without reading any Arabic.
      optionRender = (e) => ({ text: e.arabic, isArabic: true });
    }

    const options = shuffled.map((e) => {
      const r = optionRender(e);
      return {
        id: `opt-${e.id}`,
        text: r.text,
        isArabic: r.isArabic,
        ...(r.translit ? { translit: r.translit } : {}),
      };
    });

    return {
      id: `${v.id}__mc_${direction}_${idx}`,
      kind,
      wordId: v.id,
      prompt,
      promptArabic,
      promptHint,
      options,
      correctAnswerId: correctId,
    };
  });
  return { ...opts, questions };
}

export function makeFillBlankDeck(
  vocab: VocabEntry[],
  opts: { id: string; title: string; topicSlug?: string; lessonId?: string },
): ExerciseDeck {
  const questions: ExerciseQuestion[] = withEnglish(vocab).map((v, idx) => ({
    id: `${v.id}__fillblank_${idx}`,
    kind: "fill-blank-translit",
    wordId: v.id,
    prompt: v.english,
    promptArabic: v.arabic,
    acceptableAnswers: normalizeAnswers(v.pronunciation),
  }));
  return { ...opts, questions };
}

export function makeGenderQuizDeck(
  vocab: VocabEntry[],
  opts: { id: string; title: string; topicSlug?: string; lessonId?: string },
): ExerciseDeck {
  const filtered = vocab.filter((v) => v.gender === "M" || v.gender === "F");
  const questions: ExerciseQuestion[] = filtered.map((v, idx) => {
    const correctId = v.gender === "M" ? "opt-M" : "opt-F";
    return {
      id: `${v.id}__gender_${idx}`,
      kind: "gender-quiz",
      wordId: v.id,
      prompt: "Is this word masculine or feminine?",
      promptArabic: v.arabic,
      promptHint: v.pronunciation,
      options: [
        { id: "opt-M", text: "Masculine (مذكر)" },
        { id: "opt-F", text: "Feminine (مؤنث)" },
      ],
      correctAnswerId: correctId,
    };
  });
  return { ...opts, questions };
}

export function makeOrderingDeck(
  vocab: VocabEntry[],
  opts: {
    id: string;
    title: string;
    topicSlug?: string;
    lessonId?: string;
    orderBy: "numericValue" | "weekdayIndex" | "monthIndex";
  },
): ExerciseDeck {
  const sortable = vocab
    .filter((v) => typeof v[opts.orderBy] === "number")
    .sort((a, b) => (a[opts.orderBy] as number) - (b[opts.orderBy] as number));
  if (sortable.length < 4) {
    return { id: opts.id, title: opts.title, topicSlug: opts.topicSlug, lessonId: opts.lessonId, questions: [] };
  }
  // Pick groups of 5–7 in order, ask user to put them in correct sequence.
  const chunks: VocabEntry[][] = [];
  const chunkSize = Math.min(6, sortable.length);
  for (let i = 0; i + chunkSize <= sortable.length; i += chunkSize) {
    chunks.push(sortable.slice(i, i + chunkSize));
  }
  if (chunks.length === 0) chunks.push(sortable.slice(0, chunkSize));

  const questions: ExerciseQuestion[] = chunks.map((chunk, idx) => ({
    id: `${opts.id}__ordering_${idx}`,
    kind: "ordering",
    prompt: orderingPrompt(opts.orderBy),
    options: shuffle(chunk, idx + 11).map((v) => ({
      id: `opt-${v.id}`,
      text: v.arabic,
      isArabic: true,
      translit: v.pronunciation,
    })),
    correctOrder: chunk.map((v) => `opt-${v.id}`),
  }));
  return {
    id: opts.id,
    title: opts.title,
    topicSlug: opts.topicSlug,
    lessonId: opts.lessonId,
    questions,
  };
}

function orderingPrompt(orderBy: "numericValue" | "weekdayIndex" | "monthIndex"): string {
  if (orderBy === "numericValue") return "Arrange these numbers from smallest to largest.";
  if (orderBy === "weekdayIndex") return "Put the days of the week in order, starting from Monday.";
  return "Put the months in calendar order.";
}

export function normalizeAnswers(input: string): string[] {
  if (!input) return [];
  // Strip macrons/diacritics, lowercase, normalize whitespace; accept several sane variants.
  const stripped = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/ʿ|ʾ|ʼ|'|`/g, "")
    .replace(/[ḥḤ]/gi, "h")
    .replace(/[ṣṢ]/gi, "s")
    .replace(/[ḍḌ]/gi, "d")
    .replace(/[ṭṬ]/gi, "t")
    .replace(/[ẓẒ]/gi, "z")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  const original = input.toLowerCase().trim();
  const noVowelLength = stripped.replace(/[āĀ]/g, "a").replace(/[īĪ]/g, "i").replace(/[ūŪ]/g, "u");
  const out = new Set([original, stripped, noVowelLength]);
  // Also allow versions where trailing case-marker (un, in, an) is dropped, since users often skip it.
  for (const v of [...out]) {
    out.add(v.replace(/(un|in|an)$/, "").trim());
  }
  return [...out].filter(Boolean);
}

export function checkFillBlankAnswer(input: string, accepted: string[]): boolean {
  const normalized = normalizeAnswers(input);
  for (const variant of normalized) {
    if (accepted.includes(variant)) return true;
  }
  return false;
}

export function checkOrderingAnswer(submitted: string[], correct: string[]): boolean {
  if (submitted.length !== correct.length) return false;
  return submitted.every((id, i) => id === correct[i]);
}
