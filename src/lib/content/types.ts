import { Career, PostFrontMatter } from '../../constants/types';
import { Locale } from '../../i18n/locales';

export type ContentKind = 'posts' | 'careers';
export interface ContentDocument {
  meta: PostFrontMatter | Omit<Career, 'content' | 'id'>;
  body: string;
  translationPublishedAt?: string;
}
export interface ContentRecord {
  id: string;
  slug: string;
  kind: ContentKind;
  original: ContentDocument;
  translations: Partial<Record<Locale, ContentDocument>>;
  invalidLocales: Locale[];
}
export interface Snapshot {
  version: 1;
  ref: string;
  posts: ContentRecord[];
  careers: ContentRecord[];
}
export interface LocalizedContent {
  id: string;
  requestedLocale: Locale;
  contentLocale: Locale;
  state: 'original' | 'available' | 'missing' | 'invalid';
  translationAvailable: boolean;
  content: ContentDocument;
  availableLocales: Locale[];
}
