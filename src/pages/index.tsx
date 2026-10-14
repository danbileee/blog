import { NextPage } from 'next';
import styled from '@emotion/styled';

import mediaQuery from '@styles/mediaQuery';

const Home: NextPage = () => {
  return (
    <Container>
      <Title>👋 Hi! I&apos;m Danbi Lee.</Title>
      <Text>
        AI-first SaaS, 커머스 플랫폼, 웹 에이전시에서 6년간 프론트엔드 개발 경험이 있습니다. 현재는
        1인 스튜디오에서 웹 개발, 커뮤니티형 콘텐츠 플랫폼 구축, 영화 제작을 하고 있습니다.
      </Text>
      <Text>
        명확한 문제 해결과 좋은 UX, 그리고 가치를 제공하는 소프트웨어에 관심이 많습니다. 삶을 더
        낫게 만들어주는 소프트웨어를 발견하면 신납니다.
      </Text>
      <Text>
        10년 이상 일본어를 공부해왔는데 여전히 한자 때문에 일본어를 읽는 데 어려움을 느낍니다.
        그래서
        <Link href="https://furigana.app" target="_blank">
          Furigana
        </Link>
        를 만들고 있는데요, 같은 어려움이 있으신 분들은 한번 들러주세요.
      </Text>
      {/* <Text>
        I have 6 years of experience in frontend development, having worked at an AI-first SaaS
        company, a commerce platform, and a web agency. Now, I&apos;m an independent builder working
        across web development, content communities, and filmmaking.
      </Text>
      <Text>
        I care about clear thinking, thoughtful UX, and building software that delivers real value.
        I get excited whenever I find software that makes my life better.
      </Text>
      <Text>
        I&apos;ve been learning Japanese for over 10 years, but I still struggle to read Japanese
        texts with lots of kanji. That&apos;s why I&apos;m building{' '}
        <Link href="https://furigana.app" target="_blank">
          Furigana
        </Link>
        . If you&apos;ve ever had the same problem, check it out!
      </Text> */}
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

const Link = styled.a`
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color ease-in-out 0.15s;

  &:hover {
    color: var(--cornflowerblue);
  }
`;

const Text = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 10px;

  ${mediaQuery.mobile} {
    font-size: 16px;
  }
`;
