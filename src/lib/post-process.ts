import type { ConjugationEntry, SiteContent, Topic, VocabEntry } from "./types";

const NOTE_MIN_CHARS = 60;
const NOTE_MIN_REPEATS = 3;

/** Source-doc typo fixes that the parser cannot reasonably do on its own. */
const SPELLING_FIXES: Record<string, string> = {
  ERUOPE: "EUROPE",
};

const HIJRI_MONTH_GLOSSES: Record<number, string> = {
  1: "Muḥarram (1st Hijri month)",
  2: "Ṣafar (2nd Hijri month)",
  3: "Rabīʿ al-awwal (3rd Hijri month)",
  4: "Rabīʿ al-ākhir / Rabīʿ ath-thānī (4th Hijri month)",
  5: "Jumādā al-ūlā (5th Hijri month)",
  6: "Jumādā al-ākhirah / Jumādā ath-thāniyah (6th Hijri month)",
  7: "Rajab (7th Hijri month)",
  8: "Shaʿbān (8th Hijri month)",
  9: "Ramaḍān (9th Hijri month)",
  10: "Shawwāl (10th Hijri month)",
  11: "Dhū al-Qaʿdah (11th Hijri month)",
  12: "Dhū al-Ḥijjah (12th Hijri month)",
};

function fixSpelling(s: string | undefined): string | undefined {
  if (!s) return s;
  return SPELLING_FIXES[s] ?? s;
}

function parseArabicMonthNumber(arabic: string): number | undefined {
  const match = arabic.match(/^\s*([\d\u0660-\u0669\u06F0-\u06F9]+)/u);
  if (!match) return undefined;
  const normalized = [...match[1]]
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 0x0660 && code <= 0x0669) return String(code - 0x0660);
      if (code >= 0x06f0 && code <= 0x06f9) return String(code - 0x06f0);
      return char;
    })
    .join("");
  const number = Number.parseInt(normalized, 10);
  return number >= 1 && number <= 12 ? number : undefined;
}

function isIslamicMonth(vocab: VocabEntry): boolean {
  return (
    vocab.lessonId === "lesson-islamic-and-gregorian-months" &&
    vocab.category.toLowerCase().includes("islamic")
  );
}

/**
 * Apply known spelling fixes from the source document. The Google Doc has a
 * handful of obvious typos in non-content metadata (continent codes etc.) that
 * we'd rather present cleanly without altering vocabulary itself.
 */
export function applySpellingFixes(content: SiteContent): SiteContent {
  return {
    ...content,
    vocab: content.vocab.map((v) => ({
      ...v,
      continent: fixSpelling(v.continent),
      subCategory: fixSpelling(v.subCategory),
    })),
  };
}

/**
 * Detect when many vocab entries within the same topic+category share an
 * identical long english text and lift that text into a topic-level note.
 *
 * The Google Doc (Hijri/Gregorian months) puts a single long explanation in a
 * rowspan'd cell across all 12 Hijri months; the parser flattens rowspans by
 * duplicating the cell text into every covered row, so every month entry ends
 * up with the same paragraph as its English translation. This post-pass makes
 * that paragraph appear once at the section level instead of on every card.
 */
export function dedupeLongRepeatedEnglish(content: SiteContent): SiteContent {
  const topicsBySlug = new Map<string, Topic>();
  for (const t of content.topics) {
    topicsBySlug.set(t.slug, { ...t, notes: t.notes ? [...t.notes] : [] });
  }

  // Group: topicSlug + category + english => entries
  const groups = new Map<string, VocabEntry[]>();
  for (const v of content.vocab) {
    if (!v.english || v.english.length < NOTE_MIN_CHARS) continue;
    for (const slug of v.topicSlugs) {
      const key = `${slug}\u0000${v.category}\u0000${v.english}`;
      const arr = groups.get(key);
      if (arr) arr.push(v);
      else groups.set(key, [v]);
    }
  }

  const liftIds = new Set<string>();
  const liftedNotePerTopic = new Map<string, Set<string>>();
  for (const [key, arr] of groups) {
    if (arr.length < NOTE_MIN_REPEATS) continue;
    const [slug, , note] = key.split("\u0000");
    const topic = topicsBySlug.get(slug);
    if (!topic) continue;
    const seen = liftedNotePerTopic.get(slug) ?? new Set<string>();
    if (!seen.has(note)) {
      topic.notes = topic.notes ?? [];
      topic.notes.push(note);
      seen.add(note);
      liftedNotePerTopic.set(slug, seen);
    }
    for (const v of arr) liftIds.add(`${slug}\u0000${v.id}\u0000${v.english}`);
  }

  const newVocab = content.vocab.map((v) => {
    const stripFromAnyTopic = v.topicSlugs.some((slug) =>
      liftIds.has(`${slug}\u0000${v.id}\u0000${v.english}`),
    );
    return stripFromAnyTopic ? { ...v, english: "" } : v;
  });

  return {
    ...content,
    topics: content.topics.map((t) => topicsBySlug.get(t.slug) ?? t),
    vocab: newVocab,
  };
}

export function fillIslamicMonthGlosses(content: SiteContent): SiteContent {
  return {
    ...content,
    vocab: content.vocab.map((vocab) => {
      if (!isIslamicMonth(vocab)) return vocab;
      const monthIndex = parseArabicMonthNumber(vocab.arabic) ?? vocab.monthIndex;
      if (!monthIndex) return vocab;
      return {
        ...vocab,
        english: vocab.english || HIJRI_MONTH_GLOSSES[monthIndex],
        monthIndex,
        monthSystem: "hijri",
      };
    }),
  };
}

function correctConjugationCategory(conjugation: ConjugationEntry): ConjugationEntry {
  if (
    conjugation.category === "3rd person singular" &&
    conjugation.gender === "M" &&
    conjugation.english.trim().toLowerCase().startsWith("they ")
  ) {
    return {
      ...conjugation,
      id: conjugation.id.replace("__3rd-person-singular__", "__3rd-person-plural__"),
      category: "3rd person plural",
    };
  }
  return conjugation;
}

export function correctConjugationLabels(content: SiteContent): SiteContent {
  return {
    ...content,
    conjugations: content.conjugations.map(correctConjugationCategory),
  };
}
