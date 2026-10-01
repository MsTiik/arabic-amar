import Link from "next/link";

import { VerbFamiliesClient } from "@/components/verb-families-client";

export const metadata = { title: "Verb families" };

export default function VerbFamiliesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Link href="/practice" className="hover:text-foreground hover:underline">
            Practice
          </Link>{" "}
          / Verb families
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Verb families <span lang="ar" dir="rtl" className="font-arabic font-normal">عَائِلَاتُ الأَفْعَال</span>
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Learn each verb as one connected family—past, present, command, and
          verbal noun—then sort its shuffled forms. Level 2 and Qur’anic
          examples show how the same root changes inside a real sentence.
        </p>
        <details className="mt-4 max-w-3xl rounded-2xl border border-border bg-background-soft p-4 text-sm leading-relaxed text-foreground-soft">
          <summary className="cursor-pointer font-semibold text-primary focus-ring">
            How the reference forms work
          </summary>
          <p className="mt-2">
            The reference family uses <strong>he</strong> for past and present,
            and <strong>you, masculine singular</strong> for the command. Examples
            can use a different person or number, so the relevant form is highlighted.
          </p>
        </details>
      </header>

      <VerbFamiliesClient />
    </div>
  );
}
