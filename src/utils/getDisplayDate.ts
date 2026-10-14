import { Locale } from '../i18n/locales';

export default function getDisplayDate(date: string, locale: Locale = 'ko') {
  return new Intl.DateTimeFormat({ ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' }[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}
