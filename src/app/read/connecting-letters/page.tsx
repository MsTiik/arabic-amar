import Link from "next/link";

import { ArabicText } from "@/components/arabic-text";
import { FoundationsBadge } from "@/components/foundations-badge";
import { JoinLettersDemo } from "@/components/join-letters-demo";
import { ALPHABET, NON_CONNECTORS } from "@/data/foundations";

export const metadata = { title: "Connecting letters · Foundations" };

const NON_CONNECTOR_DETAILS = ALPHABET.filter((l) => l.nonConnector);

export default function ConnectingLettersPage() {
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
          Connecting letters
          <span
            lang="ar"
            dir="rtl"
            className="ml-3 font-arabic text-2xl font-normal text-foreground-soft"
          >
            حُرُوف الاتِّصَال
          </span>
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Arabic is a cursive script: letters within a word usually join
          together in a continuous stream. But{" "}
          <strong className="font-semibold text-foreground">
            six letters never attach to the letter that follows them
          </strong>
          . When one of these six appears inside a word, the chain breaks and
          the next letter starts over in its initial form.
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-accent-gold/40 bg-accent-gold-soft p-5 sm:p-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground">
          The six non-connectors
        </h2>
        <p className="mb-4 text-sm text-foreground-soft">
          Memorise these six letters. They never attach on the left (the
          following letter always starts fresh).
        </p>
        <div
          className="grid grid-cols-3 gap-3 sm:grid-cols-6"
          lang="ar"
          dir="rtl"
        >
          {NON_CONNECTOR_DETAILS.map((l) => (
            <div
              key={l.order}
              className="flex flex-col items-center gap-1 rounded-xl border border-accent-gold/40 bg-card p-3"
            >
              <span className="font-arabic-display text-4xl">{l.forms.isolated}</span>
              <span className="font-arabic text-sm text-foreground-soft">
                {l.nameArabic}
              </span>
              <span className="text-[11px] italic text-muted-foreground" dir="ltr">
                {l.name}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-foreground-soft">
          A useful mnemonic: <em>alif</em>, <em>dāl</em>, <em>dhāl</em>,{" "}
          <em>rā’</em>, <em>zāy</em>, <em>wāw</em> — the letters that
          {" \u201c"}sit alone and let the next letter start again{"\u201d."}
        </p>
      </section>

      <section className="mb-10 grid gap-4 lg:grid-cols-2">
        <ExampleCard
          title="Chain joins fully"
          subtitle="No non-connector in the word."
          english="maktab (office)"
          arabic="مَكْتَب"
          breakdown="م + ك + ت + ب"
          explanation="Mīm, kāf, tā’, and bā’ are all connectors. Every letter attaches to the next, producing one continuous glyph chain."
        />
        <ExampleCard
          title="Chain breaks at a non-connector"
          subtitle="Non-connector highlighted in gold."
          english="riḍā (contentment)"
          arabic="رِضَا"
          breakdown="ر ‖ ض + ا"
          explanation="Rā’ is a non-connector, so ḍād that follows must start in its initial form (as if opening a fresh word). Then ḍād does connect to alif — but alif is also a non-connector, ending the chain there."
          highlight
        />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Try it yourself
        </h2>
        <JoinLettersDemo />
      </section>

      <section className="mb-2 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground sm:p-6">
        <h2 className="mb-2 text-base font-semibold text-foreground">
          Why does this matter for reading the Qur’ān?
        </h2>
        <p className="mb-2">
          Muṣḥaf pages are densely calligraphic — two words can look almost
          glued together. Recognising where non-connectors force a visual break
          is one of the first skills that lets a reader parse a word correctly
          at a glance.
        </p>
        <p>
          Related:{" "}
          <Link href="/read/alphabet" className="text-primary hover:underline">
            See all 28 letters
          </Link>
          . The 6 non-connectors are marked on every alphabet card.
          <span className="ml-1 text-xs">
            ({NON_CONNECTORS.map((l) => l).join(" · ")})
          </span>
        </p>
      </section>
    </div>
  );
}

function ExampleCard({
  title,
  subtitle,
  english,
  arabic,
  breakdown,
  explanation,
  highlight,
}: {
  title: string;
  subtitle: string;
  english: string;
  arabic: string;
  breakdown: string;
  explanation: string;
  highlight?: boolean;
}) {
  return (
    <article
      className={
        "rounded-2xl border bg-card p-5 sm:p-6 " +
        (highlight ? "border-accent-gold/40" : "border-border")
      }
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      <div className="my-4 text-center">
        <ArabicText variant="display" className="text-4xl sm:text-5xl">
          {arabic}
        </ArabicText>
        <p className="mt-2 text-xs italic text-foreground-soft">{english}</p>
      </div>
      <div
        className="mb-3 rounded-md bg-background-soft px-3 py-2 text-center font-arabic text-lg"
        lang="ar"
        dir="rtl"
      >
        {breakdown}
      </div>
      <p className="text-xs text-muted-foreground">{explanation}</p>
    </article>
  );
}
