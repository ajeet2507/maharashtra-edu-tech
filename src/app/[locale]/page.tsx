
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CoursesSection from '@/components/home/CoursesSection';
import ITServicesSection from '@/components/home/ITServicesSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/layout/Footer';

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
        <AboutSection />
        <WhyChooseUs />
        <CoursesSection />
        <ITServicesSection />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
