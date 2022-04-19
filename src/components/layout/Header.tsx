import { css } from '@emotion/react';
import styled from '@emotion/styled';

import Logo from './Logo';

const BASE_PORTFOLIO_URL = 'https://blocktobody.com/';
const BASE_BLOG_URL = 'https://blog.blocktobody.com/';

const menus: string[] = ['works', 'about', 'blog'];

export default function Header() {
  return (
    <Container>
      <LogoAnchor href={BASE_PORTFOLIO_URL}>
        <StyledLogo />
      </LogoAnchor>
      <Nav>
        {menus.map((menu) => {
          const isBlog = menu === 'blog';

          return (
            <NavAnchor
              key={menu}
              href={isBlog ? BASE_BLOG_URL : `${BASE_PORTFOLIO_URL}${menu}`}
              isBlog={isBlog}
            >
              {menu}
            </NavAnchor>
          );
        })}
      </Nav>
    </Container>
  );
}

const Container = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 110px;
  padding: 0 calc(50vw - 500px);
  background-color: var(--white);
`;

const LogoAnchor = styled.a`
  width: 30px;
  height: 34px;

  &:hover {
    .cls-1 {
      transition: transform ease-in-out 0.5s !important;
      transform: translateX(5%);
    }

    .cls-2 {
      transition: transform ease-in-out 0.5s !important;
      transform: translateX(-5%);
    }
  }
`;

const StyledLogo = styled(Logo)`
  width: 30px;
  height: 31px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 45px;
`;

const NavAnchor = styled.a<{ isBlog: boolean }>`
  position: relative;
  font-size: 20px;
  font-weight: 500;

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 0px;
    height: 2px;
    background-color: var(--gray-900);
    opacity: 0;
    left: 0;
    bottom: -10px;
    transition: all ease-in-out 0.2s;

    ${({ isBlog }) =>
      isBlog &&
      css`
        width: 25px;
        opacity: 1;
      `}
  }

  &:hover {
    &::after {
      width: 25px;
      opacity: 1;
    }
  }
`;
