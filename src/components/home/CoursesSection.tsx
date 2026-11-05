
import { getTranslations } from 'next-intl/server';
import {
  ArrowUpRight,
  Code2,
  Database,
  Globe,
  Laptop,
} from 'lucide-react';

const courses = [
  {
    icon: Code2,
    titleKey: 'courseOneTitle',
    descriptionKey: 'courseOneDescription',
    levelKey: 'courseOneLevel',
    durationKey: 'courseOneDuration',
  },
  {
    icon: Globe,
    titleKey: 'courseTwoTitle',
    descriptionKey: 'courseTwoDescription',
    levelKey: 'courseTwoLevel',
    durationKey: 'courseTwoDuration',
  },
  {
    icon: Database,
    titleKey: 'courseThreeTitle',
    descriptionKey: 'courseThreeDescription',
    levelKey: 'courseThreeLevel',
    durationKey: 'courseThreeDuration',
  },
  {
    icon: Laptop,
    titleKey: 'courseFourTitle',
    descriptionKey: 'courseFourDescription',
    levelKey: 'courseFourLevel',
    durationKey: 'courseFourDuration',
  },
];

export default async function CoursesSection() {
  const t = await getTranslations('Courses');

  return (
    <section
      id="courses"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            {t('eyebrow')}
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t('title')}{' '}
            <span className="text-blue-700">
              {t('highlight')}
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600">
            {t('description')}
          </p>
        </div>

        {/* Course Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, index) => {
            const Icon = course.icon;

            return (
              <div
                key={course.titleKey}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-700 group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <span className="text-sm font-semibold text-slate-300">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold text-slate-900">
                  {t(course.titleKey)}
                </h3>

                <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">
                  {t(course.descriptionKey)}
                </p>

                <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
                  <p className="text-xs font-medium text-slate-500">
                    {t('levelLabel')}: {t(course.levelKey)}
                  </p>

                  <p className="text-xs font-medium text-slate-500">
                    {t('durationLabel')}: {t(course.durationKey)}
                  </p>
                </div>

                <a
                  href="#contact"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition-all group-hover:gap-3"
                >
                  {t('courseDetails')}
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
