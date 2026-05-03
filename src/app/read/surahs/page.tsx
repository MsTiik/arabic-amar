import Link from "next/link";

import { ArabicText } from "@/components/arabic-text";
import { FoundationsBadge } from "@/components/foundations-badge";
import { SURAHS } from "@/data/quran";

export const metadata = { title: "Short surahs · Foundations" };

export default function SurahsIndexPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <div className="mb-3">
          <FoundationsBadge />
        </div>
        <Link
          href="/read"
          className="mb-3 inline-block text-sm text-muted-foreground hover:text-foreground focus-ring"
        >
          ← Back to Foundations
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">
          Short surahs · word by word
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Tap any word in an ayah to see its meaning, root, grammar tag, and
          pronunciation. Audio is the recitation of Mishary Rashid Alafasy.
          Translations are Sahih International.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SURAHS.map((s) => (
          <Link
            key={s.number}
            href={`/read/surahs/${s.number}`}
            className="group flex flex-col rounded-3xl border border-border bg-card p-5 transition-colors hover:border-primary focus-ring"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Surah {s.number}
              </span>
              <span className="rounded-full border border-border bg-background-soft px-2 py-0.5 text-[11px] text-muted-foreground">
                {s.revelation}
              </span>
            </div>
            <ArabicText
              variant="display"
              className="mt-3 text-3xl"
              dir="rtl"
            >
              {s.nameArabic}
            </ArabicText>
            <p className="mt-1 text-base font-semibold">{s.name}</p>
            <p className="text-xs text-muted-foreground">{s.meaning}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {s.ayahs.length} {s.ayahs.length === 1 ? "verse" : "verses"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
