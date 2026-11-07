import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import AptitudeClient from './AptitudeClient';

type Props = {
  params: Promise<{ locale: string }>;
};

const siteUrl = 'https://www.maharashtra-edu-tech.in';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('aptitudeTitle'),
    description: t('aptitudeDescription'),
    alternates: {
      canonical: `${siteUrl}/${locale}/aptitude`,
      languages: {
        en: `${siteUrl}/en/aptitude`,
        hi: `${siteUrl}/hi/aptitude`,
        mr: `${siteUrl}/mr/aptitude`,
      },
    },
  };
}

export default function AptitudePage() {
  return <AptitudeClient />;
}
