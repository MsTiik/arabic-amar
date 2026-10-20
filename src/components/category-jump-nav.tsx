"use client";

import { useEffect, useRef, useState } from "react";
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

  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = stripRef.current;
    const chip = strip?.querySelector<HTMLElement>(`[data-cat="${activeId}"]`);
    if (!strip || !chip) return;
    strip.scrollTo({
      left: chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  if (categories.length <= 1) return null;

  return (
    <>
    {/* Phones: sticky chip strip in place of the sidebar. */}
    <nav
      aria-label="Categories"
      className="sticky top-0 z-20 -mx-4 border-b border-hairline bg-background/90 backdrop-blur-xl lg:hidden"
    >
      <div ref={stripRef} className="flex gap-1.5 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
        {categories.map((c) => (
          <a
            key={c.id}
            data-cat={c.id}
            href={`#${c.id}`}
            aria-current={activeId === c.id ? "true" : undefined}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-ring",
              activeId === c.id
                ? "border-foreground bg-foreground text-background"
                : "border-hairline bg-surface text-foreground-soft",
            )}
          >
            {c.label}
            <span className="ml-1.5 tabular-nums opacity-60">{c.count}</span>
          </a>
        ))}
      </div>
    </nav>
    <nav
      aria-label="Categories"
      // `max-h-[calc(100vh-7rem)]` + `overflow-y-auto` keeps the sticky nav
      // inside the viewport when there are many categories — without it the
      // nav grew taller than the viewport and the bottom items were
      // unreachable. `w-44` (instead of `min-w-44`) locks the width so long
      // category labels don't push the nav wider than the layout allows.
      className={cn(
        "sticky top-24 hidden max-h-[calc(100vh-7rem)] w-44 flex-col gap-1 self-start overflow-y-auto surface p-3 lg:flex",
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
    </>
  );
}
