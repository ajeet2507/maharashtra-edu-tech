'use client';

import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
const languages = [
  { code: 'en', label: 'English' },
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिन्दी' }
] as const;

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Navigation');
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
      aria-label={t('language')}
      className="min-h-10 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-[#10234d] outline-none focus:border-[#183b7a] sm:px-3 sm:text-sm"
    >
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.label}
        </option>
      ))}
    </select>
  );
}
