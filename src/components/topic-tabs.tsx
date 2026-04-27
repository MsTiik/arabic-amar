"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  slug: string;
  vocabCount: number;
  ruleCount: number;
  children: {
    vocab: React.ReactNode;
    rules: React.ReactNode;
    practice: React.ReactNode;
  };
}

export function TopicTabs({ vocabCount, ruleCount, children }: Props) {
  const [tab, setTab] = useState<"vocab" | "rules" | "practice">("vocab");
  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="Topic content"
        className="inline-flex gap-1 rounded-full border border-border bg-muted p-1"
      >
        <TabButton
          active={tab === "vocab"}
          onClick={() => setTab("vocab")}
          label={`Vocabulary (${vocabCount})`}
        />
        <TabButton
          active={tab === "rules"}
          onClick={() => setTab("rules")}
          label={`Rules${ruleCount ? ` (${ruleCount})` : ""}`}
        />
        <TabButton
          active={tab === "practice"}
          onClick={() => setTab("practice")}
          label="Practice"
        />
      </div>
      <div role="tabpanel">
        {tab === "vocab" && children.vocab}
        {tab === "rules" && children.rules}
        {tab === "practice" && children.practice}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-ring",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
