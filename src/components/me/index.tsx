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
  width: 100%;
  display: flex;
  align-items: flex-start;
`;

const Keyword = styled.h3`
  width: 30%;
  font-size: 20px;

  ${mediaQuery.mobile} {
    font-size: 18px;
  }
`;

const Description = styled.p`
  width: 70%;
  line-height: 1.6;
  white-space: pre-line;
`;
