
import { getTranslations } from 'next-intl/server';
import {
  ArrowUpRight,
  BookOpenCheck,
  BrainCircuit,
  Code2,
  Compass,
  Lightbulb,
  Target,
} from 'lucide-react';

export default async function AboutSection() {
  const t = await getTranslations('About');

  const pillars = [
    {
      number: '01',
      title: t('pillarOneTitle'),
      description: t('pillarOneDescription'),
      Icon: BookOpenCheck,
      iconClass: 'bg-blue-50 text-blue-700',
    },
    {
      number: '02',
      title: t('pillarTwoTitle'),
      description: t('pillarTwoDescription'),
      Icon: Code2,
      iconClass: 'bg-violet-50 text-violet-700',
    },
    {
      number: '03',
      title: t('pillarThreeTitle'),
      description: t('pillarThreeDescription'),
      Icon: BrainCircuit,
      iconClass: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">

          {/* About Introduction */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-800">
              <Compass size={15} />
              {t('eyebrow')}
            </div>

            <h2 className="max-w-xl text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {t('title')}{' '}
              <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                {t('highlight')}
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              {t('description')}
            </p>

            <a
              href="#contact"
              className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-800"
            >
              {t('cta')}
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          {/* Mission and Vision */}
          <div className="grid gap-4 sm:grid-cols-2">

            <article className="rounded-3xl border border-slate-100 bg-[#f8faff] p-6 sm:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
                <Target size={24} />
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                {t('missionLabel')}
              </p>

              <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                {t('missionTitle')}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t('missionDescription')}
              </p>
            </article>

            <article className="rounded-3xl border border-slate-100 bg-slate-950 p-6 text-white sm:mt-10 sm:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
                <Lightbulb size={24} />
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                {t('visionLabel')}
              </p>

              <h3 className="mt-2 text-xl font-extrabold">
                {t('visionTitle')}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {t('visionDescription')}
              </p>
            </article>

          </div>
        </div>

        {/* Learning Pillars */}
        <div className="mt-16 border-t border-slate-100 pt-10 sm:mt-20 sm:pt-12">

          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                {t('pillarsEyebrow')}
              </p>

              <h3 className="mt-2 text-2xl font-extrabold text-slate-950 sm:text-3xl">
                {t('pillarsTitle')}
              </h3>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-500">
              {t('pillarsDescription')}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {pillars.map(({ number, title, description, Icon, iconClass }) => (
              <article
                key={number}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}>
                    <Icon size={23} />
                  </div>

                  <span className="text-xs font-extrabold tracking-widest text-slate-300">
                    {number}
                  </span>
                </div>

                <h4 className="mt-5 text-lg font-extrabold text-slate-900">
                  {title}
                </h4>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {description}
                </p>

                <div className="mt-5 h-1 w-10 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-16" />
              </article>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
}
