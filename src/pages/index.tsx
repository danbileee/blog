import { NextPage } from 'next';
import Image from 'next/image';
import styled from '@emotion/styled';

import { useGlobalContext } from '@contexts/global';
import mediaQuery from '@styles/mediaQuery';

const Home: NextPage = () => {
  const { isMobile } = useGlobalContext();

  return (
    <>
      <Container>
        <TitleContainer>
          <Title>{`I'm a web developer,\ntrying to build useful things.`}</Title>
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
    </>
  );
};

export default Home;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: calc(100vh - 588px);

  ${mediaQuery.mobile} {
    height: calc(100vh - 500px);
  }
`;

const Title = styled.h1`
  font-weight: 900;
  font-size: 36px;
  line-height: 1.25;
  letter-spacing: -0.01em;
  white-space: pre-line;

  ${mediaQuery.mobile} {
    font-size: 26px;
  }
`;

const TitleContainer = styled.div`
  position: relative;
  width: 100%;
`;

const ImageContainer = styled.div`
  position: absolute;
  right: -20px;
  bottom: -280px;
  z-index: -1;

  ${mediaQuery.mobile} {
    right: -10px;
    bottom: -140px;
  }
`;
