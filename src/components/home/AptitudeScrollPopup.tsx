'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Check, Target, X } from 'lucide-react';

const SCROLL_THRESHOLD = 0.35;
const DISMISSED_SESSION_KEY = 'aptitude-promotion-dismissed';
const EXIT_ANIMATION_MS = 220;

export default function AptitudeScrollPopup() {
  const t = useTranslations('AptitudePromotion');
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const frameRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let hasShown = false;

    try {
      hasShown = sessionStorage.getItem(DISMISSED_SESSION_KEY) === 'true';
    } catch (error) {
      console.error('Unable to read aptitude popup session preference:', error);
    }

    if (hasShown) return;

    const checkScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight <= 0) return;

        const progress = window.scrollY / scrollableHeight;
        if (progress < SCROLL_THRESHOLD) return;

        try {
          sessionStorage.setItem(DISMISSED_SESSION_KEY, 'true');
        } catch (error) {
          console.error('Unable to save aptitude popup session preference:', error);
        }

        window.removeEventListener('scroll', checkScroll);
        const activeElement = document.activeElement;
        returnFocusRef.current =
          activeElement instanceof HTMLElement && activeElement !== document.body
            ? activeElement
            : null;
        setVisible(true);
      });
    };

    window.addEventListener('scroll', checkScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!visible || closing) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, closing]);

  function dismiss() {
    setClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setClosing(false);
      closeTimerRef.current = null;
      returnFocusRef.current?.focus({ preventScroll: true });
      returnFocusRef.current = null;
    }, EXIT_ANIMATION_MS);
  }

  function rememberAndNavigate() {
    try {
      sessionStorage.setItem(DISMISSED_SESSION_KEY, 'true');
    } catch (error) {
      console.error('Unable to save aptitude popup session preference:', error);
    }
  }

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="aptitude-popup-title"
      aria-describedby="aptitude-popup-description"
      aria-live="polite"
      className={`aptitude-promotion-popup ${closing ? 'is-closing' : 'is-opening'}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff4c2] text-[#10234d]">
          <Target aria-hidden="true" size={21} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="aptitude-popup-title" className="pr-7 text-base font-extrabold leading-5 text-[#10234d] sm:text-lg">
            {t('title')}
          </h2>
          <p id="aptitude-popup-description" className="mt-1.5 text-sm leading-5 text-slate-600">{t('description')}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t('close')}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#10234d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10234d]"
        >
          <X aria-hidden="true" size={19} />
        </button>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-700">
        {(['free', 'quick', 'instant'] as const).map((key) => (
          <li key={key} className="inline-flex items-center gap-1.5">
            <Check aria-hidden="true" size={14} className="text-emerald-700" />
            {t(key)}
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
        <Link
          href="/aptitude"
          onClick={rememberAndNavigate}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ffc928] px-4 py-2.5 text-sm font-extrabold text-[#10234d] transition hover:-translate-y-0.5 hover:bg-[#ffda5e] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10234d]"
        >
          {t('takeTest')}
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10234d]"
        >
          {t('maybeLater')}
        </button>
      </div>
    </aside>
  );
}
