import type { ContentReviewStatus } from "@/data/level-two-lessons";

/**
 * Arabic strings may wrap the letters to highlight in square brackets,
 * e.g. "طَالِبَ[ة]". Use `plainArabic()` to strip the markers.
 */
export interface GrammarItem {
  arabic: string;
  transliteration: string;
  english: string;
}

export interface FeminineMarker {
  id: string;
  symbol: string;
  nameArabic: string;
  name: string;
  examples: readonly GrammarItem[];
}

export interface GenderPair {
  masculine: GrammarItem;
  feminine: GrammarItem;
}

export interface DemonstrativeRow {
  id: string;
  label: string;
  masculine: GrammarItem;
  feminine: GrammarItem;
}

export interface PresentPerson {
  id: "he" | "she" | "you-m" | "you-f" | "i";
  pronoun: GrammarItem;
  /** Prefix letter without its vowel. */
  prefix: string;
  prefixTransliteration: string;
  feminineEnding?: boolean;
  /** English subject used to gloss the chart, e.g. "you (f.)". */
  subject: string;
  thirdPerson: boolean;
  how: string;
}

export interface ChartVerb {
  id: string;
  english: string;
  /** English verb after he/she, e.g. "studies". */
  thirdPersonEnglish: string;
  /** English verb after I/you, e.g. "study". */
  baseEnglish: string;
  prefixVowel: "a" | "u";
  stem: string;
  stemBeforeIna: string;
  stemTransliteration: string;
  stemBeforeInaTransliteration: string;
}

export interface GrammarQuestion {
  id: string;
  ask: string;
  /** Arabic sentence with ___ marking the gap. */
  stem: string;
  options: readonly string[];
  answer: string;
  transliteration: string;
  english: string;
  why: string;
}

export interface GrammarSentence extends GrammarItem {
  id: string;
}

export interface LevelTwoGrammarSheet {
  slug: string;
  title: string;
  titleArabic: string;
  description: string;
  source: string;
  reviewStatus: ContentReviewStatus;
  lessons: readonly number[];
  markers: readonly FeminineMarker[];
  pairs: readonly GenderPair[];
  demonstrativeWords: readonly GrammarItem[];
  demonstratives: readonly DemonstrativeRow[];
  persons: readonly PresentPerson[];
  modelVerb: ChartVerb;
  verbExamples: readonly GrammarSentence[];
  chartVerbs: readonly ChartVerb[];
  practice: readonly GrammarQuestion[];
}

const g = (arabic: string, transliteration: string, english: string): GrammarItem => ({
  arabic,
  transliteration,
  english,
});

const FATHA = "\u064e";
const DAMMA = "\u064f";

export function plainArabic(marked: string): string {
  return marked.replace(/[[\]]/g, "");
}

export interface ChartForm {
  person: PresentPerson;
  /** Arabic with the changing letters in [brackets]. */
  arabic: string;
  transliteration: string;
  english: string;
}

/** The five present-tense forms of a chart verb, built from its stem. */
export function chartForms(verb: ChartVerb, persons: readonly PresentPerson[] = MASCULINE_AND_FEMININE.persons): ChartForm[] {
  const vowel = verb.prefixVowel === "u" ? DAMMA : FATHA;
  return persons.map((person) => ({
    person,
    arabic: person.feminineEnding
      ? `[${person.prefix}${vowel}]${verb.stemBeforeIna}[ينَ]`
      : `[${person.prefix}${vowel}]${verb.stem}`,
    transliteration: `${person.prefixTransliteration}${verb.prefixVowel}${
      person.feminineEnding ? verb.stemBeforeInaTransliteration : verb.stemTransliteration
    }`,
    english: `${person.subject} ${person.thirdPerson ? verb.thirdPersonEnglish : verb.baseEnglish}`,
  }));
}

const PERSONS: readonly PresentPerson[] = [
  { id: "he", pronoun: g("هُوَ", "huwa", "he"), prefix: "ي", prefixTransliteration: "y", subject: "he", thirdPerson: true, how: "starts with يَـ" },
  { id: "she", pronoun: g("هِيَ", "hiya", "she"), prefix: "ت", prefixTransliteration: "t", subject: "she", thirdPerson: true, how: "starts with تَـ" },
  { id: "you-m", pronoun: g("أَنْتَ", "anta", "you (m.)"), prefix: "ت", prefixTransliteration: "t", subject: "you (m.)", thirdPerson: false, how: "starts with تَـ" },
  { id: "you-f", pronoun: g("أَنْتِ", "anti", "you (f.)"), prefix: "ت", prefixTransliteration: "t", feminineEnding: true, subject: "you (f.)", thirdPerson: false, how: "تَـ at the start, ـينَ at the end" },
  { id: "i", pronoun: g("أَنَا", "anā", "I"), prefix: "أ", prefixTransliteration: "", subject: "I", thirdPerson: false, how: "starts with أَ" },
];

const verb = (
  id: string,
  english: string,
  thirdPersonEnglish: string,
  baseEnglish: string,
  prefixVowel: "a" | "u",
  stem: string,
  stemBeforeIna: string,
  stemTransliteration: string,
  stemBeforeInaTransliteration: string,
): ChartVerb => ({
  id,
  english,
  thirdPersonEnglish,
  baseEnglish,
  prefixVowel,
  stem,
  stemBeforeIna,
  stemTransliteration,
  stemBeforeInaTransliteration,
});

export const MASCULINE_AND_FEMININE: LevelTwoGrammarSheet = {
  slug: "masculine-and-feminine",
  title: "Masculine and feminine",
  titleArabic: "المُذَكَّر وَالمُؤَنَّث",
  description:
    "One grammar thread that runs through lessons 1, 2, 3, 4 and 9: how to tell if a noun is feminine, and how verbs change when you talk about or to a woman.",
  source: "Masculine and feminine grammar sheet (Level 2, supplied October 2026)",
  reviewStatus: "confirmed",
  lessons: [1, 2, 3, 4, 9],
  markers: [
    {
      id: "ta-marbuta",
      symbol: "ـة",
      nameArabic: "التَّاءُ المَرْبُوطَةُ",
      name: "tāʾ marbūṭa · the most common",
      examples: [
        g("طَالِبَ[ة]", "ṭāliba", "female student"),
        g("سَاعَ[ة]", "sāʿa", "clock, watch"),
        g("نَافِذَ[ة]", "nāfidha", "window"),
      ],
    },
    {
      id: "alif-maqsura",
      symbol: "ـى",
      nameArabic: "الأَلِفُ المَقْصُورَةُ",
      name: "alif maqṣūra · short alif",
      examples: [
        g("لَيْلَ[ى]", "laylā", "Layla"),
        g("سَلْمَ[ى]", "salmā", "Salma"),
        g("بُشْرَ[ى]", "bushrā", "Bushra (good news)"),
      ],
    },
    {
      id: "alif-mamduda",
      symbol: "ـاء",
      nameArabic: "الأَلِفُ المَمْدُودَةُ",
      name: "alif mamdūda · long alif + hamza",
      examples: [
        g("حَوَّ[اء]", "ḥawwāʾ", "Hawwa (Eve)"),
        g("صَحْرَ[اء]", "ṣaḥrāʾ", "desert"),
      ],
    },
  ],
  pairs: [
    { masculine: g("طَالِبٌ", "ṭālib", "student (m.)"), feminine: g("طَالِبَ[ةٌ]", "ṭāliba", "student (f.)") },
    { masculine: g("مُدَرِّسٌ", "mudarris", "teacher (m.)"), feminine: g("مُدَرِّسَ[ةٌ]", "mudarrisa", "teacher (f.)") },
  ],
  demonstrativeWords: [
    g("هَذَا", "hādhā", "this (m.)"),
    g("هَذِهِ", "hādhihi", "this (f.)"),
    g("مَنْ", "man", "who? (people)"),
    g("مَا", "mā", "what? (things)"),
  ],
  demonstratives: [
    {
      id: "this-is",
      label: "This is…",
      masculine: g("هَذَا قَلَمٌ.", "hādhā qalam.", "This is a pen."),
      feminine: g("هَذِهِ سَاعَةٌ.", "hādhihi sāʿa.", "This is a clock."),
    },
    {
      id: "who",
      label: "Who? (people)",
      masculine: g("مَنْ هَذَا؟", "man hādhā?", "Who is this? (a man)"),
      feminine: g("مَنْ هَذِهِ؟", "man hādhihi?", "Who is this? (a woman)"),
    },
    {
      id: "what",
      label: "What? (things)",
      masculine: g("مَا هَذَا؟", "mā hādhā?", "What is this? (m. thing)"),
      feminine: g("مَا هَذِهِ؟", "mā hādhihi?", "What is this? (f. thing)"),
    },
  ],
  persons: PERSONS,
  modelVerb: verb("faala", "to do", "does", "do", "a", "فْعَلُ", "فْعَلِ", "fʿalu", "fʿalīna"),
  verbExamples: [
    { id: "prays", ...g("مُحَمَّدٌ [يُ]صَلِّي. فَاطِمَةُ [تُ]صَلِّي.", "muḥammadun yuṣallī. fāṭimatu tuṣallī.", "Muhammad prays. Fatima prays.") },
    {
      id: "understands",
      ...g(
        "الطَّالِبُ [يَ]فْهَمُ الدَّرْسَ. الطَّالِبَةُ [تَ]فْهَمُ الدَّرْسَ.",
        "aṭ-ṭālibu yafhamu d-darsa. aṭ-ṭālibatu tafhamu d-dars.",
        "The student (m.) understands the lesson. The student (f.) understands the lesson.",
      ),
    },
    { id: "doing-ahmad", ...g("مَاذَا [تَ]فْعَلُ يَا أَحْمَدُ؟", "mādhā tafʿalu yā aḥmad?", "What are you doing, Ahmad?") },
    { id: "doing-maryam", ...g("مَاذَا [تَ]فْعَلِ[ينَ] يَا مَرْيَمُ؟", "mādhā tafʿalīna yā maryam?", "What are you doing, Maryam?") },
    { id: "you-study", ...g("أَنْتِ [تَ]دْرُسِ[ينَ] اللُّغَةَ العَرَبِيَّةَ.", "anti tadrusīna l-lughata l-ʿarabiyya.", "You (f.) study the Arabic language.") },
  ],
  chartVerbs: [
    verb("study", "to study", "studies", "study", "a", "دْرُسُ", "دْرُسِ", "drusu", "drusīna"),
    verb("write", "to write", "writes", "write", "a", "كْتُبُ", "كْتُبِ", "ktubu", "ktubīna"),
    verb("understand", "to understand", "understands", "understand", "a", "فْهَمُ", "فْهَمِ", "fhamu", "fhamīna"),
    verb("read", "to read", "reads", "read", "a", "قْرَأُ", "قْرَئِ", "qraʾu", "qraʾīna"),
    verb("sit", "to sit", "sits", "sit", "a", "جْلِسُ", "جْلِسِ", "jlisu", "jlisīna"),
    verb("open", "to open", "opens", "open", "a", "فْتَحُ", "فْتَحِ", "ftaḥu", "ftaḥīna"),
    verb("learn", "to learn", "learns", "learn", "a", "تَعَلَّمُ", "تَعَلَّمِ", "taʿallamu", "taʿallamīna"),
    verb("watch", "to watch", "watches", "watch", "u", "شَاهِدُ", "شَاهِدِ", "shāhidu", "shāhidīna"),
    verb("revise", "to revise", "revises", "revise", "u", "ذَاكِرُ", "ذَاكِرِ", "dhākiru", "dhākirīna"),
    verb("pray", "to pray", "prays", "pray", "u", "صَلِّي", "صَلِّ", "ṣallī", "ṣallīna"),
  ],
  practice: [
    { id: "q1", ask: "Which verb?", stem: "الطَّالِبَةُ ___ الوَاجِبَ.", options: ["يَكْتُبُ", "تَكْتُبُ"], answer: "تَكْتُبُ", transliteration: "aṭ-ṭālibatu taktubu l-wājib.", english: "The student (f.) writes the homework.", why: "She → the verb starts with تَـ." },
    { id: "q2", ask: "Which verb?", stem: "أَنْتِ يَا مَرْيَمُ ___ القُرْآنَ.", options: ["تَقْرَئِينَ", "تَقْرَأُ"], answer: "تَقْرَئِينَ", transliteration: "anti yā maryamu taqraʾīna l-qurʾān.", english: "You, Maryam, read the Quran.", why: "You (f.) → تَـ at the start and ـينَ at the end." },
    { id: "q3", ask: "Which verb?", stem: "أَنَا ___ الدَّرْسَ.", options: ["يَفْهَمُ", "أَفْهَمُ"], answer: "أَفْهَمُ", transliteration: "anā afhamu d-dars.", english: "I understand the lesson.", why: "I → the verb starts with أَ." },
    { id: "q4", ask: "Which verb?", stem: "أَنْتَ يَا أَحْمَدُ ___ عَلَى الكُرْسِيِّ.", options: ["تَجْلِسِينَ", "تَجْلِسُ"], answer: "تَجْلِسُ", transliteration: "anta yā aḥmadu tajlisu ʿalā l-kursiyy.", english: "You, Ahmad, sit on the chair.", why: "You (m.) → تَـ with no ending. ـينَ is only for a woman." },
    { id: "q5", ask: "Which verb?", stem: "المُدَرِّسَةُ ___ الدَّرْسَ.", options: ["تَشْرَحُ", "يَشْرَحُ"], answer: "تَشْرَحُ", transliteration: "al-mudarrisatu tashraḥu d-dars.", english: "The teacher (f.) explains the lesson.", why: "مُدَرِّسَة ends in ة, so she → تَـ." },
    { id: "q6", ask: "Which verb?", stem: "فَاطِمَةُ ___ الفَجْرَ.", options: ["يُصَلِّي", "تُصَلِّي"], answer: "تُصَلِّي", transliteration: "fāṭimatu tuṣallī l-fajr.", english: "Fatima prays Fajr.", why: "She → تُـ. This is a ḍamma verb, so it's تُ not تَ." },
    { id: "q7", ask: "This (m.) or this (f.)?", stem: "___ نَافِذَةٌ.", options: ["هَذِهِ", "هَذَا"], answer: "هَذِهِ", transliteration: "hādhihi nāfidha.", english: "This is a window.", why: "نَافِذَة ends in ة, so it's feminine." },
    { id: "q8", ask: "This (m.) or this (f.)?", stem: "___ كِتَابٌ.", options: ["هَذَا", "هَذِهِ"], answer: "هَذَا", transliteration: "hādhā kitāb.", english: "This is a book.", why: "No feminine ending, so it's masculine." },
    { id: "q9", ask: "This (m.) or this (f.)?", stem: "___ سَلْمَى.", options: ["هَذَا", "هَذِهِ"], answer: "هَذِهِ", transliteration: "hādhihi salmā.", english: "This is Salma.", why: "سَلْمَى ends in ى (alif maqṣūra), so it's feminine." },
    { id: "q10", ask: "Who or what?", stem: "___ هَذَا؟ هُوَ مُدَرِّسٌ.", options: ["مَا", "مَنْ"], answer: "مَنْ", transliteration: "man hādhā? huwa mudarris.", english: "Who is this? He is a teacher.", why: "Asking about a person → مَنْ." },
    { id: "q11", ask: "Who or what?", stem: "___ هَذِهِ؟ هَذِهِ سَاعَةٌ.", options: ["مَا", "مَنْ"], answer: "مَا", transliteration: "mā hādhihi? hādhihi sāʿa.", english: "What is this? This is a clock.", why: "Asking about a thing → مَا." },
  ],
};

export const LEVEL_TWO_GRAMMAR_SHEETS: readonly LevelTwoGrammarSheet[] = [MASCULINE_AND_FEMININE];
