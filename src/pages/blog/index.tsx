import { NextPage } from 'next';
import fs from 'fs';
import RSS from 'rss';
import matter from 'gray-matter';
import styled from '@emotion/styled';

import PostCard from '@components/post/PostCard';
import { getContentsPath, getPublicPath } from '@utils/getPath';
import { getSlug } from '@utils/getSlug';
import { Post } from '@constants/types';

interface Props {
  posts: Post[];
}

const Blog: NextPage<Props> = ({ posts }) => {
  return (
    <PostCardList>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </PostCardList>
  );
};

export default Blog;

const URL = 'https://danbileee.com';

async function getPosts() {
  const files = fs.readdirSync(getContentsPath('posts'));

  const sorted = files
    .map((filename) => {
      const mdxWithMeta = fs.readFileSync(
        getContentsPath('posts', filename),
        'utf-8',
      );
      const { data: frontMatter } = matter(mdxWithMeta);

      return {
        frontMatter,
        slug: getSlug(filename),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontMatter?.publishedAt).valueOf() -
        new Date(a.frontMatter?.publishedAt).valueOf(),
    );

  return process.env.NODE_ENV === 'production'
    ? sorted.filter(({ frontMatter }) => !frontMatter.devOnly)
    : sorted;
}

async function generateRssFeedAndReturnPosts() {
  const posts = await getPosts();
  const feed = new RSS({
    title: 'Blog | Danbi Lee',
    description: '웹과 개발과 컴퓨터에 대해 배운 것을 기록합니다.',
    site_url: URL,
    feed_url: `${URL}/feed.xml`,
    image_url:
      'https://blog.kakaocdn.net/dn/vs0qs/btr2wt0JQlj/xpYtJpYd4szYtdEt5pV27k/img.png',
    pubDate: new Date(),
    copyright: `© ${new Date().getFullYear()} Danbi Lee`,
  });

  posts.forEach(({ frontMatter: fm, slug }) => {
    feed.item({
      title: fm.title,
      description: fm.description,
      url: `${URL}/blog/${slug}`,
      categories: [fm.category],
      date: fm.publishedAt,
      enclosure: {
        url: fm.ogImage,
      },
    });
  });

  fs.writeFileSync(getPublicPath('feed.xml'), feed.xml({ indent: true }));

  return posts;
}

export async function getStaticProps() {
  const posts = await generateRssFeedAndReturnPosts();

  return {
    props: { posts },
  };
}

const PostCardList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 120px;
`;
