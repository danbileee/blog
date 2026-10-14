import { productionOrigin } from '../constants/site';
import { isLocale, Locale } from './locales';

export function localizedPath(locale: Locale, path = '') {
  if (!path || path === '/') return `/${locale}`;
  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`;
}
export function switchLocale(asPath: string, locale: Locale) {
  return asPath.replace(/^\/(ko|en|ja)(?=\/|\?|#|$)/, `/${locale}`);
}
export function localizeContentLink(href: string, locale: Locale) {
  let path = href;
  if (href.startsWith(productionOrigin)) {
    const url = new URL(href);
    if (url.origin !== productionOrigin) return href;
    path = `${url.pathname}${url.search}${url.hash}`;
  }
  if (!path.startsWith('/') || path.startsWith('//')) return href;
  if (/^\/(ko|en|ja)(?=\/|\?|#|$)/.test(path)) return switchLocale(path, locale);
  if (/^\/(about|career)(?=\?|#|$)/.test(path))
    return localizedPath(locale, path.replace(/^\/(about|career)/, '/career'));
  if (/^\/blog(?:\/[a-zA-Z0-9_-]+)?(?=\?|#|$)/.test(path)) return localizedPath(locale, path);
  if (/^\/(?=\?|#|$)/.test(path)) return localizedPath(locale) + path.slice(1);
  return href;
}
export function pathLocale(path: string): Locale {
  const value = path.split(/[/?#]/)[1];
  return isLocale(value) ? value : 'ko';
}
