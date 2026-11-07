import type { NoteItem, QuranExample } from "@/data/level-two-lesson-notes";

const n = (arabic: string, transliteration: string, english: string): NoteItem => ({ arabic, transliteration, english });

/**
 * Qur’an excerpts for Lesson 13, keyed by section id. The Arabic is copied
 * word for word from the Uthmani text of quranenc.com (as published in the
 * quran-json package, v3.1.2), cut at word boundaries, with the lesson’s word
 * in [brackets] and … where the ayah continues. `focus` gives that word in the
 * lesson’s everyday spelling for the vocabulary bank.
 */
export const LESSON_13_QURAN: Readonly<Record<string, readonly QuranExample[]>> = {
  "getting-to-know": [
      {
        surah: 13,
        ayah: 24,
        surahName: "Ar-Ra'd",
        text: "[سَلَٰمٌ عَلَيۡكُم] بِمَا صَبَرۡتُمۡ …",
        english: "Peace be upon you for what you patiently endured.",
        focus: n("سَلَامٌ عَلَيْكُمْ", "salāmun ʿalaykum", "peace be upon you"),
        note: "The angels greet the people of Paradise with سَلَامٌ عَلَيْكُمْ: the same everyday greeting, without ال.",
      },
      {
        surah: 1,
        ayah: 2,
        surahName: "Al-Fatihah",
        text: "[ٱلۡحَمۡدُ لِلَّهِ] رَبِّ ٱلۡعَٰلَمِينَ",
        english: "All praise is for Allah, Lord of the worlds.",
        focus: n("الحَمْدُ لِلَّهِ", "al-ḥamdu lillāh", "praise be to Allah"),
        note: "The answer to كَيْفَ حَالُكَ؟ is the second ayah of al-Fātiḥah.",
      },
  ],
  "exercise-1": [
      {
        surah: 88,
        ayah: 1,
        surahName: "Al-Ghashiyah",
        text: "[هَلۡ] أَتَىٰكَ حَدِيثُ ٱلۡغَٰشِيَةِ",
        english: "Has the story of the Overwhelming Event reached you?",
        focus: n("هَلْ", "hal", "yes/no question word"),
        note: "هَلْ opens a yes/no question, just like هَلْ أَنْتَ طَالِبٌ؟",
      },
      {
        surah: 81,
        ayah: 26,
        surahName: "At-Takwir",
        text: "[فَأَيۡنَ] تَذۡهَبُونَ",
        english: "So where are you going?",
        focus: n("فَأَيْنَ", "fa-ayna", "so where"),
        note: "أَيْنَ (where) with فَ (so) joined to the front.",
      },
      {
        surah: 2,
        ayah: 28,
        surahName: "Al-Baqarah",
        text: "[كَيۡفَ] تَكۡفُرُونَ بِٱللَّهِ …",
        english: "How can you disbelieve in Allah …",
        focus: n("كَيْفَ", "kayfa", "how"),
        note: "كَيْفَ asks how, as in كَيْفَ حَالُكَ؟",
      },
  ],
  "exercise-2": [
      {
        surah: 2,
        ayah: 255,
        surahName: "Al-Baqarah",
        text: "… [مَن] ذَا ٱلَّذِي يَشۡفَعُ عِندَهُۥٓ إِلَّا بِإِذۡنِهِۦ …",
        english: "Who is it that can intercede with Him, except by His permission?",
        focus: n("مَنْ", "man", "who"),
        note: "مَنْ asks who, about a person, as in مَنْ هَذَا؟ (From Āyat al-Kursī.)",
      },
  ],
  "exercise-3": [
      {
        surah: 12,
        ayah: 2,
        surahName: "Yusuf",
        text: "إِنَّآ أَنزَلۡنَٰهُ قُرۡءَٰنًا [عَرَبِيّٗا] لَّعَلَّكُمۡ تَعۡقِلُونَ",
        english: "Indeed, We sent it down as an Arabic Qur’an so that you may understand.",
        focus: n("عَرَبِيًّا", "ʿarabiyyan", "Arabic (describing the Qur’an)"),
        note: "عَرَبِيّ is عَرَب + the yāʾ of belonging, made exactly like مِصْرِيّ and صِينِيّ.",
      },
  ],
  "position-words": [
      {
        surah: 2,
        ayah: 25,
        surahName: "Al-Baqarah",
        text: "… جَنَّـٰتٖ تَجۡرِي مِن [تَحۡتِهَا] ٱلۡأَنۡهَٰرُ …",
        english: "… gardens beneath which rivers flow.",
        focus: n("تَحْتِهَا", "taḥtihā", "beneath it"),
        note: "تَحْتَ + هَا (it), the same ending as in اِسْمُهَا.",
      },
      {
        surah: 12,
        ayah: 76,
        surahName: "Yusuf",
        text: "… [وَفَوۡقَ] كُلِّ ذِي عِلۡمٍ عَلِيمٞ",
        english: "And above every possessor of knowledge is one more knowing.",
        focus: n("وَفَوْقَ", "wa fawqa", "and above"),
        note: "وَ (and) + فَوْقَ (above).",
      },
      {
        surah: 2,
        ayah: 255,
        surahName: "Al-Baqarah",
        text: "… يَعۡلَمُ مَا [بَيۡنَ] أَيۡدِيهِمۡ وَمَا خَلۡفَهُمۡ …",
        english: "He knows what is before them and what is behind them.",
        focus: n("بَيْنَ", "bayna", "between"),
        note: "مَا بَيْنَ أَيْدِيهِمْ, literally “what is between their hands”, means what lies before them.",
      },
      {
        surah: 18,
        ayah: 79,
        surahName: "Al-Kahf",
        text: "… وَكَانَ [وَرَآءَهُم] مَّلِكٞ …",
        english: "… and behind them was a king …",
        focus: n("وَرَاءَهُمْ", "warā’ahum", "behind them"),
        note: "وَرَاءَ (behind) + هُمْ (them).",
      },
      {
        surah: 75,
        ayah: 5,
        surahName: "Al-Qiyamah",
        text: "بَلۡ يُرِيدُ ٱلۡإِنسَٰنُ لِيَفۡجُرَ [أَمَامَهُۥ]",
        english: "Rather, man wants to go on sinning in what lies ahead of him.",
        focus: n("أَمَامَهُ", "amāmahu", "in front of him, ahead of him"),
        note: "أَمَامَ (in front of) + هُ (him).",
      },
  ],
  "dual-and-plural": [
      {
        surah: 55,
        ayah: 50,
        surahName: "Ar-Rahman",
        text: "فِيهِمَا [عَيۡنَانِ] تَجۡرِيَانِ",
        english: "In both of them are two flowing springs.",
        focus: n("عَيْنَانِ", "ʿaynāni", "two springs"),
        note: "عَيْن + ـَانِ: the dual, just like كِتَابَانِ. فِيهِمَا (in both of them) and تَجْرِيَانِ (the two flow) are dual too.",
      },
      {
        surah: 55,
        ayah: 19,
        surahName: "Ar-Rahman",
        text: "مَرَجَ [ٱلۡبَحۡرَيۡنِ] يَلۡتَقِيَانِ",
        english: "He released the two seas, meeting.",
        focus: n("البَحْرَيْنِ", "al-baḥrayni", "the two seas"),
        note: "Here the dual ends in ـَيْنِ, because the two seas are the object of the verb.",
      },
      {
        surah: 2,
        ayah: 285,
        surahName: "Al-Baqarah",
        text: "… بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ [وَكُتُبِهِۦ] وَرُسُلِهِۦ …",
        english: "… in Allah, His angels, His books and His messengers …",
        focus: n("وَكُتُبِهِ", "wa kutubihi", "and His books"),
        note: "كُتُب is the broken plural of كِتَاب from this lesson.",
      },
      {
        surah: 31,
        ayah: 27,
        surahName: "Luqman",
        text: "وَلَوۡ أَنَّمَا فِي ٱلۡأَرۡضِ مِن شَجَرَةٍ [أَقۡلَٰمٞ] …",
        english: "And if all the trees on earth were pens …",
        focus: n("أَقْلَامٌ", "aqlāmun", "pens"),
        note: "أَقْلَام is the plural of قَلَم, on the pattern أَفْعَال.",
      },
  ],
  "counting": [
      {
        surah: 2,
        ayah: 196,
        surahName: "Al-Baqarah",
        text: "… فَصِيَامُ [ثَلَٰثَةِ أَيَّامٖ] فِي ٱلۡحَجِّ …",
        english: "… then a fast of three days during Hajj …",
        focus: n("ثَلَاثَةِ أَيَّامٍ", "thalāthati ayyāmin", "three days"),
        note: "يَوْم (day) is masculine, so three takes ة: ثَلَاثَة.",
      },
      {
        surah: 2,
        ayah: 226,
        surahName: "Al-Baqarah",
        text: "… تَرَبُّصُ [أَرۡبَعَةِ أَشۡهُرٖ] …",
        english: "… a waiting period of four months …",
        focus: n("أَرْبَعَةِ أَشْهُرٍ", "arbaʿati ash-hurin", "four months"),
        note: "شَهْر (month) is masculine, so four takes ة: أَرْبَعَة.",
      },
      {
        surah: 2,
        ayah: 29,
        surahName: "Al-Baqarah",
        text: "… فَسَوَّىٰهُنَّ [سَبۡعَ سَمَٰوَٰتٖ] …",
        english: "… and He made them seven heavens …",
        focus: n("سَبْعَ سَمَاوَاتٍ", "sabʿa samāwātin", "seven heavens"),
        note: "سَمَاء (sky) is feminine, so seven has no ة: سَبْع.",
      },
  ],
};
