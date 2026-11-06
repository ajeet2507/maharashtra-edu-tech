import { getTranslations } from 'next-intl/server';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Code2,
  GraduationCap,
  Laptop,
  MessageCircle,
  Monitor,
  Smartphone,
} from 'lucide-react';

export default async function HeroSection() {
  const t = await getTranslations('Hero');

  const pathways = [
    { key: 'educationTitle', icon: BookOpen, color: 'bg-[#fff0ae] text-[#10234d]' },
    { key: 'technologyTitle', icon: Laptop, color: 'bg-[#e6edf9] text-[#10234d]' },
    { key: 'innovationTitle', icon: Code2, color: 'bg-[#ffe5cf] text-[#8c3f00]' },
  ];

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[#10234d] text-white"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-36 -top-40 h-96 w-96 rounded-full border-[48px] border-white/[0.04]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -left-40 h-[28rem] w-[28rem] rounded-full border-[64px] border-[#ffc928]/10" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-[#ffe27a] sm:text-sm">
            <GraduationCap aria-hidden="true" size={17} className="shrink-0" />
            <span>{t('badge')}</span>
          </div>

          <p className="mt-6 text-sm font-bold leading-6 text-[#ffe27a] sm:text-base">
            {t('tagline')}
          </p>
          <h1 className="mt-3 max-w-3xl text-[2.4rem] font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {t('title')}
            <span className="mt-2 block text-[#ffc928]">{t('highlight')}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
            {t('description')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#courses"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc928] px-6 py-3 text-sm font-extrabold text-[#10234d] transition hover:-translate-y-0.5 hover:bg-[#ffda5e] sm:text-base"
            >
              {t('exploreCourses')}
              <ArrowRight aria-hidden="true" size={18} />
            </a>
            <a
              href="#admission"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10 sm:text-base"
            >
              <MessageCircle aria-hidden="true" size={18} />
              {t('contactUs')}
            </a>
          </div>

          <a
            href="tel:+919773105112"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-white/90 hover:text-[#ffc928]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <Smartphone aria-hidden="true" size={16} />
            </span>
            +91 97731 05112
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-[#ffc928]" />
          <div className="relative rounded-[1.7rem] bg-white p-4 text-[#10234d] shadow-2xl sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10234d] text-[#ffc928]">
                  <GraduationCap aria-hidden="true" size={24} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-500">{t('brandLabel')}</p>
                  <p className="mt-0.5 text-sm font-extrabold sm:text-base">{t('learningTitle')}</p>
                </div>
              </div>
              <span className="rounded-full bg-[#fff4c2] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide sm:text-xs">
                {t('admissionBadge')}
              </span>
            </div>

            <div className="mt-4 rounded-2xl bg-[#10234d] p-5 text-white sm:p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#ffe27a]">
                <Monitor aria-hidden="true" size={16} />
                {t('learningAreas')}
              </div>
              <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">{t('panelTitle')}</h2>
              <p className="mt-2 text-sm leading-6 text-blue-100">{t('panelDescription')}</p>
            </div>

            <div className="mt-4 grid gap-3">
              {pathways.map(({ key, icon: Icon, color }) => (
                <div key={key} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 sm:p-4">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
                    <Icon aria-hidden="true" size={22} />
                  </span>
                  <p className="min-w-0 flex-1 text-sm font-bold leading-5 sm:text-base">{t(key)}</p>
                  <ArrowRight aria-hidden="true" size={17} className="shrink-0 text-slate-400" />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#fff4c2] px-4 py-3 text-xs font-bold text-[#10234d] sm:text-sm">
              <span>{t('gradeLabel')}</span>
              <span className="flex items-center gap-1">{t('learnMore')} <ArrowDown aria-hidden="true" size={15} /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
