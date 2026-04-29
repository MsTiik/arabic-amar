import Link from "next/link";

import { ArabicText } from "@/components/arabic-text";
import { DashboardHero } from "@/components/dashboard-hero";
import { RefreshContentButton } from "@/components/refresh-content-button";
import { TopicCard } from "@/components/topic-card";
import { getSiteContent } from "@/lib/content";
import type { VocabEntry } from "@/lib/types";

export default function Home() {
  const content = getSiteContent();
  const topicVocabIndex = new Map<string, VocabEntry[]>();
  for (const v of content.vocab) {
    for (const slug of v.topicSlugs) {
      const arr = topicVocabIndex.get(slug) ?? [];
      arr.push(v);
      topicVocabIndex.set(slug, arr);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <DashboardHero
        totalVocab={content.vocab.length}
        totalRules={content.rules.length}
        totalLessons={content.lessons.length}
      />

      <section className="mt-10">
        <header className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Lessons</h2>
            <p className="text-sm text-muted-foreground">
              Each lesson has its own vocabulary, rules, and a practice deck.
            </p>
          </div>
          <Link
            href="/topics"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.topics.map((topic) => (
            <TopicCard
              key={topic.slug}
              topic={topic}
              vocab={topicVocabIndex.get(topic.slug) ?? []}
            />
          ))}
        </div>
      </section>

      <div className="calligraphic-divider my-12" />

      <section>
        <h2 className="text-2xl font-semibold tracking-tight">A taste of the calligraphy</h2>
        <p className="text-sm text-muted-foreground">
          Every Arabic word, phrase, and example on the site keeps its full diacritics
          (tashkeel). They render at full opacity so fatha, kasra, damma, sukun, shadda,
          and tanween are easy to read.
        </p>
        <div className="mt-6 grid gap-4 rounded-3xl border border-border bg-card p-8 sm:grid-cols-3">
          <ArabicText variant="display" className="text-center text-6xl sm:text-7xl">
            بِسْمِ اللهِ
          </ArabicText>
          <ArabicText variant="display" className="text-center text-6xl sm:text-7xl">
            هٰذَا قَلْبٌ
          </ArabicText>
          <ArabicText variant="display" className="text-center text-6xl sm:text-7xl">
            هٰذِهِ يَدٌ
          </ArabicText>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">Admin</h2>
        <p className="mt-1 mb-3 text-sm text-muted-foreground">
          Pull the latest content from the source Google Doc on demand. The
          daily cron also handles this automatically at 04:00 UTC.
        </p>
        <RefreshContentButton />
      </section>
    </div>
  );
}
