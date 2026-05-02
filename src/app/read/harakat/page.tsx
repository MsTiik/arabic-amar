import Link from "next/link";

import { ArabicText } from "@/components/arabic-text";
import { FoundationsBadge } from "@/components/foundations-badge";
import { LetterSpeakerButton } from "@/components/letter-speaker-button";
import {
  SHORT_VOWELS,
  SUKUN,
  SHADDA,
  TANWIN,
  type HarakahEntry,
} from "@/data/foundations";

export const metadata = { title: "Harakāt · Foundations" };

export default function HarakatPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href="/read"
          className="text-sm text-muted-foreground hover:text-foreground focus-ring"
        >
          ← Back to Foundations
        </Link>
      </div>

      <header className="mb-8">
        <div className="mb-3">
          <FoundationsBadge />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Harakāt — the diacritics
          <span
            lang="ar"
            dir="rtl"
            className="ml-3 font-arabic text-2xl font-normal text-foreground-soft"
          >
            الحَرَكَات
          </span>
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Arabic letters on their own are just consonants. The small marks
          placed above or below them — harakāt and other tashkīl — are what
          turn those bare consonants into full syllables. The Qur’ān uses full
          tashkīl throughout, which is why learning these marks is essential
          before reading a single verse.
        </p>
      </header>

      <Section title="Short vowels" subtitle="The three core vowel marks: fatḥa, kasra, ḍamma.">
        <div className="grid gap-4 lg:grid-cols-3">
          {SHORT_VOWELS.map((h) => (
            <HarakahCard key={h.slug} h={h} accentTone="primary" />
          ))}
        </div>
        <CompareRow entries={SHORT_VOWELS} />
      </Section>

      <Section title="Sukūn" subtitle="The ’no vowel’ mark — stops the consonant.">
        <div className="grid gap-4 lg:grid-cols-2">
          <HarakahCard h={SUKUN} accentTone="muted" />
          <InfoCard
            title="How to read sukūn"
            body="A letter carrying sukūn is pronounced as a bare consonant with no vowel sound after it. In Noorani Qaida this is drilled with pairs like بَبْ (bab), بِبْ (bib), بُبْ (bub) — the second letter cuts the syllable clean."
          />
        </div>
      </Section>

      <Section title="Shadda" subtitle="The doubling mark — hold the letter.">
        <div className="grid gap-4 lg:grid-cols-2">
          <HarakahCard h={SHADDA} accentTone="gold" />
          <InfoCard
            title="How to read shadda"
            body="A shadda doubles the letter — pronounce it twice, with the first instance ending on a sukūn and the second carrying the vowel written above the shadda. بَبَّ is read ba-bba, not just ba-ba."
          />
        </div>
      </Section>

      <Section
        title="Tanwīn"
        subtitle="Doubled vowel endings that add an -n sound without writing it."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {TANWIN.map((h) => (
            <HarakahCard key={h.slug} h={h} accentTone="primary" />
          ))}
        </div>
        <InfoCard
          title="When does tanwīn appear?"
          body="Tanwīn only appears on the final letter of indefinite nouns and adjectives (the ’a/an’ case). The letter ن is not written — the unwritten ’n’ is implied by the doubled mark. In Qur’ānic manuscripts, tanwīn often interacts with the next word’s first letter through the tajwīd rules (iẓhār, idghām, iqlāb, ikhfā’)."
        />
      </Section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="mb-2 text-base font-semibold text-foreground">
          Next step
        </h2>
        <p>
          Once you’re comfortable with the short vowels, learn how they
          interact with alif / wāw / yā’ to produce the long vowels:{" "}
          <Link href="/read/madd" className="text-primary hover:underline">
            Long vowels (Madd)
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function HarakahCard({
  h,
  accentTone,
}: {
  h: HarakahEntry;
  accentTone: "primary" | "gold" | "muted";
}) {
  const toneBorder =
    accentTone === "gold"
      ? "border-accent-gold/40"
      : accentTone === "muted"
        ? "border-border"
        : "border-primary/30";
  const toneBg =
    accentTone === "gold"
      ? "bg-accent-gold-soft"
      : accentTone === "muted"
        ? "bg-background-soft"
        : "bg-background-soft";
  return (
    <article className={`flex flex-col gap-3 rounded-2xl border bg-card p-5 ${toneBorder}`}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <ArabicText variant="display" as="span" className="text-2xl">
            {h.nameArabic}
          </ArabicText>
          <div className="text-sm">
            <span className="italic">{h.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">“{h.carrier.translit}”</span>
          </div>
        </div>
        <LetterSpeakerButton
          text={h.carrier.syllable}
          ariaLabel={`Play pronunciation of ${h.carrier.translit}`}
          size="md"
          ttsOnly
        />
      </header>

      <div
        className={`flex items-center justify-center rounded-xl ${toneBg} py-4`}
        lang="ar"
        dir="rtl"
      >
        <span className="font-arabic-display text-5xl sm:text-6xl">
          {h.carrier.syllable}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">{h.description}</p>
      <p className="text-xs text-muted-foreground">
        <strong className="font-semibold text-foreground">Sound:</strong>{" "}
        {h.soundEffect}
      </p>

      <div className="mt-1 flex items-center justify-between rounded-xl border border-border bg-background-soft px-3 py-2">
        <div>
          <ArabicText variant="display" as="span" className="text-xl">
            {h.example.arabic}
          </ArabicText>
          <span className="ml-2 text-xs italic text-foreground-soft">
            {h.example.translit}
          </span>
          <span className="ml-2 text-[11px] text-muted-foreground">
            — {h.example.gloss}
          </span>
          {h.example.citation ? (
            <div className="text-[10px] text-muted-foreground">
              {h.example.citation}
            </div>
          ) : null}
        </div>
        <LetterSpeakerButton
          text={h.example.arabic}
          ariaLabel={`Play pronunciation of ${h.example.translit}`}
          size="sm"
        />
      </div>
    </article>
  );
}

function CompareRow({ entries }: { entries: HarakahEntry[] }) {
  return (
    <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          Hear the three in sequence
        </h3>
        <span className="text-xs text-muted-foreground">ba · bi · bu</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {entries.map((h) => (
          <div key={h.slug} className="flex flex-col items-center gap-1">
            <ArabicText variant="display" as="span" className="text-4xl">
              {h.carrier.syllable}
            </ArabicText>
            <span className="text-[11px] text-muted-foreground">
              {h.carrier.translit}
            </span>
            <LetterSpeakerButton
              text={h.carrier.syllable}
              ariaLabel={`Play ${h.carrier.translit}`}
              size="sm"
              ttsOnly
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-2 text-sm font-semibold tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground">{body}</p>
    </article>
  );
}
