import { NextPage } from 'next';
import { css } from '@emotion/react';

import Layout from 'components/layout';

const Home: NextPage = () => (
  <Layout>
    <div
      css={css`
        color: var(--gray-900);
      `}
    >
      Hello World
    </div>
    <h1
      css={css`
        color: var(--primary-color);
      `}
    >
      안녕
    </h1>
  </Layout>
);

export default Home;
