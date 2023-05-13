import { Career } from '@constants/types';
import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';

interface Props {
  career: Career;
}

export default function CareerMeta({ career }: Props) {
  const { company, startYear, endYear, description } = career;

  return (
    <Container>
      <Wrapper>
        <Company>{company}</Company>
        <Period>{`${startYear}~${endYear ?? ''}`}</Period>
      </Wrapper>
      <Description>{description}</Description>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;

  ${mediaQuery.mobile} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding-top: 0;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Company = styled.h2`
  font-size: 28px;
  line-height: 1;

  ${mediaQuery.mobile} {
    font-size: 26px;
  }
`;

const Period = styled.p`
  font-weight: 600;
  line-height: 1;
  margin-top: 2px;

  ${mediaQuery.mobile} {
    font-size: 15px;
    margin-top: 1px;
  }
`;

const Description = styled.p`
  line-height: 1.6;
  margin: 20px 0 40px;

  ${mediaQuery.mobile} {
    margin: 16px 0 32px;
  }
`;
