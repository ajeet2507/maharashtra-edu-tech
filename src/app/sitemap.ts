import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const baseUrl = 'https://www.maharashtra-edu-tech.in';
const publicPaths = ['', '/aptitude'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alternateLocale) => [
            alternateLocale,
            `${baseUrl}/${alternateLocale}${path}`,
          ]),
        ),
      },
    })),
  );
}
