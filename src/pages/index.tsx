import { NextPage } from 'next';
import Image from 'next/image';
import styled from '@emotion/styled';

import Layout from '@components/layout';
import { useGlobalContext } from '@contexts/global';
import mediaQuery from '@styles/media-query';

const Home: NextPage = () => {
  const { isMobile } = useGlobalContext();

  return (
    <Layout>
      <Container>
        <div>
          <Headline>
            FROM {isMobile && <br />}BLOCK
            <br />
            TO {isMobile && <br />}BODY
          </Headline>
          <Subline>I build up and make things happen.</Subline>
        </div>
        <ImageContainer>
          <Image
            width={isMobile ? 320 : 650}
            height={isMobile ? 149 : 298}
            src="/blocks.jpeg"
            alt="blocks"
          />
        </ImageContainer>
      </Container>
    </Layout>
  );
};

export default Home;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: calc(100vh - 493px);

  ${mediaQuery.mobile} {
    height: calc(100vh - 340px);
  }
`;

const Headline = styled.h1`
  font-family: 'Lato';
  font-size: 90px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.01em;
  margin: -12px 0 12px;

  ${mediaQuery.mobile} {
    font-size: 80px;
  }
`;

const Subline = styled.p`
  font-weight: 900;
  font-size: 26px;
  line-height: 31px;
  letter-spacing: 0.01em;

  ${mediaQuery.mobile} {
    font-size: 18px;
    font-weight: 700;
  }
`;

const ImageContainer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: -1;

  ${mediaQuery.mobile} {
    right: -10px;
    bottom: -180px;
  }
`;
