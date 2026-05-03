/** Central registry of word-by-word surah data. */

import type { Surah } from "./types";
import { SURAH_AL_FATIHAH } from "./surahs/al-fatihah";
import { SURAH_AL_FALAQ } from "./surahs/al-falaq";
import { SURAH_AL_FIL } from "./surahs/al-fil";
import { SURAH_AL_IKHLAS } from "./surahs/al-ikhlas";
import { SURAH_AL_KAFIRUN } from "./surahs/al-kafirun";
import { SURAH_AL_KAWTHAR } from "./surahs/al-kawthar";
import { SURAH_AL_LAHAB } from "./surahs/al-lahab";
import { SURAH_AL_MAUN } from "./surahs/al-maun";
import { SURAH_AN_NAS } from "./surahs/an-nas";
import { SURAH_AN_NASR } from "./surahs/an-nasr";
import { SURAH_QURAYSH } from "./surahs/quraysh";

export type { Surah, QuranAyah, QuranWord, QuranWordPos } from "./types";

/** All surahs we have authored word-by-word data for, in display order
 *  (Al-Fātiḥah first, then short surahs descending from juzʾ ʿAmma —
 *  surah 114 down to surah 105). */
export const SURAHS: Surah[] = [
  SURAH_AL_FATIHAH,
  SURAH_AN_NAS,
  SURAH_AL_FALAQ,
  SURAH_AL_IKHLAS,
  SURAH_AL_LAHAB,
  SURAH_AN_NASR,
  SURAH_AL_KAFIRUN,
  SURAH_AL_KAWTHAR,
  SURAH_AL_MAUN,
  SURAH_QURAYSH,
  SURAH_AL_FIL,
];

export function getSurah(number: number): Surah | undefined {
  return SURAHS.find((s) => s.number === number);
}

/** Quran.com Alafasy MP3 URL for a single ayah. Pads surah and ayah to 3
 *  digits each. Already used for example-word audio in the existing
 *  audio manifest pipeline. */
export function ayahAudioUrl(surahNumber: number, ayahNumber: number): string {
  const s = String(surahNumber).padStart(3, "0");
  const a = String(ayahNumber).padStart(3, "0");
  return `https://verses.quran.com/Alafasy/mp3/${s}${a}.mp3`;
}
