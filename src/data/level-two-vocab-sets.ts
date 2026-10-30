import type { ContentReviewStatus } from "@/data/level-two-lessons";

export type VocabSetWordKind = "noun" | "adjective" | "verb" | "preposition";

export type VocabSetFormRole =
  | "word"
  | "singular"
  | "plural"
  | "opposite"
  | "other"
  | "past"
  | "present"
  | "command"
  | "masdar";

export interface VocabSetItem {
  arabic: string;
  transliteration: string;
  english: string;
}

export interface VocabSetForm {
  role: VocabSetFormRole;
  /** Most cells hold one form; some list two (e.g. a masculine and feminine). */
  items: readonly VocabSetItem[];
}

export interface VocabSetToken extends VocabSetItem {
  /** Marks the card's own word (or one of its forms) inside the sentence. */
  focus?: boolean;
  punctuationAfter?: string;
}

export interface VocabSetSentence {
  id: string;
  tokens: readonly VocabSetToken[];
  transliteration: string;
  english: string;
}

export interface VocabSetWord {
  id: string;
  kind: VocabSetWordKind;
  headword: VocabSetItem;
  forms: readonly VocabSetForm[];
  sentences: readonly VocabSetSentence[];
  reviewStatus: ContentReviewStatus;
  note?: string;
}

export interface LevelTwoVocabSet {
  slug: string;
  title: string;
  titleArabic: string;
  description: string;
  /** Where the material came from, shown on the page and kept for the audit. */
  source: string;
  words: readonly VocabSetWord[];
}

/** A broad Level 2 vocabulary theme (one unit page) that grows by adding sets. */
export interface LevelTwoVocabTheme {
  slug: string;
  title: string;
  titleArabic: string;
  description: string;
  sets: readonly LevelTwoVocabSet[];
  readingSlugs?: readonly string[];
}

export const VOCAB_SET_FORM_LABELS: Record<
  VocabSetFormRole,
  { english: string; arabic: string }
> = {
  word: { english: "Word", arabic: "الكَلِمَة" },
  singular: { english: "Singular", arabic: "الكَلِمَة" },
  plural: { english: "Plural", arabic: "الجَمْع" },
  opposite: { english: "Opposite", arabic: "العَكْس" },
  other: { english: "Other", arabic: "أُخْرَى" },
  past: { english: "Past", arabic: "مَاضٍ" },
  present: { english: "Present", arabic: "مُضَارِع" },
  command: { english: "Command", arabic: "أَمْر" },
  masdar: { english: "Verbal noun", arabic: "مَصْدَر" },
};

const t = (
  arabic: string,
  transliteration: string,
  english: string,
  extra: Pick<VocabSetToken, "focus" | "punctuationAfter"> = {},
): VocabSetToken => ({ arabic, transliteration, english, ...extra });

const i = (arabic: string, transliteration: string, english: string): VocabSetItem => ({
  arabic,
  transliteration,
  english,
});

const BAYT_TO_MASJID: LevelTwoVocabSet = {
  slug: "bayt-to-masjid",
  title: "Bayt to Masjid",
  titleArabic: "مِنَ البَيْتِ إِلَى المَسْجِدِ",
  description:
    "Thirteen words for the places around us, from the house and the street to the mosque, each with its forms and example sentences.",
  source: "Bayt to Masjid vocabulary cards (Level 2, supplied October 2026)",
  words: [
    {
      id: "bayt",
      kind: "noun",
      headword: i("بَيْت", "bayt", "house"),
      forms: [
        { role: "singular", items: [i("بَيْت", "bayt", "house")] },
        { role: "plural", items: [i("بُيُوت", "buyūt", "houses")] },
      ],
      sentences: [
        {
          id: "mosques-houses-of-allah",
          tokens: [
            t("المَسَاجِدُ", "al-masājidu", "the mosques"),
            t("بُيُوتُ", "buyūtu", "houses (of)", { focus: true }),
            t("اللهِ", "llāh", "Allah", { punctuationAfter: "." }),
          ],
          transliteration: "al-masājidu buyūtu llāh.",
          english: "Mosques are the houses of Allah.",
        },
        {
          id: "what-are-mosques",
          tokens: [
            t("مَا", "mā", "what"),
            t("المَسَاجِدُ", "l-masājid", "the mosques", { punctuationAfter: "؟" }),
          ],
          transliteration: "mā l-masājid?",
          english: "What are mosques?",
        },
      ],
      reviewStatus: "confirmed",
    },
    {
      id: "kabir",
      kind: "adjective",
      headword: i("كَبِير", "kabīr", "big"),
      forms: [
        { role: "singular", items: [i("كَبِير", "kabīr", "big")] },
        { role: "plural", items: [i("كِبَار", "kibār", "big (pl.)")] },
        {
          role: "opposite",
          items: [i("صَغِير", "ṣaghīr", "small"), i("صِغَار", "ṣighār", "small (pl.)")],
        },
      ],
      sentences: [
        {
          id: "rabbit-small-animal",
          tokens: [
            t("الأَرْنَبُ", "al-arnabu", "the rabbit"),
            t("حَيَوَانٌ", "ḥayawānun", "an animal"),
            t("صَغِيرٌ", "ṣaghīr", "small", { focus: true, punctuationAfter: "." }),
          ],
          transliteration: "al-arnabu ḥayawānun ṣaghīr.",
          english: "The rabbit is a small animal.",
        },
        {
          id: "elephant-big-animal",
          tokens: [
            t("الفِيلُ", "al-fīlu", "the elephant"),
            t("حَيَوَانٌ", "ḥayawānun", "an animal"),
            t("كَبِيرٌ", "kabīrun", "big", { focus: true }),
            t("ضَخْمٌ", "ḍakhm", "huge", { punctuationAfter: "." }),
          ],
          transliteration: "al-fīlu ḥayawānun kabīrun ḍakhm.",
          english: "The elephant is a big, huge animal.",
        },
      ],
      reviewStatus: "confirmed",
    },
    {
      id: "jamil",
      kind: "adjective",
      headword: i("جَمِيل", "jamīl", "beautiful"),
      forms: [
        { role: "word", items: [i("جَمِيل", "jamīl", "beautiful")] },
        { role: "opposite", items: [i("قَبِيح", "qabīḥ", "ugly")] },
      ],
      sentences: [
        {
          id: "human-beautiful-devil-ugly",
          tokens: [
            t("الإِنْسَانُ", "al-insānu", "the human"),
            t("جَمِيلٌ", "jamīlun", "beautiful", { focus: true }),
            t("وَالشَّيْطَانُ", "wa-sh-shayṭānu", "and the Devil"),
            t("قَبِيحٌ", "qabīḥ", "ugly", { focus: true, punctuationAfter: "." }),
          ],
          transliteration: "al-insānu jamīlun wa-sh-shayṭānu qabīḥ.",
          english: "The human is beautiful and the Devil is ugly.",
        },
        {
          id: "what-is-the-human-like",
          tokens: [
            t("كَيْفَ", "kayfa", "how / what … like"),
            t("الإِنْسَانُ", "l-insānu", "the human"),
            t("وَكَيْفَ", "wa-kayfa", "and how / what … like"),
            t("الشَّيْطَانُ", "sh-shayṭān", "the Devil", { punctuationAfter: "؟" }),
          ],
          transliteration: "kayfa l-insānu wa-kayfa sh-shayṭān?",
          english: "What is the human like, and what is the Devil like?",
        },
      ],
      reviewStatus: "confirmed",
    },
    {
      id: "shari",
      kind: "noun",
      headword: i("شَارِع", "shāriʿ", "street"),
      forms: [
        { role: "singular", items: [i("شَارِع", "shāriʿ", "street")] },
        { role: "plural", items: [i("شَوَارِع", "shawāriʿ", "streets")] },
      ],
      sentences: [
        {
          id: "house-on-mosque-street",
          tokens: [
            t("البَيْتُ", "al-baytu", "the house"),
            t("فِي", "fī", "in / on"),
            t("شَارِعِ", "shāriʿi", "street (of)", { focus: true }),
            t("المَسْجِدِ", "l-masjid", "the mosque", { punctuationAfter: "." }),
          ],
          transliteration: "al-baytu fī shāriʿi l-masjid.",
          english: "The house is on the mosque's street.",
        },
        {
          id: "shari-where-is-the-house",
          tokens: [
            t("أَيْنَ", "ayna", "where"),
            t("البَيْتُ", "l-bayt", "the house", { punctuationAfter: "؟" }),
          ],
          transliteration: "ayna l-bayt?",
          english: "Where is the house?",
        },
      ],
      reviewStatus: "normalised",
      note: "Transliteration uses ʿ for ʿayn throughout (the card used ‘).",
    },
    {
      id: "hadiqa",
      kind: "noun",
      headword: i("حَدِيقَة", "ḥadīqa", "garden, park"),
      forms: [
        { role: "singular", items: [i("حَدِيقَة", "ḥadīqa", "garden, park")] },
        { role: "plural", items: [i("حَدَائِق", "ḥadāʾiq", "gardens, parks")] },
      ],
      sentences: [
        {
          id: "went-to-al-azhar-park",
          tokens: [
            t("ذَهَبْتُ", "dhahabtu", "I went"),
            t("إِلَى", "ilā", "to"),
            t("حَدِيقَةِ", "ḥadīqati", "park (of)", { focus: true }),
            t("الأَزْهَرِ", "l-azhar", "Al-Azhar (lit. the flowers)", { punctuationAfter: "." }),
          ],
          transliteration: "dhahabtu ilā ḥadīqati l-azhar.",
          english: "I went to Al-Azhar Park.",
        },
        {
          id: "where-did-you-go",
          tokens: [
            t("إِلَى", "ilā", "to"),
            t("أَيْنَ", "ayna", "where"),
            t("ذَهَبْتَ", "dhahabta", "you went", { punctuationAfter: "؟" }),
          ],
          transliteration: "ilā ayna dhahabta?",
          english: "Where did you go?",
        },
      ],
      reviewStatus: "normalised",
      note: "Transliteration uses ʾ for hamza (the card used ’).",
    },
    {
      id: "wasi",
      kind: "adjective",
      headword: i("وَاسِع", "wāsiʿ", "wide, spacious"),
      forms: [
        {
          role: "word",
          items: [i("وَاسِع", "wāsiʿ", "spacious (m.)"), i("وَاسِعَة", "wāsiʿa", "spacious (f.)")],
        },
        { role: "opposite", items: [i("ضَيِّق", "ḍayyiq", "narrow, cramped")] },
      ],
      sentences: [
        {
          id: "house-cramped-mosque-spacious",
          tokens: [
            t("البَيْتُ", "al-baytu", "the house"),
            t("ضَيِّقٌ", "ḍayyiqun", "cramped", { focus: true }),
            t("وَالمَسْجِدُ", "wa-l-masjidu", "and the mosque"),
            t("وَاسِعٌ", "wāsiʿ", "spacious", { focus: true, punctuationAfter: "." }),
          ],
          transliteration: "al-baytu ḍayyiqun wa-l-masjidu wāsiʿ.",
          english: "The house is cramped and the mosque is spacious.",
        },
        {
          id: "what-is-the-house-like",
          tokens: [
            t("كَيْفَ", "kayfa", "how / what … like"),
            t("البَيْتُ", "l-baytu", "the house"),
            t("وَكَيْفَ", "wa-kayfa", "and how / what … like"),
            t("المَسْجِدُ", "l-masjid", "the mosque", { punctuationAfter: "؟" }),
          ],
          transliteration: "kayfa l-baytu wa-kayfa l-masjid?",
          english: "What is the house like, and what is the mosque like?",
        },
      ],
      reviewStatus: "normalised",
      note: "Transliteration uses ʿ for ʿayn throughout (the card used ‘).",
    },
    {
      id: "hawla",
      kind: "preposition",
      headword: i("حَوْلَ", "ḥawla", "around"),
      forms: [{ role: "word", items: [i("حَوْلَ", "ḥawla", "around")] }],
      sentences: [
        {
          id: "pilgrims-walk-around-kaaba",
          tokens: [
            t("يَمْشِي", "yamshī", "walk (the verb comes first)"),
            t("الحُجَّاجُ", "l-ḥujjāju", "the pilgrims"),
            t("حَوْلَ", "ḥawla", "around", { focus: true }),
            t("الكَعْبَةِ", "l-kaʿba", "the Kaaba", { punctuationAfter: "." }),
          ],
          transliteration: "yamshī l-ḥujjāju ḥawla l-kaʿba.",
          english: "The pilgrims walk around the Kaaba.",
        },
        {
          id: "where-do-the-pilgrims-walk",
          tokens: [
            t("أَيْنَ", "ayna", "where"),
            t("يَمْشِي", "yamshī", "walk (the verb comes first)"),
            t("الحُجَّاجُ", "l-ḥujjāj", "the pilgrims", { punctuationAfter: "؟" }),
          ],
          transliteration: "ayna yamshī l-ḥujjāj?",
          english: "Where do the pilgrims walk?",
        },
      ],
      reviewStatus: "normalised",
      note: "Transliteration uses ʿ for ʿayn throughout (the card used ‘).",
    },
    {
      id: "yartafiu",
      kind: "verb",
      headword: i("يَرْتَفِعُ", "yartafiʿu", "to rise"),
      forms: [
        { role: "past", items: [i("اِرْتَفَعَ", "irtafaʿa", "it rose")] },
        { role: "present", items: [i("يَرْتَفِعُ", "yartafiʿu", "it rises")] },
        { role: "command", items: [i("اِرْتَفِعْ", "irtafiʿ", "rise!")] },
        { role: "masdar", items: [i("اِرْتِفَاع", "irtifāʿ", "a rise, height")] },
        { role: "other", items: [i("مُرْتَفِع", "murtafiʿ", "high, raised")] },
        { role: "opposite", items: [i("اِنْخَفَضَ", "inkhafaḍa", "it went down")] },
      ],
      sentences: [
        {
          id: "dollar-up-riyal-down",
          tokens: [
            t("اِرْتَفَعَ", "irtafaʿa", "went up", { focus: true }),
            t("ثَمَنُ", "thamanu", "price (of)"),
            t("(سِعْرُ)", "(siʿru)", "price (of): another word for ثَمَن"),
            t("الدُّولَارِ", "d-dūlāri", "the dollar"),
            t("وَانْخَفَضَ", "wa-nkhafaḍa", "and went down", { focus: true }),
            t("ثَمَنُ", "thamanu", "price (of)"),
            t("(سِعْرُ)", "(siʿru)", "price (of): another word for ثَمَن"),
            t("الرِّيَالِ", "r-riyāl", "the riyal", { punctuationAfter: "." }),
          ],
          transliteration: "irtafaʿa thamanu (siʿru) d-dūlāri wa-nkhafaḍa thamanu (siʿru) r-riyāl.",
          english: "The price of the dollar went up and the price of the riyal went down.",
        },
        {
          id: "petrol-price-rising",
          tokens: [
            t("يَرْتَفِعُ", "yartafiʿu", "is going up", { focus: true }),
            t("سِعْرُ", "siʿru", "price (of)"),
            t("البَنْزِينِ", "l-banzīn", "petrol", { punctuationAfter: "." }),
          ],
          transliteration: "yartafiʿu siʿru l-banzīn.",
          english: "The price of petrol is going up.",
        },
        {
          id: "car-prices-on-the-rise",
          tokens: [
            t("أَسْعَارُ", "asʿāru", "prices (of)"),
            t("السَّيَّارَاتِ", "s-sayyārāti", "the cars"),
            t("فِي", "fī", "in / on"),
            t("ارْتِفَاعٍ", "rtifāʿ", "a rise", { focus: true, punctuationAfter: "." }),
          ],
          transliteration: "asʿāru s-sayyārāti fī rtifāʿ.",
          english: "Car prices are on the rise.",
        },
        {
          id: "makkah-high-britain-low",
          tokens: [
            t("جِبَالُ", "jibālu", "mountains (of)"),
            t("مَكَّةَ", "makkata", "Makkah"),
            t("مُرْتَفِعَةٌ", "murtafiʿatun", "high", { focus: true }),
            t("وَجِبَالُ", "wa-jibālu", "and the mountains (of)"),
            t("بِرِيطَانِيَا", "brīṭāniyā", "Britain"),
            t("مُنْخَفِضَةٌ", "munkhafiḍa", "low", { punctuationAfter: "." }),
          ],
          transliteration: "jibālu makkata murtafiʿatun wa-jibālu brīṭāniyā munkhafiḍa.",
          english: "The mountains of Makkah are high and the mountains of Britain are low.",
        },
      ],
      reviewStatus: "normalised",
      note: "Transliteration uses ʿ for ʿayn throughout (the card used ‘).",
    },
    {
      id: "shajara",
      kind: "noun",
      headword: i("شَجَرَة", "shajara", "tree"),
      forms: [
        { role: "singular", items: [i("شَجَرَة", "shajara", "tree")] },
        {
          role: "plural",
          items: [i("شَجَر", "shajar", "trees"), i("أَشْجَار", "ashjār", "trees")],
        },
      ],
      sentences: [
        {
          id: "trees-in-the-garden",
          tokens: [
            t("الأَشْجَارُ", "al-ashjāru", "the trees", { focus: true }),
            t("فِي", "fī", "in"),
            t("الحَدِيقَةِ", "l-ḥadīqa", "the garden", { punctuationAfter: "." }),
          ],
          transliteration: "al-ashjāru fī l-ḥadīqa.",
          english: "The trees are in the garden.",
        },
        {
          id: "where-are-the-trees",
          tokens: [
            t("أَيْنَ", "ayna", "where"),
            t("الأَشْجَارُ", "l-ashjār", "the trees", { focus: true, punctuationAfter: "؟" }),
          ],
          transliteration: "ayna l-ashjār?",
          english: "Where are the trees?",
        },
      ],
      reviewStatus: "confirmed",
    },
    {
      id: "yatakawwanu",
      kind: "verb",
      headword: i("يَتَكَوَّنُ", "yatakawwanu", "to be made up of"),
      forms: [
        { role: "past", items: [i("تَكَوَّنَ", "takawwana", "it was made up of")] },
        { role: "present", items: [i("يَتَكَوَّنُ", "yatakawwanu", "it is made up of")] },
        { role: "command", items: [i("تَكَوَّنْ", "takawwan", "be formed!")] },
        { role: "masdar", items: [i("تَكَوُّن", "takawwun", "formation, make-up")] },
        { role: "other", items: [i("مُتَكَوِّن", "mutakawwin", "made up of")] },
      ],
      sentences: [
        {
          id: "world-seven-continents",
          tokens: [
            t("تَكَوَّنَ", "takawwana", "is made up of (past form)", { focus: true }),
            t("العَالَمُ", "l-ʿālamu", "the world"),
            t("مِنْ", "min", "of / from"),
            t("سَبْعِ", "sabʿi", "seven"),
            t("قَارَّاتٍ", "qārrāt", "continents", { punctuationAfter: "." }),
          ],
          transliteration: "takawwana l-ʿālamu min sabʿi qārrāt.",
          english: "The world is made up of seven continents.",
        },
        {
          id: "library-thousand-books",
          tokens: [
            t("تَتَكَوَّنُ", "tatakawwanu", "is made up of (for a feminine word)", { focus: true }),
            t("المَكْتَبَةُ", "l-maktabatu", "the library"),
            t("مِنْ", "min", "of / from"),
            t("أَلْفِ", "alfi", "a thousand"),
            t("كِتَابٍ", "kitāb", "books (lit. book)", { punctuationAfter: "." }),
          ],
          transliteration: "tatakawwanu l-maktabatu min alfi kitāb.",
          english: "The library is made up of a thousand books.",
        },
        {
          id: "water-hydrogen-oxygen",
          tokens: [
            t("المَاءُ", "al-māʾu", "water"),
            t("مُتَكَوِّنٌ", "mutakawwinun", "made up", { focus: true }),
            t("مِنْ", "min", "of / from"),
            t("هَيْدْرُوجِين", "haydrūjīn", "hydrogen"),
            t("وَأُكْسِجِين", "wa-uksijīn", "and oxygen", { punctuationAfter: "." }),
          ],
          transliteration: "al-māʾu mutakawwinun min haydrūjīn wa-uksijīn.",
          english: "Water is made up of hydrogen and oxygen.",
        },
      ],
      reviewStatus: "normalised",
      note: "Transliteration uses ʿ for ʿayn and ʾ for hamza throughout (the card used ‘ and ’).",
    },
    {
      id: "tabiq",
      kind: "noun",
      headword: i("طَابِق", "ṭābiq", "floor, storey"),
      forms: [
        { role: "singular", items: [i("طَابِق", "ṭābiq", "floor")] },
        { role: "plural", items: [i("طَوَابِق", "ṭawābiq", "floors")] },
      ],
      sentences: [
        {
          id: "flat-on-fifth-floor",
          tokens: [
            t("شَقَّتِي", "shaqqatī", "my flat"),
            t("فِي", "fī", "in / on"),
            t("الطَّابِقِ", "ṭ-ṭābiqi", "the floor", { focus: true }),
            t("الخَامِسِ", "l-khāmis", "the fifth", { punctuationAfter: "." }),
          ],
          transliteration: "shaqqatī fī ṭ-ṭābiqi l-khāmis.",
          english: "My flat is on the fifth floor.",
        },
        {
          id: "where-is-the-flat",
          tokens: [
            t("أَيْنَ", "ayna", "where"),
            t("الشَّقَّةُ", "sh-shaqqa", "the flat", { punctuationAfter: "؟" }),
          ],
          transliteration: "ayna sh-shaqqa?",
          english: "Where is the flat?",
        },
      ],
      reviewStatus: "confirmed",
    },
    {
      id: "qarib",
      kind: "adjective",
      headword: i("قَرِيب", "qarīb", "near"),
      forms: [
        { role: "word", items: [i("قَرِيبٌ مِنْ", "qarībun min", "near to")] },
        { role: "opposite", items: [i("بَعِيدٌ عَنْ", "baʿīdun ʿan", "far from")] },
      ],
      sentences: [
        {
          id: "house-near-the-market",
          tokens: [
            t("البَيْتُ", "al-baytu", "the house"),
            t("قَرِيبٌ", "qarībun", "near", { focus: true }),
            t("مِنَ", "mina", "to (lit. from)", { focus: true }),
            t("السُّوقِ", "s-sūq", "the market", { punctuationAfter: "." }),
          ],
          transliteration: "al-baytu qarībun mina s-sūq.",
          english: "The house is near the market.",
        },
        {
          id: "qarib-where-is-the-house",
          tokens: [
            t("أَيْنَ", "ayna", "where"),
            t("البَيْتُ", "l-bayt", "the house", { punctuationAfter: "؟" }),
          ],
          transliteration: "ayna l-bayt?",
          english: "Where is the house?",
        },
        {
          id: "near-far-pen",
          tokens: [
            t("الْقَلَمُ", "al-qalamu", "the pen"),
            t("قَرِيبٌ", "qarībun", "near", { focus: true }),
            t("مِنَ", "mina", "to (lit. from)", { focus: true }),
            t("الْكِتَابِ", "l-kitābi", "the book"),
            t("وَبَعِيدٌ", "wa-baʿīdun", "and far", { focus: true }),
            t("عَنِ", "ʿani", "from", { focus: true }),
            t("الْمِسْطَرَةِ", "l-misṭarah", "the ruler", { punctuationAfter: "." }),
          ],
          transliteration: "al-qalamu qarībun mina l-kitābi wa-baʿīdun ʿani l-misṭarah.",
          english: "The pen is near the book and far from the ruler.",
        },
        {
          id: "near-far-teacher",
          tokens: [
            t("الْمُدَرِّسُ", "al-mudarrisu", "the teacher"),
            t("قَرِيبٌ", "qarībun", "near", { focus: true }),
            t("مِنَ", "mina", "to (lit. from)", { focus: true }),
            t("السَّبُّورَةِ", "s-sabbūrati", "the board"),
            t("وَبَعِيدٌ", "wa-baʿīdun", "and far", { focus: true }),
            t("عَنِ", "ʿani", "from", { focus: true }),
            t("الطُّلَّابِ", "ṭ-ṭullāb", "the students", { punctuationAfter: "." }),
          ],
          transliteration: "al-mudarrisu qarībun mina s-sabbūrati wa-baʿīdun ʿani ṭ-ṭullāb.",
          english: "The teacher is near the board and far from the students.",
        },
        {
          id: "near-far-car",
          tokens: [
            t("السَّيَّارَةُ", "as-sayyāratu", "the car"),
            t("قَرِيبَةٌ", "qarībatun", "near (f.)", { focus: true }),
            t("مِنَ", "mina", "to (lit. from)", { focus: true }),
            t("الشَّجَرَةِ", "sh-shajarati", "the tree"),
            t("وَبَعِيدَةٌ", "wa-baʿīdatun", "and far (f.)", { focus: true }),
            t("عَنِ", "ʿani", "from", { focus: true }),
            t("الْبَيْتِ", "l-bayt", "the house", { punctuationAfter: "." }),
          ],
          transliteration: "as-sayyāratu qarībatun mina sh-shajarati wa-baʿīdatun ʿani l-bayt.",
          english: "The car is near the tree and far from the house.",
        },
        {
          id: "near-far-pakistan",
          tokens: [
            t("بَاكِسْتَانُ", "Bākistānu", "Pakistan"),
            t("قَرِيبَةٌ", "qarībatun", "near (f.)", { focus: true }),
            t("مِنْ", "min", "to (lit. from)", { focus: true }),
            t("إِيرَانَ", "Īrāna", "Iran"),
            t("وَبَعِيدَةٌ", "wa-baʿīdatun", "and far (f.)", { focus: true }),
            t("عَنْ", "ʿan", "from", { focus: true }),
            t("مِصْرَ", "Miṣr", "Egypt", { punctuationAfter: "." }),
          ],
          transliteration: "Bākistānu qarībatun min Īrāna wa-baʿīdatun ʿan Miṣr.",
          english: "Pakistan is near Iran and far from Egypt.",
        },
        {
          id: "near-far-muslim",
          tokens: [
            t("الْمُسْلِمُ", "al-muslimu", "the Muslim"),
            t("قَرِيبٌ", "qarībun", "close", { focus: true }),
            t("مِنَ", "mina", "to (lit. from)", { focus: true }),
            t("اللَّهِ", "llāhi", "Allah"),
            t("وَبَعِيدٌ", "wa-baʿīdun", "and far", { focus: true }),
            t("عَنِ", "ʿani", "from", { focus: true }),
            t("الشَّيْطَانِ", "sh-shayṭān", "Satan", { punctuationAfter: "." }),
          ],
          transliteration: "al-muslimu qarībun mina llāhi wa-baʿīdun ʿani sh-shayṭān.",
          english: "The Muslim is close to Allah and far from Satan.",
        },
      ],
      reviewStatus: "normalised",
      note: "Transliteration uses ʿ for ʿayn throughout (the card used ‘). The last five sentences are the teacher’s near-and-far examples from the Khalid’s House lesson sheet.",
    },
    {
      id: "masjid",
      kind: "noun",
      headword: i("مَسْجِد", "masjid", "mosque"),
      forms: [
        { role: "singular", items: [i("مَسْجِد", "masjid", "mosque")] },
        { role: "plural", items: [i("مَسَاجِد", "masājid", "mosques")] },
        {
          role: "other",
          items: [i("سَجَدَ", "sajada", "he prostrated"), i("سُجُود", "sujūd", "prostration")],
        },
      ],
      sentences: [
        {
          id: "al-aqsa-in-palestine",
          tokens: [
            t("المَسْجِدُ", "al-masjidu", "the mosque", { focus: true }),
            t("الأَقْصَى", "l-aqṣā", "Al-Aqsa (lit. the farthest)"),
            t("فِي", "fī", "in"),
            t("فِلَسْطِينَ", "filasṭīn", "Palestine", { punctuationAfter: "." }),
          ],
          transliteration: "al-masjidu l-aqṣā fī filasṭīn.",
          english: "Al-Aqsa Mosque is in Palestine.",
        },
      ],
      reviewStatus: "confirmed",
    },
  ],
};

const HOME_AND_PLACES: LevelTwoVocabTheme = {
  slug: "home-and-places",
  title: "Home and Places",
  titleArabic: "البَيْتُ وَالأَمَاكِنُ",
  description:
    "Words for the home, its rooms and the places around it, with their forms and example sentences you can explore word by word.",
  sets: [BAYT_TO_MASJID],
  readingSlugs: ["khalids-house", "khalids-house-rooms"],
};

/** Level 2 vocabulary themes. Add new word sets to a theme's `sets`, in the order supplied. */
export const LEVEL_TWO_VOCAB_THEMES: readonly LevelTwoVocabTheme[] = [HOME_AND_PLACES];

export const LEVEL_TWO_VOCAB_SETS: readonly LevelTwoVocabSet[] = LEVEL_TWO_VOCAB_THEMES.flatMap(
  (theme) => theme.sets,
);

export function getLevelTwoVocabTheme(slug: string): LevelTwoVocabTheme | undefined {
  return LEVEL_TWO_VOCAB_THEMES.find((theme) => theme.slug === slug);
}

export function sentenceArabic(sentence: VocabSetSentence): string {
  return sentence.tokens
    .map((token) => `${token.arabic}${token.punctuationAfter ?? ""}`)
    .join(" ");
}
