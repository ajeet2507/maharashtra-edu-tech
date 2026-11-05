
'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About Us', href: '/#about' },
  { label: 'Courses', href: '/#courses' },
  { label: 'IT Services', href: '/#services' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Free Aptitude Test', href: '/aptitude' },
] as const;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:py-4">

        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex min-w-0 items-center gap-2"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-xl font-bold text-white">
            M
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-gray-900 sm:text-base">
              Maharashtra Edu & Tech
            </h1>
            <p className="hidden text-xs text-gray-500 sm:block">
              Education • Technology • Innovation
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-blue-700 ${
                link.href === '/aptitude'
                  ? 'font-semibold text-blue-700'
                  : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />

          <Link
            href="/#contact"
            className="hidden rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 sm:inline-block"
          >
            Enquire Now
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-800 lg:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 ${
                  link.href === '/aptitude'
                    ? 'font-semibold text-blue-700'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-lg bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-800 sm:hidden"
            >
              Enquire Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
