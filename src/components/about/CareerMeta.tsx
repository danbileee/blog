import { Career } from '@constants/types';
import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';

interface Props {
  career: Career;
}

export default function CareerMeta({ career }: Props) {
  const { company, startYear, endYear, description, website } = career;

  return (
    <Container>
      <Wrapper>
        {website ? (
          <a href={website} target="_blank" rel="noopener noreferrer">
            <Company style={{ textDecoration: 'underline' }}>{company}</Company>
          </a>
        ) : (
          <Company>{company}</Company>
        )}
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
  gap: 12px;
`;

const Company = styled.h2`
  font-size: 30px;
  line-height: 1;
`;

const Period = styled.p`
  font-weight: 600;
  line-height: 1;
  margin-top: 6px;

  ${mediaQuery.mobile} {
    font-size: 15px;
  }
`;

const Description = styled.p`
  line-height: 1.6;
  margin: 20px 0;

  ${mediaQuery.mobile} {
    margin: 16px 0 32px;
  }
`;
