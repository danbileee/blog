import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';

import { useGlobalContext } from '@contexts/global';
import mediaQuery from '@styles/mediaQuery';
import { getMetaInfo } from '@utils/getMetaInfo';
import useScrollDirection, { ScrollDirection } from '@hooks/useScrollDirection';
import Navigation from './Navigation';

const DESKTOP_HEADER_HEIGHT = 110;
const MOBILE_HEADER_HEIGHT = 80;

export default function Header() {
  const { isMobile } = useGlobalContext();
  const { pathname } = useRouter();
  const direction = useScrollDirection(isMobile ? MOBILE_HEADER_HEIGHT : DESKTOP_HEADER_HEIGHT);
  const { key } = getMetaInfo(pathname) ?? {};

  return (
    <Container direction={direction}>
      <Wrapper>
        <LogoAnchor href="/">
          <Image
            width={isMobile ? 28 : 36}
            height={isMobile ? 28 : 36}
            src="/logo.png"
            alt="logo"
          />
        </LogoAnchor>
        {key !== 'home' && <Navigation />}
      </Wrapper>
    </Container>
  );
}

const Container = styled.header<{ direction: ScrollDirection }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  max-width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 10;
  transform: translateY(
    ${({ direction }) => (direction === 'down' ? `-${DESKTOP_HEADER_HEIGHT}px` : '0px')}
  );
  transition: transform ease-in-out 0.2s;

  ${mediaQuery.mobile} {
    transform: translateY(
      ${({ direction }) => (direction === 'down' ? `-${MOBILE_HEADER_HEIGHT}px` : '0px')}
    );
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${DESKTOP_HEADER_HEIGHT}px;
  padding: 0 calc(50vw - 430px);

  ${mediaQuery.mobile} {
    height: ${MOBILE_HEADER_HEIGHT}px;
    padding: 0 20px;
  }
`;

const LogoAnchor = styled.a`
  width: 36px;
  height: 36px;

  ${mediaQuery.mobile} {
    width: 28px;
    height: 28px;
  }
`;
