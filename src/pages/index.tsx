import { NextPage } from 'next';
import { css } from '@emotion/react';

const Home: NextPage = () => (
  <div>
    <div
      css={css`
        color: var(--text-color);
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
  </div>
);

export default Home;
