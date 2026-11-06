
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CoursesSection from '@/components/home/CoursesSection';
import ITServicesSection from '@/components/home/ITServicesSection';
import ContactSection from '@/components/home/ContactSection';
import SchoolCoachingSection from '@/components/home/SchoolCoachingSection';
import AdmissionSection from '@/components/home/AdmissionSection';

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
        <HeroSection />
        <SchoolCoachingSection />
        <CoursesSection />
        <AboutSection />
        <WhyChooseUs />
        <ITServicesSection />
        <AdmissionSection />
        <ContactSection />
      </main>
    </>
  );
}
