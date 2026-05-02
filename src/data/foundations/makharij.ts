/**
 * Makhārij — the articulation points of Arabic letters.
 *
 * Scholars traditionally identify 17 specific articulation points, grouped
 * under 5 major zones. This file gives beginner-oriented descriptions plus
 * the set of letters belonging to each zone.
 */

export interface MakhrajZone {
  slug: string;
  nameArabic: string;
  name: string;
  /** Short beginner description of where the sound comes from. */
  description: string;
  /** Letters that belong to this zone. */
  letters: readonly string[];
  /** Sub-points (detail view). */
  subPoints: {
    name: string;
    description: string;
    letters: readonly string[];
  }[];
}

export const MAKHRAJ_ZONES: MakhrajZone[] = [
  {
    slug: "jawf",
    nameArabic: "الجَوف",
    name: "Oral cavity (al-Jawf)",
    description:
      "The empty space of the throat and mouth. No specific contact point — the sound rides on the breath. This is the zone of the long vowels (madd).",
    letters: ["ا", "و", "ي"],
    subPoints: [
      {
        name: "Empty space",
        description:
          "The long vowels: sukūn-alif preceded by fatḥa, sukūn-wāw preceded by ḍamma, sukūn-yā' preceded by kasra.",
        letters: ["ا", "و", "ي"],
      },
    ],
  },
  {
    slug: "halq",
    nameArabic: "الحَلْق",
    name: "Throat (al-Ḥalq)",
    description:
      "Three distinct points within the throat: the deepest (close to the chest), the middle, and the nearest (close to the mouth).",
    letters: ["ء", "ه", "ع", "ح", "غ", "خ"],
    subPoints: [
      {
        name: "Deepest throat",
        description: "Closest to the chest. The source of hamza and hā'.",
        letters: ["ء", "ه"],
      },
      {
        name: "Middle throat",
        description: "The centre of the throat. Source of ʿayn and ḥā'.",
        letters: ["ع", "ح"],
      },
      {
        name: "Near throat",
        description: "Closest to the mouth. Source of ghayn and khā'.",
        letters: ["غ", "خ"],
      },
    ],
  },
  {
    slug: "lisan",
    nameArabic: "اللِّسَان",
    name: "Tongue (al-Lisān)",
    description:
      "The tongue — by far the richest articulator, with 10 distinct points producing 18 letters. Includes the deepest back of the tongue, the middle, the sides, and the tip.",
    letters: [
      "ق",
      "ك",
      "ج",
      "ش",
      "ي",
      "ض",
      "ل",
      "ن",
      "ر",
      "ت",
      "د",
      "ط",
      "ث",
      "ذ",
      "ظ",
      "س",
      "ز",
      "ص",
    ],
    subPoints: [
      {
        name: "Deepest tongue + upper palate",
        description: "The tongue's back raises toward the soft palate. Source of qāf.",
        letters: ["ق"],
      },
      {
        name: "Back of tongue (slightly forward)",
        description: "A little forward of qāf. Source of kāf.",
        letters: ["ك"],
      },
      {
        name: "Middle of tongue",
        description: "Middle of the tongue against the hard palate. Source of jīm, shīn, yā'.",
        letters: ["ج", "ش", "ي"],
      },
      {
        name: "Sides of tongue",
        description:
          "The sides of the tongue press against the upper molars — the unique origin of ḍād.",
        letters: ["ض"],
      },
      {
        name: "Tip of tongue — upper gum",
        description: "Tongue tip behind upper gums. Source of lām, nūn, rā'.",
        letters: ["ل", "ن", "ر"],
      },
      {
        name: "Tongue tip + base of upper teeth",
        description: "Tongue tip pressed against the root of the upper front teeth. Source of tā', dāl, ṭā'.",
        letters: ["ت", "د", "ط"],
      },
      {
        name: "Tongue tip + edge of upper teeth",
        description:
          "Tongue tip lightly touching the tips of the upper front teeth. Source of thā', dhāl, ẓā'.",
        letters: ["ث", "ذ", "ظ"],
      },
      {
        name: "Tongue tip + lower teeth",
        description:
          "Tongue tip just behind the lower front teeth. Source of sīn, zāy, ṣād.",
        letters: ["س", "ز", "ص"],
      },
    ],
  },
  {
    slug: "shafatayn",
    nameArabic: "الشَّفَتَان",
    name: "Lips (ash-Shafatān)",
    description: "The two lips. Either both lips together, or the upper teeth on the lower lip.",
    letters: ["ب", "م", "و", "ف"],
    subPoints: [
      {
        name: "Both lips together",
        description: "Lips meet completely. Source of bā', mīm, and wāw (as a consonant).",
        letters: ["ب", "م", "و"],
      },
      {
        name: "Upper teeth on lower lip",
        description: "Inside of the upper front teeth rests on the lower lip. Source of fā'.",
        letters: ["ف"],
      },
    ],
  },
  {
    slug: "khayshum",
    nameArabic: "الخَيْشُوم",
    name: "Nasal cavity (al-Khayshūm)",
    description:
      "The inside of the nose — the source of the ghunna (nasalization) on sounds like nūn and mīm, especially when they carry a shaddah or during ikhfā' / idghām with ghunna.",
    letters: ["ن", "م"],
    subPoints: [
      {
        name: "Ghunna",
        description:
          "The hum / nasalization heard on nūn and mīm. Not a letter origin per se, but a required dimension of their full pronunciation.",
        letters: ["ن", "م"],
      },
    ],
  },
];
