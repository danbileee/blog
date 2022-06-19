import { NextPage } from 'next';
import fs from 'fs';
import matter from 'gray-matter';

import PostCard from '@components/cards/PostCard';
import { getContentsPath } from '@utils/getPath';
import { getSlug } from '@utils/getSlug';
import { Post } from '@constants/types';
import styled from '@emotion/styled';

interface Props {
  posts: Post[];
}

const Blog: NextPage<Props> = ({ posts }) => {
  return (
    <>
      <PostCardList>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </PostCardList>
    </>
  );
};

export default Blog;

export async function getStaticProps() {
  const files = fs.readdirSync(getContentsPath('posts'));
  const posts = files
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

  return {
    props: {
      posts,
    },
  };
}

const PostCardList = styled.ul``;
