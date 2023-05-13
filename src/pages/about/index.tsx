import fs from 'fs';
import matter from 'gray-matter';
import { Children } from 'react';
import styled from '@emotion/styled';

import CareerMeta from '@components/about/CareerMeta';
import mediaQuery from '@styles/mediaQuery';
import { Career } from '@constants/types';
import { getCareersPath } from '@utils/getPath';
import Markdown from '@components/markdown';

interface Props {
  careers: Career[];
}

export default function About({ careers }: Props) {
  return (
    <CareerList>
      {Children.toArray(
        careers.map((career) => (
          <li>
            <CareerMeta career={career} />
            <Markdown content={career.content} withHeadlineAnchor={false} />
          </li>
        )),
      )}
    </CareerList>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(getCareersPath());
  const careers = files
    .map((filename) => {
      const mdxWithMeta = fs.readFileSync(getCareersPath(filename), 'utf-8');
      const { data, content } = matter(mdxWithMeta);
      return { id: filename, ...data, content } as Career;
    })
    .sort((a, b) => new Date(b.startYear).valueOf() - new Date(a.startYear).valueOf());

  return {
    props: { careers },
  };
}

const CareerList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 200px;

  ${mediaQuery.mobile} {
    gap: 160px;
  }
`;
