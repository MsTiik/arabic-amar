import {
  LEVEL_TWO_ACTIONS,
  LEVEL_TWO_ACTION_SENTENCES,
  LEVEL_TWO_CLASSROOM_VOCABULARY,
  LEVEL_TWO_MARKETPLACE_ORDERING,
  LEVEL_TWO_MARKETPLACE_PASSAGE,
  LEVEL_TWO_MARKETPLACE_QUESTIONS,
  LEVEL_TWO_MARKETPLACE_READING,
  LEVEL_TWO_MATCHING_PHRASES,
} from "@/data/level-two-lessons";
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

  for (const sentence of LEVEL_TWO_MARKETPLACE_READING) {
    const location = `marketplace.reading.${sentence.id}`;
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
      if (!["verb", "noun", "connector"].includes(token.kind)) {
        issues.push({ location: tokenLocation, message: `Unknown reading word kind: ${token.kind}.` });
      }
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

  const coreFamilies = VERB_FAMILIES.filter((family) => family.levelTwoOrder !== undefined);
  if (coreFamilies.length !== 5) {
    issues.push({ location: "verb-families", message: "Exactly five reviewed core families are required." });
  }
  for (const family of coreFamilies) {
    const location = `verb-family.${family.id}`;
    requirePage(family.levelTwoSourcePage ?? 0, location);
    requireReviewStatus(family.levelTwoReviewStatus ?? "", location);
    for (const [key, form] of Object.entries(family.forms)) {
      requireArabic(form.arabic, `${location}.${key}`);
      requireTransliteration(form.transliteration, `${location}.${key}`);
      requireText(form.english, `${location}.${key}`, "English");
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
      if (
        example.kind === "class" &&
        !example.reference.includes(`page ${family.levelTwoSourcePage}`)
      ) {
        issues.push({
          location: exampleLocation,
          message: "Class example reference does not match the family’s reviewed source page.",
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

  return issues;
}
