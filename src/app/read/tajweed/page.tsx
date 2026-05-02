import Link from "next/link";

import { FoundationsBadge } from "@/components/foundations-badge";
import { TAJWEED_GROUPS } from "@/data/foundations";
import { AdvancedTajweedToggle, TajweedGroupCard } from "./tajweed-client";

export const metadata = { title: "Tajweed basics · Foundations" };

export default function TajweedPage() {
  const coreGroups = TAJWEED_GROUPS.filter((g) => g.tier === "core");
  const advancedGroups = TAJWEED_GROUPS.filter((g) => g.tier === "advanced");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <div className="mb-6">
        <Link
          href="/read"
          className="text-sm text-muted-foreground hover:text-foreground focus-ring"
        >
          ← Back to Foundations
        </Link>
      </div>

      <header className="mb-8">
        <div className="mb-3">
          <FoundationsBadge />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Tajweed basics
          <span
            lang="ar"
            dir="rtl"
            className="ml-3 font-arabic text-2xl font-normal text-foreground-soft"
          >
            التَّجْوِيد
          </span>
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
          Tajweed is the set of pronunciation rules that shape how the
          Qur&rsquo;ān is recited. The rules exist because certain letters,
          when they meet certain other letters, produce sounds that aren&rsquo;t
          obvious from the script alone. You hear them applied automatically
          when a qualified reciter recites — this page explains what&rsquo;s
          actually happening.
        </p>
        <div className="mt-3 rounded-lg border border-border bg-background-soft p-3 text-xs text-foreground-soft">
          <strong className="font-semibold text-foreground">
            How to use this page:{" "}
          </strong>
          Start with the Core rules below. They&rsquo;re the ones you&rsquo;ll
          hit most often and a beginner can learn them in a single sitting.
          The Advanced rules are real but not urgent — come back to them once
          the basics click.
        </div>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Core rules
        </h2>
        <div className="space-y-8">
          {coreGroups.map((group) => (
            <TajweedGroupCard key={group.slug} group={group} />
          ))}
        </div>
      </section>

      <AdvancedTajweedToggle groups={advancedGroups} />

      <footer className="mt-12 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        <p>
          These rules describe <em>what</em> happens, not <em>how much</em>{" "}
          to pronounce each thing. The exact timing (e.g. &ldquo;hold the
          ghunnah for 2 beats&rdquo;) is best learned by listening to a
          qualified reciter — examples on every card include audio where
          available. For formal study, pair this reference with a teacher
          or an ijāzah programme.
        </p>
      </footer>
    </div>
  );
}
