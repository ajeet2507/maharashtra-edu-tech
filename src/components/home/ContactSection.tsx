
import { getTranslations } from 'next-intl/server';
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
} from 'lucide-react';
import ContactForm from './ContactForm';

export default async function ContactSection() {
  const t = await getTranslations('Contact');

  const contactItems = [
    {
      icon: Phone,
      title: t('phoneLabel'),
      value: t('phoneValue'),
    },
    {
      icon: Mail,
      title: t('emailLabel'),
      value: t('emailValue'),
    },
    {
      icon: MapPin,
      title: t('addressLabel'),
      value: t('addressValue'),
    },
    {
      icon: Clock,
      title: t('hoursLabel'),
      value: t('hoursValue'),
    },
  ];

  return (
    <section id="contact" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            {t('eyebrow')}
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t('title')}{' '}
            <span className="text-blue-700">{t('highlight')}</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600">
            {t('description')}
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-5">

          {/* Contact Information */}
          <div className="rounded-3xl bg-slate-950 p-8 text-white lg:col-span-2">
            <h3 className="text-2xl font-bold">
              {t('infoTitle')}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              {t('infoDescription')}
            </p>

            <div className="mt-10 space-y-7">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                      <Icon size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enquiry Form UI */}
          <ContactForm />

        </div>
      </div>
    </section>
  );
}
