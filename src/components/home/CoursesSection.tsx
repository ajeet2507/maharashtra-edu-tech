import { getTranslations } from 'next-intl/server';
import CoursesCarousel, { type CourseSlide } from './CoursesCarousel';

const courseImages = [
  { id: 'computer-basics', image: '/courses/computer-basics.webp', titleKey: 'categoryOneTitle', descriptionKey: 'categoryOneDescription', listKey: 'categoryOneList', altKey: 'categoryOneImageAlt' },
  { id: 'programming', image: '/courses/programming.webp', titleKey: 'categoryTwoTitle', descriptionKey: 'categoryTwoDescription', listKey: 'categoryTwoList', altKey: 'categoryTwoImageAlt' },
  { id: 'web-development', image: '/courses/web-development.webp', titleKey: 'categoryThreeTitle', descriptionKey: 'categoryThreeDescription', listKey: 'categoryThreeList', altKey: 'categoryThreeImageAlt' },
  { id: 'frameworks', image: '/courses/frameworks.webp', titleKey: 'categoryFourTitle', descriptionKey: 'categoryFourDescription', listKey: 'categoryFourList', altKey: 'categoryFourImageAlt' },
  { id: 'mobile-apps', image: '/courses/mobile-apps.webp', titleKey: 'categoryFiveTitle', descriptionKey: 'categoryFiveDescription', listKey: 'categoryFiveList', altKey: 'categoryFiveImageAlt' },
] as const;

export default async function CoursesSection() {
  const t = await getTranslations('Courses');

  const courses: CourseSlide[] = courseImages.map(
    ({ id, image, titleKey, descriptionKey, listKey, altKey }) => ({
      id,
      image,
      title: t(titleKey),
      description: t(descriptionKey),
      topics: t(listKey).split('|'),
      imageAlt: t(altKey),
    }),
  );

  return (
    <section id="courses" className="relative overflow-hidden bg-[#fff9e6] py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="section-shape pointer-events-none absolute -right-20 top-24 h-52 w-52 rounded-full border-[28px] border-[#10234d]/[0.04]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full bg-[#ffedaa] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#10234d]">
            {t('eyebrow')}
          </p>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#10234d] sm:text-4xl lg:text-5xl">
            {t('title')} <span className="text-[#c47a00]">{t('highlight')}</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">{t('description')}</p>
        </div>

        <CoursesCarousel courses={courses} />
      </div>
    </section>
  );
}
