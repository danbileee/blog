import { PropsWithChildren } from 'react';
import styled from '@emotion/styled';

import mediaQuery from '@styles/mediaQuery';

import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}

const Main = styled.main`
  min-height: calc(100vh - 98px);
  padding: 230px calc(50vw - 350px) 138px;

  ${mediaQuery.mobile} {
    padding: 200px 20px;
  }
`;
