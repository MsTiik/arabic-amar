import Link from "next/link";
import { ArrowRight, House, Languages, MessagesSquare, ShoppingBasket, VenusAndMars, Waypoints } from "lucide-react";

import { ReadingScoreBadge } from "@/components/reading-score-badge";
import type { CurriculumUnit } from "@/data/curriculum";
import { LEVEL_TWO_READINGS } from "@/data/level-two-lessons";
import { cn } from "@/lib/cn";

const UNIT_IDENTITIES = {
  "marketplace-reading": {
    icon: ShoppingBasket,
    chip: "bg-accent-amber-soft text-accent-amber",
  },
  "actions-in-context": {
    icon: Languages,
    chip: "bg-primary-soft text-primary",
  },
  "home-and-places": {
    icon: House,
    chip: "bg-accent-rose-soft text-accent-rose",
  },
  "core-verb-families": {
    icon: Waypoints,
    chip: "bg-tense-command text-tense-command-accent",
  },
  "getting-to-know-each-other": {
    icon: MessagesSquare,
    chip: "bg-accent-amber-soft text-accent-amber",
  },
  "masculine-and-feminine": {
    icon: VenusAndMars,
    chip: "bg-accent-teal-soft text-accent-teal",
  },
} as const;

export function CurriculumUnitCard({
  unit,
}: {
  unit: CurriculumUnit;
}) {
  const identity = UNIT_IDENTITIES[unit.id as keyof typeof UNIT_IDENTITIES] ?? UNIT_IDENTITIES["actions-in-context"];
  const Icon = identity.icon;
  const reading = LEVEL_TWO_READINGS.find((candidate) => candidate.slug === unit.id);

  return (
    <article className="surface flex h-full flex-col p-5 sm:p-6">
      <div>
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-[10px]", identity.chip)}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>

      <h2 className="mt-4 section-title">{unit.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {unit.description}
      </p>
      {reading && reading.questions.length > 0 ? (
        <ReadingScoreBadge slug={reading.slug} questionIds={reading.questions.map((question) => question.id)} />
      ) : null}

      {unit.includes?.length ? (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Inside</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-foreground-soft">
            {unit.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-auto pt-5">
        <Link href={unit.href} className="btn btn-primary btn-sm">
          {unit.cta}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
