import Link from "next/link";
import { Layers } from "lucide-react";

import { levelTwoDeckForPage, levelTwoDeckPracticeHref } from "@/lib/study-cards";

/** "Practise these words" on a Level 2 topic page whose words have a flashcard deck. */
export function PractiseDeckButton({ href }: { href: string }) {
  const deck = levelTwoDeckForPage(href);
  if (!deck) return null;
  return (
    <Link href={levelTwoDeckPracticeHref(deck)} className="btn btn-primary btn-sm">
      <Layers className="h-3.5 w-3.5" aria-hidden />
      Practise these words as flashcards
    </Link>
  );
}
