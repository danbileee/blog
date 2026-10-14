import RSS from 'rss';
import { feedPath, productionOrigin } from '../../constants/site';
import { PostFrontMatter } from '../../constants/types';
import { Locale } from '../../i18n/locales';
import { messages } from '../../i18n/messages';
import { Snapshot } from '../content/types';
import { localize } from '../content/localize';

export function feedItems(snapshot: Snapshot, locale: Locale) {
  return snapshot.posts
    .filter((record) => !record.original.meta.devOnly)
    .map((record) => {
      const content = localize(record, locale);
      const meta = content.content.meta as PostFrontMatter;
      return {
        record,
        content,
        meta,
        date:
          locale === 'ko'
            ? meta.publishedAt
            : content.content.translationPublishedAt ?? meta.publishedAt,
      };
    })
    .filter(({ content }) => content.translationAvailable)
    .sort(
      (a, b) =>
        Date.parse(b.date) - Date.parse(a.date) || a.record.slug.localeCompare(b.record.slug),
    );
}

export function rssXML(snapshot: Snapshot, locale: Locale) {
  const items = feedItems(snapshot, locale);
  const feed = new RSS({
    title: `${messages[locale].blog} | Danbi Lee`,
    description: messages[locale].blogDescription,
    site_url: `${productionOrigin}/${locale}/blog`,
    feed_url: `${productionOrigin}${feedPath(locale)}`,
    language: locale,
    copyright: '© Danbi Lee',
    pubDate: items[0]?.date ?? '1970-01-01T00:00:00Z',
  });
  items.forEach(({ record, meta, date }) => {
    feed.item({
      title: meta.title,
      description: meta.description,
      url: `${productionOrigin}/${locale}/blog/${record.slug}`,
      // Preserve historical permalink semantics as well as the exact GUID values.
      guid: `${productionOrigin}${locale === 'ko' ? '' : `/${locale}`}/blog/${record.slug}`,
      date,
      categories: meta.category ? [meta.category] : undefined,
      ...(meta.ogImage ? { enclosure: { url: meta.ogImage } } : {}),
    });
  });
  // Avoid RSS's default build-time lastBuildDate: outputs are deterministic.
  return feed
    .xml({ indent: true })
    .replace(/\s*<lastBuildDate>.*?<\/lastBuildDate>/, '')
    .replace(/isPermaLink="false"/g, 'isPermaLink="true"');
}
