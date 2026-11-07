import { ArabicText } from "@/components/arabic-text";
import { ARABIC_RUN } from "@/lib/inline-arabic";

/**
 * English prose with any Arabic in it set in the Arabic font. Has no hooks,
 * so server pages and client exercises share it.
 */
export function Prose({ text }: { text: string }) {
  const parts = text.split(ARABIC_RUN);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <ArabicText key={index} variant="inline" className="text-[1.15em]">
            {part}
          </ArabicText>
        ) : (
          part
        ),
      )}
    </>
  );
}
