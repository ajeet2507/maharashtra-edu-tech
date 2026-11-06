'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef, useState, type UIEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

export type CourseSlide = {
  id: string;
  title: string;
  description: string;
  topics: string[];
  image: string;
  imageAlt: string;
};

type Props = {
  courses: CourseSlide[];
};

export default function CoursesCarousel({ courses }: Props) {
  const t = useTranslations('Courses');
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAtEnd, setIsAtEnd] = useState(false);

  function updateActiveIndex(event: UIEvent<HTMLDivElement>) {
    const track = event.currentTarget;
    setIsAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
    const firstSlide = track.firstElementChild;
    if (!(firstSlide instanceof HTMLElement)) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const slideWidth = firstSlide.getBoundingClientRect().width + gap;
    setActiveIndex(Math.min(courses.length - 1, Math.round(track.scrollLeft / slideWidth)));
  }

  function scrollToSlide(index: number) {
    const track = trackRef.current;
    const slide = track?.children.item(index);
    if (!track || !(slide instanceof HTMLElement)) return;

    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    setActiveIndex(index);
  }

  function moveBy(direction: -1 | 1) {
    scrollToSlide(Math.max(0, Math.min(courses.length - 1, activeIndex + direction)));
  }

  return (
    <div aria-roledescription="carousel" aria-label={t('carouselLabel')} className="mt-10">
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => moveBy(-1)}
          disabled={activeIndex === 0}
          aria-label={t('previousCourse')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dce5] bg-white text-[#10234d] transition hover:border-[#10234d] hover:bg-[#10234d] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft aria-hidden="true" size={19} />
        </button>
        <button
          type="button"
          onClick={() => moveBy(1)}
          disabled={isAtEnd}
          aria-label={t('nextCourse')}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8dce5] bg-white text-[#10234d] transition hover:border-[#10234d] hover:bg-[#10234d] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowRight aria-hidden="true" size={19} />
        </button>
      </div>

      <div
        ref={trackRef}
        onScroll={updateActiveIndex}
        className="course-carousel-track flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3"
      >
        {courses.map((course, index) => (
          <article
            key={course.id}
            id={`course-${course.id}`}
            aria-roledescription="slide"
            aria-label={t('slideLabel', { current: index + 1, total: courses.length })}
            style={{ animationDelay: `${Math.min(index, 4) * 90}ms` }}
            className="course-slide course-card-entrance group flex shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#e8dfc7] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#edc247] hover:shadow-xl"
          >
            <div className="course-image-wrap relative aspect-[16/9] overflow-hidden bg-slate-100">
              <Image
                src={course.image}
                alt={course.imageAlt}
                fill
                priority={index === 0}
                sizes="(max-width: 639px) 88vw, (max-width: 1023px) 48vw, 32vw"
                className="course-image object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-[#ffc928] px-3 py-1 text-[11px] font-extrabold text-[#10234d]">
                {t('categoryLabel')} 0{index + 1}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="text-lg font-extrabold leading-snug text-[#10234d] sm:text-xl">
                {course.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{course.description}</p>
              <ul id={`course-topics-${course.id}`} className="mt-4 flex flex-wrap gap-2">
                {course.topics.map((topic) => (
                  <li
                    key={topic}
                    className="rounded-lg bg-[#f4f6fa] px-2.5 py-1.5 text-xs font-medium leading-4 text-slate-700"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                <a
                  href={`#course-topics-${course.id}`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[#10234d]/15 px-3 py-2 text-xs font-bold text-[#10234d] transition hover:bg-[#f4f6fa] active:scale-95 sm:text-sm"
                >
                  {t('viewCourse')}
                  <ArrowUpRight aria-hidden="true" size={15} />
                </a>
                <a
                  href="#admission"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-[#ffc928] px-3 py-2 text-xs font-extrabold text-[#10234d] transition hover:bg-[#ffda5e] active:scale-95 sm:text-sm"
                >
                  {t('courseDetails')}
                  <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2" role="group" aria-label={t('carouselPagination')}>
        {courses.map((course, index) => (
          <button
            key={course.id}
            type="button"
            onClick={() => scrollToSlide(index)}
            aria-label={t('goToCourse', { number: index + 1 })}
            aria-current={activeIndex === index ? 'true' : undefined}
            className={`h-2.5 rounded-full transition-all ${
              activeIndex === index ? 'w-7 bg-[#10234d]' : 'w-2.5 bg-[#10234d]/25 hover:bg-[#10234d]/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
