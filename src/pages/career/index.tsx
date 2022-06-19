import CareerCard from '@components/cards/CareerCard';
import Layout from '@components/layout';
import PageMeta from '@components/layout/PageMeta';
import { careers } from '@constants/careers';
import { Children } from 'react';

export default function Career() {
  return (
    <Layout>
      <PageMeta path="career" />
      {Children.toArray(
        careers.map((career) => <CareerCard career={career} />),
      )}
    </Layout>
  );
}
