
import { getTranslations } from 'next-intl/server';
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
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
    <section id="contact" className="bg-[#fff9e6] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#a35f00]">
            {t('eyebrow')}
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight text-[#10234d] sm:text-4xl">
            {t('title')}{' '}
            <span className="text-[#c47a00]">{t('highlight')}</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600">
            {t('description')}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-5">

          {/* Contact Information */}
          <div className="rounded-2xl bg-[#10234d] p-6 text-white sm:p-8 lg:col-span-2">
            <h3 className="text-2xl font-extrabold">
              {t('infoTitle')}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              {t('infoDescription')}
            </p>

            <div className="mt-8 space-y-6">
              {contactItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#ffc928]">
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

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a
                href="tel:+919773105112"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#ffc928] px-4 py-2.5 text-sm font-bold text-[#10234d] hover:bg-[#ffda5e]"
              >
                <Phone aria-hidden="true" size={17} />
                {t('callNow')}
              </a>
              <a
                href="https://wa.me/919773105112"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/25 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
              >
                <MessageCircle aria-hidden="true" size={17} />
                {t('whatsapp')}
              </a>
            </div>
          </div>

          {/* Enquiry Form UI */}
          <ContactForm />

        </div>
      </div>
    </section>
  );
}
