import { QuranFrequencyDeck } from "@/components/quran-frequency-deck";
import { VocabBankClient } from "@/components/vocab-bank-client";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Vocabulary bank" };

export default function VocabularyPage() {
  const content = getSiteContent();
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Vocabulary bank</h1>
        <p className="text-sm text-muted-foreground">
          Search every word from every lesson. Diacritics are matched flexibly — typing{" "}
          <em>هذا</em> finds <em>هٰذَا</em>; typing <em>rasun</em> finds <em>raʾsun</em>.
        </p>
      </header>
      <QuranFrequencyDeck />
      <div>
        <h2 className="mb-3 text-2xl font-semibold tracking-tight">Lesson vocabulary</h2>
        <VocabBankClient vocab={content.vocab} topics={content.topics} />
      </div>
    </div>
  );
}
