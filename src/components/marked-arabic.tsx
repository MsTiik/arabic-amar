import { ArabicText } from "@/components/arabic-text";
import { cn } from "@/lib/cn";

interface MarkedArabicProps {
  /** Arabic with the letters to highlight wrapped in [brackets]. */
  text: string;
  variant?: "display" | "body" | "inline";
  className?: string;
  markClassName?: string;
}

export function MarkedArabic({
  text,
  variant = "body",
  className,
  markClassName = "text-primary",
}: MarkedArabicProps) {
  const parts = text.split(/(\[[^\]]+\])/).filter(Boolean);
  return (
    <ArabicText variant={variant} className={className}>
      {parts.map((part, index) =>
        part.startsWith("[") ? (
          <span key={index} className={cn("font-bold", markClassName)}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </ArabicText>
  );
}
