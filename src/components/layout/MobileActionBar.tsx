'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { MessageCircle, Phone, Target } from 'lucide-react';

export default function MobileActionBar() {
  const t = useTranslations('MobileActions');
  const pathname = usePathname();
  const isAptitudePage = pathname === '/aptitude';

  return (
    <nav
      aria-label={t('navigationLabel')}
      className={`mobile-action-bar md:hidden ${isAptitudePage ? 'mobile-action-bar-no-test' : ''}`}
    >
      <a href="tel:+919773105112" className="mobile-action-link">
        <Phone aria-hidden="true" size={18} />
        <span>{t('call')}</span>
      </a>
      <a
        href="https://wa.me/919773105112"
        target="_blank"
        rel="noreferrer"
        className="mobile-action-link"
      >
        <MessageCircle aria-hidden="true" size={18} />
        <span>{t('whatsapp')}</span>
      </a>
      {!isAptitudePage && (
        <Link href="/aptitude" className="mobile-action-link mobile-action-primary">
          <Target aria-hidden="true" size={18} />
          <span>{t('aptitude')}</span>
        </Link>
      )}
    </nav>
  );
}
