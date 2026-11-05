
'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Send, X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning';

type Toast = {
  type: ToastType;
  message: string;
};

export default function ContactForm() {
  const t = useTranslations('Contact');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  // Automatically hide toast after 10 seconds
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setToast(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get('name'),
      mobile: formData.get('phone'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setToast({
          type: response.status === 409 ? 'warning' : 'error',
          message: result.message || 'Something went wrong.',
        });
        return;
      }

      setToast({
        type: 'success',
        message: result.message,
      });

      form.reset();

    } catch {
      setToast({
        type: 'error',
        message: 'Unable to connect. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const toastStyles = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
  };

  const ToastIcon = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-4 right-4 z-[100] w-[calc(100%-2rem)] max-w-md"
          role={toast.type === 'success' ? 'status' : 'alert'}
          aria-live="polite"
        >
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg ${toastStyles[toast.type]}`}
          >
            {(() => {
              const Icon = ToastIcon[toast.type];
              return <Icon size={22} className="mt-0.5 shrink-0" />;
            })()}

            <p className="flex-1 text-sm font-medium">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Close notification"
              className="shrink-0 opacity-70 transition hover:opacity-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-3">
        <h3 className="text-2xl font-bold text-slate-900">
          {t('formTitle')}
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          {t('formDescription')}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                {t('nameLabel')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={100}
                placeholder={t('namePlaceholder')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                {t('emailLabel')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                maxLength={255}
                placeholder={t('emailPlaceholder')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">
                {t('phoneLabel')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                pattern="[6-9][0-9]{9}"
                title="Enter a valid 10-digit mobile number"
                placeholder={t('phonePlaceholder')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-slate-700">
                {t('subjectLabel')}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                minLength={3}
                maxLength={150}
                placeholder={t('subjectPlaceholder')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-semibold text-slate-700">
              {t('messageLabel')}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              maxLength={3000}
              placeholder={t('messagePlaceholder')}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Submitting...' : t('sendMessage')}
            <Send size={17} />
          </button>

        </form>
      </div>
    </>
  );
}
