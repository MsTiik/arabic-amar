import Link from "next/link";

import qaReport from "../../../../content/content-qa.json";
import type { ContentQaIssue, ContentQaReport } from "../../../lib/content-qa";

export const metadata = { title: "Content health" };

const SEVERITY_CLASS: Record<ContentQaIssue["severity"], string> = {
  error: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
  info: "border-blue-200 bg-blue-50 text-blue-950",
};

const report = qaReport as ContentQaReport;

export default function ContentHealthPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Content health</h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground-soft">
            Parser and content-quality checks generated during the latest content build.
          </p>
        </div>
        <Link href="/about" className="text-sm font-medium text-primary hover:underline">
          Source details
        </Link>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Metric label="Lessons" value={report.totals.lessons} />
        <Metric label="Topics" value={report.totals.topics} />
        <Metric label="Words" value={report.totals.vocab} />
        <Metric label="Rules" value={report.totals.rules} />
        <Metric label="Parser warnings" value={report.totals.parserWarnings} />
        <Metric label="QA issues" value={report.totals.issues} />
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Generated: {new Date(report.generatedAt).toUTCString()}
      </p>

      <section className="mt-8 space-y-4">
        {report.issues.length === 0 ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
            No content QA issues detected.
          </div>
        ) : (
          report.issues.map((issue) => (
            <article
              key={issue.code}
              className={`rounded-2xl border p-5 ${SEVERITY_CLASS[issue.severity]}`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    {issue.severity} · {issue.code}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">{issue.message}</h2>
                </div>
                <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold">
                  {issue.count}
                </span>
              </div>
              {issue.examples.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm">
                  {issue.examples.map((example) => (
                    <li key={example} className="rounded-xl bg-white/70 p-3">
                      {example}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
