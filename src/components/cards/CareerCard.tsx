import { Career } from '@constants/types';
import { useGlobalContext } from '@contexts/global';
import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';
import Image from 'next/image';
import { Children } from 'react';

function getBgPath(id: string) {
  return `/career/${id}-bg.jpg`;
}

function getLogoPath(id: string) {
  return `/career/${id}-logo.png`;
}

interface Props {
  career: Career;
}

export default function CareerCard({ career }: Props) {
  const { isMobile } = useGlobalContext();
  const { company, period, description, techStacks, careerIds, logoSize } =
    career;
  const [careerId] = careerIds;

  return (
    <Container>
      <Wrapper>
        <Company>{company}</Company>
        <Period>{period}</Period>
      </Wrapper>
      <Description>{description}</Description>
      <Stacks>
        {Children.toArray(techStacks.map((stack) => <Stack>{stack}</Stack>))}
      </Stacks>
      {careerIds.length === 1 ? (
        <Thumb src={getBgPath(careerId)} href={`/career/${careerId}`}>
          <Logo
            width={logoSize.width}
            height={logoSize.height}
            src={getLogoPath(careerId)}
          />
        </Thumb>
      ) : (
        <ThumbGrid itemHeight={isMobile ? (window.innerWidth - 32) / 2 : 215}>
          {Children.toArray(
            careerIds.map((id) => (
              <Thumb src={getBgPath(id)} href={`/career/${id}`}>
                <Logo
                  width={logoSize.width}
                  height={logoSize.height}
                  src={getLogoPath(id)}
                />
              </Thumb>
            )),
          )}
        </ThumbGrid>
      )}
    </Container>
  );
}

const Container = styled.div`
  :not(:last-of-type) {
    margin-bottom: 80px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Company = styled.h3`
  font-size: 20px;
  line-height: 1;

  ${mediaQuery.mobile} {
    font-size: 18px;
    font-weight: 600;
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
  margin: 12px 0 20px;

  ${mediaQuery.mobile} {
    line-height: 1.6;
    margin: 8px 0 16px;
  }
`;

const Stacks = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;

  ${mediaQuery.mobile} {
    gap: 8px 10px;
    margin-bottom: 24px;
  }
`;

const Stack = styled.li`
  color: ${({ theme }) => theme.colors.gray600};
  opacity: 0.65;

  ${mediaQuery.mobile} {
    font-size: 14px;
  }
`;

const ThumbGrid = styled.div<{ itemHeight: number }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  ${mediaQuery.mobile} {
    grid-template-columns: repeat(2, 1fr);
  }

  > a {
    height: ${({ itemHeight }) => itemHeight}px;
  }
`;

const Thumb = styled.a<{ src: string }>`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 360px;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  filter: grayscale(1);

  ${mediaQuery.mobile} {
    height: 200px;
    filter: grayscale(0);

    &::after {
      position: absolute;
      display: block;
      content: '';
      width: 100%;
      height: 100%;
      background-color: ${({ theme }) => theme.colors.gray900};
      opacity: 0.15;
      top: 0;
      left: 0;
      z-index: -1;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    :hover {
      filter: grayscale(0);
      transition: filter ease-in-out 0.2s;

      > span {
        transform: scale(1.1);
        transition: transform ease-in-out 0.2s;
      }
    }
  }
`;

const Logo = styled(Image)`
  object-fit: contain;
  transform: scale(1);

  ${mediaQuery.mobile} {
    transform: scale(0.85);
  }
`;
