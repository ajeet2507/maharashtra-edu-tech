import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const baseUrl = 'https://www.maharashtra-edu-tech.in';
const publicPaths = ['', '/aptitude'];

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    publicPaths.map((path) => {
      const isHomepage = path === '';

      return {
        url: `${baseUrl}/${locale}${path}`,
        changeFrequency: isHomepage ? 'weekly' : 'monthly',
        priority: isHomepage ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((alternateLocale) => [
              alternateLocale,
              `${baseUrl}/${alternateLocale}${path}`,
            ]),
          ),
        },
      };
    }),
  );
}
