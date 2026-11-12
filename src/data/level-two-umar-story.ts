import type {
  LevelTwoReading,
  LevelTwoReadingQuestion,
  LevelTwoReadingSentence,
  LevelTwoReadingToken,
  LevelTwoReadingTokenKind,
} from "@/data/level-two-lessons";

/**
 * ʿUmar and the woman with the pot: the story sheet read in Lesson 15.
 *
 * The eleven numbered lines are the sheet's own text, word for word. The six
 * questions and model answers are the lesson's التَّدْرِيبَات on the story.
 */

function w(
  arabic: string,
  transliteration: string,
  english: string,
  kind: LevelTwoReadingTokenKind,
  punctuation: { before?: string; after?: string } = {},
): LevelTwoReadingToken {
  return {
    arabic,
    transliteration,
    english,
    kind,
    ...(punctuation.before ? { punctuationBefore: punctuation.before } : {}),
    ...(punctuation.after ? { punctuationAfter: punctuation.after } : {}),
  };
}

const LATIN: Record<string, string> = { "،": ",", "؟": "?", "؛": ";" };

/** A sentence whose transliteration is its words' transliterations, so the two always agree. */
function line(id: string, english: string, tokens: readonly LevelTwoReadingToken[]): LevelTwoReadingSentence {
  const transliteration = tokens
    .map((token) => {
      const after = (token.punctuationAfter ?? "").replace(/[،؟؛]/g, (mark) => LATIN[mark]);
      return `${token.punctuationBefore ?? ""}${token.transliteration}${after}`;
    })
    .join(" ");
  return { id, english, transliteration, tokens };
}

const after = (mark: string) => ({ after: mark });

const UMAR = w("عُمَرُ", "ʿUmaru", "ʿUmar", "noun");
const SO_HE_SAID = w("فَقالَ", "fa-qāla", "so he said", "verb");
const SO_SHE_SAID = w("فَقالَتِ", "fa-qālati", "so she said", "verb");
const THE_WOMAN_SAID = [SO_SHE_SAID, w("المَرْأَةُ", "l-marʾatu", "the woman", "noun", after(":"))];

const STORY: readonly LevelTwoReadingSentence[] = [
  line(
    "umar-night-walk",
    "Our master ʿUmar ibn al-Khaṭṭāb (may Allah be pleased with him) left his house and walked through the streets of Madinah at night.",
    [
      w("خَرَجَ", "kharaja", "he went out, left", "verb"),
      w("سَيِّدُنا", "sayyidunā", "our master", "noun"),
      UMAR,
      w("بْنُ", "bnu", "son of", "noun"),
      w("الخَطّابِ", "l-Khaṭṭābi", "al-Khaṭṭāb (his father)", "noun"),
      w("رَضِيَ", "raḍiya", "was pleased", "verb", { before: "(" }),
      w("اللهُ", "llāhu", "Allah", "noun"),
      w("عَنْهُ", "ʿanhu", "with him", "connector", after(")")),
      w("مِنْ", "min", "from", "connector"),
      w("بَيْتِهِ", "baytihi", "his house", "noun", after("،")),
      w("يَمْشي", "yamshī", "walking (lit. he walks)", "verb"),
      w("في", "fī", "in", "connector"),
      w("شَوارِعِ", "shawāriʿi", "the streets (of)", "noun"),
      w("المَدينَةِ", "l-madīnati", "Madinah, the city", "noun"),
      w("في", "fī", "in, at", "connector"),
      w("اللَّيْلِ", "l-layli", "the night", "noun", after("،")),
    ],
  ),
  line(
    "umar-found-woman",
    "In the street ʿUmar found a woman and her children. She was lighting a fire and putting a pot on it.",
    [
      w("وَوَجَدَ", "wa-wajada", "and he found", "verb"),
      UMAR,
      w("في", "fī", "in", "connector"),
      w("الشّارِعِ", "sh-shāriʿi", "the street", "noun"),
      w("امْرَأَةً", "mraʾatan", "a woman", "noun"),
      w("وَأَوْلادَها", "wa-awlādahā", "and her children", "noun", after("،")),
      w("تُشْعِلُ", "tushʿilu", "she lights", "verb"),
      w("المَرْأَةُ", "l-marʾatu", "the woman", "noun"),
      w("النّارَ", "n-nāra", "the fire", "noun", after("،")),
      w("وَتَضَعُ", "wa-taḍaʿu", "and she puts", "verb"),
      w("الإِناءَ", "l-ināʾa", "the pot", "noun"),
      w("فَوْقَ", "fawqa", "on top of, on", "connector"),
      w("النّارِ", "n-nāri", "the fire", "noun", after("،")),
    ],
  ),
  line("umar-asks", "ʿUmar said: “What is this fire? And what’s in the pot?”", [
    SO_HE_SAID,
    w("عُمَرُ", "ʿUmaru", "ʿUmar", "noun", after(":")),
    w("ما", "mā", "what", "connector"),
    w("هٰذِهِ", "hādhihi", "this (f.)", "connector"),
    w("النّارُ", "n-nāru", "the fire", "noun", after("؟")),
    w("وَماذا", "wa-mādhā", "and what", "connector"),
    w("في", "fī", "in", "connector"),
    w("الإِناءِ", "l-ināʾi", "the pot", "noun", after("؟")),
  ]),
  line("umar-stones", "The woman said: “In the pot there is water and stones.”", [
    ...THE_WOMAN_SAID,
    w("في", "fī", "in", "connector"),
    w("الإِناءِ", "l-ināʾi", "the pot", "noun"),
    w("ماءٌ", "māʾun", "water", "noun"),
    w("وَحِجارَةٌ", "wa-ḥijāratun", "and stones", "noun", after(".")),
  ]),
  line("umar-why", "ʿUmar said: “Why?”", [
    SO_HE_SAID,
    w("عُمَرُ", "ʿUmaru", "ʿUmar", "noun", after(":")),
    w("لِماذا", "li-mādhā", "why", "connector", after("؟")),
  ]),
  line(
    "umar-patient",
    "She said: “So the children think I’m cooking food, and they’ll be patient and fall asleep. Allah will judge between us and ʿUmar.” (Literally “Allah is between us and ʿUmar”: a complaint against the caliph.)",
    [
      ...THE_WOMAN_SAID,
      w("لِيَعْرِفَ", "li-yaʿrifa", "so that (they) know, think", "verb"),
      w("الأَوْلادُ", "l-awlādu", "the children", "noun"),
      w("أَنّي", "annī", "that I", "connector"),
      w("أَطْبُخُ", "aṭbukhu", "I cook, I am cooking", "verb"),
      w("طَعامًا", "ṭaʿāman", "food", "noun"),
      w("فَيَصْبِروا", "fa-yaṣbirū", "and so they are patient", "verb"),
      w("وَيَناموا", "wa-yanāmū", "and they sleep", "verb", after("،")),
      w("وَاللهُ", "wa-llāhu", "and Allah", "noun"),
      w("بَيْنَنا", "baynanā", "between us", "connector"),
      w("وَبَيْنَ", "wa-bayna", "and between", "connector"),
      w("عُمَرَ", "ʿUmara", "ʿUmar", "noun", after(".")),
    ],
  ),
  line("umar-how-know", "ʿUmar said: “How would ʿUmar know about your situation?”", [
    SO_HE_SAID,
    w("عُمَرُ", "ʿUmaru", "ʿUmar", "noun", after(":")),
    w("كَيْفَ", "kayfa", "how", "connector"),
    w("يَعْرِفُ", "yaʿrifu", "he knows, would know", "verb"),
    UMAR,
    w("حالَكِ", "ḥālaki", "your (f.) situation", "noun", after("؟")),
  ]),
  line("umar-caliph", "She said: “How can he be caliph and not know how his people are doing?!”", [
    ...THE_WOMAN_SAID,
    w("كَيْفَ", "kayfa", "how", "connector"),
    w("يَكونُ", "yakūnu", "he is, can he be", "verb"),
    w("خَليفَةً", "khalīfatan", "a caliph", "noun"),
    w("وَلا", "wa-lā", "and not", "connector"),
    w("يَعْرِفُ", "yaʿrifu", "he knows", "verb"),
    w("أَحْوالَ", "aḥwāla", "the conditions (of), how … are doing", "noun"),
    w("النّاسِ", "n-nāsi", "the people", "noun", after("؟!")),
  ]),
  line("umar-storehouse", "ʿUmar ran to the food storehouse and took flour and oil.", [
    w("فَذَهَبَ", "fa-dhahaba", "so he went", "verb"),
    UMAR,
    w("يَجْري", "yajrī", "running (lit. he runs)", "verb"),
    w("إِلى", "ilā", "to", "connector"),
    w("بَيْتِ", "bayti", "the house (of)", "noun"),
    w("الطَّعامِ", "ṭ-ṭaʿāmi", "the food (bayt aṭ-ṭaʿām: the food storehouse)", "noun", after("،")),
    w("فَأَخَذَ", "fa-akhadha", "and he took", "verb"),
    w("دَقيقًا", "daqīqan", "flour", "noun"),
    w("وَزَيْتًا", "wa-zaytan", "and oil", "noun", after("،")),
  ]),
  line("umar-cooked", "He put the flour and oil in the pot, cooked (made) bread and fed the children.", [
    w("وَوَضَعَ", "wa-waḍaʿa", "and he put", "verb"),
    w("الدَّقيقَ", "d-daqīqa", "the flour", "noun"),
    w("وَالزَّيْتَ", "wa-z-zayta", "and the oil", "noun"),
    w("في", "fī", "in", "connector"),
    w("الإِناءِ", "l-ināʾi", "the pot", "noun", after("،")),
    w("وَطَبَخَ", "wa-ṭabakha", "and he cooked", "verb"),
    w("وَصَنَعَ", "wa-ṣanaʿa", "and he made", "verb", { before: "(", after: ")" }),
    w("خُبْزًا", "khubzan", "bread", "noun", after("،")),
    w("وَأَطْعَمَ", "wa-aṭʿama", "and he fed", "verb"),
    w("الأَوْلادَ", "l-awlāda", "the children", "noun", after(".")),
  ]),
  line("umar-reward", "She said: “May Allah reward you with good. You’re the real caliph, not ʿUmar!”", [
    ...THE_WOMAN_SAID,
    w("جَزاكَ", "jazāka", "may (Allah) reward you", "verb"),
    w("اللهُ", "llāhu", "Allah", "noun"),
    w("خَيْرًا", "khayran", "with good", "noun", after("،")),
    w("أَنْتَ", "anta", "you (m.)", "connector"),
    w("الخَليفَةُ", "l-khalīfatu", "the caliph", "noun"),
    w("حَقًّا", "ḥaqqan", "truly, really", "adjective"),
    w("لا", "lā", "not", "connector"),
    w("عُمَرُ", "ʿUmaru", "ʿUmar", "noun", after(".")),
  ]),
];

const INSTRUCTION = line("umar-instruction", "Read the paragraph and answer the following questions.", [
  w("اقْرَأِ", "iqraʾi", "read (command)", "verb"),
  w("الفِقْرَةَ", "l-fiqrata", "the paragraph", "noun"),
  w("وَأَجِبْ", "wa-ajib", "and answer (command)", "verb"),
  w("عَنِ", "ʿani", "about, to", "connector"),
  w("الأَسْئِلَةِ", "l-asʾilati", "the questions", "noun"),
  w("الآتِيَةِ", "l-ātiyati", "the following", "adjective", after(".")),
]);

const QUESTIONS_HEADING = line("umar-exercises-heading", "Exercises", [
  w("التَّدْرِيبَاتُ", "at-tadrībātu", "the exercises", "noun"),
]);

const QUESTIONS: readonly LevelTwoReadingQuestion[] = [
  {
    id: "umar-q-night",
    sentenceId: "umar-night-walk",
    question: line("umar-q-night-question", "What does ʿUmar ibn al-Khaṭṭāb (may Allah be pleased with him) do at night?", [
      w("مَاذَا", "mādhā", "what", "connector"),
      w("يَفْعَلُ", "yafʿalu", "he does", "verb"),
      UMAR,
      w("بْنُ", "bnu", "son of", "noun"),
      w("الخَطَّابِ", "l-Khaṭṭābi", "al-Khaṭṭāb", "noun"),
      w("رَضِيَ", "raḍiya", "was pleased", "verb"),
      w("اللهُ", "llāhu", "Allah", "noun"),
      w("عَنْهُ", "ʿanhu", "with him", "connector"),
      w("فِي", "fī", "in, at", "connector"),
      w("اللَّيْلِ", "l-layli", "the night", "noun", after("؟")),
    ]),
    answer: line("umar-q-night-answer", "He walks in the streets of the city to find out how the people are doing.", [
      w("يَمْشِي", "yamshī", "he walks", "verb"),
      w("فِي", "fī", "in", "connector"),
      w("شَوَارِعِ", "shawāriʿi", "the streets (of)", "noun"),
      w("المَدِينَةِ", "l-madīnati", "the city", "noun"),
      w("لِيَعْرِفَ", "li-yaʿrifa", "to know, to find out", "verb"),
      w("أَحْوَالَ", "aḥwāla", "the conditions (of)", "noun"),
      w("النَّاسِ", "n-nāsi", "the people", "noun", after(".")),
    ]),
  },
  {
    id: "umar-q-found",
    sentenceId: "umar-found-woman",
    question: line("umar-q-found-question", "What did ʿUmar find in the street?", [
      w("مَاذَا", "mādhā", "what", "connector"),
      w("وَجَدَ", "wajada", "he found", "verb"),
      UMAR,
      w("فِي", "fī", "in", "connector"),
      w("الشَّارِعِ", "sh-shāriʿi", "the street", "noun", after("؟")),
    ]),
    answer: line("umar-q-found-answer", "He found a woman and her children.", [
      w("وَجَدَ", "wajada", "he found", "verb"),
      w("امْرَأَةً", "mraʾatan", "a woman", "noun"),
      w("وَأَوْلَادَهَا", "wa-awlādahā", "and her children", "noun", after(".")),
    ]),
  },
  {
    id: "umar-q-stones",
    sentenceId: "umar-patient",
    question: line("umar-q-stones-question", "Why did the woman put water and stones in the pot?", [
      w("لِمَاذَا", "li-mādhā", "why", "connector"),
      w("وَضَعَتِ", "waḍaʿati", "she put", "verb"),
      w("المَرْأَةُ", "l-marʾatu", "the woman", "noun"),
      w("فِي", "fī", "in", "connector"),
      w("الإِنَاءِ", "l-ināʾi", "the pot", "noun"),
      w("مَاءً", "māʾan", "water (as the object)", "noun"),
      w("وَحِجَارَةً", "wa-ḥijāratan", "and stones (as the object)", "noun", after("؟")),
    ]),
    answer: line(
      "umar-q-stones-answer",
      "So the children would think she was cooking food, and be patient and fall asleep.",
      [
        w("لِيَظُنَّ", "li-yaẓunna", "so that (they) think", "verb"),
        w("الأَوْلَادُ", "l-awlādu", "the children", "noun"),
        w("أَنَّهَا", "annahā", "that she", "connector"),
        w("تَطْبُخُ", "taṭbukhu", "she cooks, is cooking", "verb"),
        w("طَعَامًا", "ṭaʿāman", "food", "noun", after("،")),
        w("فَيَصْبِرُوا", "fa-yaṣbirū", "and so they are patient", "verb"),
        w("وَيَنَامُوا", "wa-yanāmū", "and they sleep", "verb", after(".")),
      ],
    ),
  },
  {
    id: "umar-q-complaint",
    sentenceId: "umar-caliph",
    question: line("umar-q-complaint-question", "Why did the woman say: “Allah is (judge) between us and ʿUmar”?", [
      w("لِمَاذَا", "li-mādhā", "why", "connector"),
      w("قَالَتِ", "qālati", "she said", "verb"),
      w("المَرْأَةُ", "l-marʾatu", "the woman", "noun", after(":")),
      w("اللهُ", "allāhu", "Allah", "noun"),
      w("بَيْنَنَا", "baynanā", "between us", "connector"),
      w("وَبَيْنَ", "wa-bayna", "and between", "connector"),
      w("عُمَرَ", "ʿUmara", "ʿUmar", "noun", after("؟")),
    ]),
    answer: line(
      "umar-q-complaint-answer",
      "Because ʿUmar is the caliph and he is responsible for the people, and he did not know her situation.",
      [
        w("لِأَنَّ", "li-anna", "because", "connector"),
        w("عُمَرَ", "ʿUmara", "ʿUmar", "noun"),
        w("هُوَ", "huwa", "he (is)", "connector"),
        w("الخَلِيفَةُ", "l-khalīfatu", "the caliph", "noun"),
        w("وَهُوَ", "wa-huwa", "and he (is)", "connector"),
        w("مَسْؤُولٌ", "masʾūlun", "responsible", "adjective"),
        w("عَنِ", "ʿani", "for (lit. about)", "connector"),
        w("النَّاسِ", "n-nāsi", "the people", "noun", after("،")),
        w("وَلَا", "wa-lā", "and not", "connector"),
        w("يَعْرِفُ", "yaʿrifu", "he knows", "verb"),
        w("حَالَهَا", "ḥālahā", "her situation", "noun", after(".")),
      ],
    ),
  },
  {
    id: "umar-q-helped",
    sentenceId: "umar-storehouse",
    question: line("umar-q-helped-question", "What did ʿUmar do for the woman and the children?", [
      w("مَاذَا", "mādhā", "what", "connector"),
      w("فَعَلَ", "faʿala", "he did", "verb"),
      UMAR,
      w("لِلْمَرْأَةِ", "lil-marʾati", "for the woman", "noun"),
      w("وَالأَوْلَادِ", "wal-awlādi", "and the children", "noun", after("؟")),
    ]),
    answer: line(
      "umar-q-helped-answer",
      "He went to the food storehouse, took flour and oil, made food and fed the children.",
      [
        w("ذَهَبَ", "dhahaba", "he went", "verb"),
        w("إِلَى", "ilā", "to", "connector"),
        w("بَيْتِ", "bayti", "the house (of)", "noun"),
        w("الطَّعَامِ", "ṭ-ṭaʿāmi", "the food", "noun", after("،")),
        w("وَأَخَذَ", "wa-akhadha", "and he took", "verb"),
        w("دَقِيقًا", "daqīqan", "flour", "noun"),
        w("وَزَيْتًا", "wa-zaytan", "and oil", "noun", after("،")),
        w("وَصَنَعَ", "wa-ṣanaʿa", "and he made", "verb"),
        w("طَعَامًا", "ṭaʿāman", "food", "noun", after("،")),
        w("وَأَطْعَمَ", "wa-aṭʿama", "and he fed", "verb"),
        w("الأَوْلَادَ", "l-awlāda", "the children", "noun", after(".")),
      ],
    ),
  },
  {
    id: "umar-q-reward",
    sentenceId: "umar-reward",
    question: line(
      "umar-q-reward-question",
      "What did the woman say to ʿUmar after he made the food and fed the children?",
      [
        w("مَاذَا", "mādhā", "what", "connector"),
        w("قَالَتِ", "qālati", "she said", "verb"),
        w("المَرْأَةُ", "l-marʾatu", "the woman", "noun"),
        w("لِعُمَرَ", "li-ʿUmara", "to ʿUmar", "noun"),
        w("بَعْدَ", "baʿda", "after", "connector"),
        w("أَنْ", "an", "that (baʿda an: after)", "connector"),
        w("صَنَعَ", "ṣanaʿa", "he made", "verb"),
        w("الطَّعَامَ", "ṭ-ṭaʿāma", "the food", "noun"),
        w("وَأَطْعَمَ", "wa-aṭʿama", "and he fed", "verb"),
        w("الأَوْلَادَ", "l-awlāda", "the children", "noun", after("؟")),
      ],
    ),
    answer: line(
      "umar-q-reward-answer",
      "She said: “May Allah reward you with good. You are truly the caliph, not ʿUmar.”",
      [
        w("قَالَتْ", "qālat", "she said", "verb", after(":")),
        w("جَزَاكَ", "jazāka", "may (Allah) reward you", "verb"),
        w("اللهُ", "llāhu", "Allah", "noun"),
        w("خَيْرًا", "khayran", "with good", "noun", after("،")),
        w("أَنْتَ", "anta", "you (m.)", "connector"),
        w("الخَلِيفَةُ", "l-khalīfatu", "the caliph", "noun"),
        w("حَقًّا", "ḥaqqan", "truly, really", "adjective"),
        w("لَا", "lā", "not", "connector"),
        w("عُمَرُ", "ʿUmaru", "ʿUmar", "noun", after(".")),
      ],
    ),
  },
];

export const LEVEL_TWO_UMAR_STORY: LevelTwoReading = {
  slug: "umar-and-the-woman-with-the-pot",
  title: "ʿUmar and the woman with the pot",
  shortTitle: "ʿUmar and the woman with the pot",
  titleArabic: "عُمَرُ وَالمَرْأَةُ وَالإِنَاءُ",
  source: "ʿUmar and the woman with the pot, story sheet read in Lesson 15 (Ustadh Abdulrahman Hassan)",
  reviewStatus: "normalised",
  instruction: INSTRUCTION,
  sentences: STORY,
  english: STORY.map((sentence) => sentence.english).join(" "),
  questionsHeading: QUESTIONS_HEADING,
  questions: QUESTIONS,
  notes: [
    "The story text is the sheet’s own, including its lighter vowel marking (سَيِّدُنا, الخَطّابِ). The questions and answers are written with every vowel.",
    "In question 3, مَاءً وَحِجَارَةً take fatḥatayn because they are the objects of وَضَعَتْ (she put). In the story, فِي الإِنَاءِ مَاءٌ وَحِجَارَةٌ (in the pot is water and stones) has ḍammatayn, because there they are the subject.",
  ],
};
