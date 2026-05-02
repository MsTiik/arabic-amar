import Link from "next/link";

import { ArabicText } from "@/components/arabic-text";
import { FoundationsBadge } from "@/components/foundations-badge";
import { LetterSpeakerButton } from "@/components/letter-speaker-button";
import {
  ALPHABET,
  ALPHABET_EXTRAS,
  NON_CONNECTORS,
  type AlphabetExtra,
} from "@/data/foundations";

export const metadata = { title: "Arabic alphabet · Foundations" };

export default function AlphabetPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
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
          The Arabic alphabet
          <span
            lang="ar"
            dir="rtl"
            className="ml-3 font-arabic text-2xl font-normal text-foreground-soft"
          >
            الحُرُوف العَرَبِيَّة
          </span>
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          There are 28 letters in the Arabic alphabet. Each one has up to four
          positional shapes — how it’s drawn when it stands alone, at the start
          of a word, in the middle, or at the end. Six letters (marked with a
          gold dot) never attach to the letter that follows them.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <LegendDot className="border-accent-gold bg-accent-gold-soft" />
          <span>Non-connecting letter — never joins to the left.</span>
        </div>
      </header>

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
        dir="rtl"
      >
        {ALPHABET.map((letter) => (
          <LetterCard key={letter.order} letter={letter} />
        ))}
      </div>

      <section aria-labelledby="beyond-28-heading" className="mt-12">
        <div className="mb-4 flex items-baseline gap-3">
          <h2
            id="beyond-28-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Beyond the 28
          </h2>
          <span className="text-xs text-muted-foreground">
            Not counted as letters, but essential for reading.
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ALPHABET_EXTRAS.map((extra) => (
            <ExtraCard key={extra.slug} extra={extra} />
          ))}
        </div>
      </section>

      <footer className="mt-10 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <h2 className="mb-2 text-base font-semibold text-foreground">
          How audio works here
        </h2>
        <p className="mb-1">
          Where a Wikimedia Commons recording exists for a letter name or
          example word, you’ll hear that. Otherwise the button falls back to
          your device’s built-in Arabic text-to-speech voice (quality varies by
          browser and OS). The pronunciation of the <em>letters themselves</em>{" "}
          is best learned from a qualified reciter — these recordings are a
          reference, not a substitute for live instruction.
        </p>
        <p>
          See also:{" "}
          <Link href="/read/connecting-letters" className="text-primary hover:underline">
            Connecting letters
          </Link>
          ,{" "}
          <Link href="/read/harakat" className="text-primary hover:underline">
            Harakāt
          </Link>
          ,{" "}
          <Link href="/read/makharij" className="text-primary hover:underline">
            Makhārij
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}

function LegendDot({ className }: { className: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-block h-3 w-3 rounded-full border ${className}`}
        aria-hidden
      />
    </span>
  );
}

function LetterCard({ letter }: { letter: (typeof ALPHABET)[number] }) {
  const isNonConnector = NON_CONNECTORS.includes(letter.forms.isolated);
  return (
    <article
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5"
      aria-label={`Letter ${letter.name}`}
      dir="ltr"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-background-soft text-[11px] font-semibold text-foreground-soft tabular-nums">
              {letter.order}
            </span>
            <ArabicText
              variant="display"
              as="span"
              className="text-2xl font-medium"
            >
              {letter.nameArabic}
            </ArabicText>
          </div>
          <div className="mt-1 text-sm text-foreground">
            <span className="italic">{letter.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {letter.ipa}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isNonConnector ? (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-accent-gold/50 bg-accent-gold-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground"
              title="This letter never attaches to the letter that follows it."
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-gold" />
              Non-connector
            </span>
          ) : null}
          <LetterSpeakerButton
            text={letter.nameArabic}
            ariaLabel={`Play pronunciation of ${letter.name}`}
            size="md"
          />
        </div>
      </header>

      <section aria-label="Positional forms" className="rounded-xl bg-background-soft p-3">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Isolated · Initial · Medial · Final
        </div>
        <div
          className="grid grid-cols-4 items-end gap-1 text-center"
          lang="ar"
        >
          {(["isolated", "initial", "medial", "final"] as const).map((form) => (
            <FormCell
              key={form}
              glyph={letter.forms[form]}
              faded={isNonConnector && (form === "initial" || form === "medial")}
              emphasized={form === "isolated"}
            />
          ))}
        </div>
        <div className="mt-1 grid grid-cols-4 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Iso</span>
          <span>Init</span>
          <span>Med</span>
          <span>Fin</span>
        </div>
      </section>

      <p className="text-xs text-muted-foreground">{letter.pronunciationHint}</p>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background-soft px-3 py-2">
        <div>
          <ArabicText variant="display" as="span" className="text-xl">
            {letter.example.arabic}
          </ArabicText>
          <span className="ml-2 text-xs italic text-foreground-soft">
            {letter.example.translit}
          </span>
          <span className="ml-2 text-[11px] text-muted-foreground">
            — {letter.example.gloss}
          </span>
        </div>
        <LetterSpeakerButton
          text={letter.example.arabic}
          ariaLabel={`Play pronunciation of ${letter.example.translit}`}
          size="sm"
        />
      </div>
    </article>
  );
}

function FormCell({
  glyph,
  faded,
  emphasized,
}: {
  glyph: string;
  faded: boolean;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`rounded-md border px-1 font-arabic-display ${
        emphasized
          ? "border-primary/30 bg-primary/5 py-3 text-4xl font-semibold"
          : "border-border bg-card py-2 text-2xl"
      } ${faded ? "text-foreground-soft" : "text-foreground"}`}
    >
      {glyph}
    </div>
  );
}

function ExtraCard({ extra }: { extra: AlphabetExtra }) {
  return (
    <article
      className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-accent-gold/50 bg-accent-gold-soft/30 p-5"
      aria-label={extra.name}
      dir="ltr"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-accent-gold/60 bg-accent-gold-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground">
              Extra
            </span>
            <ArabicText
              variant="display"
              as="span"
              className="text-2xl font-medium"
            >
              {extra.nameArabic}
            </ArabicText>
          </div>
          <div className="mt-1 text-sm text-foreground">
            <span className="italic">{extra.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {extra.ipa}
            </span>
          </div>
        </div>
        <LetterSpeakerButton
          text={extra.example.arabic}
          ariaLabel={`Play example ${extra.example.translit}`}
          size="md"
        />
      </header>

      <p className="text-sm text-muted-foreground">{extra.summary}</p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {extra.forms.map((form, idx) => (
          <div
            key={idx}
            className="rounded-md border border-accent-gold/30 bg-card p-2 text-center"
          >
            <div
              className="font-arabic-display text-2xl"
              lang="ar"
              dir="rtl"
            >
              {form.glyph}
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {form.label}
            </div>
            {form.note ? (
              <div className="text-[10px] text-muted-foreground">
                {form.note}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-accent-gold/40 bg-card px-3 py-2">
        <div>
          <ArabicText variant="display" as="span" className="text-xl">
            {extra.example.arabic}
          </ArabicText>
          <span className="ml-2 text-xs italic text-foreground-soft">
            {extra.example.translit}
          </span>
          <span className="ml-2 text-[11px] text-muted-foreground">
            — {extra.example.gloss}
          </span>
        </div>
      </div>

      <details className="rounded-md bg-background-soft px-3 py-2 text-xs text-muted-foreground">
        <summary className="cursor-pointer font-semibold text-foreground">
          {extra.asideTitle}
        </summary>
        <p className="mt-2 leading-relaxed">{extra.asideBody}</p>
      </details>
    </article>
  );
}
