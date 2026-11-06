'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

export default function FooterAptitudeLink() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  if (pathname === '/aptitude') return null;

  return (
    <Link href="/aptitude" className="text-xs font-semibold text-white/60 hover:text-[#ffc928]">
      {t('aptitude')}
    </Link>
  );
}
