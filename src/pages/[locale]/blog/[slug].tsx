import { GetStaticPropsContext } from 'next';
import { PostFrontMatter } from '@constants/types';
import Markdown from '@components/markdown';
import PostMeta from '@components/post/PostMeta';
import TranslationUnavailableBanner from '@components/shared/TranslationUnavailableBanner';
import { locales, isLocale, Locale } from '../../../i18n/locales';
import { readSnapshot, localDraftPosts, isLocalDevelopment } from '../../../lib/content/snapshot';
import { localize } from '../../../lib/content/localize';
import { pageSEO } from '../../../lib/seo/page';

interface Props {
  frontMatter: PostFrontMatter;
  content: string;
  contentLocale: Locale;
  translationAvailable: boolean;
}
export default function Article({
  frontMatter,
  content,
  contentLocale,
  translationAvailable,
}: Props) {
  return (
    <>
      {!translationAvailable && <TranslationUnavailableBanner />}
      <article lang={contentLocale}>
        <PostMeta frontMatter={frontMatter} />
        <Markdown content={content} />
      </article>
    </>
  );
}
export async function getStaticPaths() {
  const snapshot = readSnapshot();
  const records = [...snapshot.posts, ...(await localDraftPosts(snapshot))];
  return {
    paths: records.flatMap((record) =>
      locales.map((locale) => ({ params: { locale, slug: record.slug } })),
    ),
    fallback: false,
  };
}
export async function getStaticProps({ params }: GetStaticPropsContext) {
  if (!isLocale(params?.locale) || typeof params?.slug !== 'string') return { notFound: true };
  const { locale } = params;
  const snapshot = readSnapshot();
  const record =
    snapshot.posts.find((entry) => entry.slug === params.slug) ??
    (await localDraftPosts(snapshot)).find((entry) => entry.slug === params.slug);
  if (!record || (record.original.meta.devOnly && !isLocalDevelopment())) return { notFound: true };
  const result = localize(record, locale);
  return {
    props: {
      locale,
      frontMatter: result.content.meta,
      content: result.content.body,
      contentLocale: result.contentLocale,
      translationAvailable: result.translationAvailable,
      seo: pageSEO(snapshot, 'article', locale, record),
    },
  };
}
