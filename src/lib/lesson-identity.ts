import {
  BookMarked,
  BookOpen,
  CalendarDays,
  Clock,
  Hand,
  Handshake,
  Hash,
  MoonStar,
  Palette,
  PencilLine,
  Shapes,
  ShoppingBasket,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface LessonIdentity {
  icon: LucideIcon;
  /** Soft background + strong text, for icon/number chips and badges. */
  chip: string;
  /** Solid fill for progress bars and accents. */
  bar: string;
}

/* Tailwind needs complete literal class strings, so each hue is written out in full. */
const HUE_CLASSES = {
  25: {
    chip: "bg-[oklch(0.93_0.05_25)] text-[oklch(0.35_0.11_25)] dark:bg-[oklch(0.32_0.06_25)] dark:text-[oklch(0.85_0.08_25)]",
    bar: "bg-[oklch(0.55_0.13_25)]",
  },
  55: {
    chip: "bg-[oklch(0.93_0.05_55)] text-[oklch(0.35_0.11_55)] dark:bg-[oklch(0.32_0.06_55)] dark:text-[oklch(0.85_0.08_55)]",
    bar: "bg-[oklch(0.55_0.13_55)]",
  },
  80: {
    chip: "bg-[oklch(0.93_0.05_80)] text-[oklch(0.35_0.11_80)] dark:bg-[oklch(0.32_0.06_80)] dark:text-[oklch(0.85_0.08_80)]",
    bar: "bg-[oklch(0.55_0.13_80)]",
  },
  115: {
    chip: "bg-[oklch(0.93_0.05_115)] text-[oklch(0.35_0.11_115)] dark:bg-[oklch(0.32_0.06_115)] dark:text-[oklch(0.85_0.08_115)]",
    bar: "bg-[oklch(0.55_0.13_115)]",
  },
  145: {
    chip: "bg-[oklch(0.93_0.05_145)] text-[oklch(0.35_0.11_145)] dark:bg-[oklch(0.32_0.06_145)] dark:text-[oklch(0.85_0.08_145)]",
    bar: "bg-[oklch(0.55_0.13_145)]",
  },
  170: {
    chip: "bg-[oklch(0.93_0.05_170)] text-[oklch(0.35_0.11_170)] dark:bg-[oklch(0.32_0.06_170)] dark:text-[oklch(0.85_0.08_170)]",
    bar: "bg-[oklch(0.55_0.13_170)]",
  },
  200: {
    chip: "bg-[oklch(0.93_0.05_200)] text-[oklch(0.35_0.11_200)] dark:bg-[oklch(0.32_0.06_200)] dark:text-[oklch(0.85_0.08_200)]",
    bar: "bg-[oklch(0.55_0.13_200)]",
  },
  230: {
    chip: "bg-[oklch(0.93_0.05_230)] text-[oklch(0.35_0.11_230)] dark:bg-[oklch(0.32_0.06_230)] dark:text-[oklch(0.85_0.08_230)]",
    bar: "bg-[oklch(0.55_0.13_230)]",
  },
  260: {
    chip: "bg-[oklch(0.93_0.05_260)] text-[oklch(0.35_0.11_260)] dark:bg-[oklch(0.32_0.06_260)] dark:text-[oklch(0.85_0.08_260)]",
    bar: "bg-[oklch(0.55_0.13_260)]",
  },
  300: {
    chip: "bg-[oklch(0.93_0.05_300)] text-[oklch(0.35_0.11_300)] dark:bg-[oklch(0.32_0.06_300)] dark:text-[oklch(0.85_0.08_300)]",
    bar: "bg-[oklch(0.55_0.13_300)]",
  },
  330: {
    chip: "bg-[oklch(0.93_0.05_330)] text-[oklch(0.35_0.11_330)] dark:bg-[oklch(0.32_0.06_330)] dark:text-[oklch(0.85_0.08_330)]",
    bar: "bg-[oklch(0.55_0.13_330)]",
  },
  350: {
    chip: "bg-[oklch(0.93_0.05_350)] text-[oklch(0.35_0.11_350)] dark:bg-[oklch(0.32_0.06_350)] dark:text-[oklch(0.85_0.08_350)]",
    bar: "bg-[oklch(0.55_0.13_350)]",
  },
} as const;

type Hue = keyof typeof HUE_CLASSES;

function identity(icon: LucideIcon, hue: Hue): LessonIdentity {
  return { icon, ...HUE_CLASSES[hue] };
}

const TOPIC_IDENTITIES: Record<string, LessonIdentity> = {
  "body-parts": identity(Hand, 25),
  numbers: identity(Hash, 260),
  time: identity(Clock, 200),
  "days-of-the-week": identity(CalendarDays, 145),
  "islamic-and-gregorian-months": identity(MoonStar, 300),
  entities: identity(Shapes, 80),
  "getting-to-know-each-other": identity(Handshake, 350),
  "nouns-in-the-classroom": identity(BookOpen, 230),
  "verbs-in-the-classroom": identity(PencilLine, 170),
  "the-marketplace": identity(ShoppingBasket, 55),
  colours: identity(Palette, 330),
  "command-verbs-in-the-qur-an": identity(BookMarked, 115),
};

const FALLBACK_HUES: readonly Hue[] = [25, 80, 145, 200, 260, 330];

/** Stable identity (icon + accent hue) for a lesson topic slug. */
export function getLessonIdentity(topicSlug: string): LessonIdentity {
  const known = TOPIC_IDENTITIES[topicSlug];
  if (known) return known;
  let hash = 0;
  for (let i = 0; i < topicSlug.length; i++) {
    hash = (hash * 31 + topicSlug.charCodeAt(i)) | 0;
  }
  return identity(BookOpen, FALLBACK_HUES[Math.abs(hash) % FALLBACK_HUES.length]);
}
