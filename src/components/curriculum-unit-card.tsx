import Link from "next/link";
import { ArrowRight, Languages, ShoppingBasket, Waypoints } from "lucide-react";

import type { CurriculumUnit } from "@/data/curriculum";
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
  "core-verb-families": {
    icon: Waypoints,
    chip: "bg-tense-command text-tense-command-accent",
  },
} as const;

export function CurriculumUnitCard({
  unit,
}: {
  unit: CurriculumUnit;
}) {
  const identity = UNIT_IDENTITIES[unit.id as keyof typeof UNIT_IDENTITIES] ?? UNIT_IDENTITIES["actions-in-context"];
  const Icon = identity.icon;

  return (
    <article className="card-raised flex h-full flex-col rounded-2xl p-5 sm:p-6">
      <div>
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", identity.chip)}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>

      <h2 className="mt-4 text-xl font-semibold tracking-tight">{unit.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {unit.description}
      </p>

      <div className="mt-auto flex flex-col items-start gap-2 pt-5">
        {unit.links.map((link, linkIndex) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold focus-ring",
              linkIndex === 0
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "border border-border bg-background-soft text-foreground hover:bg-muted",
            )}
          >
            {link.label}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        ))}
      </div>
    </article>
  );
}
