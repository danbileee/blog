import fs from 'fs';
import matter from 'gray-matter';
import { GetStaticPropsContext } from 'next';

import Career from '@components/career';
import { CareerFrontMatter } from '@constants/types';
import { getContentsPath } from '@utils/getPath';
import PageMeta from '@components/layout/PageMeta';

interface Props {
  id: string;
  frontMatter: CareerFrontMatter | null;
}

const CareerDetail = ({ id, frontMatter }: Props) => {
  if (!frontMatter) {
    return null;
  }

  return (
    <>
      <PageMeta
        title={frontMatter.title}
        description={frontMatter.description}
      />
      <Career id={id} frontMatter={frontMatter} />
    </>
  );
};

export default CareerDetail;

export async function getStaticPaths() {
  const files = fs.readdirSync(getContentsPath('careers'));
  const paths = files.map((filename) => ({
    params: {
      id: filename.replace('.yml', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const { id } = params ?? {};
  const markdownWithMeta = fs.readFileSync(
    getContentsPath('careers', `${id}.yml`),
    'utf-8',
  );
  const { data: frontMatter } = matter(markdownWithMeta);
  const { title, link, demoTitle, demoLink, description, tags } =
    frontMatter ?? {};
  const demo = {
    title: demoTitle,
    link: demoLink,
  };

  if (demoTitle && demoLink) {
    return {
      props: {
        id,
        frontMatter: {
          title,
          link,
          demo,
          description,
          tags,
        },
      },
    };
  }

  return {
    props: {
      id,
      frontMatter: {
        title,
        link,
        description,
        tags,
      },
    },
  };
}
