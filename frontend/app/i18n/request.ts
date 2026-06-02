import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const locales = ["en", "es"] as const;
type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const headerLocale = (await headers()).get("x-nestera-locale");
  const locale = locales.includes(headerLocale as Locale) ? (headerLocale as Locale) : "en";

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
