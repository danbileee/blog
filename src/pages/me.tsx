import { Children } from 'react';
import styled from '@emotion/styled';

import AboutMeItem from '@components/me';
import { aboutMe } from '@constants/aboutMe';

export default function AboutMe() {
  return (
    <Container>
      <Iam>I am a</Iam>
      <AboutMeList>
        {Children.toArray(
          aboutMe.map((item) => <AboutMeItem aboutMe={item} />),
        )}
      </AboutMeList>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Iam = styled.p`
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 80px;
`;

const AboutMeList = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
`;
