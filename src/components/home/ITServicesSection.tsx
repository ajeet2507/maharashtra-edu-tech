import { getTranslations } from 'next-intl/server';
import {
  ArrowUpRight,
  Globe,
  Smartphone,
  Palette,
  Settings,
  ShoppingCart,
} from 'lucide-react';

const services = [
  { icon: Globe, titleKey: 'serviceOneTitle', descriptionKey: 'serviceOneDescription' },
  { icon: ShoppingCart, titleKey: 'serviceFourTitle', descriptionKey: 'serviceFourDescription' },
  { icon: Smartphone, titleKey: 'serviceThreeTitle', descriptionKey: 'serviceThreeDescription' },
  { icon: Palette, titleKey: 'serviceFiveTitle', descriptionKey: 'serviceFiveDescription' },
  { icon: Settings, titleKey: 'serviceSixTitle', descriptionKey: 'serviceSixDescription' },
];

export default async function ITServicesSection() {
  const t = await getTranslations('ITServices');

  return (
    <section id="services" className="bg-[#10234d] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffe27a]">
            {t('eyebrow')}
          </p>
          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {t('title')} <span className="text-[#ffc928]">{t('highlight')}</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-blue-100">{t('description')}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, titleKey, descriptionKey }, index) => (
            <article
              key={titleKey}
              className="group rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#ffc928]/60 hover:bg-white/[0.08] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffc928] text-[#10234d]">
                  <Icon aria-hidden="true" size={23} />
                </span>
                <span className="text-sm font-bold text-white/40">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold">{t(titleKey)}</h3>
              <p className="mt-2 min-h-14 text-sm leading-6 text-blue-100">{t(descriptionKey)}</p>
              <a
                href="#contact"
                className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#ffe27a] transition-all group-hover:gap-3"
              >
                {t('learnMore')}
                <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#ffc928] p-5 text-center text-[#10234d] sm:flex-row sm:p-6 sm:text-left">
          <p className="text-lg font-extrabold sm:text-xl">{t('businessCta')}</p>
          <a href="#contact" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#10234d] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#183b7a]">
            {t('contactCta')}
            <ArrowUpRight aria-hidden="true" size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
