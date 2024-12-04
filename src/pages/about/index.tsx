import matter from 'gray-matter';
import { Children } from 'react';
import styled from '@emotion/styled';

import CareerMeta from '@components/about/CareerMeta';
import mediaQuery from '@styles/mediaQuery';
import { Career } from '@constants/types';
import Markdown from '@components/markdown';
import { octokitInstance, octokitRequestBase } from '@constants/octokit';

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
            <Markdown content={career.content} withHeadlineAnchor />
          </li>
        )),
      )}
    </CareerList>
  );
}

export async function getStaticProps() {
  const list = await octokitInstance.request('GET /repos/{owner}/{repo}/contents/{path}', {
    ...octokitRequestBase,
    path: 'careers',
  });

  if (!Array.isArray(list.data)) {
    return {
      props: { careers: [] },
    };
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

  const careers = items
    .map((item) => {
      const { data, content } = matter(item.data.toString());
      return { id: item.url, ...data, content } as Career;
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
