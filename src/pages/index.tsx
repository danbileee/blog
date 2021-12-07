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
  </div>
);

export default Home;
