import { isLocale, Locale } from './locales';

export function detectLocale(cookie = '', acceptLanguage = ''): Locale {
  const preference = cookie.split(';').find((part) => part.trim().startsWith('NEXT_LOCALE='));
  if (preference) {
    try {
      const value = decodeURIComponent(preference.trim().slice('NEXT_LOCALE='.length));
      if (isLocale(value)) return value;
    } catch {
      /* Ignore malformed cookies. */
    }
  }
  const matches = acceptLanguage
    .split(',')
    .map((range, order) => {
      const match = range
        .trim()
        .match(/^([a-z]{2,8}(?:-[a-z0-9]{1,8})*)(?:\s*;\s*q=(0(?:\.\d{1,3})?|1(?:\.0{1,3})?))?$/i);
      if (!match) return null;
      const locale = match[1].split('-')[0].toLowerCase();
      const quality = match[2] === undefined ? 1 : Number(match[2]);
      return isLocale(locale) && quality > 0 ? { locale, quality, order } : null;
    })
    .filter((item): item is { locale: Locale; quality: number; order: number } => item !== null);
  matches.sort((a, b) => b.quality - a.quality || a.order - b.order);
  return matches[0]?.locale ?? 'ko';
}
