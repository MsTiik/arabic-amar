import { stripDiacritics } from "./diacritics";

/**
 * Approximate the space a displayed Arabic string needs. Combining tashkeel
 * marks are important visually, but they do not occupy their own horizontal
 * character cell and must not make otherwise-readable text shrink.
 */
export function visibleArabicLength(text: string | undefined): number {
  return stripDiacritics(text ?? "").replace(/\s+/g, " ").trim().length;
}

/** Large prompt/flashcard sizing. Every returned class is kept as a complete
 * literal so Tailwind can discover it during compilation. */
export function arabicDisplaySize(text: string | undefined): string {
  const len = visibleArabicLength(text);
  if (len <= 12) return "text-6xl sm:text-8xl";
  if (len <= 22) return "text-5xl sm:text-7xl";
  if (len <= 34) return "text-4xl sm:text-6xl";
  return "text-3xl sm:text-5xl";
}

/** Sizing for narrower answer tiles. Prefer wrapping and a taller tile before
 * reducing Arabic below a comfortable reading size. */
export function arabicOptionSize(text: string | undefined): string {
  const len = visibleArabicLength(text);
  if (len <= 28) return "text-3xl sm:text-4xl";
  return "text-2xl sm:text-3xl";
}

export function englishDisplaySize(text: string | undefined): string {
  const len = text?.trim().length ?? 0;
  if (len <= 16) return "text-4xl sm:text-7xl";
  if (len <= 28) return "text-3xl sm:text-5xl";
  if (len <= 64) return "text-2xl sm:text-4xl";
  return "text-xl sm:text-3xl";
}

/** Long paired forms get more room instead of paying for fit with tiny type. */
export function flashcardSceneSize(
  arabic: string | undefined,
  english: string | undefined,
): string {
  if (visibleArabicLength(arabic) > 22 || (english?.trim().length ?? 0) > 44) {
    return "h-64 sm:h-96";
  }
  return "h-56 sm:h-80";
}
