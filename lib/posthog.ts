"use client";

import posthog from "posthog-js";

let initialized = false;

export function initPostHog() {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  posthog.init(key, {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false, // we capture manually in the provider
    persistence: "localStorage+cookie",
    opt_out_capturing_by_default: false,
    respect_dnt: true,
  });
  initialized = true;
}

export { posthog };
