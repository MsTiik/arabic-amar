import Link from "next/link";
import { notFound } from "next/navigation";

import { ArabicText } from "@/components/arabic-text";
import { FoundationsBadge } from "@/components/foundations-badge";
import { SurahReader } from "@/components/surah-reader";
import { SURAHS, getSurah } from "@/data/quran";

export function generateStaticParams() {
  return SURAHS.map((s) => ({ number: String(s.number) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const surah = getSurah(Number(number));
  if (!surah) return { title: "Surah not found" };
  return {
    title: `${surah.name} (${surah.meaning}) · Word by word`,
  };
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const surah = getSurah(Number(number));
  if (!surah) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <div className="mb-3">
          <FoundationsBadge />
        </div>
        <Link
          href="/read/surahs"
          className="mb-3 inline-block text-sm text-muted-foreground hover:text-foreground focus-ring"
        >
          ← All short surahs
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Surah {surah.number} · {surah.revelation}
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {surah.name}
            </h1>
            <p className="text-sm text-muted-foreground">{surah.meaning}</p>
          </div>
          <ArabicText
            variant="display"
            className="text-4xl text-foreground-soft sm:text-5xl"
            dir="rtl"
          >
            {surah.nameArabic}
          </ArabicText>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          {surah.intro}
        </p>
      </header>

      <SurahReader surah={surah} />
    </div>
  );
}
