"use client";

import { useEffect, useState } from "react";

const TOKEN_KEY = "arabic-amar:admin-refresh-token";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; at: number }
  | { kind: "error"; message: string };

/**
 * Subtle "Refresh from Google Doc" button gated by a password the admin
 * pastes once into localStorage. Visitors without the password just see the
 * button as a normal element; clicking it opens a prompt for the password.
 *
 * Wired to `POST /api/refresh`, which validates `x-admin-token` against the
 * server-side `ADMIN_REFRESH_TOKEN` env var, then POSTs to the Vercel deploy
 * hook so the site rebuilds (re-running `prebuild` to pull the latest doc).
 */
export function RefreshContentButton() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(TOKEN_KEY);
    if (stored) {
      // Hydration-time read of localStorage. Server-rendered HTML always shows
      // the no-token state to avoid a hydration mismatch; once mounted on the
      // client we read the stored token (if any) so the "Forget token" button
      // can render. This is a one-shot sync, not a cascading state update.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(stored);
    }
  }, []);

  async function handleClick() {
    let activeToken = token;
    if (!activeToken) {
      const entered = window.prompt(
        "Enter the admin refresh token to enable content refresh on this device. (Set in Vercel as ADMIN_REFRESH_TOKEN.)",
      );
      if (!entered) return;
      activeToken = entered.trim();
      window.localStorage.setItem(TOKEN_KEY, activeToken);
      setToken(activeToken);
    }

    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/refresh", {
        method: "POST",
        headers: { "x-admin-token": activeToken },
      });
      if (res.status === 401) {
        window.localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setStatus({ kind: "error", message: "Wrong token. Cleared — try again." });
        return;
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus({
          kind: "error",
          message: body.error ?? `Refresh failed (HTTP ${res.status}).`,
        });
        return;
      }
      setStatus({ kind: "success", at: Date.now() });
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message });
    }
  }

  function handleForget() {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setStatus({ kind: "idle" });
  }

  return (
    <div className="rounded-2xl border border-dashed border-border bg-background-soft p-4 text-sm">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleClick}
          disabled={status.kind === "loading"}
          className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status.kind === "loading"
            ? "Triggering deploy…"
            : "Refresh content from Google Doc"}
        </button>
        {token ? (
          <button
            type="button"
            onClick={handleForget}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Forget token on this device
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Triggers a Vercel rebuild that re-pulls the source Google Doc. New content
        is usually live within ~1 minute. Requires the admin token.
      </p>
      {status.kind === "success" ? (
        <p className="mt-2 text-xs text-emerald-700">
          Deploy triggered at {new Date(status.at).toLocaleTimeString()}. Refresh
          this page in a minute or two to see updates.
        </p>
      ) : null}
      {status.kind === "error" ? (
        <p className="mt-2 text-xs text-red-700">{status.message}</p>
      ) : null}
    </div>
  );
}
