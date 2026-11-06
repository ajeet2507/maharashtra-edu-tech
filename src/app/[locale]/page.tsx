
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

type Props = {
  params: Promise<{ locale: string }>;
};

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
