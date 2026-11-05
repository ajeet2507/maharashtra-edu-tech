
import { io } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import {
  GraduationCap,
  ArrowUpRight,
} from 'lucide-react';

async function Copyright() {
  const t = await getTranslations('Footer');
  await io();

  return (
    <p className="text-sm text-slate-500">
      {t('copyright', { year: new Date().getFullYear() })}
    </p>
  );
}

const quickLinks = [
  { labelKey: 'home', href: '#home' },
  { labelKey: 'about', href: '#about' },
  { labelKey: 'courses', href: '#courses' },
  { labelKey: 'services', href: '#services' },
  { labelKey: 'contact', href: '#contact' },
];

const courseLinks = [
  { labelKey: 'webDevelopment', href: '#courses' },
  { labelKey: 'frontendDevelopment', href: '#courses' },
  { labelKey: 'databaseManagement', href: '#courses' },
  { labelKey: 'computerFundamentals', href: '#courses' },
];

const serviceLinks = [
  { labelKey: 'websiteDevelopment', href: '#services' },
  { labelKey: 'softwareDevelopment', href: '#services' },
  { labelKey: 'mobileAppDevelopment', href: '#services' },
  { labelKey: 'uiuxDesign', href: '#services' },
];

export default async function Footer() {
  const t = await getTranslations('Footer');

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Institute Information */}
          <div>
            <a href="#home" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <GraduationCap size={25} />
              </div>

              <div>
                <p className="text-lg font-bold leading-tight">
                  Maharashtra
                </p>
                <p className="text-xs font-medium tracking-wide text-blue-400">
                  Edu & Tech Classes
                </p>
              </div>
            </a>

            <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
              {t('description')}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { label: 'Facebook', mark: 'f' },
                { label: 'Instagram', mark: 'IG' },
                { label: 'LinkedIn', mark: 'in' },
                { label: 'YouTube', mark: 'YT' },
              ].map(({ label, mark }) => (
                <span
                  key={label}
                  title={label}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-slate-400"
                >
                  {mark}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold">
              {t('quickLinksTitle')}
            </h3>

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.labelKey}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-base font-bold">
              {t('coursesTitle')}
            </h3>

            <ul className="mt-6 space-y-4">
              {courseLinks.map((link) => (
                <li key={link.labelKey}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-bold">
              {t('servicesTitle')}
            </h3>

            <ul className="mt-6 space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.labelKey}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300"
            >
              {t('getInTouch')}
              <ArrowUpRight size={16} />
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <Suspense
            fallback={
              <p className="text-sm text-slate-500" aria-hidden="true">
                &nbsp;
              </p>
            }
          >
            <Copyright />
          </Suspense>

          <div className="flex flex-wrap gap-6">
            <a
              href="#"
              className="text-sm text-slate-500 hover:text-white"
            >
              {t('privacyPolicy')}
            </a>

            <a
              href="#"
              className="text-sm text-slate-500 hover:text-white"
            >
              {t('termsConditions')}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
