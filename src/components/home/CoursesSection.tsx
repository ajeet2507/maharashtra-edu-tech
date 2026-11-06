import { getTranslations } from 'next-intl/server';
import {
  ArrowUpRight,
  Code2,
  Laptop,
  Layers3,
  Smartphone,
  Monitor,
} from 'lucide-react';

const courses = [
  {
    icon: Monitor,
    titleKey: 'categoryOneTitle',
    descriptionKey: 'categoryOneDescription',
    listKey: 'categoryOneList',
  },
  {
    icon: Code2,
    titleKey: 'categoryTwoTitle',
    descriptionKey: 'categoryTwoDescription',
    listKey: 'categoryTwoList',
  },
  {
    icon: Laptop,
    titleKey: 'categoryThreeTitle',
    descriptionKey: 'categoryThreeDescription',
    listKey: 'categoryThreeList',
  },
  {
    icon: Layers3,
    titleKey: 'categoryFourTitle',
    descriptionKey: 'categoryFourDescription',
    listKey: 'categoryFourList',
  },
  {
    icon: Smartphone,
    titleKey: 'categoryFiveTitle',
    descriptionKey: 'categoryFiveDescription',
    listKey: 'categoryFiveList',
  },
];

export default async function CoursesSection() {
  const t = await getTranslations('Courses');

  return (
    <section id="courses" className="bg-[#fff9e6] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full bg-[#ffedaa] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#10234d]">
            {t('eyebrow')}
          </p>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#10234d] sm:text-4xl lg:text-5xl">
            {t('title')} <span className="text-[#c47a00]">{t('highlight')}</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">{t('description')}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(({ icon: Icon, titleKey, descriptionKey, listKey }, index) => (
            <article
              key={titleKey}
              className="group flex flex-col rounded-2xl border border-[#e8dfc7] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#edc247] hover:shadow-xl sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10234d] text-[#ffc928]">
                  <Icon aria-hidden="true" size={24} />
                </div>
                <span className="rounded-full bg-[#fff4c2] px-3 py-1 text-xs font-extrabold text-[#10234d]">
                  {t('categoryLabel')} 0{index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-[#10234d]">{t(titleKey)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t(descriptionKey)}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {t(listKey).split('|').map((item) => (
                  <li
                    key={item}
                    className="rounded-lg bg-[#f4f6fa] px-2.5 py-1.5 text-xs font-medium leading-4 text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#admission"
                className="mt-6 inline-flex min-h-11 items-center gap-2 self-start rounded-lg bg-[#ffc928] px-4 py-2 text-sm font-bold text-[#10234d] transition hover:bg-[#ffda5e]"
              >
                {t('courseDetails')}
                <ArrowUpRight aria-hidden="true" size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
