
import { getTranslations } from 'next-intl/server';
import {
  Code2,
  Globe,
  Smartphone,
  Database,
  Palette,
  Settings,
  ArrowUpRight,
} from 'lucide-react';

const services = [
  {
    icon: Globe,
    titleKey: 'serviceOneTitle',
    descriptionKey: 'serviceOneDescription',
  },
  {
    icon: Code2,
    titleKey: 'serviceTwoTitle',
    descriptionKey: 'serviceTwoDescription',
  },
  {
    icon: Smartphone,
    titleKey: 'serviceThreeTitle',
    descriptionKey: 'serviceThreeDescription',
  },
  {
    icon: Database,
    titleKey: 'serviceFourTitle',
    descriptionKey: 'serviceFourDescription',
  },
  {
    icon: Palette,
    titleKey: 'serviceFiveTitle',
    descriptionKey: 'serviceFiveDescription',
  },
  {
    icon: Settings,
    titleKey: 'serviceSixTitle',
    descriptionKey: 'serviceSixDescription',
  },
];

export default async function ITServicesSection() {
  const t = await getTranslations('ITServices');

  return (
    <section
      id="services"
      className="bg-slate-950 py-20 text-white sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            {t('eyebrow')}
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t('title')}{' '}
            <span className="text-blue-400">
              {t('highlight')}
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-300">
            {t('description')}
          </p>
        </div>

        {/* Services */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={service.titleKey}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/50 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <span className="text-sm font-semibold text-slate-600">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold text-white">
                  {t(service.titleKey)}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {t(service.descriptionKey)}
                </p>

                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition-all group-hover:gap-3"
                >
                  {t('learnMore')}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
