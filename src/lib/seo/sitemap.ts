import { Snapshot } from '../content/types';
import { locales } from '../../i18n/locales';
import { PostFrontMatter } from '../../constants/types';
import { pageSEO } from './page';

export function escapeXML(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
export function sitemapEntries(snapshot: Snapshot) {
  const result: { url: string; lastmod?: string }[] = [];
  locales.forEach((locale) => {
    (['home', 'career', 'blog'] as const).forEach((kind) => {
      const seo = pageSEO(snapshot, kind, locale);
      if (seo.canonical) result.push({ url: seo.canonical });
    });
    snapshot.posts.forEach((record) => {
      const seo = pageSEO(snapshot, 'article', locale, record);
      const meta = record.original.meta as PostFrontMatter;
      if (seo.canonical)
        result.push({
          url: seo.canonical,
          lastmod: new Date(meta.updatedAt ?? meta.publishedAt).toISOString(),
        });
    });
  });
  return result;
}
export function sitemapXML(snapshot: Snapshot) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapEntries(
    snapshot,
  )
    .map(
      ({ url, lastmod }) =>
        `<url><loc>${escapeXML(url)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
    )
    .join('')}</urlset>\n`;
}
