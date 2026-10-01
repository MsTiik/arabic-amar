# Adding future Level 2 content

This workflow is designed for handwritten iPad notes. The contributor does **not** need to type Arabic into the repository.

## The easy workflow

1. Upload the original screenshots or PDF in their natural reading order. There is no required template or class structure.
2. Optionally add a short title or topic and mention whether anything is revision. If you do not, the material can still be organised during review.
3. The material is transcribed into an audit before it is added to the website.
4. Every item receives one of three review states:
   - **Confirmed**: the handwriting is clear and the standard-Arabic form is clear.
   - **Normalised**: the intended item is clear, but spelling, harakat, wording, translation, or labelling was corrected to Fuṣḥā.
   - **Needs confirmation**: something is genuinely ambiguous. These items stay in the audit and are blocked from the website.
5. The validation and website tests run before the content is considered ready.

The user can therefore simply keep sending images. A typed list is optional, not required.

## What to include when convenient

For a vocabulary word:

- Arabic word or the English meaning
- anything the teacher said about gender or plural
- an example sentence, if one was given

For a verb family:

- past
- present
- command
- verbal noun
- any “other form” exactly as taught
- example sentences

It is fine if some boxes are missing or the harakat are uncertain. Missing information is recorded as missing; it is never invented silently.

## Accuracy gate

Published content must:

- be Modern Standard Arabic / Fuṣḥā unless clearly labelled otherwise;
- preserve Qur’anic wording and cite it as Qur’anic;
- use consistent transliteration (`ā`, `ī`, `ū`, `ḥ`, `ʿ`, `ʾ`);
- include a source-page number;
- be marked **Confirmed** or **Normalised**;
- pass `npm run content:level2:validate`;
- pass lint, type checking, tests, the production build, and a visual check.

The validator rejects missing Arabic, English, transliteration, source pages, duplicate IDs, incomplete singular/plural pairs, English-style `oo` in transliteration, and incomplete core verb families. Linguistic review still matters: automated checks catch omissions and inconsistencies, while the audit and source comparison catch meaning and morphology.

## Where the records live

- Published Level 2 lesson data: `src/data/level-two-lessons.ts`
- Published verb families: `src/data/verb-families.ts`
- Page-to-unit map: `src/data/curriculum.ts`
- Transcription and editorial ledger: `docs/level-2-content-audit.md`

Unclear material belongs in the audit only. It must not be placed in the published data files until resolved.
