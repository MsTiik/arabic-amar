"use client";

import { useEffect, useState } from "react";

import { AppDialog } from "@/components/app-dialog";

const TOKEN_KEY = "arabic-amar:admin-refresh-token";
const UNLOCK_HASH = "#admin";

// localStorage throws in sandboxed iframes and some restricted-cookie modes
// (e.g. Safari private browsing historically). Wrap every access so a thrown
// SecurityError doesn't blow up the admin panel before the user ever sees it.
function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Token won't persist across reloads, but this session still works.
  }
}
function safeRemoveItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing we can do; token just stays in memory.
  }
}

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; at: number }
  | { kind: "error"; message: string };

/**
 * "Refresh from Google Doc" admin button. Hidden from ordinary visitors.
 *
 * The button only renders when one of these is true:
 *   - the admin token is already in localStorage (returning admin on this device), or
 *   - the page URL hash is `#admin` (first-time unlock from a bookmark).
 *
 * Clicking the button asks for the token (on devices without one stored), then
 * POSTs to `/api/refresh` with the `x-admin-token` header. The server
 * validates against the `ADMIN_REFRESH_TOKEN` env var and, on success, POSTs
 * to the Vercel deploy hook so the site rebuilds (re-running `prebuild` to
 * pull the latest doc).
 */
export function RefreshContentButton() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    // One-shot hydration-time sync. SSR and first client render both return
    // null to avoid a mismatch; after mount we reveal the control if the
    // visitor already has a token or the unlock hash is present. Once the
    // panel is revealed we keep it revealed so error feedback (e.g. a 401
    // that clears the stored token) stays visible to the admin.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const storedToken = safeGetItem(TOKEN_KEY);
    const isUnlocked = window.location.hash === UNLOCK_HASH;
    setToken(storedToken);
    setUnlocked(isUnlocked);
    if (storedToken || isUnlocked) setRevealed(true);
  }, []);

  async function handleClick() {
    if (!token) {
      setTokenInput("");
      setTokenDialogOpen(true);
      return;
    }
    await refreshWithToken(token);
  }

  async function refreshWithToken(activeToken: string) {
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/refresh", {
        method: "POST",
        headers: { "x-admin-token": activeToken },
      });
      if (res.status === 401) {
        safeRemoveItem(TOKEN_KEY);
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

  async function handleTokenSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = tokenInput.trim();
    if (!trimmed) return;
    safeSetItem(TOKEN_KEY, trimmed);
    setToken(trimmed);
    setTokenInput("");
    setTokenDialogOpen(false);
    await refreshWithToken(trimmed);
  }

  function handleForget() {
    safeRemoveItem(TOKEN_KEY);
    setToken(null);
    setStatus({ kind: "idle" });
    // Explicit "forget" hides the panel unless the page is still unlocked
    // via the #admin hash, in which case the admin can re-enter a token.
    if (!unlocked) setRevealed(false);
  }

  if (!mounted || !revealed) return null;

  return (
    <>
      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">Admin</h2>
        <p className="mt-1 mb-3 text-sm text-muted-foreground">
          Pull the latest content from the source Google Doc on demand. The
          daily cron also handles this automatically at 04:00 UTC.
        </p>
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
                : token
                  ? "Refresh content from Google Doc"
                  : "Enter token to refresh content"}
            </button>
            {token ? (
              <button
                type="button"
                onClick={handleForget}
                className="text-xs text-muted-foreground underline hover:text-foreground focus-ring"
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
      </section>

      <AppDialog
        open={tokenDialogOpen}
        title="Enter admin refresh token"
        description="The token is stored only in this browser so future refreshes do not require re-entry."
        onClose={() => setTokenDialogOpen(false)}
      >
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Admin token
            <input
              type="password"
              autoComplete="off"
              required
              autoFocus
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-3 py-2 text-base outline-none focus-ring"
            />
          </label>
          <p className="text-xs text-muted-foreground">
            Set this in Vercel as <code>ADMIN_REFRESH_TOKEN</code>.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setTokenDialogOpen(false)}
              className="rounded-full border border-border bg-background-soft px-4 py-2 text-sm font-medium hover:bg-muted focus-ring"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.kind === "loading"}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save token and refresh
            </button>
          </div>
        </form>
      </AppDialog>
    </>
  );
}
