import { getTranslations } from 'next-intl/server';
import {
  BookOpenCheck,
  BrainCircuit,
  BriefcaseBusiness,
  GraduationCap,
  Clock3,
  ClipboardCheck,
} from 'lucide-react';

const features = [
  { icon: GraduationCap, titleKey: 'featureOneTitle', descriptionKey: 'featureOneDescription' },
  { icon: BrainCircuit, titleKey: 'featureTwoTitle', descriptionKey: 'featureTwoDescription' },
  { icon: BookOpenCheck, titleKey: 'featureThreeTitle', descriptionKey: 'featureThreeDescription' },
  { icon: Clock3, titleKey: 'featureFourTitle', descriptionKey: 'featureFourDescription' },
  { icon: ClipboardCheck, titleKey: 'featureFiveTitle', descriptionKey: 'featureFiveDescription' },
  { icon: BriefcaseBusiness, titleKey: 'featureSixTitle', descriptionKey: 'featureSixDescription' },
];

export default async function WhyChooseUs() {
  const t = await getTranslations('WhyChooseUs');

  return (
    <section id="why-us" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex rounded-full bg-[#fff4c2] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#10234d]">
            {t('eyebrow')}
          </p>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#10234d] sm:text-4xl lg:text-5xl">
            {t('title')} <span className="text-[#c47a00]">{t('highlight')}</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">{t('description')}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, titleKey, descriptionKey }, index) => (
            <article
              key={titleKey}
              className="rounded-2xl border border-slate-200 bg-[#fffdf6] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#edc247] hover:shadow-lg sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10234d] text-[#ffc928]">
                  <Icon aria-hidden="true" size={23} />
                </span>
                <span className="text-sm font-extrabold text-slate-300">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-[#10234d]">{t(titleKey)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t(descriptionKey)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
