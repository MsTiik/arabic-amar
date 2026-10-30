"use client";

import { useState } from "react";

import { InteractiveArabicReading } from "@/components/interactive-arabic-reading";
import type { LevelTwoReadingSection } from "@/data/level-two-lessons";

export function SectionedReading({
  sections,
}: {
  sections: readonly LevelTwoReadingSection[];
}) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];

  if (!activeSection) return null;

  return (
    <div className="space-y-3">
      <div className="segmented flex w-full flex-wrap sm:w-fit" role="tablist" aria-label="Reading sections">
        {sections.map((section, index) => (
          <button
            key={section.id}
            id={`${section.id}-tab`}
            type="button"
            role="tab"
            aria-selected={activeSection.id === section.id}
            aria-controls={`${section.id}-panel`}
            className="segmented-item"
            onClick={() => setActiveSectionId(section.id)}
          >
            <span className="sm:hidden">Part {index + 1}</span>
            <span className="hidden sm:inline">{index + 1}. {section.title}</span>
          </button>
        ))}
      </div>
      <div
        id={`${activeSection.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${activeSection.id}-tab`}
        className="space-y-3"
      >
        <h3 className="section-title">{activeSection.title}</h3>
        <InteractiveArabicReading
          key={activeSection.id}
          sentences={activeSection.sentences}
          english={activeSection.english}
        />
      </div>
    </div>
  );
}
