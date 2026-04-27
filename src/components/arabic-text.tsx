import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "display" | "body" | "inline";

interface ArabicTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: Variant;
  /** Override the rendered tag (default `span` for inline, `div` otherwise). */
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wraps Arabic text with proper RTL direction, language tagging, and the chosen Arabic
 * font face. Use `display` for hero/large titles (uses Amiri Quran), `body` for vocab
 * card lines (Amiri), and `inline` for Arabic snippets embedded inside English prose.
 */
export function ArabicText({
  children,
  variant = "body",
  as,
  className,
  ...rest
}: ArabicTextProps) {
  const Tag = (as ?? (variant === "inline" ? "span" : "div")) as React.ElementType;
  const variantClass =
    variant === "display"
      ? "font-arabic-display"
      : variant === "inline"
        ? "font-arabic"
        : "font-arabic";
  return (
    <Tag
      lang="ar"
      dir="rtl"
      className={cn(variantClass, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
