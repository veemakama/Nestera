import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import IntlProvider from "./i18n/provider";
import AnalyticsProvider from "./components/AnalyticsProvider";
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

  return {
    title: metadata.title,
    description: metadata.description,
    alternates: {
      languages: {
        en: "/en",
        es: "/es",
      },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir={rtlLocales.includes(locale) ? "rtl" : "ltr"}>
      <body className="bg-slate-950 text-white">
        <IntlProvider locale={locale} messages={messages[locale]}>
          {children}
          <Suspense fallback={null}>
            <AnalyticsProvider />
          </Suspense>
        </IntlProvider>
      </body>
    </html>
  );
}
