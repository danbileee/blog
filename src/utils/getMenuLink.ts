import { Locale } from '../i18n/locales';

export function getMenuLink(menu: string, locale: Locale = 'ko') {
  return `/${locale}${menu === 'career' || menu === 'blog' ? `/${menu}` : ''}`;
}
