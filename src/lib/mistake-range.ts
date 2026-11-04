import type { LevelTwoReadingSentence } from "@/data/level-two-lessons";

/**
 * The words of `board` that differ from `fixed`: everything between the
 * longest shared start and the longest shared end. Tapping any of them
 * counts as finding the mistake.
 */
export function mistakeRange(board: LevelTwoReadingSentence, fixed: LevelTwoReadingSentence): [number, number] {
  const a = board.tokens.map((token) => token.arabic);
  const b = fixed.tokens.map((token) => token.arabic);
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let end = 0;
  while (end < a.length - start && end < b.length - start && a[a.length - 1 - end] === b[b.length - 1 - end]) end++;
  return [start, a.length - end];
}
