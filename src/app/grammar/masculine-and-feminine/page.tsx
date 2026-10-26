import Link from "next/link";

import { ArabicText } from "@/components/arabic-text";
import { GrammarPractice, VerbChart } from "@/components/gender-grammar-client";
import { MarkedArabic } from "@/components/marked-arabic";
import { chartForms, MASCULINE_AND_FEMININE as SHEET } from "@/data/level-two-grammar";

export const metadata = { title: "Masculine and feminine" };

const SECTIONS = [
  { id: "feminine-nouns", label: "Feminine nouns" },
  { id: "this-and-who", label: "هَذَا / هَذِهِ · مَنْ / مَا" },
  { id: "verbs", label: "Verbs for he, she, you, I" },
  { id: "chart", label: "Verb chart" },
  { id: "practice", label: "Practice" },
] as const;

function SectionHeader({ number, title, children }: { number: number; title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Part {number}</p>
      <h2 className="mt-0.5 section-title">{title}</h2>
      {children ? <div className="mt-1 max-w-3xl text-sm text-muted-foreground sm:text-base">{children}</div> : null}
    </header>
  );
}

export default function MasculineAndFemininePage() {
  const modelForms = chartForms(SHEET.modelVerb, SHEET.persons);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link href="/grammar" className="hover:text-foreground hover:underline">
            Grammar reference
          </Link>{" "}
          / Masculine and feminine
        </p>
        <h1 className="mt-1 page-title">
          Masculine and feminine (<span lang="ar">{SHEET.titleArabic}</span>)
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          <span className="chip mr-1.5 bg-primary-soft text-primary">Level 2</span>
          {SHEET.description}
        </p>
      </header>

      <nav aria-label="Jump to section" className="mb-8 flex flex-wrap gap-1">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-hairline bg-background-soft px-3 py-1 text-xs font-medium hover:bg-muted focus-ring"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <section id="feminine-nouns" className="mb-10 scroll-mt-32 sm:mb-12">
        <SectionHeader number={1} title="How to spot a feminine noun">
          A noun is usually feminine when it ends in one of these three
          endings. If it has none of them, it&apos;s usually masculine, but a
          few everyday words are feminine without one, such as{" "}
          <span lang="ar">أُمّ</span> (mother) and{" "}
          <span lang="ar">أَرْض</span> (earth).
        </SectionHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SHEET.markers.map((marker) => (
            <article key={marker.id} className="surface p-3 sm:p-5">
              <div className="flex flex-row-reverse items-center justify-between gap-3 sm:block">
                <ArabicText variant="display" className="shrink-0 text-4xl text-primary sm:text-5xl">{marker.symbol}</ArabicText>
                <div className="min-w-0">
                  <ArabicText className="text-left text-lg text-foreground sm:mt-2 sm:text-start">{marker.nameArabic}</ArabicText>
                  <p className="text-xs text-muted-foreground">{marker.name}</p>
                </div>
              </div>
              <ul className="mt-2 space-y-1 border-t border-hairline pt-2 sm:mt-3 sm:space-y-2 sm:pt-3">
                {marker.examples.map((example) => (
                  <li key={example.transliteration} className="flex items-baseline justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      <span lang="ar-Latn" className="italic">{example.transliteration}</span> · {example.english}
                    </span>
                    <MarkedArabic text={example.arabic} className="shrink-0 text-2xl text-foreground" />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-3 surface p-3 sm:mt-4 sm:p-5">
          <p className="text-sm text-foreground-soft">
            Turn a masculine word into a feminine one by adding{" "}
            <ArabicText variant="inline" className="text-primary">ـة</ArabicText>:
          </p>
          <ul className="mt-2 grid grid-cols-1 gap-2 sm:mt-3 sm:grid-cols-2">
            {SHEET.pairs.map((pair) => (
              <li key={pair.masculine.transliteration} className="tile flex items-center justify-between gap-3 px-3 py-2 sm:p-3" dir="rtl">
                <div className="text-center">
                  <ArabicText className="text-2xl text-foreground">{pair.masculine.arabic}</ArabicText>
                  <p dir="ltr" className="text-xs text-muted-foreground">{pair.masculine.english}</p>
                </div>
                <span aria-hidden className="text-muted-foreground">←</span>
                <div className="text-center">
                  <MarkedArabic text={pair.feminine.arabic} className="text-2xl text-foreground" />
                  <p dir="ltr" className="text-xs text-muted-foreground">{pair.feminine.english}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="this-and-who" className="mb-10 scroll-mt-32 sm:mb-12">
        <SectionHeader number={2} title="This is… and who or what?">
          The noun decides the word for &ldquo;this&rdquo;. And when you ask a
          question, use <ArabicText variant="inline">مَنْ</ArabicText> for people
          and <ArabicText variant="inline">مَا</ArabicText> for things.
        </SectionHeader>
        <ul className="mb-3 grid grid-cols-4 gap-1.5 sm:mb-4 sm:gap-2">
          {SHEET.demonstrativeWords.map((word) => (
            <li key={word.transliteration} className="tile px-1.5 py-2 text-center sm:p-3">
              <ArabicText variant="display" className="text-2xl text-foreground sm:text-3xl">{word.arabic}</ArabicText>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">
                <span lang="ar-Latn" className="block italic sm:inline">{word.transliteration}</span>
                <span className="hidden sm:inline"> · </span>
                <span className="block sm:inline">{word.english}</span>
              </p>
            </li>
          ))}
        </ul>
        <div className="surface overflow-hidden">
          <div className="grid grid-cols-2 gap-3 border-b border-hairline px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[8rem_1fr_1fr] sm:px-4">
            <span className="hidden sm:block" />
            <span>Masculine</span>
            <span>Feminine</span>
          </div>
          <ul className="divide-y divide-hairline">
            {SHEET.demonstratives.map((row) => (
              <li key={row.id} className="grid grid-cols-2 gap-x-3 gap-y-1 px-3 py-2.5 sm:grid-cols-[8rem_1fr_1fr] sm:gap-3 sm:px-4 sm:py-3">
                <p className="col-span-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:col-span-1 sm:self-center">
                  {row.label}
                </p>
                {[row.masculine, row.feminine].map((item) => (
                  <div key={item.arabic}>
                    <ArabicText className="text-xl text-foreground sm:text-2xl">{item.arabic}</ArabicText>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      <span lang="ar-Latn" className="italic">{item.transliteration}</span> · {item.english}
                    </p>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="verbs" className="mb-10 scroll-mt-32 sm:mb-12">
        <SectionHeader number={3} title="Verbs change for he, she, you and I">
          In the present tense, the letter at the start of the verb tells you who
          is doing it. Speaking to a woman adds{" "}
          <ArabicText variant="inline" className="text-primary">ـينَ</ArabicText> at
          the end. Model verb: <ArabicText variant="inline">فَعَلَ</ArabicText>{" "}
          (to do).
        </SectionHeader>
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-5 sm:gap-2">
          {modelForms.map((form) => (
            <div key={form.person.id} className="tile flex items-center justify-between gap-3 px-3 py-2 sm:block sm:p-3 sm:text-center">
              <div>
                <ArabicText className="text-lg text-foreground sm:text-xl">{form.person.pronoun.arabic}</ArabicText>
                <p className="text-xs text-muted-foreground">{form.person.pronoun.english}</p>
              </div>
              <div className="text-end sm:mt-2 sm:text-center">
                <MarkedArabic text={form.arabic} variant="display" className="text-2xl text-foreground sm:text-3xl" />
                <p className="text-xs text-muted-foreground">{form.person.how}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 surface border-l-4 border-l-accent-gold p-3 sm:mt-4 sm:p-5">
          <p className="text-sm text-foreground-soft">
            <strong className="text-foreground">Watch out:</strong>{" "}
            <ArabicText variant="inline">هِيَ</ArabicText> (she) and{" "}
            <ArabicText variant="inline">أَنْتَ</ArabicText> (you, m.) look the same:{" "}
            <ArabicText variant="inline">تَفْعَلُ</ArabicText>. The pronoun or the
            context tells you which one it is.
          </p>
        </div>
        <ul className="mt-3 space-y-2 sm:mt-4">
          {SHEET.verbExamples.map((example) => (
            <li key={example.id} className="tile px-3 py-2.5 sm:p-4">
              <MarkedArabic text={example.arabic} className="text-xl leading-loose text-foreground sm:text-2xl" />
              <p className="mt-1 text-sm text-muted-foreground">
                <span lang="ar-Latn" className="italic">{example.transliteration}</span>
              </p>
              <p className="text-sm text-foreground-soft">{example.english}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="chart" className="mb-10 scroll-mt-32 sm:mb-12">
        <SectionHeader number={4} title="Verb chart">
          The verbs from class, in the present tense for all five people. Pick a
          verb to see its chart.
        </SectionHeader>
        <VerbChart verbs={SHEET.chartVerbs} persons={SHEET.persons} />
      </section>

      <section id="practice" className="mb-10 scroll-mt-32 sm:mb-12">
        <SectionHeader number={5} title="Practice">
          Choose the right word for each sentence.
        </SectionHeader>
        <GrammarPractice questions={SHEET.practice} />
      </section>
    </div>
  );
}
