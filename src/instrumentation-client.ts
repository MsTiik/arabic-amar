import posthog from "posthog-js";

// PostHog shares a project with other products, so every event carries
// `app: "arabic-amar"` for filtering. Traffic goes through the /ingest
// rewrite in next.config.ts: it keeps the CSP same-origin and survives most
// ad blockers.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  try {
    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      defaults: "2026-08-30",
      person_profiles: "identified_only",
    });

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    posthog.register({
      app: "arabic-amar",
      display_mode: standalone ? "installed" : "browser",
    });
  } catch {
    // Analytics is optional; never block the app from booting.
  }
}
