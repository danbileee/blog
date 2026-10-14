import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import mediaQuery from '@styles/mediaQuery';
import NextLink from 'next/link';
import { ComponentProps } from 'react';
import { useLocale } from '../../i18n/context';
import { messages } from '../../i18n/messages';
import LanguageSelector from './LanguageSelector';

export default function Navigation(props: ComponentProps<'nav'>) {
  const { asPath } = useRouter();
  const locale = useLocale();
  return (
    <Nav {...props}>
      {(['career', 'blog'] as const).map((menu) => (
        <NextLink key={menu} href={`/${locale}/${menu}`} passHref>
          <NavAnchor isActive={asPath.split(/[/?#]/)[2] === menu}>
            {messages[locale][menu]}
          </NavAnchor>
        </NextLink>
      ))}
      <LanguageSelector />
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 28px;

  ${mediaQuery.mobile} {
    gap: 16px;
  }
`;

const NavAnchor = styled.a<{ isActive: boolean }>`
  position: relative;
  font-size: 20px;
  font-weight: 800;

  ${mediaQuery.mobile} {
    font-size: 16px;
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
