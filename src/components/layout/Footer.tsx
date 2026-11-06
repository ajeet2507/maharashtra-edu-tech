import { io } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { ArrowUpRight, GraduationCap, Phone } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

async function Copyright() {
  const t = await getTranslations('Footer');
  await io();

  return <p className="text-xs text-white/60">{t('copyright', { year: new Date().getFullYear() })}</p>;
}

const quickLinks = [
  { labelKey: 'home', href: '/#home' },
  { labelKey: 'school', href: '/#school-coaching' },
  { labelKey: 'about', href: '/#about' },
  { labelKey: 'courses', href: '/#courses' },
  { labelKey: 'services', href: '/#services' },
  { labelKey: 'contact', href: '/#contact' },
] as const;

export default async function Footer() {
  const t = await getTranslations('Footer');
  const navigation = await getTranslations('Navigation');

  return (
    <footer className="bg-[#0a1937] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ffc928] text-[#10234d]">
                <GraduationCap aria-hidden="true" size={25} />
              </span>
              <span>
                <span className="block text-base font-black leading-tight">Maharashtra</span>
                <span className="block text-xs font-semibold text-[#ffe27a]">Edu &amp; Tech Classes</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/70">{t('tagline')}</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">{t('description')}</p>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-[#ffe27a]">{t('quickLinksTitle')}</h2>
            <ul className="mt-4 space-y-3">
              {quickLinks.map(({ labelKey, href }) => (
                <li key={labelKey}>
                  <Link href={href} className="text-sm text-white/70 transition hover:text-[#ffc928]">
                    {labelKey === 'school' ? navigation('school') : t(labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-[#ffe27a]">{t('coursesTitle')}</h2>
            <ul className="mt-4 space-y-3">
              {['computerFundamentals', 'programming', 'webDevelopment', 'mobileAppDevelopment'].map((key) => (
                <li key={key}>
                  <Link href="/#courses" className="text-sm text-white/70 transition hover:text-[#ffc928]">
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-[#ffe27a]">{t('contactTitle')}</h2>
            <a href="tel:+919773105112" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-[#ffc928]">
              <Phone aria-hidden="true" size={16} />
              +91 97731 05112
            </a>
            <Link href="/#contact" className="mt-3 flex items-center gap-2 text-sm text-white/70 hover:text-[#ffc928]">
              {t('getInTouch')}
              <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold text-white/60">{navigation('language')}</p>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Suspense fallback={<p className="text-xs text-white/60">&nbsp;</p>}>
            <Copyright />
          </Suspense>
          <Link href="/aptitude" className="text-xs font-semibold text-white/60 hover:text-[#ffc928]">
            {navigation('aptitude')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
