import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_ACTION_SENTENCES,
  LEVEL_TWO_CLASSROOM_VOCABULARY,
  LEVEL_TWO_KHALIDS_HOUSE,
  LEVEL_TWO_MARKETPLACE_ORDERING,
  LEVEL_TWO_MARKETPLACE_PASSAGE,
  LEVEL_TWO_MARKETPLACE_QUESTIONS,
  LEVEL_TWO_MARKETPLACE_READING,
  LEVEL_TWO_MATCHING_PHRASES,
  type LevelTwoReadingSentence,
} from "@/data/level-two-lessons";
import { LEVEL_TWO_VOCAB_SETS, LEVEL_TWO_VOCAB_THEMES } from "@/data/level-two-vocab-sets";
import { VERB_FAMILIES } from "@/data/verb-families";

const ARABIC_RE = /[\u0600-\u06ff]/u;

export interface LevelTwoValidationIssue {
  location: string;
  message: string;
}

export function validateLevelTwoPublishedContent(): LevelTwoValidationIssue[] {
  const issues: LevelTwoValidationIssue[] = [];
  const seenIds = new Set<string>();

  function requireText(value: string | undefined, location: string, label: string) {
    if (!value?.trim()) issues.push({ location, message: `${label} is empty.` });
  }

  function requireArabic(value: string, location: string) {
    requireText(value, location, "Arabic");
    if (value && !ARABIC_RE.test(value)) {
      issues.push({ location, message: "Arabic field contains no Arabic characters." });
    }
  }

  function requirePage(page: number, location: string) {
    if (!Number.isInteger(page) || page < 1 || page > 20) {
      issues.push({ location, message: `Source page ${page} is outside the reviewed PDF.` });
    }
  }

  function requireUniqueId(id: string, location: string) {
    if (seenIds.has(id)) issues.push({ location, message: `Duplicate Level 2 id: ${id}.` });
    seenIds.add(id);
  }

  function requireReviewStatus(status: string, location: string) {
    if (status !== "confirmed" && status !== "normalised") {
      issues.push({
        location,
        message: "Published content must be confirmed or normalised; unresolved items stay in the audit.",
      });
    }
  }

  function requireTransliteration(value: string, location: string) {
    requireText(value, location, "Transliteration");
    if (/oo/i.test(value)) {
      issues.push({
        location,
        message: "Use ū for a long Arabic vowel, not English-style ‘oo’.",
      });
    }
  }

  for (const entry of LEVEL_TWO_CLASSROOM_VOCABULARY) {
    const location = `classroom.${entry.id}`;
    requireUniqueId(entry.id, location);
    requirePage(entry.sourcePage, location);
    requireReviewStatus(entry.reviewStatus, location);
    requireArabic(entry.arabic, location);
    requireTransliteration(entry.transliteration, location);
    requireText(entry.english, location, "English");
    if (Boolean(entry.pluralArabic) !== Boolean(entry.pluralTransliteration)) {
      issues.push({ location, message: "Plural Arabic and transliteration must be added together." });
    }
    if (entry.pluralArabic) requireArabic(entry.pluralArabic, `${location}.plural`);
    if (entry.pluralTransliteration) {
      requireTransliteration(entry.pluralTransliteration, `${location}.plural`);
    }
  }

  requirePage(LEVEL_TWO_MARKETPLACE_PASSAGE.sourcePage, "marketplace.passage");
  requireReviewStatus(LEVEL_TWO_MARKETPLACE_PASSAGE.reviewStatus, "marketplace.passage");
  requireArabic(LEVEL_TWO_MARKETPLACE_PASSAGE.arabic, "marketplace.passage");
  requireText(LEVEL_TWO_MARKETPLACE_PASSAGE.english, "marketplace.passage", "English");

  function requireReadingSentence(sentence: LevelTwoReadingSentence, location: string) {
    requireUniqueId(sentence.id, location);
    requireText(sentence.english, location, "Sentence meaning");
    if (sentence.tokens.length === 0) {
      issues.push({ location, message: "Interactive reading sentence has no words." });
    }
    for (const [index, token] of sentence.tokens.entries()) {
      const tokenLocation = `${location}.word.${index + 1}`;
      requireArabic(token.arabic, tokenLocation);
      requireTransliteration(token.transliteration, tokenLocation);
      requireText(token.english, tokenLocation, "Word meaning");
      if (!["verb", "noun", "adjective", "connector"].includes(token.kind)) {
        issues.push({ location: tokenLocation, message: `Unknown reading word kind: ${token.kind}.` });
      }
    }
  }

  for (const sentence of LEVEL_TWO_MARKETPLACE_READING) {
    requireReadingSentence(sentence, `marketplace.reading.${sentence.id}`);
  }

  for (const reading of [LEVEL_TWO_KHALIDS_HOUSE]) {
    const readingLocation = `reading.${reading.slug}`;
    requireUniqueId(readingLocation, readingLocation);
    requireText(reading.source, readingLocation, "Source");
    requireReviewStatus(reading.reviewStatus, readingLocation);
    requireText(reading.english, readingLocation, "English");
    if (reading.questions.length === 0) {
      issues.push({ location: readingLocation, message: "A reading needs its exercise questions." });
    }
    const sentenceIds = new Set(reading.sentences.map((sentence) => sentence.id));
    for (const question of reading.questions) {
      if (question.sentenceId && !sentenceIds.has(question.sentenceId)) {
        issues.push({
          location: `${readingLocation}.${question.id}`,
          message: `"Show in story" points at a sentence that is not in the reading: ${question.sentenceId}.`,
        });
      }
    }
    const parts = [
      ...reading.sentences,
      ...reading.questions.flatMap((question) => [question.question, question.answer]),
    ];
    for (const sentence of parts) {
      const location = `${readingLocation}.${sentence.id}`;
      requireReadingSentence(sentence, location);
      requireTransliteration(sentence.transliteration ?? "", location);
    }
  }

  for (const question of LEVEL_TWO_MARKETPLACE_QUESTIONS) {
    const location = `marketplace.question.${question.id}`;
    requireUniqueId(question.id, location);
    requirePage(question.sourcePage, location);
    requireReviewStatus(question.reviewStatus, location);
    requireArabic(question.questionArabic, location);
    requireArabic(question.answerArabic, `${location}.answer`);
    requireText(question.answerEnglish, location, "English answer");
  }

  for (const sentence of [
    ...LEVEL_TWO_MATCHING_PHRASES,
    ...LEVEL_TWO_MARKETPLACE_ORDERING,
    ...LEVEL_TWO_ACTION_SENTENCES,
  ]) {
    const location = `sentence.${sentence.id}`;
    requireUniqueId(sentence.id, location);
    requirePage(sentence.sourcePage, location);
    requireReviewStatus(sentence.reviewStatus, location);
    requireArabic(sentence.arabic, location);
    requireText(sentence.english, location, "English");
  }

  for (const action of LEVEL_TWO_ACTIONS) {
    const location = `action.${action.id}`;
    requireUniqueId(action.id, location);
    requirePage(action.sourcePage, location);
    requireReviewStatus(action.reviewStatus, location);
    requireArabic(action.arabic, location);
    requireTransliteration(action.transliteration, location);
    if (!action.english.startsWith("he ")) {
      issues.push({
        location,
        message: "Present-tense third-person masculine singular gloss must begin with ‘he’." ,
      });
    }
  }

  const levelTwoFamilies = VERB_FAMILIES.filter((family) => family.levelTwoOrder !== undefined);
  const classNoteFamilies = levelTwoFamilies.filter((family) => family.levelTwoSourcePage !== undefined);
  if (classNoteFamilies.length !== 5) {
    issues.push({ location: "verb-families", message: "Exactly five reviewed class-note families are required." });
  }
  const seenOrders = new Set<number>();
  for (const family of levelTwoFamilies) {
    const location = `verb-family.${family.id}`;
    const order = family.levelTwoOrder ?? 0;
    if (seenOrders.has(order)) issues.push({ location, message: `Duplicate Level 2 order ${order}.` });
    seenOrders.add(order);
    const sourceTag =
      family.levelTwoSourcePage !== undefined
        ? `page ${family.levelTwoSourcePage}`
        : family.levelTwoLesson !== undefined
          ? `lesson ${family.levelTwoLesson}`
          : undefined;
    if (family.levelTwoSourcePage !== undefined) requirePage(family.levelTwoSourcePage, location);
    if (
      family.levelTwoLesson !== undefined &&
      (!Number.isInteger(family.levelTwoLesson) || family.levelTwoLesson < 1)
    ) {
      issues.push({ location, message: `Lesson ${family.levelTwoLesson} is not a valid lesson number.` });
    }
    if (!sourceTag) {
      issues.push({ location, message: "A Level 2 family needs a source page or lesson." });
    }
    requireReviewStatus(family.levelTwoReviewStatus ?? "", location);
    for (const [key, form] of Object.entries(family.forms)) {
      requireArabic(form.arabic, `${location}.${key}`);
      requireTransliteration(form.transliteration, `${location}.${key}`);
      requireText(form.english, `${location}.${key}`, "English");
    }
    for (const [index, form] of (family.relatedForms ?? []).entries()) {
      const formLocation = `${location}.related.${index + 1}`;
      requireArabic(form.arabic, formLocation);
      requireTransliteration(form.transliteration, formLocation);
      requireText(form.english, formLocation, "English");
    }
    if (family.examples.length === 0) {
      issues.push({ location, message: "A reviewed family needs at least one context sentence." });
    }
    for (const [index, example] of family.examples.entries()) {
      const exampleLocation = `${location}.example.${index + 1}`;
      requireArabic(example.arabic, exampleLocation);
      requireArabic(example.focusArabic, `${exampleLocation}.focus`);
      requireTransliteration(example.transliteration, exampleLocation);
      requireText(example.english, exampleLocation, "English");
      if (!example.arabic.includes(example.focusArabic)) {
        issues.push({
          location: exampleLocation,
          message: "The form to notice must appear exactly in the Arabic example.",
        });
      }
      if (example.kind === "class" && sourceTag && !example.reference.includes(sourceTag)) {
        issues.push({
          location: exampleLocation,
          message: "Class example reference does not match the family’s source page or lesson.",
        });
      }
      if (example.kind !== "class" && !example.url?.startsWith("https://")) {
        issues.push({
          location: exampleLocation,
          message: "Qur’an and hadith examples require an HTTPS source link.",
        });
      }
    }
  }

  for (const theme of LEVEL_TWO_VOCAB_THEMES) {
    const themeLocation = `vocab-theme.${theme.slug}`;
    requireUniqueId(themeLocation, themeLocation);
    requireText(theme.title, themeLocation, "Title");
    requireArabic(theme.titleArabic, `${themeLocation}.title`);
    if (theme.sets.length === 0) issues.push({ location: themeLocation, message: "A vocabulary theme needs at least one set." });
  }

  for (const set of LEVEL_TWO_VOCAB_SETS) {
    const setLocation = `vocab-set.${set.slug}`;
    requireUniqueId(setLocation, setLocation);
    requireText(set.title, setLocation, "Title");
    requireArabic(set.titleArabic, `${setLocation}.title`);
    requireText(set.source, setLocation, "Source");
    if (set.words.length === 0) issues.push({ location: setLocation, message: "A vocabulary set needs words." });

    for (const word of set.words) {
      const location = `${setLocation}.${word.id}`;
      requireUniqueId(location, location);
      requireReviewStatus(word.reviewStatus, location);
      requireArabic(word.headword.arabic, `${location}.headword`);
      requireTransliteration(word.headword.transliteration, `${location}.headword`);
      requireText(word.headword.english, `${location}.headword`, "English");
      if (word.forms.length === 0) issues.push({ location, message: "A word card needs at least one form." });
      const roles = new Set<string>();
      for (const form of word.forms) {
        const formLocation = `${location}.${form.role}`;
        if (roles.has(form.role)) issues.push({ location: formLocation, message: "Each form role may appear once per card." });
        roles.add(form.role);
        if (form.items.length === 0) issues.push({ location: formLocation, message: "A form needs at least one item." });
        for (const item of form.items) {
          requireArabic(item.arabic, formLocation);
          requireTransliteration(item.transliteration, formLocation);
          requireText(item.english, formLocation, "English");
        }
      }
      if (!word.sentences.some((sentence) => sentence.tokens.some((token) => token.focus))) {
        issues.push({ location, message: "At least one example sentence must use the card’s word (mark it with focus)." });
      }
      if (word.sentences.length === 0) {
        issues.push({ location, message: "Every vocabulary word needs at least one example sentence." });
      }
      for (const sentence of word.sentences) {
        const sentenceLocation = `${location}.sentence.${sentence.id}`;
        requireUniqueId(`${setLocation}.sentence.${sentence.id}`, sentenceLocation);
        requireTransliteration(sentence.transliteration, sentenceLocation);
        requireText(sentence.english, sentenceLocation, "English");
        if (sentence.tokens.length === 0) issues.push({ location: sentenceLocation, message: "A sentence needs tokens." });
        for (const [index, token] of sentence.tokens.entries()) {
          const tokenLocation = `${sentenceLocation}.token.${index + 1}`;
          requireArabic(token.arabic, tokenLocation);
          requireTransliteration(token.transliteration, tokenLocation);
          requireText(token.english, tokenLocation, "English");
        }
        const tokenTransliteration = sentence.tokens
          .map((token) => `${token.transliteration}${(token.punctuationAfter ?? "").replace("؟", "?")}`)
          .join(" ");
        if (tokenTransliteration !== sentence.transliteration) {
          issues.push({
            location: sentenceLocation,
            message: `Word glosses do not line up with the sentence transliteration (“${tokenTransliteration}”).`,
          });
        }
      }
    }
  }

  return issues;
}
