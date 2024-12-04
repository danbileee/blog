import matter from 'gray-matter';
import { GetStaticPropsContext } from 'next';

import { PostFrontMatter } from '@constants/types';
import Markdown from '@components/markdown';
import PostMeta from '@components/post/PostMeta';
import PageMeta from '@components/layout/PageMeta';
import { octokitInstance, octokitRequestBase } from '@constants/octokit';

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
      <Markdown content={content} />
    </>
  );
};

export default Slug;

export async function getStaticPaths() {
  const list = await octokitInstance.request('GET /repos/{owner}/{repo}/contents/{path}', {
    ...octokitRequestBase,
    path: 'posts',
  });

  if (!Array.isArray(list.data)) {
    return [];
  }

  const paths = list.data.map((data) => ({
    params: {
      slug: data.name.replace('.mdx', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext<{ slug: string }>) {
  const { slug = '' } = params ?? {};
  const result = await octokitInstance.request('GET /repos/{owner}/{repo}/contents/{path}', {
    ...octokitRequestBase,
    path: `posts/${slug}.mdx`,
    headers: {
      ...octokitRequestBase.headers,
      accept: 'application/vnd.github.v3.raw',
    },
  });

  const { data: frontMatter, content } = matter(result.data.toString());

  return {
    props: {
      slug,
      frontMatter,
      content,
    },
  };
}
