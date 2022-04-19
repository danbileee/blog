import { PropsWithChildren } from 'react';
import styled from '@emotion/styled';

import mediaQuery from 'styles/media-query';

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
  padding: 230px calc(50vw - 500px) 150px;

  ${mediaQuery.mobile} {
    padding: 120px 20px 100px;
  }
`;