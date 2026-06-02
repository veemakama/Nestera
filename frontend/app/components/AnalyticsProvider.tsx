"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "../lib/analytics";

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useReportWebVitals((metric) => {
    trackEvent("web_vital_reported", {
      metric: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      page: pathname,
    });
  });

  useEffect(() => {
    trackEvent("navigation_clicked", {
      page: `${pathname}${searchParams.size ? `?${searchParams}` : ""}`,
    });
  }, [pathname, searchParams]);

  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
