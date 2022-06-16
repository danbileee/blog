import AboutMeItem from '@components/items/AboutMeItem';
import Layout from '@components/layout';
import PageMeta from '@components/layout/PageMeta';
import { aboutMe } from '@constants/aboutMe';
import styled from '@emotion/styled';
import { Children } from 'react';

export default function AboutMe() {
  return (
    <Layout>
      <PageMeta path="me" />
      <AboutMeList>
        {Children.toArray(
          aboutMe.map((item) => <AboutMeItem aboutMe={item} />),
        )}
      </AboutMeList>
    </Layout>
  );
}

const AboutMeList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;
