import Link from "next/link";

import { ArabicText } from "@/components/arabic-text";
import { cn } from "@/lib/cn";

/**
 * The dark header panel at the top of a course page: a back link, a small
 * label, the title with its Arabic, a short description and optional
 * buttons. Shared by the level page, Level 2 lessons, readings, word sets and
 * the grammar guides so they all start the same way.
 */
export function PageHero({
  back,
  eyebrow,
  title,
  titleArabic,
  description,
  clampDescription = false,
  children,
  className,
}: {
  back: { href: string; label: string };
  eyebrow?: string;
  title: React.ReactNode;
  titleArabic?: string;
  description?: React.ReactNode;
  /** Cut the description to three lines on phones. */
  clampDescription?: boolean;
  /** Buttons or links under the description. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "brand-panel rounded-[18px] p-4 shadow-[var(--shadow-md),inset_0_1px_0_oklch(1_0_0/8%)] sm:p-6",
        className,
      )}
    >
      <Link href={back.href} className="text-sm text-muted-foreground hover:text-foreground">
        ← {back.label}
      </Link>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div className="min-w-0">
          {eyebrow ? <p className="section-label">{eyebrow}</p> : null}
          <h1 className="mt-1 max-w-3xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{title}</h1>
        </div>
        {titleArabic ? (
          <ArabicText variant="display" as="p" className="text-2xl text-foreground-soft sm:text-3xl">
            {titleArabic}
          </ArabicText>
        ) : null}
      </div>
      {description ? (
        <p
          className={cn(
            "mt-2 max-w-3xl text-sm leading-relaxed text-foreground-soft sm:text-base",
            clampDescription && "line-clamp-3 sm:line-clamp-none",
          )}
        >
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-3 flex flex-wrap gap-2">{children}</div> : null}
    </header>
  );
}
