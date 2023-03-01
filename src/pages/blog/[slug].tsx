import fs from 'fs';
import matter from 'gray-matter';
import { GetStaticPropsContext } from 'next';

import { PostFrontMatter } from '@constants/types';
import { getContentsPath } from '@utils/getPath';
import Post from '@components/post';
import PostMeta from '@components/post/PostMeta';
import PageMeta from '@components/layout/PageMeta';

interface Props {
  frontMatter: PostFrontMatter | null;
  content: string;
}

const Slug = ({ frontMatter, content }: Props) => {
  if (!frontMatter || !content) {
    return null;
  }

  return (
    <>
      <PageMeta
        title={frontMatter.title}
        description={frontMatter.description}
        tags={frontMatter.tags}
        ogImage={frontMatter.ogImage}
      />
      <PostMeta frontMatter={frontMatter} />
      <Post content={content} />
    </>
  );
};

export default Slug;

export async function getStaticPaths() {
  const files = fs.readdirSync(getContentsPath('posts'));
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.mdx', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const { slug } = params ?? {};
  const markdownWithMeta = fs.readFileSync(
    getContentsPath('posts', `${slug}.mdx`),
    'utf-8',
  );
  const { data: frontMatter, content } = matter(markdownWithMeta);

  return {
    props: {
      slug,
      frontMatter,
      content,
    },
  };
}
