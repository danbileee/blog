import { NextPage } from 'next';
import fs from 'fs';
import RSS from 'rss';
import matter from 'gray-matter';
import styled from '@emotion/styled';

import PostCard from '@components/post/PostCard';
import { getPublicPath } from '@utils/getPath';
import { getSlug } from '@utils/getSlug';
import { Post, PostFrontMatter } from '@constants/types';
import { octokitInstance, octokitRequestBase } from '@constants/octokit';

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

async function getPosts(): Promise<Post[]> {
  const list = await octokitInstance.request('GET /repos/{owner}/{repo}/contents/{path}', {
    ...octokitRequestBase,
    path: 'posts',
  });

  if (!Array.isArray(list.data)) {
    return [];
  }

  const items = await Promise.all(
    list.data.map((data) =>
      octokitInstance.request('GET /repos/{owner}/{repo}/contents/{path}', {
        ...octokitRequestBase,
        path: data.path,
        headers: {
          ...octokitRequestBase.headers,
          accept: 'application/vnd.github.v3.raw',
        },
      }),
    ),
  );

  const sorted = items
    .map((item) => {
      const { data } = matter(item.data.toString());

      return {
        frontMatter: data as PostFrontMatter,
        slug: getSlug(item.url),
      };
    })
    .filter((item) => (process.env.NODE_ENV === 'development' ? true : !item.frontMatter.devOnly))
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
    description: 'Personal archive on web, development, and work',
    site_url: URL,
    feed_url: `${URL}/rss.xml`,
    image_url: 'https://blog.kakaocdn.net/dn/vs0qs/btr2wt0JQlj/xpYtJpYd4szYtdEt5pV27k/img.png',
    pubDate: new Date(),
    copyright: `© ${new Date().getFullYear()} Danbi Lee`,
  });

  posts.forEach(({ frontMatter: fm, slug }) => {
    feed.item({
      title: fm.title,
      description: fm.description,
      url: `${URL}/blog/${slug}`,
      categories: fm.category ? [fm.category] : undefined,
      date: fm.publishedAt,
      enclosure: {
        url: fm.ogImage,
      },
    });
  });

  fs.writeFileSync(getPublicPath('rss.xml'), feed.xml({ indent: true }));

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
