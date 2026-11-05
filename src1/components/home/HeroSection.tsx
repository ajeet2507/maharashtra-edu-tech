
import { getTranslations } from 'next-intl/server';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Code2,
  GraduationCap,
  Lightbulb,
  Play,
  Sparkles,
  Users,
} from 'lucide-react';

export default async function HeroSection() {
  const t = await getTranslations('Hero');

  const learningItems = [
    {
      number: '01',
      title: t('educationTitle'),
      category: t('education'),
      icon: GraduationCap,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      number: '02',
      title: t('technologyTitle'),
      category: t('technology'),
      icon: Code2,
      color: 'bg-violet-50 text-violet-700',
    },
    {
      number: '03',
      title: t('innovationTitle'),
      category: t('innovation'),
      icon: Lightbulb,
      color: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[#f8faff]"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-100/50 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">

        {/* LEFT CONTENT */}
        <div className="relative z-10">

          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
            <Sparkles size={15} className="text-blue-600" />
            <span className="text-xs font-semibold tracking-wide text-blue-700 sm:text-sm">
              {t('badge')}
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.13] tracking-tight text-slate-900 sm:text-5xl lg:text-[64px]">
            {t('title')}
            <span className="mt-2 block bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {t('highlight')}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            {t('description')}
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">

            <a
              href="#courses"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-blue-700 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-800 hover:shadow-xl sm:text-base"
            >
              {t('exploreCourses')}
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <a
              href="#contact"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:text-blue-700 sm:text-base"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                <Play size={13} fill="currentColor" />
              </span>
              {t('contactUs')}
            </a>

          </div>

          {/* Trust highlights */}
          <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-200 pt-7">

            <div>
              <div className="mb-2 flex items-center gap-2 text-blue-700">
                <Users size={19} />
                <span className="text-sm font-bold">01</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                {t('students')}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-blue-700">
                <BookOpen size={19} />
                <span className="text-sm font-bold">02</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                {t('courses')}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-blue-700">
                <Code2 size={19} />
                <span className="text-sm font-bold">03</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                {t('training')}
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT VISUAL DASHBOARD */}
        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">

          {/* Decorative circle */}
          <div className="absolute -right-5 -top-8 h-32 w-32 rounded-full border-[18px] border-blue-100/70" />
          <div className="absolute -bottom-8 -left-5 h-28 w-28 rounded-full bg-indigo-100/70 blur-2xl" />

          {/* Main card */}
          <div className="relative rounded-[28px] border border-white bg-white p-4 shadow-[0_25px_80px_-20px_rgba(30,64,175,0.20)] sm:p-6">

            {/* Dashboard header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-700/20">
                  <GraduationCap size={26} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Maharashtra Edu & Tech
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
                    Learning Hub
                  </h2>
                </div>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
              </div>

            </div>

            {/* Welcome banner */}
            <div className="relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#123d9c] via-blue-700 to-indigo-700 p-5 text-white sm:p-7">

              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border-[25px] border-white/10" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-blue-50">
                  <Sparkles size={13} />
                  Learn • Build • Grow
                </span>

                <h3 className="mt-5 max-w-xs text-2xl font-extrabold leading-snug sm:text-3xl">
                  Your Journey Towards a Better Future Starts Here.
                </h3>

                <p className="mt-3 max-w-xs text-sm leading-6 text-blue-100">
                  Discover knowledge, develop skills and turn your ideas into reality.
                </p>
              </div>
            </div>

            {/* Learning categories */}
            <div className="mt-6">

              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Explore What We Offer
                </h3>

                <span className="text-xs font-medium text-blue-700">
                  03 Categories
                </span>
              </div>

              <div className="space-y-3">
                {learningItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.number}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50/40 hover:shadow-md"
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                        <Icon size={23} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {item.number} / {item.category}
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800 sm:text-base">
                          {item.title}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={19}
                        className="shrink-0 text-slate-400 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-700"
                      />
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Bottom note */}
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50 p-3">
              <Sparkles size={17} className="shrink-0 text-blue-700" />
              <p className="text-xs font-medium leading-5 text-blue-900">
                Empowering learners through education and technology.
              </p>
            </div>

          </div>

          {/* Floating decoration */}
          <div className="absolute -left-8 top-24 hidden items-center gap-3 rounded-2xl border border-white bg-white p-3 shadow-xl sm:flex">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Lightbulb size={21} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Think Creative
              </p>
              <p className="text-[10px] text-slate-400">
                Build Your Future
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
