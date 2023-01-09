import { PropsWithChildren, useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';

import ElementObserver from '@components/shared/ElementObserver';
import mediaQuery from '@styles/mediaQuery';

import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }: PropsWithChildren<unknown>) {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const { pathname } = useRouter();
  const hasContentMargin = pathname !== '/';
  const contentMargin = hasContentMargin ? 120 : 0;

  return (
    <>
      <Header />
      <Main>
        <Content contentMargin={contentMargin}>{children}</Content>
        <ElementObserver callback={setIsFooterVisible} />
      </Main>
      <Footer isFooterVisible={isFooterVisible} />
    </>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 230px calc(50vw - 430px) 12vh;

  ${mediaQuery.mobile} {
    padding: 200px 20px;
  }
`;

const Content = styled.div<{ contentMargin: number }>`
  margin-bottom: ${({ contentMargin }) => contentMargin}px;
`;
