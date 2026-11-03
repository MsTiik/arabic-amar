import type {
  LevelTwoReading,
  LevelTwoReadingQuestion,
  LevelTwoReadingSentence,
  LevelTwoReadingToken,
  LevelTwoReadingTokenKind,
  LevelTwoReadingWord,
} from "@/data/level-two-lessons";

function w(
  arabic: string,
  transliteration: string,
  english: string,
  kind: LevelTwoReadingTokenKind,
  punctuationAfter?: string,
): LevelTwoReadingToken {
  return punctuationAfter
    ? { arabic, transliteration, english, kind, punctuationAfter }
    : { arabic, transliteration, english, kind };
}

function line(
  id: string,
  english: string,
  transliteration: string,
  tokens: readonly LevelTwoReadingToken[],
): LevelTwoReadingSentence {
  return { id, english, transliteration, tokens };
}

const INSTRUCTION = line(
  "haram-instruction",
  "Read the paragraph and answer the following questions:",
  "Iqra’i l-fiqrata wa ajib ʿani l-as’ilati l-ātiyah:",
  [
    w("اِقْرَأِ", "iqra’i", "read (command)", "verb"),
    w("الْفِقْرَةَ", "l-fiqrata", "the paragraph", "noun"),
    w("وَأَجِبْ", "wa ajib", "and answer (command)", "verb"),
    w("عَنِ", "ʿani", "about / to", "connector"),
    w("الْأَسْئِلَةِ", "l-as’ilati", "the questions", "noun"),
    w("الْآتِيَةِ", "l-ātiyah", "the following", "adjective", ":"),
  ],
);

const READING: readonly LevelTwoReadingSentence[] = [
  line(
    "haram-spacious",
    "Al-Masjid al-Haram (the Sacred Mosque) in Makkah is spacious, big and beautiful.",
    "Al-masjidu l-ḥarāmu bi-makkata wāsiʿun wa kabīrun wa jamīl,",
    [
      w("الْمَسْجِدُ", "al-masjidu", "the mosque", "noun"),
      w("الْحَرَامُ", "l-ḥarāmu", "the sacred", "adjective"),
      w("بِمَكَّةَ", "bi-makkata", "in Makkah", "noun"),
      w("وَاسِعٌ", "wāsiʿun", "spacious, wide", "adjective"),
      w("وَكَبِيرٌ", "wa kabīrun", "and big", "adjective"),
      w("وَجَمِيلٌ", "wa jamīl", "and beautiful", "adjective", "،"),
    ],
  ),
  line(
    "haram-floors",
    "The mosque has four floors.",
    "yatakawwanu l-masjidu min arbaʿati ṭawābiq,",
    [
      w("يَتَكَوَّنُ", "yatakawwanu", "it consists", "verb"),
      w("الْمَسْجِدُ", "l-masjidu", "the mosque", "noun"),
      w("مِنْ", "min", "of", "connector"),
      w("أَرْبَعَةِ", "arbaʿati", "four", "noun"),
      w("طَوَابِقَ", "ṭawābiq", "floors", "noun", "،"),
    ],
  ),
  line(
    "haram-doors",
    "It also has many doors and bathrooms.",
    "wa lil-masjidi abwābun wa ḥammāmātun kathīrah,",
    [
      w("وَلِلْمَسْجِدِ", "wa lil-masjidi", "and the mosque has (lit. and to the mosque)", "noun"),
      w("أَبْوَابٌ", "abwābun", "doors", "noun"),
      w("وَحَمَّامَاتٌ", "wa ḥammāmātun", "and bathrooms", "noun"),
      w("كَثِيرَةٌ", "kathīrah", "many", "adjective", "،"),
    ],
  ),
  line(
    "haram-chandeliers",
    "There are big chandeliers in the ceiling of the mosque.",
    "fī saqfi l-masjidi thurayyātun kabīrah,",
    [
      w("فِي", "fī", "in", "connector"),
      w("سَقْفِ", "saqfi", "the ceiling (of)", "noun"),
      w("الْمَسْجِدِ", "l-masjidi", "the mosque", "noun"),
      w("ثُرَيَّاتٌ", "thurayyātun", "chandeliers", "noun"),
      w("كَبِيرَةٌ", "kabīrah", "big", "adjective", "،"),
    ],
  ),
  line(
    "haram-kaaba",
    "In the middle of the mosque is the Honoured Kaaba.",
    "wa fī wasaṭi l-masjidi l-kaʿbatu l-musharrafah,",
    [
      w("وَفِي", "wa fī", "and in", "connector"),
      w("وَسَطِ", "wasaṭi", "the middle (of)", "noun"),
      w("الْمَسْجِدِ", "l-masjidi", "the mosque", "noun"),
      w("الْكَعْبَةُ", "l-kaʿbatu", "the Kaaba", "noun"),
      w("الْمُشَرَّفَةُ", "l-musharrafah", "the honoured", "adjective", "،"),
    ],
  ),
  line(
    "haram-maqam",
    "In front of the Kaaba is the Station of Ibrahim, peace be upon him.",
    "wa amāma l-kaʿbati maqāmu ibrāhīma ʿalayhi s-salām,",
    [
      w("وَأَمَامَ", "wa amāma", "and in front of", "connector"),
      w("الْكَعْبَةِ", "l-kaʿbati", "the Kaaba", "noun"),
      w("مَقَامُ", "maqāmu", "the station (of)", "noun"),
      w("إِبْرَاهِيمَ", "ibrāhīma", "Ibrahim", "noun"),
      w("عَلَيْهِ", "ʿalayhi", "upon him", "connector"),
      w("السَّلَامُ", "s-salām", "peace", "noun", "،"),
    ],
  ),
  line(
    "haram-zamzam",
    "The well of Zamzam is beneath the Kaaba.",
    "wa bi’ru zamzama taḥta l-kaʿbah,",
    [
      w("وَبِئْرُ", "wa bi’ru", "and the well (of)", "noun"),
      w("زَمْزَمَ", "zamzama", "Zamzam", "noun"),
      w("تَحْتَ", "taḥta", "under, beneath", "connector"),
      w("الْكَعْبَةِ", "l-kaʿbah", "the Kaaba", "noun", "،"),
    ],
  ),
  line(
    "haram-hotels",
    "There are tall hotels around the mosque.",
    "wa ḥawla l-masjidi fanādiqu murtafiʿah,",
    [
      w("وَحَوْلَ", "wa ḥawla", "and around", "connector"),
      w("الْمَسْجِدِ", "l-masjidi", "the mosque", "noun"),
      w("فَنَادِقُ", "fanādiqu", "hotels", "noun"),
      w("مُرْتَفِعَةٌ", "murtafiʿah", "tall, high", "adjective", "،"),
    ],
  ),
  line(
    "haram-ahmad-room",
    "Ahmad took a room in a hotel near the Sacred Mosque.",
    "akhadha aḥmadu ghurfatan fī funduqin qarībin mina l-masjidi l-ḥarām,",
    [
      w("أَخَذَ", "akhadha", "he took", "verb"),
      w("أَحْمَدُ", "aḥmadu", "Ahmad", "noun"),
      w("غُرْفَةً", "ghurfatan", "a room", "noun"),
      w("فِي", "fī", "in", "connector"),
      w("فُنْدُقٍ", "funduqin", "a hotel", "noun"),
      w("قَرِيبٍ", "qarībin", "near, close", "adjective"),
      w("مِنَ", "mina", "to (lit. from)", "connector"),
      w("الْمَسْجِدِ", "l-masjidi", "the mosque", "noun"),
      w("الْحَرَامِ", "l-ḥarām", "the sacred", "adjective", "،"),
    ],
  ),
  line(
    "haram-fiftieth-floor",
    "The room is on the fiftieth floor.",
    "al-ghurfatu fi ṭ-ṭābiqi l-khamsīn,",
    [
      w("الْغُرْفَةُ", "al-ghurfatu", "the room", "noun"),
      w("فِي", "fi", "on / in", "connector"),
      w("الطَّابِقِ", "ṭ-ṭābiqi", "the floor", "noun"),
      w("الْخَمْسِينَ", "l-khamsīn", "the fiftieth (lit. the fifty)", "adjective", "،"),
    ],
  ),
  line(
    "haram-price",
    "The room costs one hundred and fifty riyals a day.",
    "thamanu l-ghurfati mi’atun wa khamsūna riyālan fi l-yawm,",
    [
      w("ثَمَنُ", "thamanu", "the price (of)", "noun"),
      w("الْغُرْفَةِ", "l-ghurfati", "the room", "noun"),
      w("مِائَةٌ", "mi’atun", "one hundred", "noun"),
      w("وَخَمْسُونَ", "wa khamsūna", "and fifty", "noun"),
      w("رِيَالًا", "riyālan", "riyals", "noun"),
      w("فِي", "fi", "per (lit. in)", "connector"),
      w("الْيَوْمِ", "l-yawm", "the day", "noun", "،"),
    ],
  ),
  line(
    "haram-pilgrims",
    "There are many pilgrims in the mosque.",
    "al-ḥujjāju kathīrūna fi l-masjid,",
    [
      w("الْحُجَّاجُ", "al-ḥujjāju", "the pilgrims", "noun"),
      w("كَثِيرُونَ", "kathīrūna", "many", "adjective"),
      w("فِي", "fi", "in", "connector"),
      w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun", "،"),
    ],
  ),
  line(
    "haram-tawaf",
    "Ahmad does tawaf around the Kaaba on the roof of the mosque.",
    "wa yaṭūfu aḥmadu ḥawla l-kaʿbati ʿalā saṭḥi l-masjid.",
    [
      w("وَيَطُوفُ", "wa yaṭūfu", "and he does tawaf (goes around)", "verb"),
      w("أَحْمَدُ", "aḥmadu", "Ahmad", "noun"),
      w("حَوْلَ", "ḥawla", "around", "connector"),
      w("الْكَعْبَةِ", "l-kaʿbati", "the Kaaba", "noun"),
      w("عَلَى", "ʿalā", "on", "connector"),
      w("سَطْحِ", "saṭḥi", "the roof (of)", "noun"),
      w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun", "."),
    ],
  ),
];

function question(
  id: string,
  sentenceId: string,
  q: LevelTwoReadingSentence,
  answer: LevelTwoReadingSentence,
): LevelTwoReadingQuestion {
  return { id, sentenceId, question: q, answer };
}

const QUESTIONS: readonly LevelTwoReadingQuestion[] = [
  question(
    "haram-q-where",
    "haram-spacious",
    line("haram-q-where-question", "Where is the Sacred Mosque?", "ayna l-masjidu l-ḥarām?", [
      w("أَيْنَ", "ayna", "where", "connector"),
      w("الْمَسْجِدُ", "l-masjidu", "the mosque", "noun"),
      w("الْحَرَامُ", "l-ḥarām", "the sacred", "adjective", "؟"),
    ]),
    line("haram-q-where-answer", "The Sacred Mosque is in Makkah.", "al-masjidu l-ḥarāmu bi-makkah.", [
      w("الْمَسْجِدُ", "al-masjidu", "the mosque", "noun"),
      w("الْحَرَامُ", "l-ḥarāmu", "the sacred", "adjective"),
      w("بِمَكَّةَ", "bi-makkah", "in Makkah", "noun", "."),
    ]),
  ),
  question(
    "haram-q-floors",
    "haram-floors",
    line("haram-q-floors-question", "How many floors does the mosque have?", "kam ṭābiqan fi l-masjid?", [
      w("كَمْ", "kam", "how many", "connector"),
      w("طَابِقًا", "ṭābiqan", "floor(s)", "noun"),
      w("فِي", "fi", "in", "connector"),
      w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun", "؟"),
    ]),
    line("haram-q-floors-answer", "The mosque consists of four floors.", "yatakawwanu l-masjidu min arbaʿati ṭawābiq.", [
      w("يَتَكَوَّنُ", "yatakawwanu", "it consists", "verb"),
      w("الْمَسْجِدُ", "l-masjidu", "the mosque", "noun"),
      w("مِنْ", "min", "of", "connector"),
      w("أَرْبَعَةِ", "arbaʿati", "four", "noun"),
      w("طَوَابِقَ", "ṭawābiq", "floors", "noun", "."),
    ]),
  ),
  question(
    "haram-q-ceiling",
    "haram-chandeliers",
    line("haram-q-ceiling-question", "What is in the ceiling of the mosque?", "mādhā fī saqfi l-masjid?", [
      w("مَاذَا", "mādhā", "what", "connector"),
      w("فِي", "fī", "in", "connector"),
      w("سَقْفِ", "saqfi", "the ceiling (of)", "noun"),
      w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun", "؟"),
    ]),
    line("haram-q-ceiling-answer", "In the ceiling of the mosque there are big chandeliers.", "fī saqfi l-masjidi thurayyātun kabīrah.", [
      w("فِي", "fī", "in", "connector"),
      w("سَقْفِ", "saqfi", "the ceiling (of)", "noun"),
      w("الْمَسْجِدِ", "l-masjidi", "the mosque", "noun"),
      w("ثُرَيَّاتٌ", "thurayyātun", "chandeliers", "noun"),
      w("كَبِيرَةٌ", "kabīrah", "big", "adjective", "."),
    ]),
  ),
  question(
    "haram-q-middle",
    "haram-kaaba",
    line("haram-q-middle-question", "What is in the middle of the mosque?", "mādhā fī wasaṭi l-masjid?", [
      w("مَاذَا", "mādhā", "what", "connector"),
      w("فِي", "fī", "in", "connector"),
      w("وَسَطِ", "wasaṭi", "the middle (of)", "noun"),
      w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun", "؟"),
    ]),
    line("haram-q-middle-answer", "In the middle of the mosque is the Honoured Kaaba.", "fī wasaṭi l-masjidi l-kaʿbatu l-musharrafah.", [
      w("فِي", "fī", "in", "connector"),
      w("وَسَطِ", "wasaṭi", "the middle (of)", "noun"),
      w("الْمَسْجِدِ", "l-masjidi", "the mosque", "noun"),
      w("الْكَعْبَةُ", "l-kaʿbatu", "the Kaaba", "noun"),
      w("الْمُشَرَّفَةُ", "l-musharrafah", "the honoured", "adjective", "."),
    ]),
  ),
  question(
    "haram-q-front",
    "haram-maqam",
    line("haram-q-front-question", "What is in front of the Kaaba?", "mādhā amāma l-kaʿbah?", [
      w("مَاذَا", "mādhā", "what", "connector"),
      w("أَمَامَ", "amāma", "in front of", "connector"),
      w("الْكَعْبَةِ", "l-kaʿbah", "the Kaaba", "noun", "؟"),
    ]),
    line("haram-q-front-answer", "In front of the Kaaba is the Station of Ibrahim, peace be upon him.", "amāma l-kaʿbati maqāmu ibrāhīma ʿalayhi s-salām.", [
      w("أَمَامَ", "amāma", "in front of", "connector"),
      w("الْكَعْبَةِ", "l-kaʿbati", "the Kaaba", "noun"),
      w("مَقَامُ", "maqāmu", "the station (of)", "noun"),
      w("إِبْرَاهِيمَ", "ibrāhīma", "Ibrahim", "noun"),
      w("عَلَيْهِ", "ʿalayhi", "upon him", "connector"),
      w("السَّلَامُ", "s-salām", "peace", "noun", "."),
    ]),
  ),
  question(
    "haram-q-zamzam",
    "haram-zamzam",
    line("haram-q-zamzam-question", "Where is the well of Zamzam?", "ayna bi’ru zamzam?", [
      w("أَيْنَ", "ayna", "where", "connector"),
      w("بِئْرُ", "bi’ru", "the well (of)", "noun"),
      w("زَمْزَمَ", "zamzam", "Zamzam", "noun", "؟"),
    ]),
    line("haram-q-zamzam-answer", "The well of Zamzam is beneath the Kaaba.", "bi’ru zamzama taḥta l-kaʿbah.", [
      w("بِئْرُ", "bi’ru", "the well (of)", "noun"),
      w("زَمْزَمَ", "zamzama", "Zamzam", "noun"),
      w("تَحْتَ", "taḥta", "under, beneath", "connector"),
      w("الْكَعْبَةِ", "l-kaʿbah", "the Kaaba", "noun", "."),
    ]),
  ),
  question(
    "haram-q-around",
    "haram-hotels",
    line("haram-q-around-question", "What is around the mosque?", "mādhā ḥawla l-masjid?", [
      w("مَاذَا", "mādhā", "what", "connector"),
      w("حَوْلَ", "ḥawla", "around", "connector"),
      w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun", "؟"),
    ]),
    line("haram-q-around-answer", "Around the mosque there are tall hotels.", "ḥawla l-masjidi fanādiqu murtafiʿah.", [
      w("حَوْلَ", "ḥawla", "around", "connector"),
      w("الْمَسْجِدِ", "l-masjidi", "the mosque", "noun"),
      w("فَنَادِقُ", "fanādiqu", "hotels", "noun"),
      w("مُرْتَفِعَةٌ", "murtafiʿah", "tall, high", "adjective", "."),
    ]),
  ),
  question(
    "haram-q-which-floor",
    "haram-fiftieth-floor",
    line("haram-q-which-floor-question", "Which floor is Ahmad’s room on?", "fī ayyi ṭābiqin ghurfatu aḥmad?", [
      w("فِي", "fī", "on / in", "connector"),
      w("أَيِّ", "ayyi", "which", "connector"),
      w("طَابِقٍ", "ṭābiqin", "floor", "noun"),
      w("غُرْفَةُ", "ghurfatu", "the room (of)", "noun"),
      w("أَحْمَدَ", "aḥmad", "Ahmad", "noun", "؟"),
    ]),
    line("haram-q-which-floor-answer", "Ahmad’s room is on the fiftieth floor.", "ghurfatu aḥmada fi ṭ-ṭābiqi l-khamsīn.", [
      w("غُرْفَةُ", "ghurfatu", "the room (of)", "noun"),
      w("أَحْمَدَ", "aḥmada", "Ahmad", "noun"),
      w("فِي", "fi", "on / in", "connector"),
      w("الطَّابِقِ", "ṭ-ṭābiqi", "the floor", "noun"),
      w("الْخَمْسِينَ", "l-khamsīn", "the fiftieth (lit. the fifty)", "adjective", "."),
    ]),
  ),
  question(
    "haram-q-price",
    "haram-price",
    line("haram-q-price-question", "How much does the room cost?", "kam thamanu l-ghurfah?", [
      w("كَمْ", "kam", "how much", "connector"),
      w("ثَمَنُ", "thamanu", "the price (of)", "noun"),
      w("الْغُرْفَةِ", "l-ghurfah", "the room", "noun", "؟"),
    ]),
    line("haram-q-price-answer", "The room costs one hundred and fifty riyals a day.", "thamanu l-ghurfati mi’atun wa khamsūna riyālan fi l-yawm.", [
      w("ثَمَنُ", "thamanu", "the price (of)", "noun"),
      w("الْغُرْفَةِ", "l-ghurfati", "the room", "noun"),
      w("مِائَةٌ", "mi’atun", "one hundred", "noun"),
      w("وَخَمْسُونَ", "wa khamsūna", "and fifty", "noun"),
      w("رِيَالًا", "riyālan", "riyals", "noun"),
      w("فِي", "fi", "per (lit. in)", "connector"),
      w("الْيَوْمِ", "l-yawm", "the day", "noun", "."),
    ]),
  ),
  question(
    "haram-q-tawaf",
    "haram-tawaf",
    line("haram-q-tawaf-question", "Where does Ahmad do tawaf?", "ayna yaṭūfu aḥmad?", [
      w("أَيْنَ", "ayna", "where", "connector"),
      w("يَطُوفُ", "yaṭūfu", "he does tawaf (goes around)", "verb"),
      w("أَحْمَدُ", "aḥmad", "Ahmad", "noun", "؟"),
    ]),
    line("haram-q-tawaf-answer", "Ahmad does tawaf around the Kaaba on the roof of the mosque.", "yaṭūfu aḥmadu ḥawla l-kaʿbati ʿalā saṭḥi l-masjid.", [
      w("يَطُوفُ", "yaṭūfu", "he does tawaf (goes around)", "verb"),
      w("أَحْمَدُ", "aḥmadu", "Ahmad", "noun"),
      w("حَوْلَ", "ḥawla", "around", "connector"),
      w("الْكَعْبَةِ", "l-kaʿbati", "the Kaaba", "noun"),
      w("عَلَى", "ʿalā", "on", "connector"),
      w("سَطْحِ", "saṭḥi", "the roof (of)", "noun"),
      w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun", "."),
    ]),
  ),
];

/** The vocabulary table supplied with the lesson sheet, in its original order. */
const WORD_LIST: readonly LevelTwoReadingWord[] = [
  { arabic: "اِقْرَأْ", transliteration: "iqra’", english: "read (command)" },
  { arabic: "الْفِقْرَةَ", transliteration: "al-fiqrah", english: "the paragraph" },
  { arabic: "وَ", transliteration: "wa", english: "and" },
  { arabic: "أَجِبْ", transliteration: "ajib", english: "answer (command)" },
  { arabic: "عَنْ", transliteration: "ʿan", english: "about / to" },
  { arabic: "الْأَسْئِلَةِ", transliteration: "al-as’ilah", english: "the questions" },
  { arabic: "الْآتِيَةِ", transliteration: "al-ātiyah", english: "the following" },
  { arabic: "الْمَسْجِدُ", transliteration: "al-masjid", english: "the mosque" },
  { arabic: "الْحَرَامُ", transliteration: "al-ḥarām", english: "the sacred" },
  { arabic: "بِـ", transliteration: "bi-", english: "in / at" },
  { arabic: "مَكَّةَ", transliteration: "makkah", english: "Makkah" },
  { arabic: "وَاسِعٌ", transliteration: "wāsiʿ", english: "spacious, wide" },
  { arabic: "كَبِيرٌ", transliteration: "kabīr", english: "big" },
  { arabic: "جَمِيلٌ", transliteration: "jamīl", english: "beautiful" },
  { arabic: "يَتَكَوَّنُ", transliteration: "yatakawwanu", english: "it consists (of)" },
  { arabic: "مِنْ", transliteration: "min", english: "of / from" },
  { arabic: "أَرْبَعَةِ", transliteration: "arbaʿah", english: "four" },
  { arabic: "طَوَابِقَ", transliteration: "ṭawābiq", english: "floors (sing. ṭābiq)" },
  { arabic: "لِـ", transliteration: "li-", english: "for / belonging to (lil-masjid = the mosque has)" },
  { arabic: "أَبْوَابٌ", transliteration: "abwāb", english: "doors (sing. bāb)" },
  { arabic: "حَمَّامَاتٌ", transliteration: "ḥammāmāt", english: "bathrooms, toilets" },
  { arabic: "كَثِيرَةٌ", transliteration: "kathīrah", english: "many (fem.)" },
  { arabic: "فِي", transliteration: "fī", english: "in" },
  { arabic: "سَقْفِ", transliteration: "saqf", english: "ceiling" },
  { arabic: "ثُرَيَّاتٌ", transliteration: "thurayyāt", english: "chandeliers (sing. thurayyā)" },
  { arabic: "كَبِيرَةٌ", transliteration: "kabīrah", english: "big (fem.)" },
  { arabic: "وَسَطِ", transliteration: "wasaṭ", english: "middle" },
  { arabic: "الْكَعْبَةُ", transliteration: "al-kaʿbah", english: "the Kaaba" },
  { arabic: "الْمُشَرَّفَةُ", transliteration: "al-musharrafah", english: "the honoured" },
  { arabic: "أَمَامَ", transliteration: "amāma", english: "in front of" },
  { arabic: "مَقَامُ", transliteration: "maqām", english: "station, standing place" },
  { arabic: "إِبْرَاهِيمَ", transliteration: "ibrāhīm", english: "Ibrahim" },
  { arabic: "عَلَيْهِ", transliteration: "ʿalayhi", english: "upon him" },
  { arabic: "السَّلَامُ", transliteration: "as-salām", english: "peace" },
  { arabic: "بِئْرُ", transliteration: "bi’r", english: "well" },
  { arabic: "زَمْزَمَ", transliteration: "zamzam", english: "Zamzam" },
  { arabic: "تَحْتَ", transliteration: "taḥta", english: "under, beneath" },
  { arabic: "حَوْلَ", transliteration: "ḥawla", english: "around" },
  { arabic: "فَنَادِقُ", transliteration: "fanādiq", english: "hotels (sing. funduq)" },
  { arabic: "مُرْتَفِعَةٌ", transliteration: "murtafiʿah", english: "tall, high" },
  { arabic: "أَخَذَ", transliteration: "akhadha", english: "he took" },
  { arabic: "أَحْمَدُ", transliteration: "aḥmad", english: "Ahmad" },
  { arabic: "غُرْفَةً", transliteration: "ghurfah", english: "a room" },
  { arabic: "فُنْدُقٍ", transliteration: "funduq", english: "a hotel" },
  { arabic: "قَرِيبٍ", transliteration: "qarīb", english: "near, close" },
  { arabic: "مِنَ", transliteration: "mina", english: "from (qarīb min = near to)" },
  { arabic: "الْغُرْفَةُ", transliteration: "al-ghurfah", english: "the room" },
  { arabic: "الطَّابِقِ", transliteration: "aṭ-ṭābiq", english: "the floor" },
  { arabic: "الْخَمْسِينَ", transliteration: "al-khamsīn", english: "the fiftieth (lit. the fifty)" },
  { arabic: "ثَمَنُ", transliteration: "thaman", english: "price" },
  { arabic: "مِائَةٌ", transliteration: "mi’ah", english: "hundred" },
  { arabic: "خَمْسُونَ", transliteration: "khamsūn", english: "fifty" },
  { arabic: "رِيَالًا", transliteration: "riyāl", english: "riyals" },
  { arabic: "الْيَوْمِ", transliteration: "al-yawm", english: "the day (fi l-yawm = per day)" },
  { arabic: "الْحُجَّاجُ", transliteration: "al-ḥujjāj", english: "the pilgrims (sing. ḥājj)" },
  { arabic: "كَثِيرُونَ", transliteration: "kathīrūn", english: "many (masc. pl.)" },
  { arabic: "يَطُوفُ", transliteration: "yaṭūfu", english: "he does tawaf, goes around" },
  { arabic: "عَلَى", transliteration: "ʿalā", english: "on" },
  { arabic: "سَطْحِ", transliteration: "saṭḥ", english: "roof (the top surface)" },
];

export const LEVEL_TWO_MASJID_AL_HARAM: LevelTwoReading = {
  slug: "masjid-al-haram",
  title: "The Sacred Mosque in Makkah",
  shortTitle: "Al-Masjid al-Haram",
  titleArabic: "الْمَسْجِدُ الْحَرَامُ",
  source: "Al-Masjid al-Haram reading sheet (Level 2, supplied November 2026)",
  reviewStatus: "normalised",
  instruction: INSTRUCTION,
  sentences: READING,
  english:
    "Al-Masjid al-Haram (the Sacred Mosque) in Makkah is spacious, big and beautiful. The mosque has four floors. It also has many doors and bathrooms. There are big chandeliers in the ceiling of the mosque. In the middle of the mosque is the Honoured Kaaba. In front of the Kaaba is the Station of Ibrahim, peace be upon him, and the well of Zamzam is beneath the Kaaba. There are tall hotels around the mosque. Ahmad took a room in a hotel near the Sacred Mosque. The room is on the fiftieth floor. The room costs one hundred and fifty riyals a day. There are many pilgrims in the mosque, and Ahmad does tawaf around the Kaaba on the roof of the mosque.",
  questions: QUESTIONS,
  wordList: WORD_LIST,
  notes: [
    "The sheet asks you to answer questions but did not list them; the ten questions here are written from the passage, one per key fact.",
    "As in the sheet’s transliteration, the case ending is dropped at each pause (comma or full stop), as you would when reading aloud.",
  ],
};
