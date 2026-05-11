"use client";

import { useEffect, useMemo, useState } from "react";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";

import { useProgressSync } from "@/components/progress-sync-provider";
import { summarizeMastery, useProgress } from "@/lib/progress";
import { getSiteContent } from "@/lib/content";

const SIGN_IN_COOLDOWN_SECONDS = 60;

export function ProgressSyncPanel() {
  const sync = useProgressSync();
  const progress = useProgress();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const content = getSiteContent();
  const wordIds = useMemo(() => content.vocab.map((v) => v.id), [content.vocab]);
  const summary = summarizeMastery(progress, wordIds);
  const practiced = summary.learning + summary.familiar + summary.mastered;
  const cooldownRemaining = Math.max(0, Math.ceil((cooldownUntil - now) / 1000));
  const emailReady = email.trim().length > 0;
  const signInDisabled = sync.status === "syncing" || !emailReady || cooldownRemaining > 0;

  useEffect(() => {
    if (!cooldownUntil) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [cooldownUntil]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (signInDisabled) return;
    setSent(false);
    try {
      await sync.signIn(email.trim());
      setSent(true);
      setCooldownUntil(Date.now() + SIGN_IN_COOLDOWN_SECONDS * 1000);
    } catch {
      setSent(false);
    }
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          {sync.configured ? <Cloud className="h-6 w-6" /> : <CloudOff className="h-6 w-6" />}
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Progress sync
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Use the same progress on your phone
          </h1>
          <p className="mt-2 text-sm leading-6 text-foreground-soft">
            Arabic AMAR still works in guest mode. Sign in only if you want your
            browser progress copied through Supabase so another device can pick it up.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Practiced words" value={practiced} />
        <Stat label="Mastered" value={summary.mastered} />
        <Stat label="Today" value={`${progress.daily.today.cardsSeen}/${progress.daily.goalCards}`} />
      </div>

      {!sync.configured ? (
        <div className="mt-6 rounded-2xl border border-border bg-background-soft p-4 text-sm text-muted-foreground">
          Sync is not configured on this deployment yet. Add
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>
          and
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          to enable optional account sync.
        </div>
      ) : sync.user ? (
        <div className="mt-6 rounded-2xl border border-success/30 bg-success/10 p-4">
          <p className="text-sm font-semibold">Signed in as {sync.user.email}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Status: {sync.status === "syncing" ? "Syncing…" : sync.status}
          </p>
          {sync.error ? <p className="mt-2 text-sm text-danger">{sync.error}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => sync.syncNow()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring"
            >
              <RefreshCw className="h-4 w-4" />
              Sync now
            </button>
            <button
              type="button"
              onClick={() => sync.signOut()}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted focus-ring"
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 rounded-2xl border border-border bg-background-soft p-4">
          <label className="text-sm font-semibold" htmlFor="sync-email">
            Email address
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="sync-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm focus-ring"
            />
            <button
              type="submit"
              disabled={signInDisabled}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-ring"
            >
              {sync.status === "syncing"
                ? "Sending…"
                : cooldownRemaining > 0
                  ? `Try again in ${cooldownRemaining}s`
                  : "Send sign-in link"}
            </button>
          </div>
          {sent ? (
            <p className="mt-3 text-sm text-success">
              Check your email, then open the sign-in link on this device. Don&apos;t request
              another link unless this one expires.
            </p>
          ) : null}
          {sync.error ? <p className="mt-3 text-sm text-danger">{sync.error}</p> : null}
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            This uses passwordless magic-link sign-in. Your practice progress is
            merged with the cloud copy after sign-in, then saved after each update.
          </p>
        </form>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-background-soft p-4">
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
