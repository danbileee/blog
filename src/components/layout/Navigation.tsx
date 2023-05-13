import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import mediaQuery from '@styles/mediaQuery';
import { menus as menusConst } from '@constants';
import { getMenuLink } from '@utils/getMenuLink';
import { getMetaInfo } from '@utils/getMetaInfo';
import { ComponentProps } from 'react';

const menus: string[] = Object.values(menusConst).map((menu) => menu);

export default function Navigation(props: ComponentProps<'nav'>) {
  const { pathname } = useRouter();
  const { key } = getMetaInfo(pathname) ?? {};

  return (
    <Nav {...props}>
      {menus.map((menu) => (
        <NavAnchor key={menu} href={getMenuLink(menu)} isActive={menu.includes(key)}>
          {menu}
        </NavAnchor>
      ))}
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 45px;

  ${mediaQuery.mobile} {
    gap: 24px;
  }
`;

const NavAnchor = styled.a<{ isActive: boolean }>`
  position: relative;
  font-size: 20px;
  font-weight: 800;

  ${mediaQuery.mobile} {
    font-size: 18px;
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

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      &::after {
        width: 25px;
        opacity: 1;
      }
    }
  }
`;
