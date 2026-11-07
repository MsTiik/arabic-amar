"use client";

import { useEffect } from "react";
import { ArrowDown, ChevronsDownUp, ChevronsUpDown } from "lucide-react";

const SECTION_SELECTOR = "details[data-accordion-section]";

/** Open the section holding `#id` (or the section itself) and scroll to it. */
function revealHash(hash: string, smooth: boolean, closeOthers = false) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  const section = target.matches(SECTION_SELECTOR) ? target : target.closest(SECTION_SELECTOR);
  if (!section) return;
  if (closeOthers) {
    // Arriving from a link: only the linked part is open, so it sits at the top.
    document.querySelectorAll<HTMLDetailsElement>(SECTION_SELECTOR).forEach((other) => {
      if (other !== section) other.open = false;
    });
  }
  if (section instanceof HTMLDetailsElement) section.open = true;
  // Open any closed panel inside the section that the link points into.
  let parent: Element | null = target;
  while (parent) {
    if (parent instanceof HTMLDetailsElement) parent.open = true;
    parent = parent.parentElement;
  }
  requestAnimationFrame(() => target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }));
}

/**
 * Expand-all / collapse-all for a page's accordion sections, plus deep-link
 * support: a URL hash or an in-page `#link` opens the section it points to.
 */
export function AccordionControls({ className }: { className?: string }) {
  useEffect(() => {
    if (window.location.hash) revealHash(window.location.hash, false, true);
    const onHashChange = () => revealHash(window.location.hash, true);
    // Clicking a link to the hash already in the URL fires no hashchange.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href^='#']");
      if (link && link.getAttribute("href") === window.location.hash) revealHash(window.location.hash, true);
    };
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const setAll = (open: boolean) => {
    document.querySelectorAll<HTMLDetailsElement>(SECTION_SELECTOR).forEach((section) => {
      section.open = open;
    });
  };

  return (
    <div className={className}>
      <button type="button" onClick={() => setAll(true)} className="btn btn-ghost btn-sm text-muted-foreground">
        <ChevronsUpDown className="h-4 w-4" aria-hidden />
        Expand all
      </button>
      <button type="button" onClick={() => setAll(false)} className="btn btn-ghost btn-sm text-muted-foreground">
        <ChevronsDownUp className="h-4 w-4" aria-hidden />
        Collapse all
      </button>
    </div>
  );
}

/** Closes the current section, opens the next one and brings it into view. */
export function NextSectionButton({ targetId, label }: { targetId: string; label: string }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        const current = event.currentTarget.closest(SECTION_SELECTOR);
        const next = document.getElementById(targetId);
        if (current instanceof HTMLDetailsElement) current.open = false;
        if (next instanceof HTMLDetailsElement) next.open = true;
        requestAnimationFrame(() => next?.scrollIntoView({ behavior: "smooth", block: "start" }));
      }}
      className="btn btn-secondary btn-sm"
    >
      Next: {label}
      <ArrowDown className="h-4 w-4" aria-hidden />
    </button>
  );
}

/** Closes the current section and scrolls back to its heading. */
export function CloseSectionButton() {
  return (
    <button
      type="button"
      onClick={(event) => {
        const current = event.currentTarget.closest(SECTION_SELECTOR);
        if (!(current instanceof HTMLDetailsElement)) return;
        current.open = false;
        const top = current.getBoundingClientRect().top;
        if (top < 0) current.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="btn btn-ghost btn-sm text-muted-foreground"
    >
      <ChevronsDownUp className="h-4 w-4" aria-hidden />
      Collapse
    </button>
  );
}
