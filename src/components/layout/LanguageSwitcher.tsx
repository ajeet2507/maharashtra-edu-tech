'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
const languages = [
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिन्दी' }
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <select
      value={locale}
      onChange={(event) =>
        router.replace(pathname, {
          locale: event.target.value as Locale
        })
      }
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
      aria-label="Select language"
    >
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.label}
        </option>
      ))}
    </select>
  );
}
