import Link from "next/link";

import { FoundationsBadge } from "@/components/foundations-badge";

export const metadata = { title: "Foundations · Qur’ān-reading basics" };

interface FoundationCard {
  href: string;
  title: string;
  titleArabic: string;
  description: string;
  accent: string;
  tier: "A" | "B";
}

const CARDS: FoundationCard[] = [
  {
    href: "/read/alphabet",
    title: "Arabic alphabet",
    titleArabic: "الحُرُوف العَرَبِيَّة",
    description:
      "All 28 letters with their isolated, initial, medial, and final shapes. Speaker button and Qur’ānic example word on every letter.",
    accent:
      "bg-[oklch(0.93_0.05_220)] text-[oklch(0.30_0.10_220)] dark:bg-[oklch(0.30_0.06_220)] dark:text-[oklch(0.85_0.08_220)]",
    tier: "A",
  },
  {
    href: "/read/connecting-letters",
    title: "Connecting letters",
    titleArabic: "حُرُوف الاتِّصَال",
    description:
      "How letters join inside a word — and the 6 special letters that never attach to what follows them. Interactive joining demo.",
    accent:
      "bg-[oklch(0.93_0.05_40)] text-[oklch(0.30_0.10_40)] dark:bg-[oklch(0.30_0.06_40)] dark:text-[oklch(0.85_0.08_40)]",
    tier: "A",
  },
  {
    href: "/read/harakat",
    title: "Harakāt (diacritics)",
    titleArabic: "الحَرَكَات",
    description:
      "Fatḥa, kasra, ḍamma, sukūn, tanwīn, and shadda — the marks that turn bare consonants into full syllables.",
    accent:
      "bg-[oklch(0.93_0.05_350)] text-[oklch(0.30_0.10_350)] dark:bg-[oklch(0.30_0.06_350)] dark:text-[oklch(0.85_0.08_350)]",
    tier: "A",
  },
  {
    href: "/read/madd",
    title: "Long vowels (Madd)",
    titleArabic: "حُرُوف المَدّ",
    description:
      "Alif, wāw, and yā’ as elongation letters. Short-vs-long vowel pairs side by side.",
    accent:
      "bg-[oklch(0.93_0.05_145)] text-[oklch(0.30_0.10_145)] dark:bg-[oklch(0.30_0.06_145)] dark:text-[oklch(0.85_0.08_145)]",
    tier: "B",
  },
  {
    href: "/read/sun-moon",
    title: "Sun & moon letters",
    titleArabic: "الحُرُوف الشَّمْسِيَّة وَالقَمَرِيَّة",
    description:
      "The 14/14 split that controls how the definite article ’al-’ is pronounced. Tap any noun to hear the rule in action.",
    accent:
      "bg-[oklch(0.93_0.05_80)] text-[oklch(0.30_0.10_80)] dark:bg-[oklch(0.30_0.06_80)] dark:text-[oklch(0.85_0.08_80)]",
    tier: "B",
  },
  {
    href: "/read/makharij",
    title: "Makhārij (articulation points)",
    titleArabic: "مَخَارِج الحُرُوف",
    description:
      "Where in the mouth and throat each Arabic letter originates — the foundation of tajwīd.",
    accent:
      "bg-[oklch(0.93_0.05_270)] text-[oklch(0.30_0.10_270)] dark:bg-[oklch(0.30_0.06_270)] dark:text-[oklch(0.85_0.08_270)]",
    tier: "B",
  },
  {
    href: "/read/tajweed",
    title: "Tajweed basics",
    titleArabic: "التَّجْوِيد",
    description:
      "The pronunciation rules of Qurʼānic recitation — qalqalah, nūn sākinah, tanwīn — in beginner-friendly language. Advanced rules tucked behind a toggle.",
    accent:
      "bg-[oklch(0.93_0.05_10)] text-[oklch(0.30_0.10_10)] dark:bg-[oklch(0.30_0.06_10)] dark:text-[oklch(0.85_0.08_10)]",
    tier: "B",
  },
  {
    href: "/read/surahs",
    title: "Short surahs · word by word",
    titleArabic: "السُّوَر القَصِيرَة",
    description:
      "Tap any word in Al-Fātiḥah and the short surahs of Juzʼ ʿAmma to see its meaning, root, and grammar tag — plus per-ayah recitation audio.",
    accent:
      "bg-[oklch(0.93_0.05_180)] text-[oklch(0.30_0.10_180)] dark:bg-[oklch(0.30_0.06_180)] dark:text-[oklch(0.85_0.08_180)]",
    tier: "B",
  },
];

export default function ReadQuranPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <div className="mb-3">
          <FoundationsBadge />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Foundations</h1>
        <p className="mt-1 text-sm font-medium text-foreground-soft">
          Reading basics for Qurʼānic Arabic.
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          The script-level groundwork every beginner needs before picking up a
          muṣḥaf — the alphabet in all four positional shapes, how letters join
          together, the diacritics that shape every syllable, and the
          articulation points that give each letter its unique sound. This
          content is baked into the site and is independent of your curriculum
          document.
        </p>
      </header>

      <Section title="Core basics" subtitle="The script, letter forms, and vowel marks.">
        <CardGrid>
          {CARDS.filter((c) => c.tier === "A").map((c) => (
            <Card key={c.href} card={c} />
          ))}
        </CardGrid>
      </Section>

      <Section
        title="Recitation rules"
        subtitle="Elongation, the ’al-’ assimilation rule, and articulation points."
      >
        <CardGrid>
          {CARDS.filter((c) => c.tier === "B").map((c) => (
            <Card key={c.href} card={c} />
          ))}
        </CardGrid>
      </Section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

function Card({ card }: { card: FoundationCard }) {
  return (
    <Link
      href={card.href}
      className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30 hover:bg-muted focus-ring sm:p-6"
    >
      <span
        className={
          "self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider " +
          card.accent
        }
      >
        Foundations
      </span>
      <h3 className="text-xl font-semibold tracking-tight">
        {card.title}
        <span
          lang="ar"
          dir="rtl"
          className="ml-2 font-arabic text-base font-normal text-foreground-soft"
        >
          {card.titleArabic}
        </span>
      </h3>
      <p className="text-sm text-muted-foreground">{card.description}</p>
      <span className="mt-auto text-xs font-medium text-primary group-hover:underline">
        Open →
      </span>
    </Link>
  );
}
