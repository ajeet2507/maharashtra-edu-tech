import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Languages,
  Landmark,
} from 'lucide-react';

const subjects = [
  { key: 'subjectOne', icon: BookOpen },
  { key: 'subjectTwo', icon: Languages },
  { key: 'subjectThree', icon: Languages },
  { key: 'subjectFour', icon: Calculator },
  { key: 'subjectFive', icon: FlaskConical },
  { key: 'subjectSix', icon: Landmark },
  { key: 'subjectSeven', icon: Globe },
];

const benefits = ['benefitOne', 'benefitTwo', 'benefitThree', 'benefitFour', 'benefitFive', 'benefitSix'];

export default async function SchoolCoachingSection() {
  const t = await getTranslations('SchoolCoaching');

  return (
    <section id="school-coaching" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full bg-[#fff4c2] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#10234d]">
              {t('eyebrow')}
            </p>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-[#10234d] sm:text-4xl lg:text-5xl">
              {t('title')}
              <span className="mt-1 block text-[#c47a00]">{t('highlight')}</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              {t('description')}
            </p>
            <p className="mt-5 inline-flex rounded-lg bg-[#10234d] px-4 py-2 text-sm font-bold text-white">
              {t('gradeRange')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {subjects.map(({ key, icon: Icon }) => (
              <article
                key={key}
                className="rounded-2xl border border-[#e7eaf0] bg-[#fffdf6] p-4 transition hover:-translate-y-1 hover:border-[#f0c64c] hover:shadow-lg sm:p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0ae] text-[#10234d]">
                  <Icon aria-hidden="true" size={22} />
                </div>
                <h3 className="mt-4 text-sm font-bold leading-5 text-[#10234d] sm:text-base">
                  {t(key)}
                </h3>
              </article>
            ))}
          </div>
        </div>

        <div className="school-image-panel relative mt-10 h-48 overflow-hidden rounded-2xl sm:h-64 lg:h-72">
          <Image
            src="/courses/school-coaching.webp"
            alt={t('imageAlt')}
            fill
            sizes="(max-width: 1023px) 100vw, 1216px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#10234d]/85 via-[#10234d]/35 to-transparent" />
          <p className="absolute bottom-5 left-5 max-w-lg text-lg font-extrabold leading-snug text-white sm:bottom-8 sm:left-8 sm:text-2xl">
            {t('imageCaption')}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-3 rounded-2xl bg-[#10234d] p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <p key={benefit} className="flex items-center gap-3 text-sm font-semibold text-white">
              <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffc928] text-xs font-black text-[#10234d]">
                ✓
              </span>
              {t(benefit)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
