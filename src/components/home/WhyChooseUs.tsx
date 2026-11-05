
import { getTranslations } from 'next-intl/server';
import {
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  GraduationCap,
  ArrowUpRight,
} from 'lucide-react';

export default async function WhyChooseUs() {
  const t = await getTranslations('WhyChooseUs');

  const features = [
    {
      icon: BookOpenCheck,
      number: '01',
      title: t('featureOneTitle'),
      description: t('featureOneDescription'),
      color: 'bg-blue-50 text-blue-700',
    },
    {
      icon: GraduationCap,
      number: '02',
      title: t('featureTwoTitle'),
      description: t('featureTwoDescription'),
      color: 'bg-violet-50 text-violet-700',
    },
    {
      icon: BrainCircuit,
      number: '03',
      title: t('featureThreeTitle'),
      description: t('featureThreeDescription'),
      color: 'bg-amber-50 text-amber-700',
    },
    {
      icon: BriefcaseBusiness,
      number: '04',
      title: t('featureFourTitle'),
      description: t('featureFourDescription'),
      color: 'bg-emerald-50 text-emerald-700',
    },
  ];

  return (
    <section id="why-us" className="bg-[#f8faff] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">

        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-700">
            {t('eyebrow')}
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {t('title')}{' '}
            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              {t('highlight')}
            </span>
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600">
            {t('description')}
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-100 hover:shadow-xl sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color}`}>
                    <Icon size={26} />
                  </div>

                  <span className="text-sm font-extrabold text-slate-200">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-extrabold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-blue-700">
                    {t('learnMore')}
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="text-slate-400 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-700"
                  />
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
