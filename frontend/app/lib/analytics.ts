export type AnalyticsEvent =
  | "wallet_connect_started"
  | "wallet_connect_succeeded"
  | "wallet_connect_failed"
  | "form_submit_succeeded"
  | "form_submit_failed"
  | "navigation_clicked"
  | "web_vital_reported";

type EventPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props?: EventPayload }) => void;
  }
}

const isBrowser = typeof window !== "undefined";

export function trackEvent(event: AnalyticsEvent, payload: EventPayload = {}) {
  if (!isBrowser || navigator.doNotTrack === "1") {
    return;
  }

  window.gtag?.("event", event, payload);
  window.plausible?.(event, { props: payload });

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", event, payload);
  }
}

export function reportError(error: unknown, context: EventPayload = {}) {
  const message = error instanceof Error ? error.message : String(error);

  trackEvent("form_submit_failed", {
    ...context,
    error: message,
  });

  if (process.env.NODE_ENV !== "production") {
    console.error("[error-tracking]", error, context);
  }
}
