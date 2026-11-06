'use client';

import { useTranslations } from 'next-intl';
import { FormEvent } from 'react';
import { GraduationCap, MessageCircle, Phone } from 'lucide-react';

const categories = [
  'schoolCategory',
  'fundamentalsCategory',
  'programmingCategory',
  'webCategory',
  'frameworksCategory',
  'mobileCategory',
];

const selections = [
  'schoolSelection',
  'fundamentalsSelection',
  'programmingSelection',
  'webSelection',
  'frameworksSelection',
  'mobileSelection',
];

export default function AdmissionSection() {
  const t = useTranslations('Admission');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const student = String(formData.get('studentName') ?? '').trim();
    const parent = String(formData.get('parentName') ?? '').trim();
    const mobile = String(formData.get('mobile') ?? '').trim();
    const category = String(formData.get('category') ?? '');
    const selection = String(formData.get('selection') ?? '');
    const message = String(formData.get('message') ?? '').trim();

    const lines = [
      t('whatsappIntro'),
      `${t('studentName')}: ${student}`,
      ...(parent ? [`${t('parentName')}: ${parent}`] : []),
      `${t('mobileLabel')}: ${mobile}`,
      `${t('categoryLabel')}: ${category}`,
      `${t('selectionLabel')}: ${selection}`,
      ...(message ? [`${t('messageLabel')}: ${message}`] : []),
    ];

    window.location.assign(
      `https://wa.me/919773105112?text=${encodeURIComponent(lines.join('\n'))}`,
    );
  }

  return (
    <section id="admission" className="bg-[#10234d] py-16 text-white sm:py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div className="flex flex-col items-start justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ffe27a]">
            <GraduationCap aria-hidden="true" size={16} />
            {t('eyebrow')}
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-blue-100">
            {t('description')}
          </p>
          <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href="tel:+919773105112"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#ffc928] px-5 py-3 text-sm font-extrabold text-[#10234d] transition hover:bg-[#ffda5e]"
            >
              <Phone aria-hidden="true" size={17} />
              {t('callNow')}
            </a>
            <a
              href="https://wa.me/919773105112"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <MessageCircle aria-hidden="true" size={17} />
              {t('whatsapp')}
            </a>
          </div>
          <p className="mt-4 text-lg font-bold tracking-wide text-white">
            +91 97731 05112
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 text-[#10234d] shadow-2xl shadow-black/20 sm:p-7">
          <h3 className="text-xl font-extrabold sm:text-2xl">{t('formTitle')}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t('formDescription')}</p>
          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="admission-student" className="mb-1.5 block text-sm font-semibold">
                {t('studentName')}
              </label>
              <input
                id="admission-student"
                name="studentName"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                className="min-h-12 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-[#183b7a] focus:ring-2 focus:ring-[#183b7a]/15"
              />
            </div>
            <div>
              <label htmlFor="admission-parent" className="mb-1.5 block text-sm font-semibold">
                {t('parentName')}
              </label>
              <input
                id="admission-parent"
                name="parentName"
                maxLength={100}
                autoComplete="additional-name"
                className="min-h-12 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-[#183b7a] focus:ring-2 focus:ring-[#183b7a]/15"
              />
            </div>
            <div>
              <label htmlFor="admission-mobile" className="mb-1.5 block text-sm font-semibold">
                {t('mobileLabel')}
              </label>
              <input
                id="admission-mobile"
                name="mobile"
                type="tel"
                required
                inputMode="numeric"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                title={t('mobileValidation')}
                autoComplete="tel"
                className="min-h-12 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-[#183b7a] focus:ring-2 focus:ring-[#183b7a]/15"
              />
            </div>
            <div>
              <label htmlFor="admission-category" className="mb-1.5 block text-sm font-semibold">
                {t('categoryLabel')}
              </label>
              <select
                id="admission-category"
                name="category"
                required
                defaultValue=""
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-base outline-none focus:border-[#183b7a] focus:ring-2 focus:ring-[#183b7a]/15"
              >
                <option value="" disabled>{t('selectPlaceholder')}</option>
                {categories.map((key) => <option key={key}>{t(key)}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="admission-selection" className="mb-1.5 block text-sm font-semibold">
                {t('selectionLabel')}
              </label>
              <select
                id="admission-selection"
                name="selection"
                required
                defaultValue=""
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-base outline-none focus:border-[#183b7a] focus:ring-2 focus:ring-[#183b7a]/15"
              >
                <option value="" disabled>{t('selectPlaceholder')}</option>
                {selections.map((key) => <option key={key}>{t(key)}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="admission-message" className="mb-1.5 block text-sm font-semibold">
                {t('messageLabel')}
              </label>
              <textarea
                id="admission-message"
                name="message"
                rows={3}
                maxLength={1000}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-base outline-none focus:border-[#183b7a] focus:ring-2 focus:ring-[#183b7a]/15"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#10234d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#183b7a] sm:col-span-2"
            >
              <MessageCircle aria-hidden="true" size={18} />
              {t('sendWhatsApp')}
            </button>
            <p className="text-xs leading-5 text-slate-500 sm:col-span-2">
              {t('whatsappNote')}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
