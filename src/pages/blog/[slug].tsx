import fs from 'fs';
import matter from 'gray-matter';
import { GetStaticPropsContext } from 'next';

import { PostFrontMatter } from '@constants/types';
import { getPostsPath } from '@utils/getPath';
import Markdown from '@components/markdown';
import PostMeta from '@components/post/PostMeta';
import PageMeta from '@components/layout/PageMeta';
// import Script from 'next/script';

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
      {/* <Script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js" /> */}
      <PostMeta frontMatter={frontMatter} />
      <Markdown content={content} />
    </>
  );
};

export default Slug;

export async function getStaticPaths() {
  const files = fs.readdirSync(getPostsPath());
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
  const markdownWithMeta = fs.readFileSync(getPostsPath(`${slug}.mdx`), 'utf-8');
  const { data: frontMatter, content } = matter(markdownWithMeta);

  return {
    props: {
      slug,
      frontMatter,
      content,
    },
  };
}
