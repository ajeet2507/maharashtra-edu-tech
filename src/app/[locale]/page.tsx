
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CoursesSection from '@/components/home/CoursesSection';
import ITServicesSection from '@/components/home/ITServicesSection';
import ContactSection from '@/components/home/ContactSection';
import SchoolCoachingSection from '@/components/home/SchoolCoachingSection';
import AdmissionSection from '@/components/home/AdmissionSection';
import RevealOnScroll from '@/components/common/RevealOnScroll';
import AptitudeScrollPopup from '@/components/home/AptitudeScrollPopup';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

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
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        hi: `${siteUrl}/hi`,
        mr: `${siteUrl}/mr`,
      },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  return (
    <>
      <main>
        <div className="hero-entrance"><HeroSection /></div>
        <RevealOnScroll><SchoolCoachingSection /></RevealOnScroll>
        <RevealOnScroll><CoursesSection /></RevealOnScroll>
        <RevealOnScroll><AboutSection /></RevealOnScroll>
        <RevealOnScroll><WhyChooseUs /></RevealOnScroll>
        <RevealOnScroll><ITServicesSection /></RevealOnScroll>
        <RevealOnScroll><AdmissionSection /></RevealOnScroll>
        <RevealOnScroll><ContactSection /></RevealOnScroll>
      </main>
      <AptitudeScrollPopup />
    </>
  );
}
