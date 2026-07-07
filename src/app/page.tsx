import Link from "next/link";

import { DashboardHero } from "@/components/dashboard-hero";
import { NamesOfAllahTeaser } from "@/components/names-of-allah-teaser";
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

      <div className="mt-8">
        <NamesOfAllahTeaser />
      </div>

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

      <RefreshContentButton />
    </div>
  );
}
