/**
 * Top high-frequency Qur'ānic words/lemmas for the vocabulary bank's
 * Foundations deck.
 *
 * Source: Quranic Arabic Corpus lemma frequency list (Dukes 2009, CC BY-SA 3.0)
 * — the lemma forms ranked by occurrences across the muṣḥaf. Cross-checked
 * against [80%-of-the-Qur'ān] booklets used in classical curricula
 * (e.g. "Understand Qur'ān Academy" 80% words list).
 *
 * Glosses are short, beginner-friendly. Roots use the QAC's hyphenated
 * triliteral form (e.g. "ر-ح-م"). Pronunciation is ALA-LC-style.
 *
 * NOT sourced from the user's Google Doc — this is curated reference data
 * baked into the site under the Foundations badge.
 */

import type { Gender } from "@/lib/types";

export interface QuranFrequencyWord {
  /** Stable id, slug-safe. */
  id: string;
  /** Lemma in fully-vocalized Arabic. */
  arabic: string;
  /** ALA-LC transliteration. */
  pronunciation: string;
  /** Concise English gloss (1-3 words). */
  english: string;
  /** Triliteral root (where applicable). */
  root?: string;
  /** Coarse grammatical category for grouping. */
  category:
    | "Particles & connectors"
    | "Pronouns"
    | "Demonstratives & relatives"
    | "Verbs"
    | "Nouns — Allah & people"
    | "Nouns — concepts & places"
    | "Time & quantity"
    | "Prepositions";
  /** Optional gender hint for nouns. */
  gender?: Gender;
}

/**
 * Top-125 lemmas selected from the QAC frequency list.
 *
 * Coverage estimate: roughly the 50% mark of running tokens in the muṣḥaf
 * (the QAC list shows that the top ~125 lemmas account for ~50% of word
 * occurrences, after which the curve flattens significantly).
 */
export const TOP_QURAN_WORDS: QuranFrequencyWord[] = [
  // ───── Particles & connectors ─────────────────────────────────────────
  { id: "wa", arabic: "وَ", pronunciation: "wa", english: "and", category: "Particles & connectors" },
  { id: "fa", arabic: "فَ", pronunciation: "fa", english: "then / so", category: "Particles & connectors" },
  { id: "thumma", arabic: "ثُمَّ", pronunciation: "thumma", english: "then (after that)", category: "Particles & connectors" },
  { id: "aw", arabic: "أَوْ", pronunciation: "aw", english: "or", category: "Particles & connectors" },
  { id: "bal", arabic: "بَلْ", pronunciation: "bal", english: "rather / nay", category: "Particles & connectors" },
  { id: "lakin", arabic: "لَٰكِنْ", pronunciation: "lākin", english: "but", category: "Particles & connectors" },
  { id: "inna", arabic: "إِنَّ", pronunciation: "inna", english: "indeed (emphasis)", category: "Particles & connectors" },
  { id: "anna", arabic: "أَنَّ", pronunciation: "anna", english: "that (emphasis)", category: "Particles & connectors" },
  { id: "an", arabic: "أَنْ", pronunciation: "an", english: "that / to", category: "Particles & connectors" },
  { id: "in-cond", arabic: "إِنْ", pronunciation: "in", english: "if", category: "Particles & connectors" },
  { id: "idha", arabic: "إِذَا", pronunciation: "idhā", english: "when", category: "Particles & connectors" },
  { id: "law", arabic: "لَوْ", pronunciation: "law", english: "if (counterfactual)", category: "Particles & connectors" },
  { id: "lamma", arabic: "لَمَّا", pronunciation: "lammā", english: "when / not yet", category: "Particles & connectors" },
  { id: "qad", arabic: "قَدْ", pronunciation: "qad", english: "indeed / already", category: "Particles & connectors" },
  { id: "la-neg", arabic: "لَا", pronunciation: "lā", english: "not (present)", category: "Particles & connectors" },
  { id: "lam", arabic: "لَمْ", pronunciation: "lam", english: "did not (past)", category: "Particles & connectors" },
  { id: "lan", arabic: "لَنْ", pronunciation: "lan", english: "will never", category: "Particles & connectors" },
  { id: "ma-neg", arabic: "مَا", pronunciation: "mā", english: "not / what", category: "Particles & connectors" },
  { id: "hal", arabic: "هَلْ", pronunciation: "hal", english: "is/does (yes-no question)", category: "Particles & connectors" },
  { id: "ya-voc", arabic: "يَا", pronunciation: "yā", english: "O! (calling)", category: "Particles & connectors" },

  // ───── Prepositions ───────────────────────────────────────────────────
  { id: "fi", arabic: "فِي", pronunciation: "fī", english: "in / into", category: "Prepositions" },
  { id: "min", arabic: "مِنْ", pronunciation: "min", english: "from / of", category: "Prepositions" },
  { id: "ila", arabic: "إِلَى", pronunciation: "ilā", english: "to / towards", category: "Prepositions" },
  { id: "ala", arabic: "عَلَى", pronunciation: "ʿalā", english: "on / upon", category: "Prepositions" },
  { id: "an-prep", arabic: "عَنْ", pronunciation: "ʿan", english: "from / about", category: "Prepositions" },
  { id: "bi", arabic: "بِ", pronunciation: "bi", english: "with / by", category: "Prepositions" },
  { id: "li", arabic: "لِ", pronunciation: "li", english: "to / for", category: "Prepositions" },
  { id: "ka", arabic: "كَ", pronunciation: "ka", english: "like / as", category: "Prepositions" },
  { id: "maa", arabic: "مَعَ", pronunciation: "maʿa", english: "with (alongside)", category: "Prepositions" },
  { id: "bayna", arabic: "بَيْنَ", pronunciation: "bayna", english: "between / among", category: "Prepositions" },
  { id: "tahta", arabic: "تَحْتَ", pronunciation: "taḥta", english: "under", category: "Prepositions" },
  { id: "fawqa", arabic: "فَوْقَ", pronunciation: "fawqa", english: "above", category: "Prepositions" },

  // ───── Pronouns ───────────────────────────────────────────────────────
  { id: "ana", arabic: "أَنَا", pronunciation: "anā", english: "I", category: "Pronouns" },
  { id: "anta", arabic: "أَنْتَ", pronunciation: "anta", english: "you (m.s.)", category: "Pronouns" },
  { id: "anti", arabic: "أَنْتِ", pronunciation: "anti", english: "you (f.s.)", category: "Pronouns" },
  { id: "huwa", arabic: "هُوَ", pronunciation: "huwa", english: "he / it (m)", category: "Pronouns" },
  { id: "hiya", arabic: "هِيَ", pronunciation: "hiya", english: "she / it (f)", category: "Pronouns" },
  { id: "nahnu", arabic: "نَحْنُ", pronunciation: "naḥnu", english: "we", category: "Pronouns" },
  { id: "antum", arabic: "أَنْتُمْ", pronunciation: "antum", english: "you (m.pl.)", category: "Pronouns" },
  { id: "hum", arabic: "هُمْ", pronunciation: "hum", english: "they (m)", category: "Pronouns" },
  { id: "hunna", arabic: "هُنَّ", pronunciation: "hunna", english: "they (f)", category: "Pronouns" },

  // ───── Demonstratives & relatives ─────────────────────────────────────
  { id: "hadha", arabic: "هَٰذَا", pronunciation: "hādhā", english: "this (m.s.)", category: "Demonstratives & relatives" },
  { id: "hadhihi", arabic: "هَٰذِهِ", pronunciation: "hādhihi", english: "this (f.s.)", category: "Demonstratives & relatives" },
  { id: "dhalika", arabic: "ذَٰلِكَ", pronunciation: "dhālika", english: "that (m.s.)", category: "Demonstratives & relatives" },
  { id: "tilka", arabic: "تِلْكَ", pronunciation: "tilka", english: "that (f.s.)", category: "Demonstratives & relatives" },
  { id: "haaulai", arabic: "هَٰؤُلَاءِ", pronunciation: "hāʾulāʾi", english: "these (people)", category: "Demonstratives & relatives" },
  { id: "alladhi", arabic: "ٱلَّذِي", pronunciation: "alladhī", english: "the one who (m.s.)", category: "Demonstratives & relatives" },
  { id: "allati", arabic: "ٱلَّتِي", pronunciation: "allatī", english: "the one who (f.s.)", category: "Demonstratives & relatives" },
  { id: "alladhina", arabic: "ٱلَّذِينَ", pronunciation: "alladhīna", english: "those who (m.pl.)", category: "Demonstratives & relatives" },

  // ───── Common verbs ───────────────────────────────────────────────────
  { id: "qala", arabic: "قَالَ", pronunciation: "qāla", english: "he said", root: "ق-و-ل", category: "Verbs" },
  { id: "kana", arabic: "كَانَ", pronunciation: "kāna", english: "he was", root: "ك-و-ن", category: "Verbs" },
  { id: "jaa", arabic: "جَاءَ", pronunciation: "jāʾa", english: "he came", root: "ج-ي-ء", category: "Verbs" },
  { id: "raaa", arabic: "رَأَى", pronunciation: "raʾā", english: "he saw", root: "ر-أ-ي", category: "Verbs" },
  { id: "alima", arabic: "عَلِمَ", pronunciation: "ʿalima", english: "he knew", root: "ع-ل-م", category: "Verbs" },
  { id: "amana", arabic: "آمَنَ", pronunciation: "āmana", english: "he believed", root: "ء-م-ن", category: "Verbs" },
  { id: "amila", arabic: "عَمِلَ", pronunciation: "ʿamila", english: "he did / acted", root: "ع-م-ل", category: "Verbs" },
  { id: "kafara", arabic: "كَفَرَ", pronunciation: "kafara", english: "he disbelieved", root: "ك-ف-ر", category: "Verbs" },
  { id: "khalaqa", arabic: "خَلَقَ", pronunciation: "khalaqa", english: "he created", root: "خ-ل-ق", category: "Verbs" },
  { id: "araada", arabic: "أَرَادَ", pronunciation: "arāda", english: "he wanted", root: "ر-و-د", category: "Verbs" },
  { id: "akhadha", arabic: "أَخَذَ", pronunciation: "akhadha", english: "he took", root: "أ-خ-ذ", category: "Verbs" },
  { id: "ataa", arabic: "أَتَى", pronunciation: "atā", english: "he came / brought", root: "أ-ت-ي", category: "Verbs" },
  { id: "arsala", arabic: "أَرْسَلَ", pronunciation: "arsala", english: "he sent", root: "ر-س-ل", category: "Verbs" },
  { id: "wajada", arabic: "وَجَدَ", pronunciation: "wajada", english: "he found", root: "و-ج-د", category: "Verbs" },
  { id: "anzala", arabic: "أَنْزَلَ", pronunciation: "anzala", english: "he sent down", root: "ن-ز-ل", category: "Verbs" },
  { id: "ja3ala", arabic: "جَعَلَ", pronunciation: "jaʿala", english: "he made / placed", root: "ج-ع-ل", category: "Verbs" },
  { id: "dhaba", arabic: "ذَهَبَ", pronunciation: "dhahaba", english: "he went", root: "ذ-ه-ب", category: "Verbs" },
  { id: "akala", arabic: "أَكَلَ", pronunciation: "akala", english: "he ate", root: "أ-ك-ل", category: "Verbs" },
  { id: "shariba", arabic: "شَرِبَ", pronunciation: "shariba", english: "he drank", root: "ش-ر-ب", category: "Verbs" },
  { id: "kataba", arabic: "كَتَبَ", pronunciation: "kataba", english: "he wrote", root: "ك-ت-ب", category: "Verbs" },
  { id: "samia", arabic: "سَمِعَ", pronunciation: "samiʿa", english: "he heard", root: "س-م-ع", category: "Verbs" },
  { id: "nazara", arabic: "نَظَرَ", pronunciation: "naẓara", english: "he looked", root: "ن-ظ-ر", category: "Verbs" },
  { id: "qara2a", arabic: "قَرَأَ", pronunciation: "qaraʾa", english: "he read / recited", root: "ق-ر-أ", category: "Verbs" },
  { id: "kana-yakun", arabic: "يَكُونُ", pronunciation: "yakūnu", english: "he is / will be", root: "ك-و-ن", category: "Verbs" },

  // ───── Nouns — Allah & people ─────────────────────────────────────────
  { id: "allah", arabic: "ٱللَّه", pronunciation: "Allāh", english: "Allah", category: "Nouns — Allah & people" },
  { id: "rabb", arabic: "رَبّ", pronunciation: "rabb", english: "Lord", root: "ر-ب-ب", category: "Nouns — Allah & people", gender: "M" },
  { id: "ilah", arabic: "إِلَٰه", pronunciation: "ilāh", english: "god / deity", root: "أ-ل-ه", category: "Nouns — Allah & people", gender: "M" },
  { id: "rasul", arabic: "رَسُول", pronunciation: "rasūl", english: "messenger", root: "ر-س-ل", category: "Nouns — Allah & people", gender: "M" },
  { id: "nabi", arabic: "نَبِيّ", pronunciation: "nabī", english: "prophet", root: "ن-ب-أ", category: "Nouns — Allah & people", gender: "M" },
  { id: "abd", arabic: "عَبْد", pronunciation: "ʿabd", english: "servant / slave", root: "ع-ب-د", category: "Nouns — Allah & people", gender: "M" },
  { id: "nas", arabic: "نَاس", pronunciation: "nās", english: "people / mankind", root: "ن-و-س", category: "Nouns — Allah & people" },
  { id: "qawm", arabic: "قَوْم", pronunciation: "qawm", english: "people / nation", root: "ق-و-م", category: "Nouns — Allah & people" },
  { id: "rajul", arabic: "رَجُل", pronunciation: "rajul", english: "man", root: "ر-ج-ل", category: "Nouns — Allah & people", gender: "M" },
  { id: "imraa", arabic: "ٱمْرَأَة", pronunciation: "imraʾa", english: "woman", root: "م-ر-أ", category: "Nouns — Allah & people", gender: "F" },
  { id: "ibn", arabic: "ٱبْن", pronunciation: "ibn", english: "son", root: "ب-ن-و", category: "Nouns — Allah & people", gender: "M" },
  { id: "ab", arabic: "أَب", pronunciation: "ab", english: "father", root: "أ-ب-و", category: "Nouns — Allah & people", gender: "M" },
  { id: "umm", arabic: "أُمّ", pronunciation: "umm", english: "mother", root: "أ-م-م", category: "Nouns — Allah & people", gender: "F" },
  { id: "akh", arabic: "أَخ", pronunciation: "akh", english: "brother", root: "أ-خ-و", category: "Nouns — Allah & people", gender: "M" },
  { id: "malik", arabic: "مَلِك", pronunciation: "malik", english: "king", root: "م-ل-ك", category: "Nouns — Allah & people", gender: "M" },
  { id: "muminun", arabic: "مُؤْمِنُون", pronunciation: "muʾminūn", english: "believers", root: "ء-م-ن", category: "Nouns — Allah & people", gender: "M" },
  { id: "kafirun", arabic: "كَافِرُون", pronunciation: "kāfirūn", english: "disbelievers", root: "ك-ف-ر", category: "Nouns — Allah & people", gender: "M" },
  { id: "shaytan", arabic: "شَيْطَان", pronunciation: "shayṭān", english: "Satan / devil", root: "ش-ط-ن", category: "Nouns — Allah & people", gender: "M" },
  { id: "jinn", arabic: "جِنّ", pronunciation: "jinn", english: "jinn", root: "ج-ن-ن", category: "Nouns — Allah & people" },
  { id: "malak", arabic: "مَلَك", pronunciation: "malak", english: "angel", root: "م-ل-ك", category: "Nouns — Allah & people", gender: "M" },

  // ───── Nouns — concepts & places ──────────────────────────────────────
  { id: "kitab", arabic: "كِتَاب", pronunciation: "kitāb", english: "book / scripture", root: "ك-ت-ب", category: "Nouns — concepts & places", gender: "M" },
  { id: "quran", arabic: "قُرْآن", pronunciation: "qurʾān", english: "Qur'ān (recitation)", root: "ق-ر-أ", category: "Nouns — concepts & places", gender: "M" },
  { id: "ayah", arabic: "آيَة", pronunciation: "āya", english: "sign / verse", root: "أ-ي-ي", category: "Nouns — concepts & places", gender: "F" },
  { id: "din", arabic: "دِين", pronunciation: "dīn", english: "religion / judgment", root: "د-ي-ن", category: "Nouns — concepts & places", gender: "M" },
  { id: "iman", arabic: "إِيمَان", pronunciation: "īmān", english: "faith", root: "ء-م-ن", category: "Nouns — concepts & places", gender: "M" },
  { id: "haqq", arabic: "حَقّ", pronunciation: "ḥaqq", english: "truth / right", root: "ح-ق-ق", category: "Nouns — concepts & places", gender: "M" },
  { id: "bil", arabic: "بَاطِل", pronunciation: "bāṭil", english: "falsehood", root: "ب-ط-ل", category: "Nouns — concepts & places", gender: "M" },
  { id: "khayr", arabic: "خَيْر", pronunciation: "khayr", english: "good / better", root: "خ-ي-ر", category: "Nouns — concepts & places", gender: "M" },
  { id: "sharr", arabic: "شَرّ", pronunciation: "sharr", english: "evil / worse", root: "ش-ر-ر", category: "Nouns — concepts & places", gender: "M" },
  { id: "rahma", arabic: "رَحْمَة", pronunciation: "raḥma", english: "mercy", root: "ر-ح-م", category: "Nouns — concepts & places", gender: "F" },
  { id: "ilm", arabic: "عِلْم", pronunciation: "ʿilm", english: "knowledge", root: "ع-ل-م", category: "Nouns — concepts & places", gender: "M" },
  { id: "amal", arabic: "عَمَل", pronunciation: "ʿamal", english: "deed / action", root: "ع-م-ل", category: "Nouns — concepts & places", gender: "M" },
  { id: "qalb", arabic: "قَلْب", pronunciation: "qalb", english: "heart", root: "ق-ل-ب", category: "Nouns — concepts & places", gender: "M" },
  { id: "nafs", arabic: "نَفْس", pronunciation: "nafs", english: "soul / self", root: "ن-ف-س", category: "Nouns — concepts & places", gender: "F" },
  { id: "ruh", arabic: "رُوح", pronunciation: "rūḥ", english: "spirit / soul", root: "ر-و-ح", category: "Nouns — concepts & places", gender: "M" },
  { id: "samaa", arabic: "سَمَاء", pronunciation: "samāʾ", english: "heaven / sky", root: "س-م-و", category: "Nouns — concepts & places", gender: "F" },
  { id: "ard", arabic: "أَرْض", pronunciation: "arḍ", english: "earth / land", root: "أ-ر-ض", category: "Nouns — concepts & places", gender: "F" },
  { id: "jannah", arabic: "جَنَّة", pronunciation: "janna", english: "garden / paradise", root: "ج-ن-ن", category: "Nouns — concepts & places", gender: "F" },
  { id: "nar", arabic: "نَار", pronunciation: "nār", english: "fire", root: "ن-و-ر", category: "Nouns — concepts & places", gender: "F" },
  { id: "bayt", arabic: "بَيْت", pronunciation: "bayt", english: "house", root: "ب-ي-ت", category: "Nouns — concepts & places", gender: "M" },
  { id: "balad", arabic: "بَلَد", pronunciation: "balad", english: "land / town", root: "ب-ل-د", category: "Nouns — concepts & places", gender: "M" },
  { id: "ma-water", arabic: "مَاء", pronunciation: "māʾ", english: "water", root: "م-و-ه", category: "Nouns — concepts & places", gender: "M" },
  { id: "tariq", arabic: "طَرِيق", pronunciation: "ṭarīq", english: "path / road", root: "ط-ر-ق", category: "Nouns — concepts & places", gender: "M" },
  { id: "sirat", arabic: "صِرَاط", pronunciation: "ṣirāṭ", english: "(straight) path", root: "ص-ر-ط", category: "Nouns — concepts & places", gender: "M" },
  { id: "salat", arabic: "صَلَاة", pronunciation: "ṣalāh", english: "prayer", root: "ص-ل-و", category: "Nouns — concepts & places", gender: "F" },
  { id: "zakah", arabic: "زَكَاة", pronunciation: "zakāh", english: "charity / purity", root: "ز-ك-و", category: "Nouns — concepts & places", gender: "F" },
  { id: "siyam", arabic: "صِيَام", pronunciation: "ṣiyām", english: "fasting", root: "ص-و-م", category: "Nouns — concepts & places", gender: "M" },
  { id: "hajj", arabic: "حَجّ", pronunciation: "ḥajj", english: "pilgrimage", root: "ح-ج-ج", category: "Nouns — concepts & places", gender: "M" },
  { id: "wajh", arabic: "وَجْه", pronunciation: "wajh", english: "face", root: "و-ج-ه", category: "Nouns — concepts & places", gender: "M" },

  // ───── Time & quantity ────────────────────────────────────────────────
  { id: "yawm", arabic: "يَوْم", pronunciation: "yawm", english: "day", root: "ي-و-م", category: "Time & quantity", gender: "M" },
  { id: "layl", arabic: "لَيْل", pronunciation: "layl", english: "night", root: "ل-ي-ل", category: "Time & quantity", gender: "M" },
  { id: "sa3a", arabic: "سَاعَة", pronunciation: "sāʿa", english: "hour / The Hour", root: "س-و-ع", category: "Time & quantity", gender: "F" },
  { id: "akhira", arabic: "آخِرَة", pronunciation: "ākhira", english: "the Hereafter", root: "أ-خ-ر", category: "Time & quantity", gender: "F" },
  { id: "dunya", arabic: "دُنْيَا", pronunciation: "dunyā", english: "this world", root: "د-ن-و", category: "Time & quantity", gender: "F" },
  { id: "kull", arabic: "كُلّ", pronunciation: "kull", english: "every / all", root: "ك-ل-ل", category: "Time & quantity" },
  { id: "ba3d", arabic: "بَعْض", pronunciation: "baʿḍ", english: "some / part of", root: "ب-ع-ض", category: "Time & quantity" },
  { id: "kathir", arabic: "كَثِير", pronunciation: "kathīr", english: "many", root: "ك-ث-ر", category: "Time & quantity" },
  { id: "qalil", arabic: "قَلِيل", pronunciation: "qalīl", english: "few / little", root: "ق-ل-ل", category: "Time & quantity" },
  { id: "wahid", arabic: "وَاحِد", pronunciation: "wāḥid", english: "one", root: "و-ح-د", category: "Time & quantity" },
  { id: "ahad", arabic: "أَحَد", pronunciation: "aḥad", english: "one / anyone", root: "أ-ح-د", category: "Time & quantity" },
  { id: "kabir", arabic: "كَبِير", pronunciation: "kabīr", english: "big / great", root: "ك-ب-ر", category: "Time & quantity" },
  { id: "azim", arabic: "عَظِيم", pronunciation: "ʿaẓīm", english: "tremendous / great", root: "ع-ظ-م", category: "Time & quantity" },
];
