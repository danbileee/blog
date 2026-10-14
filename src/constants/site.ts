// Canonicals must never depend on a preview/request hostname.
export const productionOrigin = 'https://danbileee.com';
export function feedPath(locale: 'ko' | 'en' | 'ja') {
  return locale === 'ko' ? '/rss.xml' : `/${locale}/rss.xml`;
}
