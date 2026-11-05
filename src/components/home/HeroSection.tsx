import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Users,
} from 'lucide-react';

export default async function HeroSection() {
  const t = await getTranslations('Hero');

  const learningItems = [
    {
      number: '01',
      label: t('education'),
      title: t('educationTitle'),
      Icon: GraduationCap,
      iconStyle: 'bg-blue-50 text-blue-700',
    },
    {
      number: '02',
      label: t('technology'),
      title: t('technologyTitle'),
      Icon: Code2,
      iconStyle: 'bg-violet-50 text-violet-700',
    },
    {
      number: '03',
      label: t('innovation'),
      title: t('innovationTitle'),
      Icon: Lightbulb,
      iconStyle: 'bg-amber-50 text-amber-700',
    },
  ];

  const highlights = [
    { label: t('students'), Icon: Users },
    { label: t('courses'), Icon: BookOpen },
    { label: t('training'), Icon: Code2 },
  ];

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[#f7f9ff] text-slate-900"
    >
      {/* Soft ambient shapes */}
      <div className="pointer-events-none absolute -right-40 -top-44 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:radial-gradient(#94a3b8_0.7px,transparent_0.7px)] [background-size:22px_22px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:py-24">
        {/* Content */}
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 shadow-sm shadow-blue-900/5">
            <Sparkles size={15} className="text-blue-700" />
            <span className="text-xs font-bold tracking-wide text-blue-800 sm:text-sm">
              {t('badge')}
            </span>
          </div>

          <h1 className="max-w-2xl text-[2.65rem] font-black leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[4.35rem]">
            {t('title')}
            <span className="mt-2 block bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 bg-clip-text pb-2 text-transparent">
              {t('highlight')}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            {t('description')}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#courses"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-blue-700 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-800 hover:shadow-xl sm:text-base"
            >
              {t('exploreCourses')}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-800 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:text-blue-700 sm:text-base"
            >
              {t('contactUs')}
              <ArrowUpRight size={17} />
            </a>
          </div>

          <div className="mt-11 grid max-w-xl grid-cols-3 gap-3 border-t border-slate-200 pt-7 sm:gap-6">
            {highlights.map(({ label, Icon }) => (
              <div key={label} className="min-w-0">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon size={18} />
                </div>
                <p className="text-xs font-bold leading-5 text-slate-700 sm:text-sm">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual learning dashboard */}
        <div className="relative mx-auto w-full max-w-[560px] lg:ml-auto">
          <div className="absolute -right-7 -top-8 h-36 w-36 rounded-full border-[22px] border-blue-100/80" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-violet-200/60 blur-2xl" />

          <div className="relative rounded-[30px] border border-white/90 bg-white/80 p-3 shadow-[0_30px_90px_-28px_rgba(30,64,175,0.28)] backdrop-blur sm:p-5">
            <div className="rounded-[23px] border border-slate-100 bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-700/20">
                    <GraduationCap size={26} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400">Maharashtra Edu & Tech</p>
                    <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">Learning Hub</h2>
                  </div>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
              </div>

              <div className="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#123b91] via-blue-700 to-indigo-700 p-5 text-white sm:p-7">
                <div className="absolute -right-9 -top-12 h-44 w-44 rounded-full border-[26px] border-white/10" />
                <div className="absolute -bottom-16 right-20 h-36 w-36 rounded-full bg-cyan-300/10 blur-2xl" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-blue-50">
                    <Sparkles size={13} /> Learn · Build · Grow
                  </span>
                  <h3 className="mt-5 max-w-sm text-2xl font-extrabold leading-tight tracking-tight sm:text-[2rem]">
                    Learn new skills. Create your future.
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100">
                    Build knowledge, gain practical experience and turn ideas into possibilities.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-bold text-white/90">
                    <span className="h-px w-8 bg-cyan-300" /> Explore your potential
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">Explore What We Offer</h3>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">03 Areas</span>
                </div>
                <div className="space-y-3">
                  {learningItems.map(({ number, label, title, Icon, iconStyle }) => (
                    <div
                      key={number}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md sm:p-4"
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
                        <Icon size={23} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                          {number} / {label}
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-800 sm:text-[15px]">{title}</p>
                      </div>
                      <ArrowUpRight size={18} className="shrink-0 text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-700" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs font-semibold leading-5 text-blue-900">
                <Sparkles size={16} className="shrink-0 text-blue-700" />
                Education and technology for a brighter tomorrow.
              </div>
            </div>
          </div>

          <div className="absolute -left-7 top-28 hidden items-center gap-3 rounded-2xl border border-white bg-white p-3 shadow-xl shadow-slate-900/10 sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Lightbulb size={21} />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-800">Think Creative</p>
              <p className="mt-0.5 text-[10px] text-slate-400">Build Your Future</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
