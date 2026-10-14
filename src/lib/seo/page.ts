import { productionOrigin } from '../../constants/site';
import { locales, Locale } from '../../i18n/locales';
import { localizedPath } from '../../i18n/routes';
import { messages } from '../../i18n/messages';
import { ContentRecord, Snapshot } from '../content/types';
import { localize } from '../content/localize';
import { PostFrontMatter } from '../../constants/types';

export type PageKind = 'home' | 'career' | 'blog' | 'article';
export interface PageSEO {
  draft: boolean;
  title: string;
  description: string;
  locale: Locale;
  contentLocale: Locale;
  url: string;
  indexable: boolean;
  canonical: string | null;
  alternates: { locale: Locale | 'x-default'; url: string }[];
  type: 'website' | 'article';
  tags: string[];
  ogImage: string | null;
}

export function pageSEO(
  snapshot: Snapshot,
  kind: PageKind,
  locale: Locale,
  record?: ContentRecord,
): PageSEO {
  const text = messages[locale];
  let path = `/${kind}`;
  if (kind === 'home') path = '';
  if (kind === 'article') path = `/blog/${record!.slug}`;
  const eligible = (language: Locale) => {
    if (record?.original.meta.devOnly) return false;
    if (kind === 'article')
      return Boolean(record && localize(record, language).translationAvailable);
    if (language === 'ko' || kind === 'home') return true;
    if (kind === 'blog') return false;
    return snapshot.careers.every((entry) => localize(entry, language).translationAvailable);
  };
  const content = record ? localize(record, locale) : null;
  const meta = content?.content.meta as PostFrontMatter | undefined;
  const url = `${productionOrigin}${localizedPath(locale, path)}`;
  const indexable = eligible(locale);
  const alternates: PageSEO['alternates'] = indexable
    ? locales.filter(eligible).map((language) => ({
        locale: language,
        url: `${productionOrigin}${localizedPath(language, path)}`,
      }))
    : [];
  if (indexable && kind === 'home')
    alternates.push({ locale: 'x-default', url: `${productionOrigin}/` });
  return {
    draft: Boolean(record?.original.meta.devOnly),
    title: meta?.title ?? text[kind === 'article' ? 'blog' : kind],
    description:
      meta?.description ??
      {
        home: text.homeDescription,
        career: text.careerDescription,
        blog: text.blogDescription,
        article: text.blogDescription,
      }[kind],
    locale,
    contentLocale: content?.contentLocale ?? locale,
    url,
    indexable,
    canonical: indexable ? url : null,
    alternates,
    type: kind === 'article' ? 'article' : 'website',
    tags: meta?.tags ?? [],
    ogImage: meta?.ogImage ?? null,
  };
}
