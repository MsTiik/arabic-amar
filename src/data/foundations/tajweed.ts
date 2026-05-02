/**
 * Hand-curated reference data for beginner tajweed (Qur'ānic recitation) rules.
 *
 * Tajweed is the discipline of pronouncing Qur'ānic Arabic correctly. It's
 * a large science — here we cover only the rules a beginner actually needs
 * to start reading the muṣḥaf. Anything marked { advanced: true } is shown
 * behind a "Show advanced" toggle so it doesn't overwhelm a first-time
 * learner.
 *
 * Sources: Noorani Qaida, Madinah Arabic, Quranica, AlifBee tajweed primer.
 * Re-reviewed for beginner phrasing; every rule is explained in one plain
 * English sentence before any jargon.
 */

export type TajweedTier = "core" | "advanced";

/** Individual letter-trigger for rules like nūn-sākinah where each sub-rule
 *  depends on which letter follows. */
export interface TriggerLetter {
  arabic: string;
  translit: string;
}

/** A worked Qur'ānic example used to illustrate a single rule. */
export interface TajweedExample {
  arabic: string;
  translit: string;
  gloss: string;
  /** Optional Qur'ān citation (e.g. "Qur'ān 112:1"). */
  citation?: string;
  /** Which part of the word the rule fires on — used to highlight letters. */
  focus?: string;
}

export interface TajweedRule {
  /** Stable slug for links / anchors. */
  slug: string;
  /** Short English rule name (e.g. "Izhar"). */
  name: string;
  /** Arabic name of the rule. */
  nameArabic: string;
  /** One-line plain-English summary — the thing a beginner should memorise. */
  summary: string;
  /** Longer 2-3 sentence explanation. No unexplained jargon. */
  explanation: string;
  /** Letters that trigger this rule, if applicable. */
  triggerLetters?: TriggerLetter[];
  /** Up to ~3 worked examples. */
  examples: TajweedExample[];
}

export interface TajweedGroup {
  slug: string;
  title: string;
  titleArabic: string;
  /** Plain-English intro to the whole group. */
  intro: string;
  /** "What is the trigger?" e.g. "When a ن has a sukūn (نْ) or tanwīn ends a word". */
  trigger: string;
  rules: TajweedRule[];
  tier: TajweedTier;
}

/* ---------- Qalqalah ---------- */

const QALQALAH: TajweedGroup = {
  slug: "qalqalah",
  title: "Qalqalah — the bouncing letters",
  titleArabic: "القَلْقَلَة",
  intro:
    "Qalqalah means “vibration” or “echo.” Five specific letters — ق ط ب ج د — produce a small echo-bounce when they carry a sukūn. Think of it as a tiny drum-beat that leaves the letter vibrating after you say it.",
  trigger: "One of the 5 qalqalah letters (ق ط ب ج د) carries a sukūn or is the last letter you stop on.",
  tier: "core",
  rules: [
    {
      slug: "qalqalah-sughra",
      name: "Lesser Qalqalah",
      nameArabic: "قَلْقَلَة صُغْرَى",
      summary: "Small bounce — when a qalqalah letter has a sukūn in the middle of a word.",
      explanation:
        "You'll hear a short, sharp echo immediately after the letter. The bounce is small — don't add a full vowel, just a quick “uh” sound.",
      triggerLetters: [
        { arabic: "ق", translit: "qāf" },
        { arabic: "ط", translit: "ṭā'" },
        { arabic: "ب", translit: "bā'" },
        { arabic: "ج", translit: "jīm" },
        { arabic: "د", translit: "dāl" },
      ],
      examples: [
        {
          arabic: "يَقْطَعُونَ",
          translit: "yaqṭaʿūna",
          gloss: "they cut off",
          focus: "قْ",
        },
        {
          arabic: "يَدْخُلُونَ",
          translit: "yadkhulūna",
          gloss: "they enter",
          focus: "دْ",
        },
      ],
    },
    {
      slug: "qalqalah-kubra",
      name: "Greater Qalqalah",
      nameArabic: "قَلْقَلَة كُبْرَى",
      summary: "Bigger bounce — when the qalqalah letter is the last letter you stop on at the end of an ayah.",
      explanation:
        "Because you're stopping, the echo is more pronounced. Same 5 letters, just a stronger vibration because the word is ending.",
      examples: [
        {
          arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقْ",
          translit: "qul aʿūdhu bi-rabbi-l-falaq",
          gloss: "Say: I seek refuge with the Lord of the daybreak.",
          citation: "Qur'ān 113:1",
          focus: "قْ",
        },
        {
          arabic: "وَتَبَّ",
          translit: "wa-tabb",
          gloss: "and perished.",
          citation: "Qur'ān 111:1",
          focus: "بّْ",
        },
      ],
    },
  ],
};

/* ---------- Nūn Sākinah + Tanwīn ---------- */

const NUN_SAKINAH: TajweedGroup = {
  slug: "nun-sakinah",
  title: "Nūn sākinah & tanwīn rules",
  titleArabic: "أَحْكَام النُّون السَّاكِنَة وَالتَّنْوِين",
  intro:
    "A “nūn sākinah” is the letter ن with a sukūn on top of it (نْ). “Tanwīn” is the ‑an / ‑in / ‑un sound you get from the double-fatḥa / kasra / ḍamma at the end of a word — it's pronounced as if there's a hidden n at the end. Both behave the same way: what happens to the “n” sound depends entirely on the letter that comes next. There are 4 possible outcomes.",
  trigger: "When a نْ (nūn with sukūn) or a word ending in tanwīn (◌ً ◌ٍ ◌ٌ) is followed by another letter.",
  tier: "core",
  rules: [
    {
      slug: "izhar",
      name: "Izhar — say it clearly",
      nameArabic: "إِظْهَار",
      summary: "When one of the 6 throat letters follows, pronounce the n clearly with no change.",
      explanation:
        "The 6 throat letters (ء ه ع ح غ خ) are too far back in the mouth for the n to merge with them. So you just say the n normally, cleanly, without any modification.",
      triggerLetters: [
        { arabic: "ء", translit: "hamzah" },
        { arabic: "ه", translit: "hā'" },
        { arabic: "ع", translit: "ʿayn" },
        { arabic: "ح", translit: "ḥā'" },
        { arabic: "غ", translit: "ghayn" },
        { arabic: "خ", translit: "khā'" },
      ],
      examples: [
        {
          arabic: "مِنْ هَادٍ",
          translit: "min hādin",
          gloss: "any guide",
          focus: "نْ ه",
        },
        {
          arabic: "يَنْعِقُ",
          translit: "yanʿiqu",
          gloss: "cries out",
          focus: "نْ ع",
        },
      ],
    },
    {
      slug: "idgham",
      name: "Idghām — merge it in",
      nameArabic: "إِدْغَام",
      summary: "When one of 6 specific letters follows, the n sound melts into that letter.",
      explanation:
        "The 6 letters are ي ر م ل و ن. With 4 of them (ي ن م و) you keep a nasal hum (“ghunnah”) for about 2 beats. With ل and ر there's no hum — just a clean merge. You won't hear an n at all; it turns into the next letter.",
      triggerLetters: [
        { arabic: "ي", translit: "yā' — with ghunnah" },
        { arabic: "ر", translit: "rā' — no ghunnah" },
        { arabic: "م", translit: "mīm — with ghunnah" },
        { arabic: "ل", translit: "lām — no ghunnah" },
        { arabic: "و", translit: "wāw — with ghunnah" },
        { arabic: "ن", translit: "nūn — with ghunnah" },
      ],
      examples: [
        {
          arabic: "مَن يَعْمَلْ",
          translit: "may-yaʿmal (not: man yaʿmal)",
          gloss: "whoever does",
          focus: "نْ ي",
        },
        {
          arabic: "مِن رَّبِّهِمْ",
          translit: "mir-rabbihim (not: min rabbihim)",
          gloss: "from their Lord",
          focus: "نْ ر",
        },
      ],
    },
    {
      slug: "iqlab",
      name: "Iqlāb — flip it to an m",
      nameArabic: "إِقْلَاب",
      summary: "When a ب follows, the n sound flips into an m sound (with a slight nasal hum).",
      explanation:
        "There's only one letter that triggers iqlāb: ب. The n becomes m. You'll see a small م written above the ن in the muṣḥaf as a reminder. The hum lasts about 2 beats.",
      triggerLetters: [{ arabic: "ب", translit: "bā'" }],
      examples: [
        {
          arabic: "مِنۢ بَعْدِ",
          translit: "mim-baʿdi (not: min-baʿdi)",
          gloss: "after",
          focus: "نۢ ب",
        },
        {
          arabic: "سَمِيعٌۢ بَصِيرٌ",
          translit: "samīʿum-baṣīr",
          gloss: "All-Hearing, All-Seeing",
          focus: "◌ٌۢ ب",
        },
      ],
    },
    {
      slug: "ikhfa",
      name: "Ikhfā — hide it",
      nameArabic: "إِخْفَاء",
      summary: "When any of the remaining 15 letters follows, hide the n — don't say it fully, just hum nasally.",
      explanation:
        "15 letters trigger ikhfā (basically, everything not covered by the other 3 rules). The n doesn't fully sound — instead you make a nasal humming sound held for about 2 beats, with your tongue already in position for the next letter.",
      triggerLetters: [
        { arabic: "ت", translit: "tā'" },
        { arabic: "ث", translit: "thā'" },
        { arabic: "ج", translit: "jīm" },
        { arabic: "د", translit: "dāl" },
        { arabic: "ذ", translit: "dhāl" },
        { arabic: "ز", translit: "zāy" },
        { arabic: "س", translit: "sīn" },
        { arabic: "ش", translit: "shīn" },
        { arabic: "ص", translit: "ṣād" },
        { arabic: "ض", translit: "ḍād" },
        { arabic: "ط", translit: "ṭā'" },
        { arabic: "ظ", translit: "ẓā'" },
        { arabic: "ف", translit: "fā'" },
        { arabic: "ق", translit: "qāf" },
        { arabic: "ك", translit: "kāf" },
      ],
      examples: [
        {
          arabic: "مِن شَرِّ",
          translit: "min-sharri (nasalised n)",
          gloss: "from the evil of",
          citation: "Qur'ān 113:2",
          focus: "نْ ش",
        },
        {
          arabic: "مِنْ قَبْلُ",
          translit: "min-qablu (nasalised n)",
          gloss: "before",
          focus: "نْ ق",
        },
      ],
    },
  ],
};

/* ---------- Mīm Sākinah (advanced) ---------- */

const MIM_SAKINAH: TajweedGroup = {
  slug: "mim-sakinah",
  title: "Mīm sākinah rules",
  titleArabic: "أَحْكَام المِيم السَّاكِنَة",
  intro:
    "A “mīm sākinah” is the letter م with a sukūn on top (مْ). Just like the nūn sākinah, its sound behaves differently depending on the next letter — but it has simpler rules, only 3.",
  trigger: "When a مْ (mīm with sukūn) is followed by another letter.",
  tier: "advanced",
  rules: [
    {
      slug: "ikhfa-shafawi",
      name: "Ikhfā Shafawi — lip-hiding",
      nameArabic: "إِخْفَاء شَفَوِي",
      summary: "When ب follows, hide the m with a nasal hum held for about 2 beats.",
      explanation:
        "Only 1 letter triggers this: ب. Touch your lips lightly together for the m but don't fully close them — the sound becomes a nasal hum that blends into the ب. “Shafawi” means “of the lips.”",
      triggerLetters: [{ arabic: "ب", translit: "bā'" }],
      examples: [
        {
          arabic: "تَرْمِيهِم بِحِجَارَةٍ",
          translit: "tarmīhim bi-ḥijārah",
          gloss: "pelting them with stones",
          citation: "Qur'ān 105:4",
        },
      ],
    },
    {
      slug: "idgham-shafawi",
      name: "Idghām Shafawi — lip-merging",
      nameArabic: "إِدْغَام شَفَوِي",
      summary: "When م follows م, merge the two into a single doubled م with a hum.",
      explanation:
        "Only triggered by م itself. Two mīms in a row merge into one long nasal m, held for about 2 beats.",
      triggerLetters: [{ arabic: "م", translit: "mīm" }],
      examples: [
        {
          arabic: "لَهُم مَّا",
          translit: "lahum-mā",
          gloss: "they will have",
        },
      ],
    },
    {
      slug: "izhar-shafawi",
      name: "Izhar Shafawi — lip-clarity",
      nameArabic: "إِظْهَار شَفَوِي",
      summary: "For all other 26 letters, say the م clearly with no change.",
      explanation:
        "Anything except ب and م — just pronounce the m normally with your lips fully closed. No hum, no merge. Pay special attention when ف or و comes next since those are also lip-sounds and learners sometimes let the m blur.",
      examples: [
        {
          arabic: "هُمْ فِيهَا",
          translit: "hum fīhā",
          gloss: "they, in it",
        },
      ],
    },
  ],
};

/* ---------- Heavy / Light (advanced) ---------- */

const HEAVY_LIGHT: TajweedGroup = {
  slug: "tafkhim-tarqiq",
  title: "Heavy vs light letters",
  titleArabic: "التَّفْخِيم وَالتَّرْقِيق",
  intro:
    "Arabic letters split into two pronunciation “weights.” Heavy letters (tafkhīm) are pronounced with the back of the tongue raised — they sound full and resonant. Light letters (tarqīq) are pronounced with the tongue relaxed — they sound thin and sharp. Getting this right is what makes recitation sound authentically Arabic instead of flat.",
  trigger: "Always — every letter has a default weight, and a few letters change weight depending on the vowel they carry.",
  tier: "advanced",
  rules: [
    {
      slug: "always-heavy",
      name: "Always heavy (7 letters)",
      nameArabic: "حُرُوف الاسْتِعْلَاء",
      summary: "خ ص ض غ ط ق ظ are always pronounced heavy, no matter their vowel.",
      explanation:
        "Memorise them as the mnemonic “khuṣṣa ḍaghṭin qiẓ” (خصّ ضغط قظ). Raise the back of your tongue toward the roof of your mouth — the sound becomes full and round. These are sometimes called the “elevated” letters.",
      triggerLetters: [
        { arabic: "خ", translit: "khā'" },
        { arabic: "ص", translit: "ṣād" },
        { arabic: "ض", translit: "ḍād" },
        { arabic: "غ", translit: "ghayn" },
        { arabic: "ط", translit: "ṭā'" },
        { arabic: "ق", translit: "qāf" },
        { arabic: "ظ", translit: "ẓā'" },
      ],
      examples: [
        {
          arabic: "ٱلصِّرَاطَ",
          translit: "aṣ-ṣirāṭa",
          gloss: "the path",
          citation: "Qur'ān 1:6",
        },
        {
          arabic: "قُلْ",
          translit: "qul",
          gloss: "say",
        },
      ],
    },
    {
      slug: "conditional-weight",
      name: "Conditional: ر ل ا",
      nameArabic: "الحُرُوف المُعَلَّقَة",
      summary: "ر (rā'), ل in “Allāh”, and alif change weight based on the vowel.",
      explanation:
        "• ر is heavy with fatḥa or ḍamma (رَ رُ رْا), light with kasra (رِ).  • ل is only heavy inside the word “Allāh” when it follows a fatḥa or ḍamma (قَالَ ٱللَّهُ), light when it follows a kasra (بِٱللَّهِ).  • alif inherits the weight of the letter before it.",
      examples: [
        {
          arabic: "رَبِّ",
          translit: "rabbi — heavy ر",
          gloss: "my Lord",
        },
        {
          arabic: "رِجَالٌ",
          translit: "rijālun — light ر",
          gloss: "men",
        },
      ],
    },
    {
      slug: "always-light",
      name: "Always light",
      nameArabic: "حُرُوف الاسْتِفَال",
      summary: "Everything else (18 letters) is always light — tongue relaxed.",
      explanation:
        "The remaining letters are never heavy. Keep your tongue flat and forward; the sound should be thin and crisp. If you start to “darken” these letters you'll sound like you're over-pronouncing.",
      examples: [
        {
          arabic: "بِسْمِ",
          translit: "bismi — all light",
          gloss: "in the name of",
        },
      ],
    },
  ],
};

export const TAJWEED_GROUPS: TajweedGroup[] = [
  QALQALAH,
  NUN_SAKINAH,
  MIM_SAKINAH,
  HEAVY_LIGHT,
];
