import { NextPage } from 'next';
import styled from '@emotion/styled';

import mediaQuery from '@styles/mediaQuery';

const Home: NextPage = () => {
  return (
    <Container>
      <Title>Hi, I&apos;m a web developer.</Title>
      <Text>AI-native SaaS, 커머스 플랫폼, 웹 에이전시에서 프론트엔드 개발 경험이 있습니다.</Text>
      <Text>명확한 문제 해결과 좋은 UX, 그리고 가치를 제공하는 소프트웨어에 관심이 많습니다.</Text>
      <Text>혼자보다는 함께, 더 큰 임팩트를 지향하며 일합니다.</Text>
    </Container>
  );
};

export default Home;

const Container = styled.div`
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
  margin-bottom: 32px;

  ${mediaQuery.mobile} {
    font-size: 26px;
  }
`;

const Text = styled.p`
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 10px;

  ${mediaQuery.mobile} {
    font-size: 16px;
  }
`;
