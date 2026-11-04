/**
 * Splits English text around its Arabic runs: `text.split(ARABIC_RUN)` puts
 * the Arabic at odd indexes. Letters, harakat and tatweel join a run; the
 * Arabic comma deliberately does not, so "مَكْتَب → مَكَاتِب، مِسْطَرَة → مَسَاطِر"
 * stays as separate pieces in reading order instead of one right-to-left span
 * that would flip the pairs.
 */
const ARABIC_LETTER = "\\u0610-\\u061A\\u0620-\\u065F\\u0670-\\u06D3";

export const ARABIC_RUN = new RegExp(`([${ARABIC_LETTER}](?:[${ARABIC_LETTER}\\s]*[${ARABIC_LETTER}])?؟?)`);
