"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  slug: string;
  vocabCount: number;
  ruleCount: number;
  panels: {
    vocab: React.ReactNode;
    rules: React.ReactNode;
    practice: React.ReactNode;
  };
}

export function TopicTabs({ slug, vocabCount, ruleCount, panels }: Props) {
  const [tab, setTab] = useState<"vocab" | "rules" | "practice">("vocab");
  const panelId = `${slug}-${tab}-panel`;
  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="Topic content"
        className="segmented"
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
      <div id={panelId} role="tabpanel">
        {tab === "vocab" && panels.vocab}
        {tab === "rules" && panels.rules}
        {tab === "practice" && panels.practice}
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
        "segmented-item focus-ring",
        !active && "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
