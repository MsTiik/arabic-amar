import posthog from "posthog-js";
import { track as vercelTrack } from "@vercel/analytics";

/**
 * Product analytics. Every key action goes through `trackEvent` so the event
 * names stay in one typed place and land in both PostHog (funnels, retention)
 * and Vercel Web Analytics (custom events, on plans that support them).
 *
 * PostHog only initialises when NEXT_PUBLIC_POSTHOG_KEY is set (production),
 * so local dev and preview deploys don't pollute the numbers.
 */
type Props = Record<string, string | number | boolean | null | undefined>;

export interface AnalyticsEvents {
  practice_session_started: {
    deck_id: string;
    deck_title: string;
    exercise_kind: string;
    question_count: number;
    topic_slug?: string;
    lesson_id?: string;
  };
  practice_session_completed: AnalyticsEvents["practice_session_started"] & {
    correct: number;
    wrong: number;
    accuracy: number;
    best_combo: number;
  };
  audio_played: { source: "word" | "letter"; mode: "recording" | "tts" };
  sync_code_requested: Props;
  sync_signed_in: Props;
  sync_signed_out: Props;
  app_installed: Props;
}

export function isAnalyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
}

export function trackEvent<E extends keyof AnalyticsEvents>(
  event: E,
  props?: AnalyticsEvents[E],
): void {
  if (typeof window === "undefined") return;
  try {
    const clean = Object.fromEntries(
      Object.entries(props ?? {}).filter(([, v]) => v !== undefined),
    ) as Record<string, string | number | boolean | null>;
    if (isAnalyticsEnabled()) posthog.capture(event, clean);
    vercelTrack(event, clean);
  } catch {
    // Analytics must never break the learning experience.
  }
}

/** Link this browser's events to the signed-in sync account (Supabase user
 *  id only — no email) so progress across devices counts as one learner. */
export function identifyLearner(userId: string): void {
  if (!isAnalyticsEnabled()) return;
  try {
    posthog.identify(userId);
  } catch {}
}

export function resetLearner(): void {
  if (!isAnalyticsEnabled()) return;
  try {
    posthog.reset();
  } catch {}
}
