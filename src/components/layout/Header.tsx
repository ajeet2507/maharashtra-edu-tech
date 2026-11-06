'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Menu, Phone, Target, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const navLinks = [
  { key: 'home', href: '/#home' },
  { key: 'school', href: '/#school-coaching' },
  { key: 'courses', href: '/#courses' },
  { key: 'services', href: '/#services' },
  { key: 'about', href: '/#about' },
  { key: 'contact', href: '/#contact' },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const isAptitudePage = pathname === '/aptitude';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex min-w-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10234d] text-[#ffc928]">
            <span className="text-xl font-black">M</span>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black leading-tight text-[#10234d] sm:text-base">
              Maharashtra Edu &amp; Tech
            </span>
            <span className="hidden text-[11px] font-medium text-slate-500 sm:block">
              {t('tagline')}
            </span>
          </span>
        </Link>

        <nav aria-label={t('mainMenu')} className="hidden items-center gap-4 xl:flex">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="whitespace-nowrap text-xs font-bold text-slate-700 transition hover:text-[#a35f00] 2xl:text-sm"
            >
              {t(key)}
            </Link>
          ))}
          {!isAptitudePage && <Link
            href="/aptitude"
            className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-lg bg-[#ffc928] px-3 py-2 text-xs font-extrabold text-[#10234d] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#ffda5e] active:scale-95 2xl:px-4 2xl:text-sm"
          >
            <Target aria-hidden="true" size={17} />
            {t('aptitudeCta')}
          </Link>}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/#admission"
            className="hidden min-h-10 items-center gap-2 rounded-lg bg-[#ffc928] px-3 py-2 text-xs font-extrabold text-[#10234d] transition hover:bg-[#ffda5e] md:inline-flex"
          >
            {t('admission')}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-[#10234d] xl:hidden"
          >
            {menuOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
          </button>
        </div>
      </div>

      {!isAptitudePage && <div className="border-t border-[#f1e8c9] bg-[#fff9e6] px-4 py-2.5 xl:hidden sm:px-6">
        <Link
          href="/aptitude"
          className="mx-auto flex min-h-12 max-w-7xl items-center justify-center gap-2 rounded-xl bg-[#ffc928] px-4 py-3 text-center text-sm font-extrabold text-[#10234d] shadow-sm transition hover:bg-[#ffda5e] active:scale-[0.99]"
        >
          <Target aria-hidden="true" size={18} />
          {t('aptitudeCta')}
        </Link>
      </div>}

      {menuOpen && (
        <nav aria-label={t('mainMenu')} className="border-t border-slate-100 bg-white px-4 py-3 xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-[#fff8df] hover:text-[#10234d]"
              >
                {t(key)}
              </Link>
            ))}
            {!isAptitudePage && <Link
              href="/aptitude"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-[#fff8df] hover:text-[#10234d]"
            >
              {t('aptitude')}
            </Link>}
            <Link
              href="/#admission"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#ffc928] px-4 py-3 text-sm font-extrabold text-[#10234d] md:hidden"
            >
              <Phone aria-hidden="true" size={17} />
              {t('admission')}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
