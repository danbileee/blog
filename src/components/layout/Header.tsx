import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { menus as menusConst } from '@constants/metaInfo';
import { useRouter } from 'next/router';

import mediaQuery from '@styles/mediaQuery';
import { getMenuLink } from '@utils/getMenuLink';
import { getMetaInfo } from '@utils/getMetaInfo';

import Logo from './Logo';

const menus: string[] = Object.values(menusConst).map((menu) => menu);

export default function Header() {
  const { pathname } = useRouter();
  const { menu: currentMenu } = getMetaInfo(pathname);

  return (
    <Container>
      <LogoAnchor href="/">
        <StyledLogo />
      </LogoAnchor>
      <Nav>
        {menus.map((menu) => (
          <NavAnchor
            key={menu}
            href={getMenuLink(menu)}
            isActive={menu === currentMenu}
          >
            {menu}
          </NavAnchor>
        ))}
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
  max-width: 100%;
  height: 110px;
  padding: 0 calc(50vw - 430px);
  background-color: ${({ theme }) => theme.colors.white};

  ${mediaQuery.mobile} {
    height: 70px;
    padding: 0 20px;
  }
`;

const LogoAnchor = styled.a`
  width: 30px;
  height: 34px;

  ${mediaQuery.mobile} {
    width: 26px;
    height: 29px;
  }

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
  width: 100%;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 45px;

  ${mediaQuery.mobile} {
    gap: 28px;
  }
`;

const NavAnchor = styled.a<{ isActive: boolean }>`
  position: relative;
  font-size: 20px;
  font-weight: 800;

  ${mediaQuery.mobile} {
    font-size: 18px;
    font-weight: 800;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 0px;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.gray900};
    opacity: 0;
    left: 0;
    bottom: -10px;
    transition: all ease-in-out 0.2s;

    ${({ isActive }) =>
      isActive &&
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
