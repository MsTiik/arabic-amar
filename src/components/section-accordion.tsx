import { ChevronDown } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { CloseSectionButton, NextSectionButton } from "@/components/section-accordion-client";
import { cn } from "@/lib/cn";

export { AccordionControls } from "@/components/section-accordion-client";

/**
 * One part of a long lesson page as a collapsible card. Closed, it reads as
 * a line in the lesson's table of contents (number, title, what is inside);
 * open, it shows the part and ends with a button to move on to the next one.
 * Server-rendered `<details>`: deep links and find-in-page open it, and
 * `AccordionControls` adds expand-all and hash handling.
 */
export function AccordionSection({
  id,
  number,
  eyebrow,
  title,
  titleArabic,
  intro,
  contents,
  defaultOpen = false,
  next,
  children,
}: {
  id: string;
  number: number;
  eyebrow?: string;
  title: React.ReactNode;
  titleArabic?: string;
  intro?: React.ReactNode;
  /** Short chips describing what the part holds, e.g. "2 dialogues". */
  contents?: readonly string[];
  defaultOpen?: boolean;
  next?: { id: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <details
      id={id}
      data-accordion-section=""
      open={defaultOpen}
      className="group/section surface scroll-mt-20 overflow-hidden"
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 p-3 transition-colors hover:bg-background-soft/60 focus-ring sm:gap-4 sm:p-4 [&::-webkit-details-marker]:hidden">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-primary-soft text-sm font-bold tabular-nums text-primary transition-colors group-open/section:bg-primary group-open/section:text-primary-foreground">
          {number}
        </span>
        <span className="min-w-0 flex-1">
          {eyebrow ? (
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{eyebrow}</span>
          ) : null}
          <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <span className="text-base font-semibold leading-snug sm:text-lg">{title}</span>
            {titleArabic ? (
              <ArabicText variant="display" as="span" className="text-lg text-foreground-soft sm:text-xl">
                {titleArabic}
              </ArabicText>
            ) : null}
          </span>
          {intro ? (
            <span className="mt-0.5 line-clamp-2 block text-sm leading-relaxed text-muted-foreground group-open/section:line-clamp-none">
              {intro}
            </span>
          ) : null}
          {contents?.length ? (
            <span className="mt-1.5 flex flex-wrap gap-1 group-open/section:hidden">
              {contents.map((item) => (
                <span key={item} className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {item}
                </span>
              ))}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className="mt-2 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open/section:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="space-y-4 border-t border-hairline px-3 pb-3 pt-4 sm:px-5 sm:pb-4">
        {children}
        <footer className={cn("flex flex-wrap items-center gap-2 border-t border-hairline pt-3", next ? "justify-between" : "justify-end")}>
          <CloseSectionButton />
          {next ? <NextSectionButton targetId={next.id} label={next.label} /> : null}
        </footer>
      </div>
    </details>
  );
}
