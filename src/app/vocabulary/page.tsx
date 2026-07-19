import { QuranFrequencyDeck } from "@/components/quran-frequency-deck";
import { NamesOfAllahTeaser } from "@/components/names-of-allah-teaser";
import { VocabBankClient } from "@/components/vocab-bank-client";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Vocabulary bank" };

export default function VocabularyPage() {
  const content = getSiteContent();
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-10">
      <header>
        <p className="section-label">Word bank</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Vocabulary bank</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search every word from every lesson. Diacritics are matched flexibly — typing{" "}
          <em>هذا</em> finds <em>هٰذَا</em>; typing <em>rasun</em> finds <em>raʾsun</em>.
        </p>
      </header>
      <NamesOfAllahTeaser />
      <QuranFrequencyDeck />
      <div>
        <h2 className="section-label mb-3">Lesson vocabulary</h2>
        <VocabBankClient vocab={content.vocab} topics={content.topics} />
      </div>
    </div>
  );
}
