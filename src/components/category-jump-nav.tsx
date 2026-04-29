"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  categories: { id: string; label: string; count: number }[];
  className?: string;
}

/**
 * Sticky sidebar that lists category anchors. Clicking jumps to the category section,
 * and the active category is highlighted as you scroll.
 */
export function CategoryJumpNav({ categories, className }: Props) {
  const [activeId, setActiveId] = useState<string | null>(
    categories[0]?.id ?? null,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      },
    );
    for (const c of categories) {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [categories]);

  if (categories.length <= 1) return null;

  return (
    <nav
      aria-label="Categories"
      // `max-h-[calc(100vh-7rem)]` + `overflow-y-auto` keeps the sticky nav
      // inside the viewport when there are many categories — without it the
      // nav grew taller than the viewport and the bottom items were
      // unreachable. `w-44` (instead of `min-w-44`) locks the width so long
      // category labels don't push the nav wider than the layout allows.
      className={cn(
        "sticky top-24 hidden max-h-[calc(100vh-7rem)] w-44 flex-col gap-1 self-start overflow-y-auto rounded-2xl border border-border bg-card p-3 lg:flex",
        className,
      )}
    >
      <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Jump to
      </p>
      {categories.map((c) => (
        <a
          key={c.id}
          href={`#${c.id}`}
          className={cn(
            "flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors focus-ring",
            activeId === c.id
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <span className="truncate">{c.label}</span>
          <span className="ml-2 shrink-0 text-[10px] tabular-nums text-muted-foreground">
            {c.count}
          </span>
        </a>
      ))}
    </nav>
  );
}
