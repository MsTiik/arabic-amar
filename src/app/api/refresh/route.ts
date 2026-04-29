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
