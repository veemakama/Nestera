# Analytics and Performance Monitoring

Nestera reports Core Web Vitals through `app/components/AnalyticsProvider.tsx` and custom product events through `app/lib/analytics.ts`.

## Providers

- `NEXT_PUBLIC_GA_ID`: enables Google Analytics 4 with anonymized IPs.
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: enables Plausible for privacy-friendly analytics.
- Browser `Do Not Track` is respected before custom events are sent.

## Tracked Events

- `navigation_clicked`: route changes.
- `web_vital_reported`: Core Web Vitals payloads including metric name, value, rating, and page.
- `wallet_connect_started`, `wallet_connect_succeeded`, `wallet_connect_failed`: wallet funnel instrumentation hooks.
- `form_submit_succeeded`, `form_submit_failed`: form outcome hooks.

## Performance Budget

The first budget lives in `performance-budget.json`:

- LCP: 2500 ms
- CLS: 0.1
- INP: 200 ms
- JavaScript: 250 KB per route
- Total page weight: 1200 KB

Add CI enforcement with Lighthouse CI, Chromatic, or the hosting provider's Web Vitals dashboard when deployment credentials are available.
