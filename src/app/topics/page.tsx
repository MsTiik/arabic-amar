import { TopicCard } from "@/components/topic-card";
import { getSiteContent } from "@/lib/content";
import type { VocabEntry } from "@/lib/types";

export const metadata = { title: "Lessons" };

export default function TopicsPage() {
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
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-6">
        <p className="section-label">Curriculum</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Lessons</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a lesson to see its vocabulary, rules, and practice deck. Your progress ring
          fills as you mark words familiar and mastered.
        </p>
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
    </div>
  );
}
