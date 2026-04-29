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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const adminToken = process.env.ADMIN_REFRESH_TOKEN;
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!adminToken || !hookUrl) {
    return Response.json(
      {
        ok: false,
        error:
          "Server is missing ADMIN_REFRESH_TOKEN or VERCEL_DEPLOY_HOOK_URL env var.",
      },
      { status: 500 },
    );
  }

  const provided = request.headers.get("x-admin-token");
  if (!provided || !timingSafeEquals(provided, adminToken)) {
    return Response.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let hookResponse: Response;
  try {
    hookResponse = await fetch(hookUrl, { method: "POST" });
  } catch (err) {
    return Response.json(
      {
        ok: false,
        error: `Failed to reach Vercel deploy hook: ${(err as Error).message}`,
      },
      { status: 502 },
    );
  }

  if (!hookResponse.ok) {
    const detail = await hookResponse.text().catch(() => "");
    return Response.json(
      {
        ok: false,
        error: `Vercel deploy hook returned ${hookResponse.status}.`,
        detail: detail.slice(0, 500),
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}

/** Constant-time string compare to avoid leaking the token via timing. */
function timingSafeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
