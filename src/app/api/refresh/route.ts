/**
 * POST /api/refresh
 *
 * Triggers a fresh Vercel deploy by POSTing to the project's deploy hook URL.
 * The deploy re-runs the prebuild step (`tsx scripts/build-content.ts`) which
 * pulls the latest Google Doc and regenerates `content/content.json`, so the
 * site rebuilds with whatever's currently in the doc.
 *
 * Gated by an `x-admin-token` header that must match the `ADMIN_REFRESH_TOKEN`
 * env var (set in Vercel Settings → Environment Variables). The deploy hook
 * URL is also held server-side only (`VERCEL_DEPLOY_HOOK_URL`) so it never
 * leaves the server.
 */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Per-process HMAC key. Regenerated on every cold start so digests can't be
// compared across invocations; only used here to normalize both compared
// values to a fixed-length buffer for `timingSafeEqual`.
const HMAC_KEY = randomBytes(32);

// Per-instance rate limit: at most `RATE_LIMIT_MAX` successful triggers per
// `RATE_LIMIT_WINDOW_MS`. A Vercel deploy hook POST is an expensive operation
// (eats build minutes), so even a leaked token shouldn't be able to burn
// through the monthly allowance. Serverless instances are per-region and
// short-lived, so this is a best-effort ceiling, not a hard global cap.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const recentTriggers: number[] = [];

export async function POST(request: Request) {
  const adminToken = process.env.ADMIN_REFRESH_TOKEN;
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!adminToken || !hookUrl) {
    console.error(
      "[api/refresh] Missing server env vars:",
      !adminToken ? "ADMIN_REFRESH_TOKEN" : "",
      !hookUrl ? "VERCEL_DEPLOY_HOOK_URL" : "",
    );
    return Response.json(
      { ok: false, error: "Server is not configured for content refresh." },
      { status: 500 },
    );
  }

  const provided = request.headers.get("x-admin-token");
  if (!provided || !safeCompare(provided, adminToken)) {
    return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  const now = Date.now();
  while (recentTriggers.length > 0 && now - recentTriggers[0] > RATE_LIMIT_WINDOW_MS) {
    recentTriggers.shift();
  }
  if (recentTriggers.length >= RATE_LIMIT_MAX) {
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - recentTriggers[0]);
    return Response.json(
      {
        ok: false,
        error: `Too many refresh requests. Try again in ${Math.ceil(retryAfterMs / 1000)}s.`,
      },
      {
        status: 429,
        headers: { "retry-after": String(Math.ceil(retryAfterMs / 1000)) },
      },
    );
  }

  let hookResponse: Response;
  try {
    hookResponse = await fetch(hookUrl, { method: "POST" });
  } catch (err) {
    console.error("[api/refresh] Deploy hook fetch failed:", err);
    return Response.json(
      { ok: false, error: "Failed to reach Vercel deploy hook." },
      { status: 502 },
    );
  }

  if (!hookResponse.ok) {
    const detail = await hookResponse.text().catch(() => "");
    console.error(
      `[api/refresh] Deploy hook returned ${hookResponse.status}:`,
      detail.slice(0, 500),
    );
    return Response.json(
      { ok: false, error: `Vercel deploy hook returned ${hookResponse.status}.` },
      { status: 502 },
    );
  }

  // Only count a slot once the deploy hook accepted the request, so hook
  // outages or network errors don't lock the admin out of retrying.
  recentTriggers.push(now);
  return Response.json({ ok: true });
}

/**
 * Constant-time string compare that avoids leaking length via timing.
 * Both inputs are HMAC'd to fixed-length digests before comparison, so
 * `timingSafeEqual` sees buffers of identical length regardless of input.
 */
function safeCompare(a: string, b: string): boolean {
  const aDigest = createHmac("sha256", HMAC_KEY).update(a).digest();
  const bDigest = createHmac("sha256", HMAC_KEY).update(b).digest();
  return timingSafeEqual(aDigest, bDigest);
}
