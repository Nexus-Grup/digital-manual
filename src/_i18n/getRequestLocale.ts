// Locale for routes without a locale segment (product pages), read from the locale cookie.
// Server-only: reading cookies makes the caller dynamic, so render it inside <Suspense>.
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/_i18n/config";
import type { Locale } from "@/_i18n/config";

export async function getRequestLocale(): Promise<Locale> {
    const value = (await cookies()).get(LOCALE_COOKIE)?.value;
    return isLocale(value) ? value : DEFAULT_LOCALE;
}
