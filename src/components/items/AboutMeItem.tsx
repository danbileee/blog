import { AboutMe } from '@constants/types';
import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';

interface Props {
  aboutMe: AboutMe;
}

export default function AboutMeItem({ aboutMe }: Props) {
  const { keyword, description } = aboutMe;

  return (
    <Container>
      <Keyword>{keyword}</Keyword>
      <Description>{description}</Description>
    </Container>
  );
}

const Container = styled.li`
  width: 75%;

  ${mediaQuery.mobile} {
    width: 100%;
  }
`;

const Keyword = styled.h3`
  font-size: 20px;
  margin-bottom: 8px;

  ${mediaQuery.mobile} {
    font-size: 18px;
  }
`;

const Description = styled.p`
  line-height: 1.6;
`;
