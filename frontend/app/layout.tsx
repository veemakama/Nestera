import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import IntlProvider from "./i18n/provider";
import AnalyticsProvider from "./components/AnalyticsProvider";
import MonitoringProvider from "./components/MonitoringProvider";
import { StructuredData } from "./components/StructuredData";
import {
  generatePageMetadata,
  SITE_URL,
  getOrganizationSchema,
  getWebsiteSchema,
} from "./lib/seo";
import en from "./locales/en.json";
import es from "./locales/es.json";

const messages = { en, es };
const defaultLocale = "en";
const rtlLocales = ["ar", "he", "fa", "ur"];

const getLocale = async () => {
  const locale = (await headers()).get("x-nestera-locale") ?? defaultLocale;
  return locale in messages ? (locale as keyof typeof messages) : defaultLocale;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const metadata = messages[locale].metadata;

  return generatePageMetadata({
    title: metadata.title,
    description: metadata.description,
    url: "/",
    locale,
    alternateLanguages: {
      en: `${SITE_URL}/en`,
      es: `${SITE_URL}/es`,
    },
  });
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir={rtlLocales.includes(locale) ? "rtl" : "ltr"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#061a1a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nestera" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
        <StructuredData schema={[getOrganizationSchema(), getWebsiteSchema()]} />
      </head>
      <body className="bg-slate-950 text-white">
        <IntlProvider locale={locale} messages={messages[locale]}>
          {children}
          <Suspense fallback={null}>
            <AnalyticsProvider />
            <MonitoringProvider />
          </Suspense>
        </IntlProvider>
      </body>
    </html>
  );
}
