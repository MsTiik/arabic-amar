"use client";

import { useMemo, useState, useDeferredValue } from "react";
import { Search, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { VocabCard } from "@/components/vocab-card";
import { foldForSearch } from "@/lib/diacritics";
import { cn } from "@/lib/cn";
import type { Topic, VocabEntry } from "@/lib/types";

interface Props {
  vocab: VocabEntry[];
  topics: Topic[];
}

type GenderFilter = "" | "M" | "F" | "Both";

export function VocabBankClient({ vocab, topics }: Props) {
  const [query, setQuery] = useState("");
  const [topicSlug, setTopicSlug] = useState("");
  const [gender, setGender] = useState<GenderFilter>("");
  const [extraOnly, setExtraOnly] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const deferred = useDeferredValue(query);

  const filtered = useMemo(() => {
    const folded = foldForSearch(deferred);
    return vocab.filter((v) => {
      if (topicSlug && !v.topicSlugs.includes(topicSlug)) return false;
      if (gender && v.gender !== gender) return false;
      if (extraOnly && !v.isExtra) return false;
      if (folded) {
        const haystack = [
          v.arabicFolded,
          foldForSearch(v.pronunciation),
          foldForSearch(v.english),
          foldForSearch(v.category),
          foldForSearch(v.subCategory ?? ""),
          foldForSearch(v.continent ?? ""),
          foldForSearch(v.country ?? ""),
        ].join(" ");
        if (!haystack.includes(folded)) return false;
      }
      return true;
    });
  }, [vocab, deferred, topicSlug, gender, extraOnly]);

  const groupedByTopic = useMemo(() => {
    const map = new Map<string, VocabEntry[]>();
    for (const v of filtered) {
      const key = v.topicSlugs[0] ?? "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(v);
    }
    return [...map.entries()].sort((a, b) => {
      const ta = topics.find((t) => t.slug === a[0])?.order ?? 999;
      const tb = topics.find((t) => t.slug === b[0])?.order ?? 999;
      return ta - tb;
    });
  }, [filtered, topics]);

  const showEmpty = filtered.length === 0;
  const isFiltering = Boolean(query || topicSlug || gender || extraOnly);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6">
        <div className="flex items-center gap-3 rounded-full border border-border bg-background-soft px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Arabic, transliteration, or English… (try هذا, hadha, this)"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            aria-label="Search vocabulary"
          />
          {query ? (
            <button
              type="button"
              className="rounded-full p-1 text-muted-foreground hover:text-foreground focus-ring"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Select
            value={topicSlug}
            onChange={setTopicSlug}
            placeholder="All lessons"
            options={topics.map((t) => ({ value: t.slug, label: t.name }))}
          />
          <Select
            value={gender}
            onChange={(v) => setGender(v as GenderFilter)}
            placeholder="Any gender"
            options={[
              { value: "M", label: "Masculine" },
              { value: "F", label: "Feminine" },
              { value: "Both", label: "Both" },
            ]}
          />
          <button
            type="button"
            onClick={() => setExtraOnly((x) => !x)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-ring",
              extraOnly
                ? "border-accent-gold bg-accent-gold-soft text-foreground"
                : "border-border bg-background-soft text-muted-foreground hover:text-foreground",
            )}
          >
            Extras only
          </button>

          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span className="tabular-nums">
              {filtered.length} / {vocab.length} words
            </span>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="rounded-full border border-border bg-background-soft px-3 py-1 hover:text-foreground focus-ring"
            >
              {collapsed ? "Expand all" : "Collapse all"}
            </button>
          </div>
        </div>
      </div>

      {showEmpty ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-base text-foreground">No words match those filters.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try removing a filter or searching by transliteration (e.g. <em>raʾsun</em> or{" "}
            <em>rasun</em>).
          </p>
        </div>
      ) : null}

      {!collapsed && !isFiltering ? (
        <div className="space-y-8">
          {groupedByTopic.map(([slug, entries]) => {
            const topic = topics.find((t) => t.slug === slug);
            return (
              <section key={slug}>
                <header className="mb-3 flex items-baseline justify-between">
                  <h2 className="text-xl font-semibold tracking-tight">
                    {topic?.name ?? slug}
                    {topic?.nameArabic ? (
                      <ArabicText
                        variant="inline"
                        className="ml-3 text-2xl text-foreground-soft"
                      >
                        {topic.nameArabic}
                      </ArabicText>
                    ) : null}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {entries.length} words
                  </span>
                </header>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {entries.map((entry) => (
                    <VocabCard key={entry.id} entry={entry} size="md" />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : null}

      {(collapsed || isFiltering) && filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((entry) => (
            <VocabCard key={entry.id} entry={entry} size="md" />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-border bg-background-soft px-3 py-1.5 text-sm font-medium text-foreground focus-ring"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
