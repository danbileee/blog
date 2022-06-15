import { NextPage } from 'next';
import fs from 'fs';
import matter from 'gray-matter';

import Layout from '@components/layout';
import PostCard from '@components/cards/PostCard';
import { getPath } from '@utils/getPath';
import { getSlug } from '@utils/getSlug';
import { Post } from '@constants/types';
import PageMeta from '@components/layout/PageMeta';

interface Props {
  posts: Post[];
}

const Blog: NextPage<Props> = ({ posts }) => {
  return (
    <Layout>
      <PageMeta path="blog" />
      <ul>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </Layout>
  );
};

export default Blog;

export async function getStaticProps() {
  const files = fs.readdirSync(getPath('posts'));

  const posts = files.map((filename) => {
    const mdxWithMeta = fs.readFileSync(getPath('posts', filename), 'utf-8');
    const { data: frontMatter } = matter(mdxWithMeta);

    return {
      frontMatter,
      slug: getSlug(filename),
    };
  });

  return {
    props: {
      posts,
    },
  };
}
