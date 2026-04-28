import type { SiteContent, Topic, VocabEntry } from "./types";

const NOTE_MIN_CHARS = 60;
const NOTE_MIN_REPEATS = 3;

/** Source-doc typo fixes that the parser cannot reasonably do on its own. */
const SPELLING_FIXES: Record<string, string> = {
  ERUOPE: "EUROPE",
};

function fixSpelling(s: string | undefined): string | undefined {
  if (!s) return s;
  return SPELLING_FIXES[s] ?? s;
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
