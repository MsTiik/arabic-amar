export type ContentReviewStatus = "confirmed" | "normalised";

export interface ReviewedContent {
  sourcePage: number;
  reviewStatus: ContentReviewStatus;
}

export interface LevelTwoVocabulary extends ReviewedContent {
  id: string;
  arabic: string;
  transliteration: string;
  english: string;
  gender?: "M" | "F";
  pluralArabic?: string;
  pluralTransliteration?: string;
  exampleArabic?: string;
  exampleEnglish?: string;
  note?: string;
}

export interface LevelTwoSentence extends ReviewedContent {
  id: string;
  arabic: string;
  english: string;
  note?: string;
}

export interface LevelTwoQuestion extends ReviewedContent {
  id: string;
  questionArabic: string;
  answerArabic: string;
  answerEnglish: string;
}

export interface LevelTwoAction extends ReviewedContent {
  id: string;
  arabic: string;
  transliteration: string;
  english: string;
  note?: string;
}

export type LevelTwoReadingTokenKind = "verb" | "noun" | "connector";

export interface LevelTwoReadingToken {
  arabic: string;
  transliteration: string;
  english: string;
  kind: LevelTwoReadingTokenKind;
  punctuationAfter?: string;
}

export interface LevelTwoReadingSentence {
  id: string;
  tokens: readonly LevelTwoReadingToken[];
  english: string;
}

export const LEVEL_TWO_CLASSROOM_VOCABULARY: readonly LevelTwoVocabulary[] = [
  { id: "book", arabic: "كِتَاب", transliteration: "kitāb", english: "book", gender: "M", pluralArabic: "كُتُب", pluralTransliteration: "kutub", exampleArabic: "الْقُرْآنُ كِتَابُ اللهِ.", exampleEnglish: "The Qur’an is the Book of Allah.", sourcePage: 6, reviewStatus: "normalised" },
  { id: "pen", arabic: "قَلَم", transliteration: "qalam", english: "pen", gender: "M", pluralArabic: "أَقْلَام", pluralTransliteration: "aqlām", sourcePage: 6, reviewStatus: "confirmed" },
  { id: "notebook", arabic: "دَفْتَر", transliteration: "daftar", english: "notebook", gender: "M", pluralArabic: "دَفَاتِر", pluralTransliteration: "dafātir", exampleArabic: "الدَّفْتَرُ فِي الْحَقِيبَةِ.", exampleEnglish: "The notebook is in the bag.", sourcePage: 6, reviewStatus: "confirmed" },
  { id: "teacher", arabic: "مُدَرِّس", transliteration: "mudarris", english: "teacher", gender: "M", pluralArabic: "مُدَرِّسُون", pluralTransliteration: "mudarrisūn", exampleArabic: "خَالِدٌ مُدَرِّسٌ.", exampleEnglish: "Khalid is a teacher.", sourcePage: 6, reviewStatus: "normalised" },
  { id: "board", arabic: "سَبُّورَة", transliteration: "sabbūrah", english: "board", gender: "F", pluralArabic: "سَبُّورَات", pluralTransliteration: "sabbūrāt", exampleArabic: "السَّبُّورَةُ عَلَى الْحَائِطِ.", exampleEnglish: "The board is on the wall.", sourcePage: 7, reviewStatus: "normalised" },
  { id: "desk", arabic: "مَكْتَب", transliteration: "maktab", english: "desk / office", gender: "M", pluralArabic: "مَكَاتِب", pluralTransliteration: "makātib", exampleArabic: "الْكِتَابُ فَوْقَ الْمَكْتَبِ.", exampleEnglish: "The book is on the desk.", sourcePage: 7, reviewStatus: "confirmed" },
  { id: "seat", arabic: "مَقْعَد", transliteration: "maqʿad", english: "seat", gender: "M", pluralArabic: "مَقَاعِد", pluralTransliteration: "maqāʿid", exampleArabic: "يَجْلِسُ أَحْمَدُ عَلَى الْمَقْعَدِ.", exampleEnglish: "Ahmed sits on the seat.", sourcePage: 7, reviewStatus: "normalised" },
  { id: "ruler", arabic: "مِسْطَرَة", transliteration: "misṭarah", english: "ruler", gender: "F", pluralArabic: "مَسَاطِر", pluralTransliteration: "masāṭir", exampleArabic: "الْمِسْطَرَةُ فِي الْحَقِيبَةِ.", exampleEnglish: "The ruler is in the bag.", sourcePage: 7, reviewStatus: "confirmed" },
  { id: "eraser", arabic: "مِمْحَاة", transliteration: "mimḥāh", english: "eraser", gender: "F", pluralArabic: "مَمَاحٍ", pluralTransliteration: "mamāḥin", exampleArabic: "الْمِمْحَاةُ فِي الْحَقِيبَةِ.", exampleEnglish: "The eraser is in the bag.", note: "The plural is a broken plural; do not form it as مِمْحَات.", sourcePage: 8, reviewStatus: "confirmed" },
  { id: "door", arabic: "بَاب", transliteration: "bāb", english: "door", gender: "M", pluralArabic: "أَبْوَاب", pluralTransliteration: "abwāb", exampleArabic: "هَذَا بَابٌ.", exampleEnglish: "This is a door.", sourcePage: 8, reviewStatus: "confirmed" },
  { id: "window", arabic: "نَافِذَة", transliteration: "nāfidhah", english: "window", gender: "F", pluralArabic: "نَوَافِذ", pluralTransliteration: "nawāfidh", exampleArabic: "هَذِهِ نَافِذَةٌ.", exampleEnglish: "This is a window.", sourcePage: 8, reviewStatus: "confirmed" },
  { id: "student", arabic: "طَالِب", transliteration: "ṭālib", english: "student", gender: "M", pluralArabic: "طُلَّاب", pluralTransliteration: "ṭullāb", exampleArabic: "أَحْمَدُ طَالِبٌ.", exampleEnglish: "Ahmed is a student.", sourcePage: 8, reviewStatus: "normalised" },
  { id: "board-eraser", arabic: "مِمْسَحَة", transliteration: "mimsaḥah", english: "board eraser / wiping tool", gender: "F", pluralArabic: "مِمْسَحَات", pluralTransliteration: "mimsaḥāt", exampleArabic: "الْمِمْسَحَةُ عَلَى السَّبُّورَةِ.", exampleEnglish: "The wiping tool is on the board.", sourcePage: 8, reviewStatus: "normalised" },
  { id: "clock", arabic: "سَاعَة", transliteration: "sāʿah", english: "clock / hour", gender: "F", pluralArabic: "سَاعَات", pluralTransliteration: "sāʿāt", exampleArabic: "السَّاعَةُ عَلَى الْحَائِطِ.", exampleEnglish: "The clock is on the wall.", sourcePage: 9, reviewStatus: "confirmed" },
  { id: "fan", arabic: "مِرْوَحَة", transliteration: "mirwaḥah", english: "fan", gender: "F", pluralArabic: "مَرَاوِح", pluralTransliteration: "marāwiḥ", exampleArabic: "الْمِرْوَحَةُ فِي السَّقْفِ.", exampleEnglish: "The fan is installed in the ceiling.", note: "The compact noun phrase for ‘ceiling fan’ is مِرْوَحَةُ السَّقْفِ.", sourcePage: 9, reviewStatus: "confirmed" },
  { id: "map", arabic: "خَرِيطَة", transliteration: "kharīṭah", english: "map", gender: "F", pluralArabic: "خَرَائِط", pluralTransliteration: "kharāʾiṭ", exampleArabic: "الْخَرِيطَةُ عَلَى الْحَائِطِ.", exampleEnglish: "The map is on the wall.", sourcePage: 9, reviewStatus: "confirmed" },
  { id: "notice-board", arabic: "لَوْحَة", transliteration: "lawḥah", english: "notice board / panel", gender: "F", pluralArabic: "لَوْحَات", pluralTransliteration: "lawḥāt", exampleArabic: "اللَّوْحَةُ عَلَى الْحَائِطِ.", exampleEnglish: "The panel is on the wall.", sourcePage: 9, reviewStatus: "confirmed" },
  { id: "computer", arabic: "حَاسُوب", transliteration: "ḥāsūb", english: "computer", gender: "M", pluralArabic: "حَوَاسِيب", pluralTransliteration: "ḥawāsīb", exampleArabic: "الْحَاسُوبُ فَوْقَ الْمَكْتَبِ.", exampleEnglish: "The computer is on the desk.", sourcePage: 10, reviewStatus: "confirmed" },
  { id: "library", arabic: "مَكْتَبَة", transliteration: "maktabah", english: "library", gender: "F", pluralArabic: "مَكْتَبَات", pluralTransliteration: "maktabāt", exampleArabic: "الْكِتَابُ فِي الْمَكْتَبَةِ.", exampleEnglish: "The book is in the library.", sourcePage: 10, reviewStatus: "normalised" },
  { id: "laboratory", arabic: "مُخْتَبَر", transliteration: "mukhtabar", english: "laboratory", gender: "M", pluralArabic: "مُخْتَبَرَات", pluralTransliteration: "mukhtabarāt", exampleArabic: "الطَّالِبُ فِي الْمُخْتَبَرِ.", exampleEnglish: "The student is in the laboratory.", sourcePage: 10, reviewStatus: "normalised" },
  { id: "bag", arabic: "حَقِيبَة", transliteration: "ḥaqībah", english: "bag / backpack", gender: "F", pluralArabic: "حَقَائِب", pluralTransliteration: "ḥaqāʾib", exampleArabic: "الْقَلَمُ فِي الْحَقِيبَةِ.", exampleEnglish: "The pen is in the bag.", sourcePage: 10, reviewStatus: "confirmed" },
  { id: "lamp", arabic: "مِصْبَاح", transliteration: "miṣbāḥ", english: "lamp / light bulb", gender: "M", sourcePage: 1, reviewStatus: "confirmed" },
  { id: "chair", arabic: "كُرْسِيّ", transliteration: "kursiyy", english: "chair", gender: "M", pluralArabic: "كَرَاسِيّ", pluralTransliteration: "karāsiyy", exampleArabic: "الْمُدَرِّسُ عَلَى الْكُرْسِيِّ.", exampleEnglish: "The teacher is on the chair.", sourcePage: 11, reviewStatus: "normalised" },
  { id: "classroom", arabic: "فَصْل", transliteration: "faṣl", english: "classroom", gender: "M", pluralArabic: "فُصُول", pluralTransliteration: "fuṣūl", exampleArabic: "الطُّلَّابُ فِي الْفَصْلِ.", exampleEnglish: "The students are in the classroom.", sourcePage: 11, reviewStatus: "confirmed" },
  { id: "sharpener", arabic: "مِبْرَاة", transliteration: "mibrāh", english: "sharpener", gender: "F", pluralArabic: "مَبَارٍ", pluralTransliteration: "mabārin", exampleArabic: "هَذِهِ مِبْرَاةٌ.", exampleEnglish: "This is a sharpener.", note: "The plural is a broken plural; do not form it as مِبْرَايَات.", sourcePage: 11, reviewStatus: "normalised" },
  { id: "wall", arabic: "حَائِط", transliteration: "ḥāʾiṭ", english: "wall", gender: "M", pluralArabic: "حَوَائِط", pluralTransliteration: "ḥawāʾiṭ", exampleArabic: "السَّبُّورَةُ عَلَى الْحَائِطِ.", exampleEnglish: "The board is on the wall.", sourcePage: 11, reviewStatus: "confirmed" },
] as const;

export const LEVEL_TWO_MARKETPLACE_READING: readonly LevelTwoReadingSentence[] = [
  {
    id: "reading-shops-on-friday",
    english: "Ahmed shops on Friday.",
    tokens: [
      { arabic: "يَتَسَوَّقُ", transliteration: "yatasawwaqu", english: "he shops", kind: "verb" },
      { arabic: "أَحْمَدُ", transliteration: "Aḥmadu", english: "Ahmed", kind: "noun" },
      { arabic: "يَوْمَ", transliteration: "yawma", english: "on the day of", kind: "connector" },
      { arabic: "الْجُمُعَةِ", transliteration: "al-jumuʿati", english: "Friday", kind: "noun", punctuationAfter: "." },
    ],
  },
  {
    id: "reading-goes-to-market",
    english: "He takes money from his father and goes to the market.",
    tokens: [
      { arabic: "يَأْخُذُ", transliteration: "yaʾkhudhu", english: "he takes", kind: "verb" },
      { arabic: "أَحْمَدُ", transliteration: "Aḥmadu", english: "Ahmed", kind: "noun" },
      { arabic: "النُّقُودَ", transliteration: "an-nuqūda", english: "the money", kind: "noun" },
      { arabic: "مِنْ", transliteration: "min", english: "from", kind: "connector" },
      { arabic: "أَبِيهِ", transliteration: "abīhi", english: "his father", kind: "noun", punctuationAfter: "،" },
      { arabic: "وَيَذْهَبُ", transliteration: "wa-yadhhabu", english: "and he goes", kind: "verb" },
      { arabic: "إِلَى", transliteration: "ilā", english: "to", kind: "connector" },
      { arabic: "السُّوقِ", transliteration: "as-sūqi", english: "the market", kind: "noun" },
      { arabic: "التِّجَارِيِّ", transliteration: "at-tijāriyyi", english: "commercial", kind: "noun", punctuationAfter: "." },
    ],
  },
  {
    id: "reading-buys-supplies",
    english: "He buys fruit, vegetables, meat, legumes, cleaning supplies, stationery, and clothes.",
    tokens: [
      { arabic: "يَشْتَرِي", transliteration: "yashtarī", english: "he buys", kind: "verb" },
      { arabic: "فَاكِهَةً", transliteration: "fākihatan", english: "fruit", kind: "noun" },
      { arabic: "وَخَضْرَوَاتٍ", transliteration: "wa-khaḍrawātin", english: "and vegetables", kind: "noun" },
      { arabic: "وَلُحُومًا", transliteration: "wa-luḥūman", english: "and meat", kind: "noun" },
      { arabic: "وَبُقُولِيَّاتٍ", transliteration: "wa-buqūliyyātin", english: "and legumes", kind: "noun" },
      { arabic: "وَأَدَوَاتِ", transliteration: "wa-adawāti", english: "and supplies for", kind: "noun" },
      { arabic: "نَظَافَةٍ", transliteration: "naẓāfatin", english: "cleaning", kind: "noun" },
      { arabic: "وَأَدَوَاتٍ", transliteration: "wa-adawātin", english: "and supplies", kind: "noun" },
      { arabic: "مَكْتَبِيَّةً", transliteration: "maktabiyyatan", english: "stationery / office-related", kind: "noun" },
      { arabic: "وَمَلَابِسَ", transliteration: "wa-malābisa", english: "and clothes", kind: "noun", punctuationAfter: "." },
    ],
  },
  {
    id: "reading-returns-home",
    english: "Ahmed returns home and sits with his father. He calculates how much he spent and gives the remainder to his father.",
    tokens: [
      { arabic: "يَعُودُ", transliteration: "yaʿūdu", english: "he returns", kind: "verb" },
      { arabic: "أَحْمَدُ", transliteration: "Aḥmadu", english: "Ahmed", kind: "noun" },
      { arabic: "إِلَى", transliteration: "ilā", english: "to", kind: "connector" },
      { arabic: "الْبَيْتِ", transliteration: "al-bayti", english: "the house / home", kind: "noun", punctuationAfter: "،" },
      { arabic: "وَيَجْلِسُ", transliteration: "wa-yajlisu", english: "and he sits", kind: "verb" },
      { arabic: "مَعَ", transliteration: "maʿa", english: "with", kind: "connector" },
      { arabic: "أَبِيهِ", transliteration: "abīhi", english: "his father", kind: "noun", punctuationAfter: "،" },
      { arabic: "وَيَحْسِبُ", transliteration: "wa-yaḥsibu", english: "and he calculates", kind: "verb" },
      { arabic: "كَمْ", transliteration: "kam", english: "how much", kind: "connector" },
      { arabic: "دَفَعَ", transliteration: "dafaʿa", english: "he paid", kind: "verb" },
      { arabic: "مِنَ", transliteration: "mina", english: "from / of", kind: "connector" },
      { arabic: "النُّقُودِ", transliteration: "an-nuqūdi", english: "the money", kind: "noun" },
      { arabic: "لِلْمُشْتَرَيَاتِ", transliteration: "li-l-mushtarayāti", english: "for the purchases", kind: "noun", punctuationAfter: "،" },
      { arabic: "وَيُعْطِي", transliteration: "wa-yuʿṭī", english: "and he gives", kind: "verb" },
      { arabic: "الْبَاقِيَ", transliteration: "al-bāqiya", english: "the remainder / change", kind: "noun" },
      { arabic: "لِأَبِيهِ", transliteration: "li-abīhi", english: "to his father", kind: "connector", punctuationAfter: "." },
    ],
  },
] as const;

function readingSentenceToArabic(sentence: LevelTwoReadingSentence): string {
  return sentence.tokens
    .map((token) => `${token.arabic}${token.punctuationAfter ?? ""}`)
    .join(" ");
}

export const LEVEL_TWO_MARKETPLACE_PASSAGE = {
  arabic: LEVEL_TWO_MARKETPLACE_READING.map(readingSentenceToArabic).join(" "),
  english: LEVEL_TWO_MARKETPLACE_READING.map((sentence) => sentence.english).join(" "),
  sourcePage: 3,
  reviewStatus: "normalised" as const,
};

export const LEVEL_TWO_MARKETPLACE_QUESTIONS: readonly LevelTwoQuestion[] = [
  { id: "shopping-day", questionArabic: "مَاذَا يَفْعَلُ أَحْمَدُ يَوْمَ الْجُمُعَةِ؟", answerArabic: "يَتَسَوَّقُ أَحْمَدُ يَوْمَ الْجُمُعَةِ.", answerEnglish: "Ahmed shops on Friday.", sourcePage: 3, reviewStatus: "confirmed" },
  { id: "money-source", questionArabic: "مِمَّنْ يَأْخُذُ أَحْمَدُ النُّقُودَ؟", answerArabic: "يَأْخُذُ أَحْمَدُ النُّقُودَ مِنْ أَبِيهِ.", answerEnglish: "Ahmed takes the money from his father.", sourcePage: 3, reviewStatus: "normalised" },
  { id: "money-use", questionArabic: "مَاذَا يَفْعَلُ أَحْمَدُ بِالنُّقُودِ؟", answerArabic: "يَذْهَبُ إِلَى السُّوقِ، وَيَشْتَرِي فَاكِهَةً وَخَضْرَوَاتٍ وَلُحُومًا وَبُقُولِيَّاتٍ وَأَدَوَاتِ نَظَافَةٍ وَأَدَوَاتٍ مَكْتَبِيَّةً وَمَلَابِسَ.", answerEnglish: "He goes to the market and buys fruit, vegetables, meat, legumes, cleaning supplies, stationery, and clothes.", sourcePage: 3, reviewStatus: "normalised" },
  { id: "fruit-example", questionArabic: "مَا الْفَاكِهَةُ؟", answerArabic: "التُّفَّاحُ فَاكِهَةٌ.", answerEnglish: "Apples are fruit.", sourcePage: 3, reviewStatus: "normalised" },
  { id: "fruit-seller", questionArabic: "مَنْ يَبِيعُ الْفَاكِهَةَ؟", answerArabic: "الْفَاكِهِيُّ يَبِيعُ الْفَاكِهَةَ.", answerEnglish: "The fruit seller sells fruit.", sourcePage: 4, reviewStatus: "confirmed" },
  { id: "vegetable-seller", questionArabic: "مَنْ يَبِيعُ الْخَضْرَوَاتِ؟", answerArabic: "الْخُضَرِيُّ يَبِيعُ الْخَضْرَوَاتِ.", answerEnglish: "The vegetable seller sells vegetables.", sourcePage: 4, reviewStatus: "confirmed" },
  { id: "legumes", questionArabic: "مَا الْبُقُولِيَّاتُ؟", answerArabic: "الْعَدَسُ وَالْفُولُ وَالْحِمَّصُ وَالْفَاصُولِيَاءُ مِنَ الْبُقُولِيَّاتِ.", answerEnglish: "Lentils, fava beans, chickpeas, and beans are legumes.", sourcePage: 4, reviewStatus: "normalised" },
  { id: "cleaning-supplies", questionArabic: "مَا أَدَوَاتُ النَّظَافَةِ؟", answerArabic: "الصَّابُونُ مِنْ أَدَوَاتِ النَّظَافَةِ.", answerEnglish: "Soap is a cleaning supply.", sourcePage: 4, reviewStatus: "normalised" },
  { id: "stationery", questionArabic: "مَا الْأَدَوَاتُ الْمَكْتَبِيَّةُ؟", answerArabic: "الْقَلَمُ وَالدَّفْتَرُ وَالْمِسْطَرَةُ وَالْمِمْحَاةُ وَالْمِبْرَاةُ مِنَ الْأَدَوَاتِ الْمَكْتَبِيَّةِ.", answerEnglish: "The pen, notebook, ruler, eraser, and sharpener are stationery.", sourcePage: 4, reviewStatus: "normalised" },
  { id: "return-home", questionArabic: "إِلَى أَيْنَ يَعُودُ أَحْمَدُ بَعْدَ التَّسَوُّقِ؟", answerArabic: "يَعُودُ أَحْمَدُ إِلَى الْبَيْتِ.", answerEnglish: "Ahmed returns home.", sourcePage: 4, reviewStatus: "confirmed" },
  { id: "with-father", questionArabic: "مَاذَا يَفْعَلُ أَحْمَدُ مَعَ أَبِيهِ؟", answerArabic: "يَحْسِبُ كَمْ دَفَعَ، وَيُعْطِي الْبَاقِيَ لِأَبِيهِ.", answerEnglish: "He calculates how much he paid and gives the remainder to his father.", sourcePage: 4, reviewStatus: "normalised" },
] as const;

export const LEVEL_TWO_MATCHING_PHRASES: readonly LevelTwoSentence[] = [
  { id: "colours-examples", arabic: "أَلْوَانٌ: الْأَزْرَقُ وَالْأَسْوَدُ وَالْأَحْمَرُ", english: "Colours: blue, black, and red", sourcePage: 4, reviewStatus: "confirmed" },
  { id: "teacher-corrects", arabic: "الْأُسْتَاذُ يُصَحِّحُ الْوَاجِبَاتِ.", english: "The teacher corrects the homework assignments.", sourcePage: 4, reviewStatus: "normalised" },
  { id: "father-please", arabic: "يَا أَبِي، تَفَضَّلْ.", english: "Father, please / go ahead.", sourcePage: 4, reviewStatus: "normalised" },
  { id: "praise", arabic: "الْحَمْدُ لِلَّهِ.", english: "Praise belongs to Allah.", sourcePage: 4, reviewStatus: "confirmed" },
  { id: "commercial-market", arabic: "السُّوقُ التِّجَارِيُّ", english: "the commercial market", sourcePage: 4, reviewStatus: "confirmed" },
  { id: "school-name", arabic: "الْمَدْرَسَةُ الرَّحْمَانِيَّةُ", english: "al-Raḥmāniyyah School", sourcePage: 4, reviewStatus: "normalised" },
  { id: "permanence", arabic: "الْبَقَاءُ لِلَّهِ تَعَالَى.", english: "Permanence belongs to Allah Most High.", sourcePage: 4, reviewStatus: "confirmed" },
  { id: "accountant-brother", arabic: "أَخِي مُحَاسِبٌ.", english: "My brother is an accountant.", sourcePage: 4, reviewStatus: "normalised" },
  { id: "please-enter", arabic: "تَفَضَّلْ، اُدْخُلْ.", english: "Please, come in.", sourcePage: 4, reviewStatus: "confirmed" },
] as const;

export const LEVEL_TWO_MARKETPLACE_ORDERING: readonly LevelTwoSentence[] = [
  { id: "goes-to-market", arabic: "يَذْهَبُ أَحْمَدُ إِلَى السُّوقِ التِّجَارِيِّ.", english: "Ahmed goes to the commercial market.", sourcePage: 5, reviewStatus: "confirmed" },
  { id: "umrah", arabic: "أَنَا ذَاهِبٌ إِلَى مَكَّةَ لِلْعُمْرَةِ.", english: "I am going to Makkah for ʿumrah.", sourcePage: 5, reviewStatus: "normalised" },
  { id: "buy-meat", arabic: "يَا خَالِدُ، اِشْتَرِ لَنَا لَحْمًا مِنْ فَضْلِكَ.", english: "Khalid, please buy us some meat.", sourcePage: 5, reviewStatus: "normalised" },
  { id: "buyer-stood", arabic: "وَقَفَ الْمُشْتَرِي أَمَامَ الْبَائِعِ.", english: "The buyer stood in front of the seller.", sourcePage: 5, reviewStatus: "confirmed" },
  { id: "seller-took-money", arabic: "أَخَذَ الْخُضَرِيُّ النُّقُودَ.", english: "The vegetable seller took the money.", sourcePage: 5, reviewStatus: "confirmed" },
  { id: "clothes-shop", arabic: "خَالِدٌ فِي مَتْجَرِ الْمَلَابِسِ.", english: "Khalid is in the clothes shop.", sourcePage: 5, reviewStatus: "normalised" },
  { id: "counts-money", arabic: "يَحْسِبُ الْبَائِعُ النُّقُودَ.", english: "The seller counts the money.", sourcePage: 5, reviewStatus: "confirmed" },
  { id: "sit-khalid", arabic: "تَفَضَّلْ يَا خَالِدُ، اِجْلِسْ.", english: "Please, Khalid, sit down.", sourcePage: 5, reviewStatus: "normalised" },
  { id: "students-leave", arabic: "يَخْرُجُ الطُّلَّابُ مِنَ الْفَصْلِ، وَيَبْقَى الْمُدَرِّسُ يُصَحِّحُ الْوَاجِبَ.", english: "The students leave the classroom, and the teacher remains to correct the homework.", sourcePage: 5, reviewStatus: "normalised" },
] as const;

export const LEVEL_TWO_ACTIONS: readonly LevelTwoAction[] = [
  { id: "write", arabic: "يَكْتُبُ", transliteration: "yaktubu", english: "he writes", sourcePage: 13, reviewStatus: "normalised" },
  { id: "read", arabic: "يَقْرَأُ", transliteration: "yaqraʾu", english: "he reads / recites", sourcePage: 13, reviewStatus: "normalised" },
  { id: "explain", arabic: "يَشْرَحُ", transliteration: "yashraḥu", english: "he explains", sourcePage: 13, reviewStatus: "normalised" },
  { id: "understand", arabic: "يَفْهَمُ", transliteration: "yafhamu", english: "he understands", sourcePage: 13, reviewStatus: "normalised" },
  { id: "stand", arabic: "يَقِفُ", transliteration: "yaqifu", english: "he stands / stops", note: "It can also describe rising from a seated position.", sourcePage: 13, reviewStatus: "normalised" },
  { id: "sit", arabic: "يَجْلِسُ", transliteration: "yajlisu", english: "he sits", sourcePage: 13, reviewStatus: "normalised" },
  { id: "open", arabic: "يَفْتَحُ", transliteration: "yaftaḥu", english: "he opens", sourcePage: 13, reviewStatus: "confirmed" },
  { id: "close", arabic: "يُغْلِقُ", transliteration: "yughliqu", english: "he closes", sourcePage: 13, reviewStatus: "normalised" },
  { id: "enter", arabic: "يَدْخُلُ", transliteration: "yadkhulu", english: "he enters", sourcePage: 13, reviewStatus: "normalised" },
  { id: "leave", arabic: "يَخْرُجُ", transliteration: "yakhruju", english: "he exits / leaves", sourcePage: 13, reviewStatus: "normalised" },
  { id: "draw", arabic: "يَرْسُمُ", transliteration: "yarsumu", english: "he draws", sourcePage: 13, reviewStatus: "normalised" },
  { id: "colour", arabic: "يُلَوِّنُ", transliteration: "yulawwinu", english: "he colours", sourcePage: 13, reviewStatus: "normalised" },
  { id: "walk", arabic: "يَمْشِي", transliteration: "yamshī", english: "he walks", sourcePage: 13, reviewStatus: "confirmed" },
  { id: "correct", arabic: "يُصَحِّحُ", transliteration: "yuṣaḥḥiḥu", english: "he corrects", sourcePage: 14, reviewStatus: "normalised" },
  { id: "take", arabic: "يَأْخُذُ", transliteration: "yaʾkhudhu", english: "he takes", sourcePage: 14, reviewStatus: "normalised" },
  { id: "give", arabic: "يُعْطِي", transliteration: "yuʿṭī", english: "he gives", sourcePage: 14, reviewStatus: "normalised" },
  { id: "think", arabic: "يُفَكِّرُ", transliteration: "yufakkiru", english: "he thinks", sourcePage: 14, reviewStatus: "normalised" },
  { id: "point", arabic: "يُشِيرُ", transliteration: "yushīru", english: "he points / indicates", sourcePage: 14, reviewStatus: "confirmed" },
  { id: "ask", arabic: "يَسْأَلُ", transliteration: "yasʾalu", english: "he asks", sourcePage: 14, reviewStatus: "normalised" },
  { id: "answer", arabic: "يُجِيبُ", transliteration: "yujību", english: "he answers / responds", sourcePage: 14, reviewStatus: "confirmed" },
  { id: "watch", arabic: "يُشَاهِدُ", transliteration: "yushāhidu", english: "he watches", sourcePage: 14, reviewStatus: "normalised" },
  { id: "learn", arabic: "يَتَعَلَّمُ", transliteration: "yataʿallamu", english: "he learns", sourcePage: 14, reviewStatus: "normalised" },
  { id: "revise", arabic: "يُذَاكِرُ", transliteration: "yudhākiru", english: "he studies / revises", sourcePage: 14, reviewStatus: "normalised" },
  { id: "teach", arabic: "يُعَلِّمُ", transliteration: "yuʿallimu", english: "he teaches", note: "The shaddah is essential; without it the reading changes.", sourcePage: 14, reviewStatus: "normalised" },
  { id: "wipe", arabic: "يَمْسَحُ", transliteration: "yamsaḥu", english: "he wipes", sourcePage: 14, reviewStatus: "confirmed" },
  { id: "hear", arabic: "يَسْمَعُ", transliteration: "yasmaʿu", english: "he hears", note: "For ‘he listens’, use يَسْتَمِعُ.", sourcePage: 14, reviewStatus: "normalised" },
  { id: "run", arabic: "يَجْرِي", transliteration: "yajrī", english: "he runs", sourcePage: 14, reviewStatus: "confirmed" },
] as const;

export const LEVEL_TWO_ACTION_SENTENCES: readonly LevelTwoSentence[] = [
  { id: "understands-lesson", arabic: "الطَّالِبُ يَفْهَمُ الدَّرْسَ.", english: "The student understands the lesson.", sourcePage: 15, reviewStatus: "confirmed" },
  { id: "revises-lesson", arabic: "الطَّالِبُ يُذَاكِرُ الدَّرْسَ.", english: "The student studies or revises the lesson.", sourcePage: 15, reviewStatus: "normalised" },
  { id: "explains-lesson", arabic: "الْمُدَرِّسُ يَشْرَحُ الدَّرْسَ.", english: "The teacher explains the lesson.", sourcePage: 15, reviewStatus: "confirmed" },
  { id: "opens-door", arabic: "الطَّالِبُ يَفْتَحُ الْبَابَ.", english: "The student opens the door.", sourcePage: 15, reviewStatus: "confirmed" },
  { id: "watches-lecture", arabic: "الطَّالِبُ يُشَاهِدُ الْمُحَاضَرَةَ.", english: "The student watches the lecture.", note: "The source’s left label named a different verb; the sentence itself is corrected here.", sourcePage: 15, reviewStatus: "normalised" },
  { id: "asks-student", arabic: "الْمُدَرِّسُ يَسْأَلُ الطَّالِبَ.", english: "The teacher asks the student.", sourcePage: 15, reviewStatus: "confirmed" },
  { id: "answers-question", arabic: "الطَّالِبُ يُجِيبُ عَنِ السُّؤَالِ.", english: "The student answers the question.", sourcePage: 15, reviewStatus: "normalised" },
  { id: "sits-chair", arabic: "الْمُدَرِّسُ يَجْلِسُ عَلَى الْكُرْسِيِّ.", english: "The teacher sits on the chair.", sourcePage: 15, reviewStatus: "confirmed" },
  { id: "learns-arabic", arabic: "الطَّالِبُ يَتَعَلَّمُ اللُّغَةَ الْعَرَبِيَّةَ.", english: "The student learns Arabic.", sourcePage: 15, reviewStatus: "confirmed" },
  { id: "wipes-board", arabic: "الْمُدَرِّسُ يَمْسَحُ السَّبُّورَةَ.", english: "The teacher wipes the board.", sourcePage: 15, reviewStatus: "confirmed" },
  { id: "takes-notebook", arabic: "الطَّالِبُ يَأْخُذُ الدَّفْتَرَ مِنَ الْمُدَرِّسِ.", english: "The student takes the notebook from the teacher.", sourcePage: 15, reviewStatus: "confirmed" },
] as const;
