/**
 * Hand-curated reference data for the 28 letters of the Arabic alphabet.
 *
 * This data is intentionally NOT sourced from the Google Doc — it's
 * foundational script knowledge that should stay stable regardless of
 * curriculum changes.
 *
 * `isolated` / `initial` / `medial` / `final` are the four positional shapes.
 * For the 6 non-connecting letters, the initial/medial forms equal the
 * isolated/final forms respectively (these letters never attach to the left).
 */

export type Makhraj =
  | "throat-deep" // far throat
  | "throat-mid" // middle throat
  | "throat-near" // near throat
  | "tongue-deep" // deepest part of tongue
  | "tongue-middle" // middle of tongue
  | "tongue-edges" // sides / edges
  | "tongue-tip" // tip of tongue
  | "tongue-tip-upper" // tip against upper teeth
  | "lips"
  | "oral-cavity" // long-vowel / empty-cavity letters
  | "nasal"; // ghunna

export interface AlphabetLetter {
  /** Order in the standard alphabet (1-28). */
  order: number;
  /** Arabic name of the letter (e.g. "باء"). */
  nameArabic: string;
  /** Transliterated name (e.g. "bā'"). */
  name: string;
  /** IPA of the consonant sound (may be empty for alif, which is a vowel carrier). */
  ipa: string;
  /** A short, beginner-readable pronunciation cue. */
  pronunciationHint: string;
  /** Whether this letter is one of the 6 that never connect to the left. */
  nonConnector: boolean;
  /** Positional shapes. */
  forms: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  /** Sun or moon letter (for the al- assimilation rule). */
  sunOrMoon: "sun" | "moon";
  /** Primary articulation zone. */
  makhraj: Makhraj;
  /** A representative Qur'ānic word starting (or prominently featuring) this
   *  letter. Used for the example-word audio button — the Arabic key is
   *  looked up in the existing audio manifest (Wikimedia Commons). */
  example: {
    arabic: string;
    translit: string;
    gloss: string;
    /** Optional Qur'ān citation to upgrade the audio to a recitation. */
    citation?: string;
  };
}

export const ALPHABET: AlphabetLetter[] = [
  {
    order: 1,
    nameArabic: "ألف",
    name: "alif",
    ipa: "/ɑː/ or /ʔ/",
    pronunciationHint: "Long 'aa' when carrying madd; a soft glottal stop otherwise.",
    nonConnector: true,
    forms: { isolated: "ا", initial: "ا", medial: "ـا", final: "ـا" },
    sunOrMoon: "moon",
    makhraj: "oral-cavity",
    example: {
      arabic: "اللَّه",
      translit: "Allāh",
      gloss: "God",
    },
  },
  {
    order: 2,
    nameArabic: "باء",
    name: "bā'",
    ipa: "/b/",
    pronunciationHint: "Like English 'b'.",
    nonConnector: false,
    forms: { isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب" },
    sunOrMoon: "moon",
    makhraj: "lips",
    example: {
      arabic: "بِسْمِ",
      translit: "bismi",
      gloss: "in the name of",
      citation: "Qur'ān 1:1",
    },
  },
  {
    order: 3,
    nameArabic: "تاء",
    name: "tā'",
    ipa: "/t/",
    pronunciationHint: "Light 't'; tongue tip on the back of the upper teeth.",
    nonConnector: false,
    forms: { isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip",
    example: {
      arabic: "تَبَارَكَ",
      translit: "tabāraka",
      gloss: "blessed is",
      citation: "Qur'ān 67:1",
    },
  },
  {
    order: 4,
    nameArabic: "ثاء",
    name: "thā'",
    ipa: "/θ/",
    pronunciationHint: "'th' as in 'think'; tip of tongue between teeth.",
    nonConnector: false,
    forms: { isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip-upper",
    example: {
      arabic: "ثُمَّ",
      translit: "thumma",
      gloss: "then",
    },
  },
  {
    order: 5,
    nameArabic: "جيم",
    name: "jīm",
    ipa: "/d͡ʒ/",
    pronunciationHint: "Like 'j' in 'jam'.",
    nonConnector: false,
    forms: { isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج" },
    sunOrMoon: "moon",
    makhraj: "tongue-middle",
    example: {
      arabic: "جَنَّة",
      translit: "jannah",
      gloss: "garden / paradise",
    },
  },
  {
    order: 6,
    nameArabic: "حاء",
    name: "ḥā'",
    ipa: "/ħ/",
    pronunciationHint: "Heavy 'h' from the middle of the throat.",
    nonConnector: false,
    forms: { isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح" },
    sunOrMoon: "moon",
    makhraj: "throat-mid",
    example: {
      arabic: "حَمْدُ",
      translit: "ḥamdu",
      gloss: "praise",
      citation: "Qur'ān 1:2",
    },
  },
  {
    order: 7,
    nameArabic: "خاء",
    name: "khā'",
    ipa: "/x/",
    pronunciationHint: "Like German 'Bach' or Scottish 'loch' — from the near throat.",
    nonConnector: false,
    forms: { isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ" },
    sunOrMoon: "moon",
    makhraj: "throat-near",
    example: {
      arabic: "خَلَقَ",
      translit: "khalaqa",
      gloss: "created",
      citation: "Qur'ān 96:1",
    },
  },
  {
    order: 8,
    nameArabic: "دال",
    name: "dāl",
    ipa: "/d/",
    pronunciationHint: "Light 'd'; tongue tip on the back of the upper teeth.",
    nonConnector: true,
    forms: { isolated: "د", initial: "د", medial: "ـد", final: "ـد" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip",
    example: {
      arabic: "دِين",
      translit: "dīn",
      gloss: "religion / way of life",
    },
  },
  {
    order: 9,
    nameArabic: "ذال",
    name: "dhāl",
    ipa: "/ð/",
    pronunciationHint: "'th' as in 'this'; tongue tip between teeth.",
    nonConnector: true,
    forms: { isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip-upper",
    example: {
      arabic: "ذَٰلِكَ",
      translit: "dhālika",
      gloss: "that",
      citation: "Qur'ān 2:2",
    },
  },
  {
    order: 10,
    nameArabic: "راء",
    name: "rā'",
    ipa: "/r/",
    pronunciationHint: "Rolled / tapped 'r'; tongue tip flicks the ridge behind upper teeth.",
    nonConnector: true,
    forms: { isolated: "ر", initial: "ر", medial: "ـر", final: "ـر" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip",
    example: {
      arabic: "رَبّ",
      translit: "rabb",
      gloss: "Lord",
      citation: "Qur'ān 1:2",
    },
  },
  {
    order: 11,
    nameArabic: "زاي",
    name: "zāy",
    ipa: "/z/",
    pronunciationHint: "Like English 'z'.",
    nonConnector: true,
    forms: { isolated: "ز", initial: "ز", medial: "ـز", final: "ـز" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip",
    example: {
      arabic: "زَكَاة",
      translit: "zakāh",
      gloss: "obligatory charity",
    },
  },
  {
    order: 12,
    nameArabic: "سين",
    name: "sīn",
    ipa: "/s/",
    pronunciationHint: "Light 's' like English 'see'.",
    nonConnector: false,
    forms: { isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip",
    example: {
      arabic: "سَلَام",
      translit: "salām",
      gloss: "peace",
    },
  },
  {
    order: 13,
    nameArabic: "شين",
    name: "shīn",
    ipa: "/ʃ/",
    pronunciationHint: "'sh' as in 'ship'.",
    nonConnector: false,
    forms: { isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش" },
    sunOrMoon: "sun",
    makhraj: "tongue-middle",
    example: {
      arabic: "شَمْس",
      translit: "shams",
      gloss: "sun",
    },
  },
  {
    order: 14,
    nameArabic: "صاد",
    name: "ṣād",
    ipa: "/sˤ/",
    pronunciationHint: "Heavy / emphatic 's'; back of tongue raises toward the roof of the mouth.",
    nonConnector: false,
    forms: { isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip",
    example: {
      arabic: "صِرَاط",
      translit: "ṣirāṭ",
      gloss: "path",
      citation: "Qur'ān 1:6",
    },
  },
  {
    order: 15,
    nameArabic: "ضاد",
    name: "ḍād",
    ipa: "/dˤ/",
    pronunciationHint: "Heavy 'd'; unique to Arabic — the Qur'ān is called 'lughat ad-ḍād'.",
    nonConnector: false,
    forms: { isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض" },
    sunOrMoon: "sun",
    makhraj: "tongue-edges",
    example: {
      arabic: "ضَالِّين",
      translit: "ḍāllīn",
      gloss: "those who go astray",
      citation: "Qur'ān 1:7",
    },
  },
  {
    order: 16,
    nameArabic: "طاء",
    name: "ṭā'",
    ipa: "/tˤ/",
    pronunciationHint: "Heavy / emphatic 't'; back of tongue raised.",
    nonConnector: false,
    forms: { isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip",
    example: {
      arabic: "طَيِّب",
      translit: "ṭayyib",
      gloss: "pure / good",
    },
  },
  {
    order: 17,
    nameArabic: "ظاء",
    name: "ẓā'",
    ipa: "/ðˤ/",
    pronunciationHint: "Heavy 'dh'; emphatic version of dhāl.",
    nonConnector: false,
    forms: { isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip-upper",
    example: {
      arabic: "ظُلْم",
      translit: "ẓulm",
      gloss: "injustice",
    },
  },
  {
    order: 18,
    nameArabic: "عين",
    name: "ʿayn",
    ipa: "/ʕ/",
    pronunciationHint: "Voiced constriction in the middle of the throat — no English equivalent.",
    nonConnector: false,
    forms: { isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع" },
    sunOrMoon: "moon",
    makhraj: "throat-mid",
    example: {
      arabic: "عَبْد",
      translit: "ʿabd",
      gloss: "servant / worshipper",
    },
  },
  {
    order: 19,
    nameArabic: "غين",
    name: "ghayn",
    ipa: "/ɣ/",
    pronunciationHint: "Voiced version of khā' — a gargling sound near the throat.",
    nonConnector: false,
    forms: { isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ" },
    sunOrMoon: "moon",
    makhraj: "throat-near",
    example: {
      arabic: "غَفُور",
      translit: "ghafūr",
      gloss: "oft-forgiving",
    },
  },
  {
    order: 20,
    nameArabic: "فاء",
    name: "fā'",
    ipa: "/f/",
    pronunciationHint: "Like English 'f'.",
    nonConnector: false,
    forms: { isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف" },
    sunOrMoon: "moon",
    makhraj: "lips",
    example: {
      arabic: "فَلَق",
      translit: "falaq",
      gloss: "daybreak",
      citation: "Qur'ān 113:1",
    },
  },
  {
    order: 21,
    nameArabic: "قاف",
    name: "qāf",
    ipa: "/q/",
    pronunciationHint: "Deep 'k' from the uvula — further back than English 'k'.",
    nonConnector: false,
    forms: { isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق" },
    sunOrMoon: "moon",
    makhraj: "tongue-deep",
    example: {
      arabic: "قُرْآن",
      translit: "qur'ān",
      gloss: "the Qur'ān",
    },
  },
  {
    order: 22,
    nameArabic: "كاف",
    name: "kāf",
    ipa: "/k/",
    pronunciationHint: "Like English 'k'.",
    nonConnector: false,
    forms: { isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك" },
    sunOrMoon: "moon",
    makhraj: "tongue-deep",
    example: {
      arabic: "كِتَاب",
      translit: "kitāb",
      gloss: "book",
    },
  },
  {
    order: 23,
    nameArabic: "لام",
    name: "lām",
    ipa: "/l/",
    pronunciationHint: "Like English 'l'; heavy in the word 'Allāh' after fatḥa or ḍamma.",
    nonConnector: false,
    forms: { isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip",
    example: {
      arabic: "لَيْل",
      translit: "layl",
      gloss: "night",
    },
  },
  {
    order: 24,
    nameArabic: "ميم",
    name: "mīm",
    ipa: "/m/",
    pronunciationHint: "Like English 'm'.",
    nonConnector: false,
    forms: { isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم" },
    sunOrMoon: "moon",
    makhraj: "lips",
    example: {
      arabic: "مَلِك",
      translit: "malik",
      gloss: "king",
      citation: "Qur'ān 114:2",
    },
  },
  {
    order: 25,
    nameArabic: "نون",
    name: "nūn",
    ipa: "/n/",
    pronunciationHint: "Like English 'n'; tongue tip behind upper teeth.",
    nonConnector: false,
    forms: { isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن" },
    sunOrMoon: "sun",
    makhraj: "tongue-tip",
    example: {
      arabic: "نَبِيّ",
      translit: "nabī",
      gloss: "prophet",
    },
  },
  {
    order: 26,
    nameArabic: "هاء",
    name: "hā'",
    ipa: "/h/",
    pronunciationHint: "Light 'h' from the deep throat — like a breath.",
    nonConnector: false,
    forms: { isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه" },
    sunOrMoon: "moon",
    makhraj: "throat-deep",
    example: {
      arabic: "هُدَى",
      translit: "hudā",
      gloss: "guidance",
      citation: "Qur'ān 2:2",
    },
  },
  {
    order: 27,
    nameArabic: "واو",
    name: "wāw",
    ipa: "/w/ or /uː/",
    pronunciationHint: "English 'w' as a consonant; long 'oo' when carrying madd.",
    nonConnector: true,
    forms: { isolated: "و", initial: "و", medial: "ـو", final: "ـو" },
    sunOrMoon: "moon",
    makhraj: "lips",
    example: {
      arabic: "وَعْد",
      translit: "waʿd",
      gloss: "promise",
    },
  },
  {
    order: 28,
    nameArabic: "ياء",
    name: "yā'",
    ipa: "/j/ or /iː/",
    pronunciationHint: "English 'y' as a consonant; long 'ee' when carrying madd.",
    nonConnector: false,
    forms: { isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي" },
    sunOrMoon: "moon",
    makhraj: "tongue-middle",
    example: {
      arabic: "يَوْم",
      translit: "yawm",
      gloss: "day",
      citation: "Qur'ān 1:4",
    },
  },
];

/** The six letters that never connect to what follows them. */
export const NON_CONNECTORS: readonly string[] = ["ا", "د", "ذ", "ر", "ز", "و"];

/**
 * Two characters that aren't counted among the 28 base letters but are
 * essential for reading — hamza (the glottal stop, written on various
 * carriers) and alif-lām (the definite article "the", which interacts with
 * sun/moon letters).
 */
export interface AlphabetExtra {
  slug: "hamza" | "alif-lam";
  nameArabic: string;
  name: string;
  ipa: string;
  summary: string;
  /** Forms / realizations to show as small cells. */
  forms: Array<{
    glyph: string;
    label: string;
    note?: string;
  }>;
  example: {
    arabic: string;
    translit: string;
    gloss: string;
  };
  /** Short note about why it isn't in the 28. */
  asideTitle: string;
  asideBody: string;
}

export const ALPHABET_EXTRAS: readonly AlphabetExtra[] = [
  {
    slug: "hamza",
    nameArabic: "هَمْزة",
    name: "hamza",
    ipa: "/ʔ/",
    summary:
      "A glottal stop — the catch in the throat between the two syllables of 'uh-oh'. Hamza almost always sits on a 'seat' (alif, wāw, or yā') rather than standing alone; the seat is chosen by the surrounding vowels.",
    forms: [
      { glyph: "ء", label: "Standalone", note: "on the line" },
      { glyph: "أ", label: "On alif", note: "with fatḥa/ḍamma" },
      { glyph: "إ", label: "Under alif", note: "with kasra" },
      { glyph: "ؤ", label: "On wāw", note: "after ḍamma" },
      { glyph: "ئ", label: "On yā'", note: "after kasra" },
    ],
    example: {
      arabic: "شَيْء",
      translit: "shay'",
      gloss: "a thing",
    },
    asideTitle: "Why isn't it letter #29?",
    asideBody:
      "Hamza represents a sound, not a letter shape — it's written on top of (or underneath) one of the existing letters, so it doesn't take its own alphabetical slot. The standalone glyph ء exists for cases where no carrier is appropriate.",
  },
  {
    slug: "alif-lam",
    nameArabic: "ال التَّعْرِيف",
    name: "alif-lām (the definite article)",
    ipa: "/al-/ or /aʃ-, at-, .../",
    summary:
      "Two-letter prefix meaning 'the'. Before a moon letter it's pronounced 'al-' as written. Before a sun letter, the lām is silent and the following letter doubles (shadda) — e.g. اَلشَّمْس is read 'ash-shams', not 'al-shams'.",
    forms: [
      { glyph: "الْ", label: "Before moon letter", note: "lām pronounced" },
      { glyph: "اَلْقَمَر", label: "al-qamar", note: "the moon" },
      { glyph: "الـّ", label: "Before sun letter", note: "lām silent, shadda" },
      { glyph: "اَلشَّمْس", label: "ash-shams", note: "the sun" },
    ],
    example: {
      arabic: "اَلْحَمْدُ",
      translit: "al-ḥamdu",
      gloss: "the praise",
    },
    asideTitle: "Why isn't it a letter?",
    asideBody:
      "Alif-lām is a two-letter grammatical prefix, not an alphabet entry. It's listed here because reading the Qur'ān requires recognising when the lām is pronounced and when it's assimilated into the following sun letter. See the full sun/moon rule on its own page.",
  },
];

/** Helper: letter lookup by order (1-based). */
export function getLetter(order: number): AlphabetLetter | undefined {
  return ALPHABET.find((l) => l.order === order);
}
