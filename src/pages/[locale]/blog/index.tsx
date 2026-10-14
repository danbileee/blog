import { GetStaticPropsContext } from 'next';
import styled from '@emotion/styled';
import PostCard from '@components/post/PostCard';
import { Post, PostFrontMatter } from '@constants/types';
import { locales, isLocale, Locale } from '../../../i18n/locales';
import { readSnapshot } from '../../../lib/content/snapshot';
import { localize } from '../../../lib/content/localize';
import { pageSEO } from '../../../lib/seo/page';

interface Card extends Post {
  contentLocale: Locale;
}
export default function Blog({ posts }: { posts: Card[] }) {
  return (
    <PostCardList>
      {posts.map((post) => (
        <li key={post.slug}>
          <PostCard post={post} contentLocale={post.contentLocale} />
        </li>
      ))}
    </PostCardList>
  );
}
export function getStaticPaths() {
  return { paths: locales.map((locale) => ({ params: { locale } })), fallback: false };
}
export function getStaticProps({ params }: GetStaticPropsContext) {
  if (!params || !isLocale(params.locale)) return { notFound: true };
  const { locale } = params;
  const snapshot = readSnapshot();
  const posts = snapshot.posts
    .map((record) => {
      const result = localize(record, locale);
      return {
        slug: record.slug,
        frontMatter: result.content.meta as PostFrontMatter,
        contentLocale: result.contentLocale,
      };
    })
    .sort(
      (a, b) =>
        Date.parse(b.frontMatter.publishedAt) - Date.parse(a.frontMatter.publishedAt) ||
        a.slug.localeCompare(b.slug),
    );
  return { props: { locale, posts, seo: pageSEO(snapshot, 'blog', locale) } };
}
const PostCardList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 120px;
`;
