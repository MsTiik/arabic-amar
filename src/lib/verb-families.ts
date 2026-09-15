import {
  VERB_FORM_KEYS,
  type VerbFamily,
  type VerbFormKey,
} from "@/data/verb-families";

export const VERB_FORM_META: Record<
  VerbFormKey,
  { shortLabel: string; arabicLabel: string; grammarLabel: string; prompt: string }
> = {
  past: {
    shortLabel: "Past",
    arabicLabel: "المَاضِي",
    grammarLabel: "Māḍī",
    prompt: "he did…",
  },
  present: {
    shortLabel: "Present",
    arabicLabel: "المُضَارِع",
    grammarLabel: "Muḍāriʿ",
    prompt: "he does…",
  },
  command: {
    shortLabel: "Command",
    arabicLabel: "الأَمْر",
    grammarLabel: "Amr",
    prompt: "do…!",
  },
  masdar: {
    shortLabel: "Verbal noun",
    arabicLabel: "المَصْدَر",
    grammarLabel: "Maṣdar",
    prompt: "the action",
  },
};

/** Stable shuffle, so a round stays put during React re-renders. */
export function shuffledVerbFormKeys(seed: number): VerbFormKey[] {
  const keys = [...VERB_FORM_KEYS];
  let state = seed || 1;
  for (let i = keys.length - 1; i > 0; i--) {
    state = (state * 9301 + 49297) % 233280;
    const j = Math.floor((state / 233280) * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  return keys;
}
export function isVerbSortCorrect(
  placements: Partial<Record<VerbFormKey, VerbFormKey>>,
): boolean {
  return VERB_FORM_KEYS.every((key) => placements[key] === key);
}

export function findVerbFamily(
  families: VerbFamily[],
  id: string,
): VerbFamily | undefined {
  return families.find((family) => family.id === id);
}
