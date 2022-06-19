import { NextPage } from 'next';
import Image from 'next/image';
import styled from '@emotion/styled';

import Layout from '@components/layout';
import { useGlobalContext } from '@contexts/global';
import mediaQuery from '@styles/mediaQuery';

const Home: NextPage = () => {
  const { isMobile } = useGlobalContext();

  return (
    <Layout>
      <Container>
        <TitleContainer>
          <Title>I like to build things up!</Title>
          <ImageContainer>
            <Image
              width={isMobile ? 320 : 650}
              height={isMobile ? 149 : 298}
              src="/blocks.jpeg"
              alt="blocks"
            />
          </ImageContainer>
        </TitleContainer>
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
  height: calc(100vh - 490px);

  ${mediaQuery.mobile} {
    height: calc(100vh - 360px);
  }
`;

const Title = styled.h1`
  font-weight: 900;
  font-size: 36px;
  line-height: 1.2;
  letter-spacing: -0.02px;

  ${mediaQuery.mobile} {
    font-size: 24px;
  }
`;

const TitleContainer = styled.div`
  position: relative;
  width: 100%;
`;

const ImageContainer = styled.div`
  position: absolute;
  right: -20px;
  bottom: -200px;
  z-index: -1;

  ${mediaQuery.mobile} {
    right: -10px;
    bottom: -140px;
  }
`;
