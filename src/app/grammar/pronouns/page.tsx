import Link from "next/link";

import { PronounCard } from "@/components/pronoun-card";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Pronouns reference" };

export default function PronounsPage() {
  const content = getSiteContent();
  const detached = content.pronouns.filter((p) => p.kind === "detached");
  const attached = content.pronouns.filter((p) => p.kind === "attached");
  const intro = content.grammarIntros.find((g) => g.section === "pronouns");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link
            href="/grammar"
            className="hover:text-foreground hover:underline"
          >
            Grammar reference
          </Link>{" "}
          / Pronouns
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Pronouns (الضمائر)
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Detached and attached pronouns from the AMAR notes — full table with
          usage notes and a Qur&apos;ān example for each pronoun. Tap{" "}
          <span className="font-medium text-foreground-soft">
            &ldquo;Show example&rdquo;
          </span>{" "}
          on any card to reveal the citation.
        </p>
      </header>

      {intro && intro.paragraphs.length > 0 ? (
        <section className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            About pronouns
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-foreground-soft sm:text-base">
            {intro.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      ) : null}

      <nav
        aria-label="Pronoun jump"
        className="sticky top-24 z-10 mb-6 -mx-4 flex flex-wrap gap-1 overflow-x-auto bg-background/85 px-4 py-2 backdrop-blur"
      >
        <a
          href="#detached"
          className="rounded-full border border-border bg-background-soft px-3 py-1 text-xs font-medium hover:bg-muted focus-ring"
        >
          Detached pronouns
        </a>
        <a
          href="#attached"
          className="rounded-full border border-border bg-background-soft px-3 py-1 text-xs font-medium hover:bg-muted focus-ring"
        >
          Attached pronouns
        </a>
      </nav>

      <section id="detached" className="mb-12 scroll-mt-32">
        <header className="mb-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            Detached pronouns
          </h2>
          <p className="text-sm text-muted-foreground">
            Standalone pronouns — full words that can stand on their own (
            <span lang="ar-Latn" className="italic">
              ḍamāʾir munfaṣilah
            </span>
            ).
          </p>
        </header>
        {detached.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No detached pronouns captured yet — try refreshing from the source
            doc.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {detached.map((p) => (
              <PronounCard key={p.id} pronoun={p} />
            ))}
          </div>
        )}
      </section>

      <section id="attached" className="mb-12 scroll-mt-32">
        <header className="mb-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            Attached pronouns
          </h2>
          <p className="text-sm text-muted-foreground">
            Suffixes that attach to nouns, verbs, or prepositions (
            <span lang="ar-Latn" className="italic">
              ḍamāʾir muttaṣilah
            </span>
            ) — they cannot stand alone.
          </p>
        </header>
        {attached.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            No attached pronouns captured yet — try refreshing from the source
            doc.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {attached.map((p) => (
              <PronounCard key={p.id} pronoun={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
