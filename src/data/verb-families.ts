export const VERB_FORM_KEYS = ["past", "present", "command", "masdar"] as const;

export type VerbFormKey = (typeof VERB_FORM_KEYS)[number];

export interface VerbForm {
  arabic: string;
  transliteration: string;
  english: string;
}

export interface VerbSourceExample {
  kind: "quran" | "hadith";
  reference: string;
  /** Hadith grade as reported by the linked collection; omitted for Qur'an. */
  grade?: string;
  arabic: string;
  transliteration: string;
  english: string;
  /** The inflected form learners should notice inside the example. */
  focusArabic: string;
  url: string;
  note?: string;
}

export interface VerbFamily {
  id: string;
  root: string;
  meaning: string;
  forms: Record<VerbFormKey, VerbForm>;
  /** Opposites are optional: not every verb has one natural, useful opposite. */
  opposite?: {
    arabic: string;
    transliteration: string;
    english: string;
    familyId?: string;
  };
  relatedNameOfAllah?: {
    arabic: string;
    transliteration: string;
    english: string;
    href: string;
  };
  examples: VerbSourceExample[];
  usageNote?: string;
}

/**
 * A deliberately curated first deck. The four family forms follow the class
 * tables; Qur'anic examples are checked against Quranic Arabic Corpus
 * morphology and link to the complete verse on Quran.com.
 *
 * The English renderings below are concise learning glosses written for this
 * site rather than copied verse translations.
 */
export const VERB_FAMILIES: VerbFamily[] = [
  {
    id: "tafaddala",
    root: "ف-ض-ل",
    meaning: "to be gracious; to proceed",
    forms: {
      past: { arabic: "تَفَضَّلَ", transliteration: "tafaḍḍala", english: "he was gracious / proceeded" },
      present: { arabic: "يَتَفَضَّلُ", transliteration: "yatafaḍḍalu", english: "he proceeds" },
      command: { arabic: "تَفَضَّلْ", transliteration: "tafaḍḍal", english: "please / go ahead!" },
      masdar: { arabic: "تَفَضُّل", transliteration: "tafaḍḍul", english: "graciousness" },
    },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 23:24",
        arabic: "يُرِيدُ أَن يَتَفَضَّلَ عَلَيْكُمْ",
        transliteration: "yurīdu an yatafaḍḍala ʿalaykum",
        english: "He wants to assert his superiority over you.",
        focusArabic: "يَتَفَضَّلَ",
        url: "https://quran.com/23/24",
        note: "In this verse the form means to claim or assert superiority. The everyday command تَفَضَّلْ is the courteous ‘please / go ahead.’",
      },
    ],
    usageNote: "The command is a common expression of courtesy and respect.",
  },
  {
    id: "baqiya",
    root: "ب-ق-ي",
    meaning: "to remain; to stay",
    forms: {
      past: { arabic: "بَقِيَ", transliteration: "baqiya", english: "he remained" },
      present: { arabic: "يَبْقَى", transliteration: "yabqā", english: "he remains" },
      command: { arabic: "اِبْقَ", transliteration: "ibqa", english: "remain! / stay!" },
      masdar: { arabic: "بَقَاء", transliteration: "baqāʾ", english: "remaining / permanence" },
    },
    opposite: { arabic: "فَنِيَ", transliteration: "faniya", english: "to pass away / perish" },
    relatedNameOfAllah: {
      arabic: "الْبَاقِي",
      transliteration: "al-Bāqī",
      english: "The Everlasting",
      href: "/vocabulary/names-of-allah#al-baqi",
    },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 55:27",
        arabic: "وَيَبْقَىٰ وَجْهُ رَبِّكَ ذُو الْجَلَالِ وَالْإِكْرَامِ",
        transliteration: "wa-yabqā wajhu rabbika dhū al-jalāli wa-l-ikrām",
        english: "And your Lord—Possessor of Majesty and Honour—will remain.",
        focusArabic: "وَيَبْقَىٰ",
        url: "https://quran.com/55/27",
      },
    ],
  },
  {
    id: "aata",
    root: "ع-ط-و",
    meaning: "to give",
    forms: {
      past: { arabic: "أَعْطَى", transliteration: "aʿṭā", english: "he gave" },
      present: { arabic: "يُعْطِي", transliteration: "yuʿṭī", english: "he gives" },
      command: { arabic: "أَعْطِ", transliteration: "aʿṭi", english: "give!" },
      masdar: { arabic: "إِعْطَاء", transliteration: "iʿṭāʾ", english: "giving" },
    },
    opposite: { arabic: "أَخَذَ", transliteration: "akhadha", english: "to take", familyId: "akhadha" },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 108:1",
        arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
        transliteration: "innā aʿṭaynāka al-kawthar",
        english: "Indeed, We have given you al-Kawthar.",
        focusArabic: "أَعْطَيْنَاكَ",
        url: "https://quran.com/108/1",
      },
    ],
  },
  {
    id: "akhadha",
    root: "أ-خ-ذ",
    meaning: "to take",
    forms: {
      past: { arabic: "أَخَذَ", transliteration: "akhadha", english: "he took" },
      present: { arabic: "يَأْخُذُ", transliteration: "yaʾkhudhu", english: "he takes" },
      command: { arabic: "خُذْ", transliteration: "khudh", english: "take!" },
      masdar: { arabic: "أَخْذ", transliteration: "akhdh", english: "taking" },
    },
    opposite: { arabic: "أَعْطَى", transliteration: "aʿṭā", english: "to give", familyId: "aata" },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 2:255",
        arabic: "لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
        transliteration: "lā taʾkhudhuhu sinatun wa-lā nawmun",
        english: "Neither drowsiness nor sleep overtakes Him.",
        focusArabic: "تَأْخُذُهُ",
        url: "https://quran.com/2/255",
      },
    ],
  },
  {
    id: "dhahaba",
    root: "ذ-ه-ب",
    meaning: "to go",
    forms: {
      past: { arabic: "ذَهَبَ", transliteration: "dhahaba", english: "he went" },
      present: { arabic: "يَذْهَبُ", transliteration: "yadhhabu", english: "he goes" },
      command: { arabic: "اِذْهَبْ", transliteration: "idhhab", english: "go!" },
      masdar: { arabic: "ذَهَاب", transliteration: "dhahāb", english: "going" },
    },
    opposite: { arabic: "جَاءَ", transliteration: "jāʾa", english: "to come" },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 12:15",
        arabic: "فَلَمَّا ذَهَبُوا بِهِ",
        transliteration: "fa-lammā dhahabū bihi",
        english: "So when they took him away…",
        focusArabic: "ذَهَبُوا",
        url: "https://quran.com/12/15",
        note: "With بِهِ, the verb carries the contextual sense ‘they took him away.’",
      },
    ],
  },
  {
    id: "qaraa",
    root: "ق-ر-أ",
    meaning: "to read; to recite",
    forms: {
      past: { arabic: "قَرَأَ", transliteration: "qaraʾa", english: "he read / recited" },
      present: { arabic: "يَقْرَأُ", transliteration: "yaqraʾu", english: "he reads / recites" },
      command: { arabic: "اِقْرَأْ", transliteration: "iqraʾ", english: "read! / recite!" },
      masdar: { arabic: "قِرَاءَة", transliteration: "qirāʾah", english: "reading / recitation" },
    },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 16:98",
        arabic: "فَإِذَا قَرَأْتَ الْقُرْآنَ فَاسْتَعِذْ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        transliteration: "fa-idhā qaraʾta al-qurʾāna fa-staʿidh billāhi mina ash-shayṭāni ar-rajīm",
        english: "When you recite the Qur’an, seek refuge in Allah from Satan, the accursed.",
        focusArabic: "قَرَأْتَ",
        url: "https://quran.com/16/98",
      },
    ],
  },
  {
    id: "samia",
    root: "س-م-ع",
    meaning: "to hear",
    forms: {
      past: { arabic: "سَمِعَ", transliteration: "samiʿa", english: "he heard" },
      present: { arabic: "يَسْمَعُ", transliteration: "yasmaʿu", english: "he hears" },
      command: { arabic: "اِسْمَعْ", transliteration: "ismaʿ", english: "listen!" },
      masdar: { arabic: "سَمَاع", transliteration: "samāʿ", english: "hearing / listening" },
    },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 58:1",
        arabic: "قَدْ سَمِعَ اللَّهُ قَوْلَ الَّتِي تُجَادِلُكَ فِي زَوْجِهَا",
        transliteration: "qad samiʿa Allāhu qawla allatī tujādiluka fī zawjihā",
        english: "Allah has certainly heard the words of the woman who disputed with you concerning her husband.",
        focusArabic: "سَمِعَ",
        url: "https://quran.com/58/1",
      },
    ],
  },
  {
    id: "fataha",
    root: "ف-ت-ح",
    meaning: "to open; to grant victory",
    forms: {
      past: { arabic: "فَتَحَ", transliteration: "fataḥa", english: "he opened" },
      present: { arabic: "يَفْتَحُ", transliteration: "yaftaḥu", english: "he opens" },
      command: { arabic: "اِفْتَحْ", transliteration: "iftaḥ", english: "open!" },
      masdar: { arabic: "فَتْح", transliteration: "fatḥ", english: "opening / victory" },
    },
    opposite: { arabic: "أَغْلَقَ", transliteration: "aghlaqa", english: "to close" },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 48:1",
        arabic: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُبِينًا",
        transliteration: "innā fataḥnā laka fatḥan mubīnan",
        english: "Indeed, We have granted you a clear victory.",
        focusArabic: "فَتَحْنَا",
        url: "https://quran.com/48/1",
        note: "The root’s concrete sense is ‘open’; in this verse فَتْح means victory or conquest.",
      },
    ],
  },
  {
    id: "dakhala",
    root: "د-خ-ل",
    meaning: "to enter",
    forms: {
      past: { arabic: "دَخَلَ", transliteration: "dakhala", english: "he entered" },
      present: { arabic: "يَدْخُلُ", transliteration: "yadkhulu", english: "he enters" },
      command: { arabic: "اُدْخُلْ", transliteration: "udkhul", english: "enter!" },
      masdar: { arabic: "دُخُول", transliteration: "dukhūl", english: "entering" },
    },
    opposite: { arabic: "خَرَجَ", transliteration: "kharaja", english: "to exit" },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 110:2",
        arabic: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا",
        transliteration: "wa-raʾayta an-nāsa yadkhulūna fī dīni Allāhi afwājan",
        english: "And you see the people entering Allah’s religion in crowds.",
        focusArabic: "يَدْخُلُونَ",
        url: "https://quran.com/110/2",
      },
    ],
  },
  {
    id: "sabbaha",
    root: "س-ب-ح",
    meaning: "to glorify",
    forms: {
      past: { arabic: "سَبَّحَ", transliteration: "sabbaḥa", english: "he glorified" },
      present: { arabic: "يُسَبِّحُ", transliteration: "yusabbiḥu", english: "he glorifies" },
      command: { arabic: "سَبِّحْ", transliteration: "sabbiḥ", english: "glorify!" },
      masdar: { arabic: "تَسْبِيح", transliteration: "tasbīḥ", english: "glorification" },
    },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 87:1",
        arabic: "سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى",
        transliteration: "sabbiḥi isma rabbika al-aʿlā",
        english: "Glorify the name of your Lord, the Most High.",
        focusArabic: "سَبِّحِ",
        url: "https://quran.com/87/1",
      },
    ],
  },
  {
    id: "istaghfara",
    root: "غ-ف-ر",
    meaning: "to seek forgiveness",
    forms: {
      past: { arabic: "اِسْتَغْفَرَ", transliteration: "istaghfara", english: "he sought forgiveness" },
      present: { arabic: "يَسْتَغْفِرُ", transliteration: "yastaghfiru", english: "he seeks forgiveness" },
      command: { arabic: "اِسْتَغْفِرْ", transliteration: "istaghfir", english: "seek forgiveness!" },
      masdar: { arabic: "اِسْتِغْفَار", transliteration: "istighfār", english: "seeking forgiveness" },
    },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 110:3",
        arabic: "وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا",
        transliteration: "wa-staghfirhu innahu kāna tawwāban",
        english: "And ask His forgiveness; indeed, He is ever accepting of repentance.",
        focusArabic: "وَاسْتَغْفِرْهُ",
        url: "https://quran.com/110/3",
      },
    ],
  },
  {
    id: "qala",
    root: "ق-و-ل",
    meaning: "to say",
    forms: {
      past: { arabic: "قَالَ", transliteration: "qāla", english: "he said" },
      present: { arabic: "يَقُولُ", transliteration: "yaqūlu", english: "he says" },
      command: { arabic: "قُلْ", transliteration: "qul", english: "say!" },
      masdar: { arabic: "قَوْل", transliteration: "qawl", english: "saying / speech" },
    },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 2:30",
        arabic: "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ",
        transliteration: "wa-idh qāla rabbuka lil-malāʾikati",
        english: "And when your Lord said to the angels…",
        focusArabic: "قَالَ",
        url: "https://quran.com/2/30",
      },
    ],
  },
  {
    id: "faala",
    root: "ف-ع-ل",
    meaning: "to do",
    forms: {
      past: { arabic: "فَعَلَ", transliteration: "faʿala", english: "he did" },
      present: { arabic: "يَفْعَلُ", transliteration: "yafʿalu", english: "he does" },
      command: { arabic: "اِفْعَلْ", transliteration: "ifʿal", english: "do!" },
      masdar: { arabic: "فِعْل", transliteration: "fiʿl", english: "doing / action" },
    },
    examples: [
      {
        kind: "quran",
        reference: "Qur’an 105:1",
        arabic: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ",
        transliteration: "a-lam tara kayfa faʿala rabbuka bi-aṣḥābi al-fīl",
        english: "Have you not seen how your Lord dealt with the companions of the elephant?",
        focusArabic: "فَعَلَ",
        url: "https://quran.com/105/1",
      },
    ],
  },
];
