/**
 * Learner level — a light gamification layer derived purely from how many
 * words have been mastered. Nothing is stored; the level is recomputed from
 * existing progress so it can never drift out of sync with mastery.
 */
export interface LearnerLevel {
  /** 1-based level number. */
  level: number;
  title: string;
  /** Mastered words needed to reach this level. */
  floor: number;
  /** Mastered words needed for the next level, or null at the top level. */
  next: number | null;
  /** 0..1 progress from this level's floor to the next. */
  progress: number;
  /** Words still needed for the next level (0 at the top). */
  remaining: number;
}

const LEVELS: ReadonlyArray<{ floor: number; title: string }> = [
  { floor: 0, title: "Newcomer" },
  { floor: 10, title: "Beginner" },
  { floor: 25, title: "Learner" },
  { floor: 50, title: "Word builder" },
  { floor: 100, title: "Reader" },
  { floor: 175, title: "Speaker" },
  { floor: 275, title: "Scholar" },
  { floor: 400, title: "Master" },
];

export function getLearnerLevel(masteredWords: number): LearnerLevel {
  const mastered = Math.max(0, Math.floor(masteredWords));
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (mastered >= LEVELS[i].floor) index = i;
  }
  const current = LEVELS[index];
  const nextLevel = LEVELS[index + 1] ?? null;
  const next = nextLevel ? nextLevel.floor : null;
  const span = next === null ? 0 : next - current.floor;
  const progress = next === null ? 1 : Math.min(1, (mastered - current.floor) / span);
  return {
    level: index + 1,
    title: current.title,
    floor: current.floor,
    next,
    progress,
    remaining: next === null ? 0 : Math.max(0, next - mastered),
  };
}
