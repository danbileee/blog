import matter from 'gray-matter';
import { isDeepStrictEqual } from 'util';
import { locales, Locale } from '../../i18n/locales';
import { ContentDocument, ContentKind, ContentRecord, LocalizedContent } from './types';

function requiredText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0;
}
export function parseDocument(raw: string, kind: ContentKind): ContentDocument {
  if (!raw.startsWith('---')) throw new Error('Missing frontmatter');
  const { data, content } = matter(raw);
  const fields = kind === 'posts' ? ['title', 'description'] : ['company', 'description'];
  // One existing career is metadata-only; preserve it without requiring a new body.
  if (
    (kind === 'posts' && !data.devOnly && !content.trim()) ||
    fields.some((key) => !requiredText(data[key]))
  )
    throw new Error('Incomplete document');
  if (data.devOnly !== undefined && typeof data.devOnly !== 'boolean')
    throw new Error('Invalid devOnly flag');
  // Normalize YAML dates once, preserving the historical Date interpretation.
  ['publishedAt', 'updatedAt'].forEach((key) => {
    if (data[key] instanceof Date) data[key] = data[key].toISOString();
  });
  if (
    kind === 'posts' &&
    (!requiredText(data.publishedAt) || !Number.isFinite(Date.parse(data.publishedAt)))
  )
    throw new Error('Invalid publication date');
  if (
    kind === 'posts' &&
    data.updatedAt !== undefined &&
    !Number.isFinite(Date.parse(data.updatedAt))
  )
    throw new Error('Invalid update date');
  if (kind === 'careers' && !Number.isFinite(Number(data.startYear)))
    throw new Error('Invalid start year');
  return { meta: data as ContentDocument['meta'], body: content };
}
export function translationDocument(
  raw: string,
  original: ContentDocument,
  kind: ContentKind,
  locale: Locale,
  now = Date.now(),
): ContentDocument {
  const { data } = matter(raw);
  if (data.locale !== locale || data.translationStatus !== 'complete')
    throw new Error('Translation must declare locale and complete status');
  // The translated document needs only localized fields, then inherits identity metadata.
  const localizedFields =
    kind === 'posts' ? ['title', 'description', 'category', 'tags'] : ['company', 'description'];
  Object.keys(data).forEach((key) => {
    if (['locale', 'translationStatus', 'translationPublishedAt', ...localizedFields].includes(key))
      return;
    const source = (original.meta as unknown as Record<string, unknown>)[key];
    const repeated = data[key] instanceof Date ? data[key].toISOString() : data[key];
    if (!isDeepStrictEqual(source, repeated)) throw new Error(`Conflicting shared field: ${key}`);
  });
  const { content } = matter(raw);
  const required = kind === 'posts' ? ['title', 'description'] : ['company', 'description'];
  if (!content.trim() || required.some((key) => !requiredText(data[key])))
    throw new Error('Incomplete translation');
  if (kind === 'posts') {
    if (data.category !== undefined && typeof data.category !== 'string')
      throw new Error('Invalid translated category');
    if (
      data.tags !== undefined &&
      (!Array.isArray(data.tags) || data.tags.some((tag: unknown) => typeof tag !== 'string'))
    )
      throw new Error('Invalid translated tags');
  }
  const meta = { ...original.meta };
  localizedFields.forEach((key) => {
    if (data[key] !== undefined) (meta as unknown as Record<string, unknown>)[key] = data[key];
  });
  const doc: ContentDocument = { meta, body: content };
  if (data.translationPublishedAt !== undefined) {
    const value =
      data.translationPublishedAt instanceof Date
        ? data.translationPublishedAt.toISOString()
        : data.translationPublishedAt;
    if (
      typeof value !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(
        value,
      ) ||
      !Number.isFinite(Date.parse(value)) ||
      Date.parse(value) > now
    )
      throw new Error('Invalid translation publication timestamp');
    // Reject normalized impossible dates such as February 30.
    const datePart = value.slice(0, 10);
    if (new Date(`${datePart}T00:00:00Z`).toISOString().slice(0, 10) !== datePart)
      throw new Error('Invalid calendar date');
    doc.translationPublishedAt = new Date(value).toISOString();
  }
  return doc;
}
export function localize(record: ContentRecord, locale: Locale): LocalizedContent {
  const translated = record.translations[locale];
  const available = locale === 'ko' || Boolean(translated);
  let state: LocalizedContent['state'] = record.invalidLocales.includes(locale)
    ? 'invalid'
    : 'missing';
  if (translated) state = 'available';
  if (locale === 'ko') state = 'original';
  return {
    id: record.id,
    requestedLocale: locale,
    contentLocale: available ? locale : 'ko',
    state,
    translationAvailable: available,
    content: translated ?? record.original,
    availableLocales: locales.filter(
      (language) => language === 'ko' || Boolean(record.translations[language]),
    ),
  };
}
