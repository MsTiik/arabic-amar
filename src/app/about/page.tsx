import Link from "next/link";
import { ArabicText } from "@/components/arabic-text";
import { getSiteContent } from "@/lib/content";
import { SALAHFLOW_URL, SITE_CONTACT_EMAIL } from "@/lib/site";

export const metadata = { title: "About" };

export default function AboutPage() {
  const { source, fetchedAt } = getSiteContent();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">About this site</h1>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground-soft">
        <p>
          Arabic Amar is a gamified study companion for the {" "}
          <strong className="text-foreground">{source.name}</strong>, an introductory
          Arabic course aimed at helping students read and understand the Quran.
        </p>
        <p>
          All content on this site is parsed directly from the public study notes Google
          Doc. The Arabic is preserved with its full diacritics (
          <ArabicText variant="inline" className="text-xl">تشكيل</ArabicText>) so that
          fatha, kasra, damma, sukun, shadda, and tanween remain visible exactly as written.
        </p>
        <p className="rounded-2xl border border-border bg-card p-4 text-sm">
          {"Source content last fetched: "}
          <span className="font-medium text-foreground">
            {new Date(fetchedAt).toUTCString()}
          </span>
          {". The site refreshes from the Google Doc on every deploy."}
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">Credits</h2>
      <ul className="mt-2 space-y-2 text-sm">
        <li>
          <span className="text-muted-foreground">{"Course material: "}</span>
          <strong>{source.name}</strong>
        </li>
        <li>
          <span className="text-muted-foreground">{"Source document: "}</span>
          <Link className="underline" href={source.docUrl}>
            Google Doc
          </Link>
        </li>
        <li>
          <span className="text-muted-foreground">{"Content QA: "}</span>
          <Link className="underline" href="/admin/content-health">
            latest build report
          </Link>
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">Feedback &amp; contact</h2>
      <p className="mt-2 text-sm text-foreground-soft">
        {"Arabic Amar is built and maintained independently. Spotted a mistake, have an idea, or want to say salaam? Email "}
        <a className="underline" href={`mailto:${SITE_CONTACT_EMAIL}`}>
          {SITE_CONTACT_EMAIL}
        </a>
        .
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">Also by me</h2>
      <p className="mt-2 text-sm text-foreground-soft">
        <a className="underline" href={SALAHFLOW_URL} target="_blank" rel="noreferrer">
          SalahFlow
        </a>
        {" — a companion app for your daily salah."}
      </p>

      <h2 className="mt-10 text-xl font-semibold tracking-tight">Privacy</h2>
      <p className="mt-2 text-sm text-foreground-soft">
        Your progress (streak, daily goal, mastery) is stored locally in your browser. Nothing
        is uploaded — clear your site data to wipe progress.
      </p>
    </div>
  );
}
