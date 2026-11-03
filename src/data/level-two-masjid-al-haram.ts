import type {
  LevelTwoMatchPair,
  LevelTwoOrderItem,
  LevelTwoReading,
  LevelTwoReadingDrill,
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

const MASJID = w("الْمَسْجِدِ", "l-masjidi", "the mosque", "noun");
const HARAM_END = (punctuation: string) => w("الْحَرَامِ", "l-ḥarām", "the sacred", "adjective", punctuation);

const QUESTIONS_HEADING = line("haram-ex1-heading", "Exercises 1", "at-tadrībātu 1", [
  w("التَّدْرِيبَاتُ", "at-tadrībātu", "the exercises", "noun"),
  w("١", "1", "1", "noun"),
]);

const QUESTIONS: readonly LevelTwoReadingQuestion[] = [
  question(
    "haram-q-where",
    "haram-spacious",
    line("haram-q-where-question", "Where is al-Masjid al-Haram?", "ayna l-masjidu l-ḥarām?", [
      w("أَيْنَ", "ayna", "where", "connector"),
      w("الْمَسْجِدُ", "l-masjidu", "the mosque", "noun"),
      w("الْحَرَامُ", "l-ḥarām", "the sacred", "adjective", "؟"),
    ]),
    line("haram-q-where-answer", "Al-Masjid al-Haram is in Makkah.", "al-masjidu l-ḥarāmu bi-makkah.", [
      w("الْمَسْجِدُ", "al-masjidu", "the mosque", "noun"),
      w("الْحَرَامُ", "l-ḥarāmu", "the sacred", "adjective"),
      w("بِمَكَّةَ", "bi-makkah", "in Makkah", "noun", "."),
    ]),
  ),
  question(
    "haram-q-like",
    "haram-spacious",
    line("haram-q-like-question", "What is al-Masjid al-Haram like?", "kayfa l-masjidu l-ḥarām?", [
      w("كَيْفَ", "kayfa", "how / what … like", "connector"),
      w("الْمَسْجِدُ", "l-masjidu", "the mosque", "noun"),
      w("الْحَرَامُ", "l-ḥarām", "the sacred", "adjective", "؟"),
    ]),
    line("haram-q-like-answer", "Spacious, big and beautiful.", "wāsiʿun wa kabīrun wa jamīl.", [
      w("وَاسِعٌ", "wāsiʿun", "spacious, wide", "adjective"),
      w("وَكَبِيرٌ", "wa kabīrun", "and big", "adjective"),
      w("وَجَمِيلٌ", "wa jamīl", "and beautiful", "adjective", "."),
    ]),
  ),
  question(
    "haram-q-consists",
    "haram-floors",
    line("haram-q-consists-question", "What does al-Masjid al-Haram consist of?", "mimma yatakawwanu l-masjidu l-ḥarām?", [
      w("مِمَّ", "mimma", "of what (min + mā)", "connector"),
      w("يَتَكَوَّنُ", "yatakawwanu", "it consists", "verb"),
      w("الْمَسْجِدُ", "l-masjidu", "the mosque", "noun"),
      w("الْحَرَامُ", "l-ḥarām", "the sacred", "adjective", "؟"),
    ]),
    line("haram-q-consists-answer", "It consists of four floors.", "yatakawwanu min arbaʿati ṭawābiq.", [
      w("يَتَكَوَّنُ", "yatakawwanu", "it consists", "verb"),
      w("مِنْ", "min", "of", "connector"),
      w("أَرْبَعَةِ", "arbaʿati", "four", "noun"),
      w("طَوَابِقَ", "ṭawābiq", "floors", "noun", "."),
    ]),
  ),
  question(
    "haram-q-doors",
    "haram-doors",
    line("haram-q-doors-question", "How many doors and bathrooms does al-Masjid al-Haram have?", "kam bāban wa ḥammāman lil-masjidi l-ḥarām?", [
      w("كَمْ", "kam", "how many", "connector"),
      w("بَابًا", "bāban", "door(s)", "noun"),
      w("وَحَمَّامًا", "wa ḥammāman", "and bathroom(s)", "noun"),
      w("لِلْمَسْجِدِ", "lil-masjidi", "does the mosque have (lit. to the mosque)", "noun"),
      HARAM_END("؟"),
    ]),
    line("haram-q-doors-answer", "The mosque has many doors and bathrooms.", "lil-masjidi abwābun wa ḥammāmātun kathīrah.", [
      w("لِلْمَسْجِدِ", "lil-masjidi", "the mosque has (lit. to the mosque)", "noun"),
      w("أَبْوَابٌ", "abwābun", "doors", "noun"),
      w("وَحَمَّامَاتٌ", "wa ḥammāmātun", "and bathrooms", "noun"),
      w("كَثِيرَةٌ", "kathīrah", "many", "adjective", "."),
    ]),
  ),
  question(
    "haram-q-kaaba",
    "haram-kaaba",
    line("haram-q-kaaba-question", "Where is the Honoured Kaaba?", "ayna l-kaʿbatu l-musharrafah?", [
      w("أَيْنَ", "ayna", "where", "connector"),
      w("الْكَعْبَةُ", "l-kaʿbatu", "the Kaaba", "noun"),
      w("الْمُشَرَّفَةُ", "l-musharrafah", "the honoured", "adjective", "؟"),
    ]),
    line("haram-q-kaaba-answer", "In the middle of the mosque.", "fī wasaṭi l-masjid.", [
      w("فِي", "fī", "in", "connector"),
      w("وَسَطِ", "wasaṭi", "the middle (of)", "noun"),
      w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun", "."),
    ]),
  ),
  question(
    "haram-q-maqam",
    "haram-maqam",
    line("haram-q-maqam-question", "Where is the Station of Ibrahim, peace be upon him?", "ayna maqāmu ibrāhīma ʿalayhi s-salām?", [
      w("أَيْنَ", "ayna", "where", "connector"),
      w("مَقَامُ", "maqāmu", "the station (of)", "noun"),
      w("إِبْرَاهِيمَ", "ibrāhīma", "Ibrahim", "noun"),
      w("عَلَيْهِ", "ʿalayhi", "upon him", "connector"),
      w("السَّلَامُ", "s-salām", "peace", "noun", "؟"),
    ]),
    line("haram-q-maqam-answer", "In front of the Kaaba.", "amāma l-kaʿbah.", [
      w("أَمَامَ", "amāma", "in front of", "connector"),
      w("الْكَعْبَةِ", "l-kaʿbah", "the Kaaba", "noun", "."),
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
    line("haram-q-ceiling-answer", "Big chandeliers.", "thurayyātun kabīrah.", [
      w("ثُرَيَّاتٌ", "thurayyātun", "chandeliers", "noun"),
      w("كَبِيرَةٌ", "kabīrah", "big", "adjective", "."),
    ]),
  ),
  question(
    "haram-q-around",
    "haram-hotels",
    line("haram-q-around-question", "What is around al-Masjid al-Haram?", "mādhā ḥawla l-masjidi l-ḥarām?", [
      w("مَاذَا", "mādhā", "what", "connector"),
      w("حَوْلَ", "ḥawla", "around", "connector"),
      MASJID,
      HARAM_END("؟"),
    ]),
    line("haram-q-around-answer", "Tall hotels.", "fanādiqu murtafiʿah.", [
      w("فَنَادِقُ", "fanādiqu", "hotels", "noun"),
      w("مُرْتَفِعَةٌ", "murtafiʿah", "tall, high", "adjective", "."),
    ]),
  ),
  question(
    "haram-q-took",
    "haram-ahmad-room",
    line("haram-q-took-question", "What did Ahmad take?", "mādhā akhadha aḥmad?", [
      w("مَاذَا", "mādhā", "what", "connector"),
      w("أَخَذَ", "akhadha", "he took", "verb"),
      w("أَحْمَدُ", "aḥmad", "Ahmad", "noun", "؟"),
    ]),
    line("haram-q-took-answer", "He took a room in a hotel near al-Masjid al-Haram.", "akhadha ghurfatan fī funduqin qarībin mina l-masjidi l-ḥarām.", [
      w("أَخَذَ", "akhadha", "he took", "verb"),
      w("غُرْفَةً", "ghurfatan", "a room", "noun"),
      w("فِي", "fī", "in", "connector"),
      w("فُنْدُقٍ", "funduqin", "a hotel", "noun"),
      w("قَرِيبٍ", "qarībin", "near, close", "adjective"),
      w("مِنَ", "mina", "to (lit. from)", "connector"),
      MASJID,
      HARAM_END("."),
    ]),
  ),
  question(
    "haram-q-room",
    "haram-fiftieth-floor",
    line("haram-q-room-question", "Where is Ahmad’s room?", "ayna ghurfatu aḥmad?", [
      w("أَيْنَ", "ayna", "where", "connector"),
      w("غُرْفَةُ", "ghurfatu", "the room (of)", "noun"),
      w("أَحْمَدَ", "aḥmad", "Ahmad", "noun", "؟"),
    ]),
    line("haram-q-room-answer", "On the fiftieth floor.", "fi ṭ-ṭābiqi l-khamsīn.", [
      w("فِي", "fi", "on / in", "connector"),
      w("الطَّابِقِ", "ṭ-ṭābiqi", "the floor", "noun"),
      w("الْخَمْسِينَ", "l-khamsīn", "the fiftieth (lit. the fifty)", "adjective", "."),
    ]),
  ),
  question(
    "haram-q-price",
    "haram-price",
    line("haram-q-price-question", "What is the price of the room?", "mā thamanu l-ghurfah?", [
      w("مَا", "mā", "what", "connector"),
      w("ثَمَنُ", "thamanu", "the price (of)", "noun"),
      w("الْغُرْفَةِ", "l-ghurfah", "the room", "noun", "؟"),
    ]),
    line("haram-q-price-answer", "One hundred and fifty riyals a day.", "mi’atun wa khamsūna riyālan fi l-yawm.", [
      w("مِائَةٌ", "mi’atun", "one hundred", "noun"),
      w("وَخَمْسُونَ", "wa khamsūna", "and fifty", "noun"),
      w("رِيَالًا", "riyālan", "riyals", "noun"),
      w("فِي", "fi", "per (lit. in)", "connector"),
      w("الْيَوْمِ", "l-yawm", "the day", "noun", "."),
    ]),
  ),
  question(
    "haram-q-why-roof",
    "haram-pilgrims",
    line("haram-q-why-roof-question", "Why does Ahmad do tawaf on the roof of al-Masjid al-Haram?", "li-mādhā yaṭūfu aḥmadu ʿalā saṭḥi l-masjidi l-ḥarām?", [
      w("لِمَاذَا", "li-mādhā", "why", "connector"),
      w("يَطُوفُ", "yaṭūfu", "he does tawaf (goes around)", "verb"),
      w("أَحْمَدُ", "aḥmadu", "Ahmad", "noun"),
      w("عَلَى", "ʿalā", "on", "connector"),
      w("سَطْحِ", "saṭḥi", "the roof (of)", "noun"),
      MASJID,
      HARAM_END("؟"),
    ]),
    line("haram-q-why-roof-answer", "Because there are many pilgrims in the mosque.", "li-anna l-ḥujjāja kathīrūna fi l-masjid.", [
      w("لِأَنَّ", "li-anna", "because", "connector"),
      w("الْحُجَّاجَ", "l-ḥujjāja", "the pilgrims", "noun"),
      w("كَثِيرُونَ", "kathīrūna", "many", "adjective"),
      w("فِي", "fi", "in", "connector"),
      w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun", "."),
    ]),
  ),
];

function heading(id: string, digit: string, number: string): LevelTwoReadingSentence {
  return line(id, `Exercises ${number}`, `at-tadrībātu ${number}`, [
    w("التَّدْرِيبَاتُ", "at-tadrībātu", "the exercises", "noun"),
    w(digit, number, number, "noun"),
  ]);
}

function pair(
  id: string,
  left: LevelTwoReadingSentence,
  right: LevelTwoReadingSentence,
  answer: LevelTwoReadingSentence,
  example = false,
): LevelTwoMatchPair {
  return example ? { id, left, right, answer, example } : { id, left, right, answer };
}

const MATCHING: LevelTwoReadingDrill = {
  kind: "match",
  id: "haram-match",
  label: "Matching",
  heading: heading("haram-match-heading", "٢", "2"),
  instruction: line(
    "haram-match-instruction",
    "Match the words that go together, and write the phrase as in the example.",
    "ṣil bayna l-mutanāsibayn, wa ktubi l-jumlata kamā fi l-mithāl.",
    [
      w("صِلْ", "ṣil", "connect / match (command)", "verb"),
      w("بَيْنَ", "bayna", "between", "connector"),
      w("الْمُتَنَاسِبَيْنِ", "l-mutanāsibayn", "the two that go together", "noun", "،"),
      w("وَاكْتُبِ", "wa ktubi", "and write (command)", "verb"),
      w("الْجُمْلَةَ", "l-jumlata", "the sentence / phrase", "noun"),
      w("كَمَا", "kamā", "as", "connector"),
      w("فِي", "fi", "in", "connector"),
      w("الْمِثَالِ", "l-mithāl", "the example", "noun", "."),
    ],
  ),
  pairs: [
    pair(
      "match-maqam",
      line("match-maqam-left", "the Station of Ibrahim, peace be upon him", "maqāmu ibrāhīma ʿalayhi s-salām", [
        w("مَقَامُ", "maqāmu", "the station (of)", "noun"),
        w("إِبْرَاهِيمَ", "ibrāhīma", "Ibrahim", "noun"),
        w("عَلَيْهِ", "ʿalayhi", "upon him", "connector"),
        w("السَّلَامُ", "s-salām", "peace", "noun"),
      ]),
      line("match-maqam-right", "in front of the Kaaba", "amāma l-kaʿbah", [
        w("أَمَامَ", "amāma", "in front of", "connector"),
        w("الْكَعْبَةِ", "l-kaʿbah", "the Kaaba", "noun"),
      ]),
      line("match-maqam-answer", "The Station of Ibrahim is in front of the Kaaba.", "maqāmu ibrāhīma amāma l-kaʿbah.", [
        w("مَقَامُ", "maqāmu", "the station (of)", "noun"),
        w("إِبْرَاهِيمَ", "ibrāhīma", "Ibrahim", "noun"),
        w("أَمَامَ", "amāma", "in front of", "connector"),
        w("الْكَعْبَةِ", "l-kaʿbah", "the Kaaba", "noun", "."),
      ]),
    ),
    pair(
      "match-masjid",
      line("match-masjid-left", "the mosque", "al-masjid", [w("الْمَسْجِدُ", "al-masjid", "the mosque", "noun")]),
      line("match-masjid-right", "the sacred", "al-ḥarām", [w("الْحَرَامُ", "al-ḥarām", "the sacred", "adjective")]),
      line("match-masjid-answer", "The Sacred Mosque.", "al-masjidu l-ḥarām.", [
        w("الْمَسْجِدُ", "al-masjidu", "the mosque", "noun"),
        w("الْحَرَامُ", "l-ḥarām", "the sacred", "adjective", "."),
      ]),
    ),
    pair(
      "match-kaaba",
      line("match-kaaba-left", "the Honoured Kaaba", "al-kaʿbatu l-musharrafah", [
        w("الْكَعْبَةُ", "al-kaʿbatu", "the Kaaba", "noun"),
        w("الْمُشَرَّفَةُ", "l-musharrafah", "the honoured", "adjective"),
      ]),
      line("match-kaaba-right", "the middle of the mosque", "wasaṭa l-masjid", [
        w("وَسَطَ", "wasaṭa", "in the middle (of)", "connector"),
        w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun"),
      ]),
      line("match-kaaba-answer", "The Honoured Kaaba is in the middle of the mosque.", "al-kaʿbatu l-musharrafatu wasaṭa l-masjid.", [
        w("الْكَعْبَةُ", "al-kaʿbatu", "the Kaaba", "noun"),
        w("الْمُشَرَّفَةُ", "l-musharrafatu", "the honoured", "adjective"),
        w("وَسَطَ", "wasaṭa", "in the middle (of)", "connector"),
        w("الْمَسْجِدِ", "l-masjid", "the mosque", "noun", "."),
      ]),
    ),
    pair(
      "match-fifty",
      line("match-fifty-left", "fifty", "khamsūn", [w("خَمْسُونَ", "khamsūn", "fifty", "noun")]),
      line("match-fifty-right", "riyals", "riyālan", [w("رِيَالًا", "riyālan", "riyals", "noun")]),
      line("match-fifty-answer", "Fifty riyals.", "khamsūna riyālā.", [
        w("خَمْسُونَ", "khamsūna", "fifty", "noun"),
        w("رِيَالًا", "riyālā", "riyals", "noun", "."),
      ]),
    ),
    pair(
      "match-zamzam",
      line("match-zamzam-left", "the well of Zamzam", "bi’ru zamzam", [
        w("بِئْرُ", "bi’ru", "the well (of)", "noun"),
        w("زَمْزَمَ", "zamzam", "Zamzam", "noun"),
      ]),
      line("match-zamzam-right", "under the Kaaba", "taḥta l-kaʿbah", [
        w("تَحْتَ", "taḥta", "under, beneath", "connector"),
        w("الْكَعْبَةِ", "l-kaʿbah", "the Kaaba", "noun"),
      ]),
      line("match-zamzam-answer", "The well of Zamzam is under the Kaaba.", "bi’ru zamzama taḥta l-kaʿbah.", [
        w("بِئْرُ", "bi’ru", "the well (of)", "noun"),
        w("زَمْزَمَ", "zamzama", "Zamzam", "noun"),
        w("تَحْتَ", "taḥta", "under, beneath", "connector"),
        w("الْكَعْبَةِ", "l-kaʿbah", "the Kaaba", "noun", "."),
      ]),
    ),
    pair(
      "match-four",
      line("match-four-left", "four", "arbaʿatu", [w("أَرْبَعَةُ", "arbaʿatu", "four", "noun")]),
      line("match-four-right", "floors", "ṭawābiqu", [w("طَوَابِقُ", "ṭawābiqu", "floors", "noun")]),
      line("match-four-answer", "Four floors.", "arbaʿatu ṭawābiq.", [
        w("أَرْبَعَةُ", "arbaʿatu", "four", "noun"),
        w("طَوَابِقَ", "ṭawābiq", "floors", "noun", "."),
      ]),
    ),
    pair(
      "match-hotels",
      line("match-hotels-left", "hotels", "fanādiqu", [w("فَنَادِقُ", "fanādiqu", "hotels", "noun")]),
      line("match-hotels-right", "tall", "murtafiʿah", [w("مُرْتَفِعَةٌ", "murtafiʿah", "tall, high", "adjective")]),
      line("match-hotels-answer", "Tall hotels.", "fanādiqu murtafiʿah.", [
        w("فَنَادِقُ", "fanādiqu", "hotels", "noun"),
        w("مُرْتَفِعَةٌ", "murtafiʿah", "tall, high", "adjective", "."),
      ]),
      true,
    ),
    pair(
      "match-consists",
      line("match-consists-left", "consists", "yatakawwanu", [w("يَتَكَوَّنُ", "yatakawwanu", "it consists", "verb")]),
      line("match-consists-right", "of / from", "min", [w("مِنْ", "min", "of / from", "connector")]),
      line("match-consists-answer", "Consists of.", "yatakawwanu min.", [
        w("يَتَكَوَّنُ", "yatakawwanu", "it consists", "verb"),
        w("مِنْ", "min", "of", "connector", "."),
      ]),
    ),
  ],
  rightOrder: [
    "match-zamzam",
    "match-four",
    "match-maqam",
    "match-hotels",
    "match-consists",
    "match-kaaba",
    "match-masjid",
    "match-fifty",
  ],
};

function order(
  id: string,
  jumbled: readonly LevelTwoReadingToken[],
  sequence: readonly number[],
  answer: LevelTwoReadingSentence,
): LevelTwoOrderItem {
  return { id, jumbled, order: sequence, answer };
}

const ORDERING: LevelTwoReadingDrill = {
  kind: "order",
  id: "haram-order",
  label: "Word order",
  heading: heading("haram-order-heading", "٣", "3"),
  instruction: line("haram-order-instruction", "Rearrange the words and make sentences.", "rattibi l-kalimāti wa kawwin jumalā.", [
    w("رَتِّبِ", "rattibi", "arrange (command)", "verb"),
    w("الْكَلِمَاتِ", "l-kalimāti", "the words", "noun"),
    w("وَكَوِّنْ", "wa kawwin", "and form (command)", "verb"),
    w("جُمَلًا", "jumalā", "sentences", "noun", "."),
  ]),
  items: [
    order(
      "order-mosques",
      [
        w("الْمَسَاجِدُ", "al-masājidu", "the mosques", "noun"),
        w("اللهِ", "llāh", "Allah", "noun"),
        w("بُيُوتُ", "buyūtu", "the houses (of)", "noun"),
      ],
      [0, 2, 1],
      line("order-mosques-answer", "The mosques are the houses of Allah.", "al-masājidu buyūtu llāh.", [
        w("الْمَسَاجِدُ", "al-masājidu", "the mosques", "noun"),
        w("بُيُوتُ", "buyūtu", "the houses (of)", "noun"),
        w("اللهِ", "llāh", "Allah", "noun", "."),
      ]),
    ),
    order(
      "order-garden",
      [
        w("ذَهَبْتُ", "dhahabtu", "I went", "verb"),
        w("حَدِيقَةِ", "ḥadīqati", "the garden (of)", "noun"),
        w("إِلَى", "ilā", "to", "connector"),
        w("الْمَنْزِلِ", "l-manzil", "the house", "noun"),
      ],
      [0, 2, 1, 3],
      line("order-garden-answer", "I went to the garden of the house.", "dhahabtu ilā ḥadīqati l-manzil.", [
        w("ذَهَبْتُ", "dhahabtu", "I went", "verb"),
        w("إِلَى", "ilā", "to", "connector"),
        w("حَدِيقَةِ", "ḥadīqati", "the garden (of)", "noun"),
        w("الْمَنْزِلِ", "l-manzil", "the house", "noun", "."),
      ]),
    ),
    order(
      "order-pilgrims",
      [
        w("حَوْلَ", "ḥawla", "around", "connector"),
        w("يَمْشِي", "yamshī", "walk(s)", "verb"),
        w("الْحُجَّاجُ", "l-ḥujjāju", "the pilgrims", "noun"),
        w("الْكَعْبَةِ", "l-kaʿbah", "the Kaaba", "noun"),
      ],
      [1, 2, 0, 3],
      line("order-pilgrims-answer", "The pilgrims walk around the Kaaba.", "yamshi l-ḥujjāju ḥawla l-kaʿbah.", [
        w("يَمْشِي", "yamshī", "walk(s)", "verb"),
        w("الْحُجَّاجُ", "l-ḥujjāju", "the pilgrims", "noun"),
        w("حَوْلَ", "ḥawla", "around", "connector"),
        w("الْكَعْبَةِ", "l-kaʿbah", "the Kaaba", "noun", "."),
      ]),
    ),
    order(
      "order-flat",
      [
        w("شَقَّتِي", "shaqqatī", "my flat", "noun"),
        w("الطَّابِقِ", "ṭ-ṭābiqi", "the floor", "noun"),
        w("فِي", "fi", "on / in", "connector"),
        w("الْخَامِسِ", "l-khāmis", "the fifth", "adjective"),
      ],
      [0, 2, 1, 3],
      line("order-flat-answer", "My flat is on the fifth floor.", "shaqqatī fi ṭ-ṭābiqi l-khāmis.", [
        w("شَقَّتِي", "shaqqatī", "my flat", "noun"),
        w("فِي", "fi", "on / in", "connector"),
        w("الطَّابِقِ", "ṭ-ṭābiqi", "the floor", "noun"),
        w("الْخَامِسِ", "l-khāmis", "the fifth", "adjective", "."),
      ]),
    ),
    order(
      "order-trees",
      [
        w("فِي", "fi", "in", "connector"),
        w("الْأَشْجَارُ", "al-ashjāru", "the trees", "noun"),
        w("الْحَدِيقَةِ", "l-ḥadīqah", "the garden", "noun"),
      ],
      [1, 0, 2],
      line("order-trees-answer", "The trees are in the garden.", "al-ashjāru fi l-ḥadīqah.", [
        w("الْأَشْجَارُ", "al-ashjāru", "the trees", "noun"),
        w("فِي", "fi", "in", "connector"),
        w("الْحَدِيقَةِ", "l-ḥadīqah", "the garden", "noun", "."),
      ]),
    ),
    order(
      "order-aqsa",
      [
        w("الْأَقْصَى", "l-aqṣā", "al-Aqsa (lit. the farthest)", "adjective"),
        w("الْمَسْجِدُ", "al-masjidu", "the mosque", "noun"),
        w("فِلَسْطِينَ", "filasṭīn", "Palestine", "noun"),
        w("فِي", "fī", "in", "connector"),
      ],
      [1, 0, 3, 2],
      line("order-aqsa-answer", "Al-Masjid al-Aqsa is in Palestine.", "al-masjidu l-aqṣā fī filasṭīn.", [
        w("الْمَسْجِدُ", "al-masjidu", "the mosque", "noun"),
        w("الْأَقْصَى", "l-aqṣā", "al-Aqsa (lit. the farthest)", "adjective"),
        w("فِي", "fī", "in", "connector"),
        w("فِلَسْطِينَ", "filasṭīn", "Palestine", "noun", "."),
      ]),
    ),
    order(
      "order-insan",
      [
        w("الْإِنْسَانُ", "al-insānu", "man / the human being", "noun"),
        w("قَبِيحٌ", "qabīḥ", "ugly", "adjective"),
        w("وَ", "wa", "and", "connector"),
        w("الشَّيْطَانُ", "ash-shayṭānu", "Shaytan", "noun"),
        w("جَمِيلٌ", "jamīlun", "beautiful", "adjective"),
      ],
      [0, 4, 2, 3, 1],
      line("order-insan-answer", "Man is beautiful and Shaytan is ugly.", "al-insānu jamīlun wa sh-shayṭānu qabīḥ.", [
        w("الْإِنْسَانُ", "al-insānu", "man / the human being", "noun"),
        w("جَمِيلٌ", "jamīlun", "beautiful", "adjective"),
        w("وَالشَّيْطَانُ", "wa sh-shayṭānu", "and Shaytan", "noun"),
        w("قَبِيحٌ", "qabīḥ", "ugly", "adjective", "."),
      ]),
    ),
    order(
      "order-mountains",
      [
        w("جِبَالُ", "jibālu", "the mountains (of)", "noun"),
        w("وَجِبَالُ", "wa jibālu", "and the mountains (of)", "noun"),
        w("مَكَّةَ", "makkata", "Makkah", "noun"),
        w("مُرْتَفِعَةٌ", "murtafiʿah", "high", "adjective"),
        w("مُنْخَفِضَةٌ", "munkhafiḍatun", "low", "adjective"),
        w("بَاكِسْتَانَ", "bākistāna", "Pakistan", "noun"),
      ],
      [0, 2, 4, 1, 5, 3],
      line(
        "order-mountains-answer",
        "The mountains of Makkah are low and the mountains of Pakistan are high.",
        "jibālu makkata munkhafiḍatun wa jibālu bākistāna murtafiʿah.",
        [
          w("جِبَالُ", "jibālu", "the mountains (of)", "noun"),
          w("مَكَّةَ", "makkata", "Makkah", "noun"),
          w("مُنْخَفِضَةٌ", "munkhafiḍatun", "low", "adjective"),
          w("وَجِبَالُ", "wa jibālu", "and the mountains (of)", "noun"),
          w("بَاكِسْتَانَ", "bākistāna", "Pakistan", "noun"),
          w("مُرْتَفِعَةٌ", "murtafiʿah", "high", "adjective", "."),
        ],
      ),
    ),
    order(
      "order-jannah",
      [
        w("يَجْلِسُ", "yajlisu", "sit(s)", "verb"),
        w("فِي", "fi", "in", "connector"),
        w("الْمُسْلِمُونَ", "l-muslimūna", "the Muslims", "noun"),
        w("الْجَنَّةِ", "l-jannati", "Paradise", "noun"),
        w("الْأَرَائِكِ", "l-arā’ik", "the couches", "noun"),
        w("عَلَى", "ʿalā", "on", "connector"),
      ],
      [0, 2, 1, 3, 5, 4],
      line("order-jannah-answer", "The Muslims sit on couches in Paradise.", "yajlisu l-muslimūna fi l-jannati ʿala l-arā’ik.", [
        w("يَجْلِسُ", "yajlisu", "sit(s)", "verb"),
        w("الْمُسْلِمُونَ", "l-muslimūna", "the Muslims", "noun"),
        w("فِي", "fi", "in", "connector"),
        w("الْجَنَّةِ", "l-jannati", "Paradise", "noun"),
        w("عَلَى", "ʿalā", "on", "connector"),
        w("الْأَرَائِكِ", "l-arā’ik", "the couches", "noun", "."),
      ]),
    ),
    order(
      "order-sinah",
      [
        w("وَ", "wa", "and", "connector"),
        w("لَا", "lā", "not / neither", "connector"),
        w("نَوْمٌ", "nawm", "sleep", "noun"),
        w("تَعَالَى", "taʿālā", "the Exalted", "verb"),
        w("اللهُ", "allāhu", "Allah", "noun"),
        w("سِنَةٌ", "sinatun", "drowsiness", "noun"),
        w("تَأْخُذُهُ", "ta’khudhuhu", "overtakes Him", "verb"),
        w("لَا", "lā", "not / neither", "connector"),
      ],
      [4, 3, 1, 6, 5, 0, 7, 2],
      line(
        "order-sinah-answer",
        "Allah, the Exalted: neither drowsiness nor sleep overtakes Him.",
        "allāhu taʿālā lā ta’khudhuhu sinatun wa lā nawm.",
        [
          w("اللهُ", "allāhu", "Allah", "noun"),
          w("تَعَالَى", "taʿālā", "the Exalted", "verb"),
          w("لَا", "lā", "not / neither", "connector"),
          w("تَأْخُذُهُ", "ta’khudhuhu", "overtakes Him", "verb"),
          w("سِنَةٌ", "sinatun", "drowsiness", "noun"),
          w("وَلَا", "wa lā", "and not / nor", "connector"),
          w("نَوْمٌ", "nawm", "sleep", "noun", "."),
        ],
      ),
    ),
  ],
};

function correction(
  id: string,
  number: number,
  board: LevelTwoReadingSentence,
  fixed: LevelTwoReadingSentence,
): LevelTwoReadingQuestion {
  return { id, number, question: board, answer: fixed };
}

const WATER = w("الْمَاءِ", "l-mā’", "water", "noun");

const CORRECTIONS: LevelTwoReadingDrill = {
  kind: "correct",
  id: "haram-correct",
  label: "Corrections",
  heading: heading("haram-correct-heading", "٤", "4"),
  instruction: line("haram-correct-instruction", "Correct the following sentences.", "ṣaḥḥiḥi l-jumala l-ātiyah.", [
    w("صَحِّحِ", "ṣaḥḥiḥi", "correct (command)", "verb"),
    w("الْجُمَلَ", "l-jumala", "the sentences", "noun"),
    w("الْآتِيَةَ", "l-ātiyah", "the following", "adjective", "."),
  ]),
  items: [
    correction(
      "correct-water",
      1,
      line("correct-water-board", "The water consists of three floors.", "al-mā’u mutakawwinun min thalāthati ṭawābiq.", [
        w("الْمَاءُ", "al-mā’u", "the water", "noun"),
        w("مُتَكَوِّنٌ", "mutakawwinun", "consisting, made up", "adjective"),
        w("مِنْ", "min", "of", "connector"),
        w("ثَلَاثَةِ", "thalāthati", "three", "noun"),
        w("طَوَابِقَ", "ṭawābiq", "floors", "noun", "."),
      ]),
      line("correct-water-fixed", "The house consists of three floors.", "al-baytu mutakawwinun min thalāthati ṭawābiq.", [
        w("الْبَيْتُ", "al-baytu", "the house", "noun"),
        w("مُتَكَوِّنٌ", "mutakawwinun", "consisting, made up", "adjective"),
        w("مِنْ", "min", "of", "connector"),
        w("ثَلَاثَةِ", "thalāthati", "three", "noun"),
        w("طَوَابِقَ", "ṭawābiq", "floors", "noun", "."),
      ]),
    ),
    correction(
      "correct-continents",
      2,
      line("correct-continents-board", "The world consists of nine continents.", "takawwana l-ʿālamu min tisʿi qārrāt.", [
        w("تَكَوَّنَ", "takawwana", "it consists (lit. it was made up)", "verb"),
        w("الْعَالَمُ", "l-ʿālamu", "the world", "noun"),
        w("مِنْ", "min", "of", "connector"),
        w("تِسْعِ", "tisʿi", "nine", "noun"),
        w("قَارَّاتٍ", "qārrāt", "continents", "noun", "."),
      ]),
      line("correct-continents-fixed", "The world consists of seven continents.", "takawwana l-ʿālamu min sabʿi qārrāt.", [
        w("تَكَوَّنَ", "takawwana", "it consists (lit. it was made up)", "verb"),
        w("الْعَالَمُ", "l-ʿālamu", "the world", "noun"),
        w("مِنْ", "min", "of", "connector"),
        w("سَبْعِ", "sabʿi", "seven", "noun"),
        w("قَارَّاتٍ", "qārrāt", "continents", "noun", "."),
      ]),
    ),
    correction(
      "correct-money",
      3,
      line("correct-money-board", "The money is in the wardrobe.", "an-nuqūdu fī khizānati l-malābis.", [
        w("النُّقُودُ", "an-nuqūdu", "the money", "noun"),
        w("فِي", "fī", "in", "connector"),
        w("خِزَانَةِ", "khizānati", "the cupboard (of)", "noun"),
        w("الْمَلَابِسِ", "l-malābis", "the clothes", "noun", "."),
      ]),
      line("correct-money-fixed", "The money is in the wallet.", "an-nuqūdu fi l-miḥfaẓah.", [
        w("النُّقُودُ", "an-nuqūdu", "the money", "noun"),
        w("فِي", "fi", "in", "connector"),
        w("الْمِحْفَظَةِ", "l-miḥfaẓah", "the wallet", "noun", "."),
      ]),
    ),
    correction(
      "correct-cooker",
      4,
      line("correct-cooker-board", "The cooker is in the bedroom.", "mawqidu ṭ-ṭaʿāmi fī ghurfati n-nawm.", [
        w("مَوْقِدُ", "mawqidu", "the cooker / stove (of)", "noun"),
        w("الطَّعَامِ", "ṭ-ṭaʿāmi", "food", "noun"),
        w("فِي", "fī", "in", "connector"),
        w("غُرْفَةِ", "ghurfati", "the room (of)", "noun"),
        w("النَّوْمِ", "n-nawm", "sleep", "noun", "."),
      ]),
      line("correct-cooker-fixed", "The cooker is in the kitchen.", "mawqidu ṭ-ṭaʿāmi fi l-maṭbakh.", [
        w("مَوْقِدُ", "mawqidu", "the cooker / stove (of)", "noun"),
        w("الطَّعَامِ", "ṭ-ṭaʿāmi", "food", "noun"),
        w("فِي", "fi", "in", "connector"),
        w("الْمَطْبَخِ", "l-maṭbakh", "the kitchen", "noun", "."),
      ]),
    ),
    correction(
      "correct-fruit",
      5,
      line("correct-fruit-board", "The fruit is in the cookers.", "al-fawākihu fi l-mawāqid.", [
        w("الْفَوَاكِهُ", "al-fawākihu", "the fruit (pl.)", "noun"),
        w("فِي", "fi", "in", "connector"),
        w("الْمَوَاقِدِ", "l-mawāqid", "the cookers / stoves", "noun", "."),
      ]),
      line("correct-fruit-fixed", "The fruit is in the fridge.", "al-fawākihu fi th-thallājah.", [
        w("الْفَوَاكِهُ", "al-fawākihu", "the fruit (pl.)", "noun"),
        w("فِي", "fi", "in", "connector"),
        w("الثَّلَّاجَةِ", "th-thallājah", "the fridge", "noun", "."),
      ]),
    ),
    correction(
      "correct-bin",
      8,
      line("correct-bin-board", "The bin is above the sink.", "sallatu l-muhmalāti fawqa ḥawḍi l-mā’.", [
        w("سَلَّةُ", "sallatu", "the basket (of)", "noun"),
        w("الْمُهْمَلَاتِ", "l-muhmalāti", "rubbish", "noun"),
        w("فَوْقَ", "fawqa", "above", "connector"),
        w("حَوْضِ", "ḥawḍi", "the basin (of)", "noun"),
        { ...WATER, punctuationAfter: "." },
      ]),
      line("correct-bin-fixed", "The bin is under the sink.", "sallatu l-muhmalāti taḥta ḥawḍi l-mā’.", [
        w("سَلَّةُ", "sallatu", "the basket (of)", "noun"),
        w("الْمُهْمَلَاتِ", "l-muhmalāti", "rubbish", "noun"),
        w("تَحْتَ", "taḥta", "under, beneath", "connector"),
        w("حَوْضِ", "ḥawḍi", "the basin (of)", "noun"),
        { ...WATER, punctuationAfter: "." },
      ]),
    ),
    correction(
      "correct-tap",
      9,
      line("correct-tap-board", "The tap is under the sink.", "ṣunbūru l-mā’i taḥta ḥawḍi l-mā’.", [
        w("صُنْبُورُ", "ṣunbūru", "the tap (of)", "noun"),
        w("الْمَاءِ", "l-mā’i", "water", "noun"),
        w("تَحْتَ", "taḥta", "under, beneath", "connector"),
        w("حَوْضِ", "ḥawḍi", "the basin (of)", "noun"),
        { ...WATER, punctuationAfter: "." },
      ]),
      line("correct-tap-fixed", "The tap is above the sink.", "ṣunbūru l-mā’i fawqa ḥawḍi l-mā’.", [
        w("صُنْبُورُ", "ṣunbūru", "the tap (of)", "noun"),
        w("الْمَاءِ", "l-mā’i", "water", "noun"),
        w("فَوْقَ", "fawqa", "above", "connector"),
        w("حَوْضِ", "ḥawḍi", "the basin (of)", "noun"),
        { ...WATER, punctuationAfter: "." },
      ]),
    ),
    correction(
      "correct-clothes",
      10,
      line("correct-clothes-board", "The clothes are in the fridge.", "al-malābisu fi th-thallājah.", [
        w("الْمَلَابِسُ", "al-malābisu", "the clothes", "noun"),
        w("فِي", "fi", "in", "connector"),
        w("الثَّلَّاجَةِ", "th-thallājah", "the fridge", "noun", "."),
      ]),
      line("correct-clothes-fixed", "The clothes are in the wardrobe.", "al-malābisu fi l-khizānah.", [
        w("الْمَلَابِسُ", "al-malābisu", "the clothes", "noun"),
        w("فِي", "fi", "in", "connector"),
        w("الْخِزَانَةِ", "l-khizānah", "the wardrobe / cupboard", "noun", "."),
      ]),
    ),
    correction(
      "correct-guests",
      11,
      line("correct-guests-board", "Fatima receives Zaynab in the bathroom.", "tastaqbilu fāṭimatu zaynaba fi l-ḥammām.", [
        w("تَسْتَقْبِلُ", "tastaqbilu", "she receives / welcomes", "verb"),
        w("فَاطِمَةُ", "fāṭimatu", "Fatima", "noun"),
        w("زَيْنَبَ", "zaynaba", "Zaynab", "noun"),
        w("فِي", "fi", "in", "connector"),
        w("الْحَمَّامِ", "l-ḥammām", "the bathroom", "noun", "."),
      ]),
      line("correct-guests-fixed", "Fatima receives Zaynab in the guest room.", "tastaqbilu fāṭimatu zaynaba fī ghurfati ḍ-ḍuyūf.", [
        w("تَسْتَقْبِلُ", "tastaqbilu", "she receives / welcomes", "verb"),
        w("فَاطِمَةُ", "fāṭimatu", "Fatima", "noun"),
        w("زَيْنَبَ", "zaynaba", "Zaynab", "noun"),
        w("فِي", "fī", "in", "connector"),
        w("غُرْفَةِ", "ghurfati", "the room (of)", "noun"),
        w("الضُّيُوفِ", "ḍ-ḍuyūf", "the guests", "noun", "."),
      ]),
    ),
  ],
};

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
  questionsHeading: QUESTIONS_HEADING,
  sentences: READING,
  english:
    "Al-Masjid al-Haram (the Sacred Mosque) in Makkah is spacious, big and beautiful. The mosque has four floors. It also has many doors and bathrooms. There are big chandeliers in the ceiling of the mosque. In the middle of the mosque is the Honoured Kaaba. In front of the Kaaba is the Station of Ibrahim, peace be upon him, and the well of Zamzam is beneath the Kaaba. There are tall hotels around the mosque. Ahmad took a room in a hotel near the Sacred Mosque. The room is on the fiftieth floor. The room costs one hundred and fifty riyals a day. There are many pilgrims in the mosque, and Ahmad does tawaf around the Kaaba on the roof of the mosque.",
  questions: QUESTIONS,
  drills: [MATCHING, ORDERING, CORRECTIONS],
  wordList: WORD_LIST,
  notes: [
    "As in the sheet’s transliteration, the case ending is dropped at each pause (comma or full stop), as you would when reading aloud.",
    "In the matching exercise the second column lists طَوَابِقُ; after a number such as أَرْبَعَةُ it is written طَوَابِقَ, because it is a diptote and takes fatha in the genitive.",
    "In the word-order exercise more than one order can be correct; the sentence shown is the sheet’s suggestion.",
    "The corrections keep the board’s numbering, which skips 6 and 7.",
  ],
};
