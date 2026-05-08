export interface NameOfAllahSource {
  type: "quran" | "hadith";
  reference: string;
  url: string;
}

export interface NameOfAllah {
  id: string;
  arabic: string;
  transliteration: string;
  shortMeaning: string;
  explanation: string;
  sources: NameOfAllahSource[];
}

type QuranSourceKey = `q:${number}:${number}`;
type SourceKey = QuranSourceKey | "tirmidhi-3507";

type RawNameOfAllah = Omit<NameOfAllah, "sources"> & {
  sourceKeys: SourceKey[];
};

function sourceFromKey(key: SourceKey): NameOfAllahSource {
  if (key === "tirmidhi-3507") {
    return {
      type: "hadith",
      reference: "Jami' at-Tirmidhi 3507 enumeration (da'if grade)",
      url: "https://sunnah.com/tirmidhi:3507",
    };
  }

  const [, surah, ayah] = key.split(":");
  return {
    type: "quran",
    reference: `Qur'an ${surah}:${ayah}`,
    url: `https://quran.com/${surah}/${ayah}`,
  };
}

const RAW_NAMES_OF_ALLAH: RawNameOfAllah[] = [
  { id: "allah", arabic: "اللَّه", transliteration: "Allāh", shortMeaning: "The one true God", explanation: "The proper name of God: the only One worthy of worship, the Creator and Sustainer of everything.", sourceKeys: ["q:1:1", "q:59:22", "tirmidhi-3507"] },
  { id: "ar-rahman", arabic: "الرَّحْمَٰن", transliteration: "ar-Raḥmān", shortMeaning: "The Entirely Merciful", explanation: "Allah's mercy is vast, overflowing, and reaches all creation in this world.", sourceKeys: ["q:55:1", "q:59:22", "tirmidhi-3507"] },
  { id: "ar-rahim", arabic: "الرَّحِيم", transliteration: "ar-Raḥīm", shortMeaning: "The Especially Merciful", explanation: "Allah shows special, lasting mercy to those who turn to Him and receive His guidance.", sourceKeys: ["q:1:3", "q:2:163", "tirmidhi-3507"] },
  { id: "al-malik", arabic: "الْمَلِك", transliteration: "al-Malik", shortMeaning: "The King", explanation: "The absolute King and Sovereign whose authority, command, and ownership are complete.", sourceKeys: ["q:59:23", "q:20:114", "tirmidhi-3507"] },
  { id: "al-quddus", arabic: "الْقُدُّوس", transliteration: "al-Quddūs", shortMeaning: "The Most Holy", explanation: "The One completely pure and perfect, far above every flaw, weakness, or imperfection.", sourceKeys: ["q:59:23", "q:62:1", "tirmidhi-3507"] },
  { id: "as-salam", arabic: "السَّلَام", transliteration: "as-Salām", shortMeaning: "The Source of Peace", explanation: "The One free from every deficiency, from whom true safety, wholeness, and peace come.", sourceKeys: ["q:59:23", "tirmidhi-3507"] },
  { id: "al-mumin", arabic: "الْمُؤْمِن", transliteration: "al-Muʾmin", shortMeaning: "The Giver of Security", explanation: "The One who grants safety, confirms the truth, and gives faith and assurance to His servants.", sourceKeys: ["q:59:23", "tirmidhi-3507"] },
  { id: "al-muhaymin", arabic: "الْمُهَيْمِن", transliteration: "al-Muhaymin", shortMeaning: "The Guardian", explanation: "The One who watches over, preserves, and fully witnesses all things.", sourceKeys: ["q:59:23", "tirmidhi-3507"] },
  { id: "al-aziz", arabic: "الْعَزِيز", transliteration: "al-ʿAzīz", shortMeaning: "The Almighty", explanation: "The Mighty and Honored One whose power cannot be overcome.", sourceKeys: ["q:59:23", "q:3:6", "tirmidhi-3507"] },
  { id: "al-jabbar", arabic: "الْجَبَّار", transliteration: "al-Jabbār", shortMeaning: "The Compeller", explanation: "The One whose will prevails, who compels what He wills and restores what is broken.", sourceKeys: ["q:59:23", "tirmidhi-3507"] },
  { id: "al-mutakabbir", arabic: "الْمُتَكَبِّر", transliteration: "al-Mutakabbir", shortMeaning: "The Supremely Great", explanation: "The One uniquely entitled to greatness, majesty, and complete exaltation above creation.", sourceKeys: ["q:59:23", "tirmidhi-3507"] },
  { id: "al-khaliq", arabic: "الْخَالِق", transliteration: "al-Khāliq", shortMeaning: "The Creator", explanation: "The One who brings every created thing into existence with knowledge, wisdom, and power.", sourceKeys: ["q:59:24", "q:6:102", "tirmidhi-3507"] },
  { id: "al-bari", arabic: "الْبَارِئ", transliteration: "al-Bāriʾ", shortMeaning: "The Originator", explanation: "The One who originates creation distinctly and perfectly, without flaw or prior model.", sourceKeys: ["q:59:24", "tirmidhi-3507"] },
  { id: "al-musawwir", arabic: "الْمُصَوِّر", transliteration: "al-Muṣawwir", shortMeaning: "The Fashioner", explanation: "The One who gives each creature its particular form, proportion, and beauty.", sourceKeys: ["q:59:24", "tirmidhi-3507"] },
  { id: "al-ghaffar", arabic: "الْغَفَّار", transliteration: "al-Ghaffār", shortMeaning: "The Repeated Forgiver", explanation: "The One who repeatedly covers sins and forgives servants who return to Him.", sourceKeys: ["q:71:10", "q:20:82", "tirmidhi-3507"] },
  { id: "al-qahhar", arabic: "الْقَهَّار", transliteration: "al-Qahhār", shortMeaning: "The All-Subduing", explanation: "The One before whose authority every force, tyrant, and created thing is subdued.", sourceKeys: ["q:13:16", "q:40:16", "tirmidhi-3507"] },
  { id: "al-wahhab", arabic: "الْوَهَّاب", transliteration: "al-Wahhāb", shortMeaning: "The Bestower", explanation: "The One who gives freely and generously, even before His servants ask.", sourceKeys: ["q:3:8", "q:38:35", "tirmidhi-3507"] },
  { id: "ar-razzaq", arabic: "الرَّزَّاق", transliteration: "ar-Razzāq", shortMeaning: "The Provider", explanation: "The One who continually provides sustenance, means, and benefit to every creature.", sourceKeys: ["q:51:58", "tirmidhi-3507"] },
  { id: "al-fattah", arabic: "الْفَتَّاح", transliteration: "al-Fattāḥ", shortMeaning: "The Opener", explanation: "The One who opens doors of mercy, judgment, provision, and relief by His wisdom.", sourceKeys: ["q:34:26", "tirmidhi-3507"] },
  { id: "al-alim", arabic: "الْعَلِيم", transliteration: "al-ʿAlīm", shortMeaning: "The All-Knowing", explanation: "The One whose knowledge fully encompasses what is seen, hidden, past, and future.", sourceKeys: ["q:2:158", "q:57:6", "tirmidhi-3507"] },
  { id: "al-qabid", arabic: "الْقَابِض", transliteration: "al-Qābiḍ", shortMeaning: "The Withholder", explanation: "The One who withholds, constricts, or takes according to perfect wisdom and justice.", sourceKeys: ["q:2:245", "tirmidhi-3507"] },
  { id: "al-basit", arabic: "الْبَاسِط", transliteration: "al-Bāsiṭ", shortMeaning: "The Expander", explanation: "The One who expands provision, mercy, life, and opportunity for whom He wills.", sourceKeys: ["q:2:245", "tirmidhi-3507"] },
  { id: "al-khafid", arabic: "الْخَافِض", transliteration: "al-Khāfiḍ", shortMeaning: "The Abaser", explanation: "The One who lowers false pride and brings down what deserves to be humbled.", sourceKeys: ["tirmidhi-3507"] },
  { id: "ar-rafi", arabic: "الرَّافِع", transliteration: "ar-Rāfiʿ", shortMeaning: "The Exalter", explanation: "The One who raises ranks, honors servants, and elevates truth by His command.", sourceKeys: ["tirmidhi-3507"] },
  { id: "al-muizz", arabic: "الْمُعِزّ", transliteration: "al-Muʿizz", shortMeaning: "The Giver of Honor", explanation: "The One who grants honor, strength, and dignity to whom He wills.", sourceKeys: ["q:3:26", "tirmidhi-3507"] },
  { id: "al-mudhill", arabic: "الْمُذِلّ", transliteration: "al-Mudhill", shortMeaning: "The Humiliator", explanation: "The One who can humble or disgrace whoever rejects truth and deserves abasement.", sourceKeys: ["q:3:26", "tirmidhi-3507"] },
  { id: "as-sami", arabic: "السَّمِيع", transliteration: "as-Samīʿ", shortMeaning: "The All-Hearing", explanation: "The One who hears every sound, supplication, whisper, and unspoken need.", sourceKeys: ["q:2:127", "q:49:1", "tirmidhi-3507"] },
  { id: "al-basir", arabic: "الْبَصِير", transliteration: "al-Baṣīr", shortMeaning: "The All-Seeing", explanation: "The One who sees all outward actions, hidden realities, and unseen details.", sourceKeys: ["q:4:58", "q:42:11", "tirmidhi-3507"] },
  { id: "al-hakam", arabic: "الْحَكَم", transliteration: "al-Ḥakam", shortMeaning: "The Judge", explanation: "The One whose judgment is perfectly true, final, wise, and just.", sourceKeys: ["q:22:69", "tirmidhi-3507"] },
  { id: "al-adl", arabic: "الْعَدْل", transliteration: "al-ʿAdl", shortMeaning: "The Utterly Just", explanation: "The One whose justice is complete and who never wrongs anyone in the least.", sourceKeys: ["q:6:115", "tirmidhi-3507"] },
  { id: "al-latif", arabic: "اللَّطِيف", transliteration: "al-Laṭīf", shortMeaning: "The Subtle and Gentle", explanation: "The One whose kindness reaches His servants in subtle, hidden, and gentle ways.", sourceKeys: ["q:6:103", "q:67:14", "tirmidhi-3507"] },
  { id: "al-khabir", arabic: "الْخَبِير", transliteration: "al-Khabīr", shortMeaning: "The All-Aware", explanation: "The One fully aware of inner states, hidden matters, and every consequence.", sourceKeys: ["q:6:18", "q:59:18", "tirmidhi-3507"] },
  { id: "al-halim", arabic: "الْحَلِيم", transliteration: "al-Ḥalīm", shortMeaning: "The Forbearing", explanation: "The One who delays punishment and treats servants with patience and restraint.", sourceKeys: ["q:2:225", "q:35:41", "tirmidhi-3507"] },
  { id: "al-azim", arabic: "الْعَظِيم", transliteration: "al-ʿAẓīm", shortMeaning: "The Magnificent", explanation: "The One whose greatness, majesty, and perfection are beyond comparison.", sourceKeys: ["q:2:255", "q:56:96", "tirmidhi-3507"] },
  { id: "al-ghafur", arabic: "الْغَفُور", transliteration: "al-Ghafūr", shortMeaning: "The Forgiving", explanation: "The One who forgives abundantly and covers the faults of repentant servants.", sourceKeys: ["q:2:173", "q:60:7", "tirmidhi-3507"] },
  { id: "ash-shakur", arabic: "الشَّكُور", transliteration: "ash-Shakūr", shortMeaning: "The Appreciative", explanation: "The One who rewards even small acts of goodness with generous increase.", sourceKeys: ["q:35:30", "q:64:17", "tirmidhi-3507"] },
  { id: "al-aliyy", arabic: "الْعَلِيّ", transliteration: "al-ʿAliyy", shortMeaning: "The Most High", explanation: "The One exalted above all creation in rank, power, and perfection.", sourceKeys: ["q:2:255", "q:42:4", "tirmidhi-3507"] },
  { id: "al-kabir", arabic: "الْكَبِير", transliteration: "al-Kabīr", shortMeaning: "The Most Great", explanation: "The One whose greatness surpasses everything and before whom all creation is small.", sourceKeys: ["q:13:9", "q:40:12", "tirmidhi-3507"] },
  { id: "al-hafiz", arabic: "الْحَفِيظ", transliteration: "al-Ḥafīẓ", shortMeaning: "The Preserver", explanation: "The One who protects, preserves, records, and guards whatever He wills.", sourceKeys: ["q:11:57", "q:42:6", "tirmidhi-3507"] },
  { id: "al-muqit", arabic: "الْمُقِيت", transliteration: "al-Muqīt", shortMeaning: "The Sustainer", explanation: "The One who nourishes, sustains, and maintains creation with exact measure.", sourceKeys: ["q:4:85", "tirmidhi-3507"] },
  { id: "al-hasib", arabic: "الْحَسِيب", transliteration: "al-Ḥasīb", shortMeaning: "The Reckoner", explanation: "The One sufficient for His servants and exact in calling every deed to account.", sourceKeys: ["q:4:6", "q:33:39", "tirmidhi-3507"] },
  { id: "al-jalil", arabic: "الْجَلِيل", transliteration: "al-Jalīl", shortMeaning: "The Majestic", explanation: "The One possessed of perfect majesty, dignity, and awe-inspiring greatness.", sourceKeys: ["tirmidhi-3507"] },
  { id: "al-karim", arabic: "الْكَرِيم", transliteration: "al-Karīm", shortMeaning: "The Generous", explanation: "The One whose generosity, honor, and noble giving never diminish.", sourceKeys: ["q:27:40", "q:82:6", "tirmidhi-3507"] },
  { id: "ar-raqib", arabic: "الرَّقِيب", transliteration: "ar-Raqīb", shortMeaning: "The Watchful", explanation: "The One who watches over every soul, action, intention, and trust.", sourceKeys: ["q:4:1", "q:5:117", "tirmidhi-3507"] },
  { id: "al-mujib", arabic: "الْمُجِيب", transliteration: "al-Mujīb", shortMeaning: "The Responsive", explanation: "The One who answers prayers and responds to servants in the best way.", sourceKeys: ["q:11:61", "tirmidhi-3507"] },
  { id: "al-wasi", arabic: "الْوَاسِع", transliteration: "al-Wāsiʿ", shortMeaning: "The All-Encompassing", explanation: "The One whose knowledge, mercy, provision, and power are vast and unbounded.", sourceKeys: ["q:2:115", "q:2:261", "tirmidhi-3507"] },
  { id: "al-hakim", arabic: "الْحَكِيم", transliteration: "al-Ḥakīm", shortMeaning: "The All-Wise", explanation: "The One who places everything in its proper place with perfect wisdom.", sourceKeys: ["q:2:129", "q:57:1", "tirmidhi-3507"] },
  { id: "al-wadud", arabic: "الْوَدُود", transliteration: "al-Wadūd", shortMeaning: "The Loving", explanation: "The One who loves His righteous servants and is worthy of their deepest love.", sourceKeys: ["q:11:90", "q:85:14", "tirmidhi-3507"] },
  { id: "al-majid", arabic: "الْمَجِيد", transliteration: "al-Majīd", shortMeaning: "The Most Glorious", explanation: "The One full of glory, nobility, honor, and praiseworthy perfection.", sourceKeys: ["q:11:73", "tirmidhi-3507"] },
  { id: "al-baith", arabic: "الْبَاعِث", transliteration: "al-Bāʿith", shortMeaning: "The Resurrector", explanation: "The One who raises the dead and awakens hearts, nations, and deeds.", sourceKeys: ["q:22:7", "tirmidhi-3507"] },
  { id: "ash-shahid", arabic: "الشَّهِيد", transliteration: "ash-Shahīd", shortMeaning: "The Witness", explanation: "The One who witnesses all things and whose testimony is complete and true.", sourceKeys: ["q:4:79", "q:41:53", "tirmidhi-3507"] },
  { id: "al-haqq", arabic: "الْحَقّ", transliteration: "al-Ḥaqq", shortMeaning: "The Truth", explanation: "The One whose existence, words, promises, and judgments are absolute truth.", sourceKeys: ["q:22:6", "q:23:116", "tirmidhi-3507"] },
  { id: "al-wakil", arabic: "الْوَكِيل", transliteration: "al-Wakīl", shortMeaning: "The Trustee", explanation: "The One entrusted with all affairs and sufficient for those who rely on Him.", sourceKeys: ["q:3:173", "q:33:3", "tirmidhi-3507"] },
  { id: "al-qawiyy", arabic: "الْقَوِيّ", transliteration: "al-Qawiyy", shortMeaning: "The Most Strong", explanation: "The One whose strength is complete and never touched by weakness.", sourceKeys: ["q:22:40", "q:58:21", "tirmidhi-3507"] },
  { id: "al-matin", arabic: "الْمَتِين", transliteration: "al-Matīn", shortMeaning: "The Firm", explanation: "The One whose power is firm, enduring, and impossible to shake.", sourceKeys: ["q:51:58", "tirmidhi-3507"] },
  { id: "al-waliyy", arabic: "الْوَلِيّ", transliteration: "al-Waliyy", shortMeaning: "The Protecting Friend", explanation: "The One who protects, supports, and lovingly takes charge of His servants.", sourceKeys: ["q:42:28", "q:7:196", "tirmidhi-3507"] },
  { id: "al-hamid", arabic: "الْحَمِيد", transliteration: "al-Ḥamīd", shortMeaning: "The Praiseworthy", explanation: "The One worthy of all praise for His perfect names, actions, and gifts.", sourceKeys: ["q:14:8", "q:31:26", "tirmidhi-3507"] },
  { id: "al-muhsi", arabic: "الْمُحْصِي", transliteration: "al-Muḥṣī", shortMeaning: "The Enumerator", explanation: "The One who counts and encompasses everything without omission or error.", sourceKeys: ["tirmidhi-3507"] },
  { id: "al-mubdi", arabic: "الْمُبْدِئ", transliteration: "al-Mubdiʾ", shortMeaning: "The Originating Beginner", explanation: "The One who begins creation and brings things into existence from nothing.", sourceKeys: ["q:10:4", "q:85:13", "tirmidhi-3507"] },
  { id: "al-muid", arabic: "الْمُعِيد", transliteration: "al-Muʿīd", shortMeaning: "The Restorer", explanation: "The One who returns creation after death and restores what He wills.", sourceKeys: ["q:10:4", "q:85:13", "tirmidhi-3507"] },
  { id: "al-muhyi", arabic: "الْمُحْيِي", transliteration: "al-Muḥyī", shortMeaning: "The Giver of Life", explanation: "The One who gives physical life, spiritual life, and resurrection after death.", sourceKeys: ["q:30:50", "q:57:2", "tirmidhi-3507"] },
  { id: "al-mumit", arabic: "الْمُمِيت", transliteration: "al-Mumīt", shortMeaning: "The Causer of Death", explanation: "The One who decrees death at its appointed time with complete wisdom.", sourceKeys: ["q:3:156", "q:57:2", "tirmidhi-3507"] },
  { id: "al-hayy", arabic: "الْحَيّ", transliteration: "al-Ḥayy", shortMeaning: "The Ever-Living", explanation: "The One whose life is perfect, eternal, and never touched by death.", sourceKeys: ["q:2:255", "q:40:65", "tirmidhi-3507"] },
  { id: "al-qayyum", arabic: "الْقَيُّوم", transliteration: "al-Qayyūm", shortMeaning: "The Self-Subsisting", explanation: "The One who exists by Himself and sustains everything else at every moment.", sourceKeys: ["q:2:255", "q:3:2", "tirmidhi-3507"] },
  { id: "al-wajid", arabic: "الْوَاجِد", transliteration: "al-Wājid", shortMeaning: "The Finder", explanation: "The One who lacks nothing and finds whatever He wills with complete ability.", sourceKeys: ["q:38:44", "tirmidhi-3507"] },
  { id: "al-maajid", arabic: "الْمَاجِد", transliteration: "al-Mājid", shortMeaning: "The Noble Glorified", explanation: "The One whose noble glory, excellence, and generosity are complete.", sourceKeys: ["tirmidhi-3507"] },
  { id: "al-wahid", arabic: "الْوَاحِد", transliteration: "al-Wāḥid", shortMeaning: "The One", explanation: "The One who is uniquely one, without partner, rival, equal, or division.", sourceKeys: ["q:2:163", "q:37:4", "tirmidhi-3507"] },
  { id: "as-samad", arabic: "الصَّمَد", transliteration: "aṣ-Ṣamad", shortMeaning: "The Eternal Refuge", explanation: "The One absolutely depended upon by all, while He needs nothing.", sourceKeys: ["q:112:2", "tirmidhi-3507"] },
  { id: "al-qadir", arabic: "الْقَادِر", transliteration: "al-Qādir", shortMeaning: "The Able", explanation: "The One fully able to do whatever He wills without weakness or limitation.", sourceKeys: ["q:6:65", "q:36:81", "tirmidhi-3507"] },
  { id: "al-muqtadir", arabic: "الْمُقْتَدِر", transliteration: "al-Muqtadir", shortMeaning: "The Powerful Determiner", explanation: "The One whose power executes every decree with complete mastery.", sourceKeys: ["q:54:42", "q:54:55", "tirmidhi-3507"] },
  { id: "al-muqaddim", arabic: "الْمُقَدِّم", transliteration: "al-Muqaddim", shortMeaning: "The Expediter", explanation: "The One who brings forward what He wills in rank, time, and honor.", sourceKeys: ["tirmidhi-3507"] },
  { id: "al-muakhkhir", arabic: "الْمُؤَخِّر", transliteration: "al-Muʾakhkhir", shortMeaning: "The Delayer", explanation: "The One who delays what He wills according to perfect wisdom and timing.", sourceKeys: ["q:71:4", "tirmidhi-3507"] },
  { id: "al-awwal", arabic: "الأَوَّل", transliteration: "al-Awwal", shortMeaning: "The First", explanation: "The One before whom there was nothing and whose existence has no beginning.", sourceKeys: ["q:57:3", "tirmidhi-3507"] },
  { id: "al-akhir", arabic: "الآخِر", transliteration: "al-Ākhir", shortMeaning: "The Last", explanation: "The One after whom there is nothing and whose existence has no end.", sourceKeys: ["q:57:3", "tirmidhi-3507"] },
  { id: "az-zahir", arabic: "الظَّاهِر", transliteration: "aẓ-Ẓāhir", shortMeaning: "The Manifest", explanation: "The One whose signs, power, and truth are evident above all things.", sourceKeys: ["q:57:3", "tirmidhi-3507"] },
  { id: "al-batin", arabic: "الْبَاطِن", transliteration: "al-Bāṭin", shortMeaning: "The Hidden", explanation: "The One fully aware of hidden realities and beyond the grasp of sight.", sourceKeys: ["q:57:3", "tirmidhi-3507"] },
  { id: "al-wali", arabic: "الْوَالِي", transliteration: "al-Wālī", shortMeaning: "The Governor", explanation: "The One who governs, manages, and disposes of all affairs.", sourceKeys: ["tirmidhi-3507"] },
  { id: "al-mutaali", arabic: "الْمُتَعَالِي", transliteration: "al-Mutaʿālī", shortMeaning: "The Most Exalted", explanation: "The One supremely exalted above every deficiency, comparison, and limitation.", sourceKeys: ["q:13:9", "tirmidhi-3507"] },
  { id: "al-barr", arabic: "الْبَرّ", transliteration: "al-Barr", shortMeaning: "The Source of Goodness", explanation: "The One abundant in kindness, goodness, truthfulness, and beneficence.", sourceKeys: ["q:52:28", "tirmidhi-3507"] },
  { id: "at-tawwab", arabic: "التَّوَّاب", transliteration: "at-Tawwāb", shortMeaning: "The Accepter of Repentance", explanation: "The One who turns servants back to Him and accepts sincere repentance repeatedly.", sourceKeys: ["q:2:37", "q:110:3", "tirmidhi-3507"] },
  { id: "al-muntaqim", arabic: "الْمُنْتَقِم", transliteration: "al-Muntaqim", shortMeaning: "The Avenger", explanation: "The One who justly takes retribution against wrongdoing when His wisdom decrees.", sourceKeys: ["q:32:22", "q:43:41", "tirmidhi-3507"] },
  { id: "al-afuw", arabic: "الْعَفُوّ", transliteration: "al-ʿAfuww", shortMeaning: "The Pardoner", explanation: "The One who erases sins, pardons faults, and removes their consequences.", sourceKeys: ["q:4:149", "q:22:60", "tirmidhi-3507"] },
  { id: "ar-rauf", arabic: "الرَّؤُوف", transliteration: "ar-Raʾūf", shortMeaning: "The Most Kind", explanation: "The One whose tenderness and compassion toward His servants are immense.", sourceKeys: ["q:2:143", "q:57:9", "tirmidhi-3507"] },
  { id: "malik-ul-mulk", arabic: "مَالِكُ الْمُلْك", transliteration: "Mālik ul-Mulk", shortMeaning: "Owner of the Kingdom", explanation: "The One who owns all dominion and grants or removes authority as He wills.", sourceKeys: ["q:3:26", "tirmidhi-3507"] },
  { id: "dhul-jalali-wal-ikram", arabic: "ذُو الْجَلَالِ وَالْإِكْرَام", transliteration: "Dhū al-Jalāli wa-l-Ikrām", shortMeaning: "Possessor of Majesty and Honor", explanation: "The One possessed of majestic greatness and perfect generosity toward creation.", sourceKeys: ["q:55:27", "q:55:78", "tirmidhi-3507"] },
  { id: "al-muqsit", arabic: "الْمُقْسِط", transliteration: "al-Muqsiṭ", shortMeaning: "The Equitable", explanation: "The One who establishes fairness and restores rights with perfect justice.", sourceKeys: ["tirmidhi-3507"] },
  { id: "al-jami", arabic: "الْجَامِع", transliteration: "al-Jāmiʿ", shortMeaning: "The Gatherer", explanation: "The One who gathers creation, hearts, deeds, and people for the appointed Day.", sourceKeys: ["q:3:9", "tirmidhi-3507"] },
  { id: "al-ghaniyy", arabic: "الْغَنِيّ", transliteration: "al-Ghaniyy", shortMeaning: "The Self-Sufficient", explanation: "The One free of all need, while every creature depends entirely on Him.", sourceKeys: ["q:3:97", "q:47:38", "tirmidhi-3507"] },
  { id: "al-mughni", arabic: "الْمُغْنِي", transliteration: "al-Mughnī", shortMeaning: "The Enricher", explanation: "The One who enriches and grants sufficiency to whomever He wills.", sourceKeys: ["q:9:28", "tirmidhi-3507"] },
  { id: "al-mani", arabic: "الْمَانِع", transliteration: "al-Māniʿ", shortMeaning: "The Preventer", explanation: "The One who prevents harm, withholds by wisdom, and blocks what He wills.", sourceKeys: ["tirmidhi-3507"] },
  { id: "ad-darr", arabic: "الضَّارّ", transliteration: "aḍ-Ḍārr", shortMeaning: "The Distresser", explanation: "The One who can allow hardship by wisdom, trial, justice, or purification.", sourceKeys: ["tirmidhi-3507"] },
  { id: "an-nafi", arabic: "النَّافِع", transliteration: "an-Nāfiʿ", shortMeaning: "The Benefiter", explanation: "The One who brings benefit, protection, guidance, and every true good.", sourceKeys: ["tirmidhi-3507"] },
  { id: "an-nur", arabic: "النُّور", transliteration: "an-Nūr", shortMeaning: "The Light", explanation: "The One who is the light of the heavens and earth and guides by light.", sourceKeys: ["q:24:35", "tirmidhi-3507"] },
  { id: "al-hadi", arabic: "الْهَادِي", transliteration: "al-Hādī", shortMeaning: "The Guide", explanation: "The One who guides hearts, paths, communities, and servants to truth.", sourceKeys: ["q:25:31", "tirmidhi-3507"] },
  { id: "al-badi", arabic: "الْبَدِيع", transliteration: "al-Badīʿ", shortMeaning: "The Incomparable Originator", explanation: "The One who originates the heavens and earth without precedent or example.", sourceKeys: ["q:2:117", "q:6:101", "tirmidhi-3507"] },
  { id: "al-baqi", arabic: "الْبَاقِي", transliteration: "al-Bāqī", shortMeaning: "The Everlasting", explanation: "The One who remains forever after all created things pass away.", sourceKeys: ["q:55:27", "tirmidhi-3507"] },
  { id: "al-warith", arabic: "الْوَارِث", transliteration: "al-Wārith", shortMeaning: "The Inheritor", explanation: "The One to whom all things return after every owner and kingdom disappears.", sourceKeys: ["q:15:23", "tirmidhi-3507"] },
  { id: "ar-rashid", arabic: "الرَّشِيد", transliteration: "ar-Rashīd", shortMeaning: "The Guide to Right", explanation: "The One whose guidance and management lead to what is right and sound.", sourceKeys: ["tirmidhi-3507"] },
  { id: "as-sabur", arabic: "الصَّبُور", transliteration: "aṣ-Ṣabūr", shortMeaning: "The Patient", explanation: "The One who does not hasten punishment and acts with perfect timing.", sourceKeys: ["tirmidhi-3507"] },
];

export const NAMES_OF_ALLAH: NameOfAllah[] = RAW_NAMES_OF_ALLAH.map((name) => ({
  id: name.id,
  arabic: name.arabic,
  transliteration: name.transliteration,
  shortMeaning: name.shortMeaning,
  explanation: name.explanation,
  sources: name.sourceKeys.map(sourceFromKey),
}));
