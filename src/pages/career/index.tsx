import { Children } from 'react';
import styled from '@emotion/styled';

import CareerCard from '@components/career/CareerCard';
import { careers } from '@constants/careers';
import mediaQuery from '@styles/mediaQuery';

export default function Career() {
  return (
    <CareerList>
      {Children.toArray(
        careers.map((career) => <CareerCard career={career} />),
      )}
    </CareerList>
  );
}

const CareerList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 200px;

  ${mediaQuery.mobile} {
    gap: 120px;
  }
`;
