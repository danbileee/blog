import { css } from '@emotion/react';
import { ComponentProps } from 'react';
import NextLink from 'next/link';
import { useLocale } from '../../i18n/context';
import { localizeContentLink } from '../../i18n/routes';

export default function Anchor({ children, ...props }: ComponentProps<'a'>) {
  const locale = useLocale();
  const href = localizeContentLink(props.href ?? '', locale);
  const internal = href.startsWith('/') && !href.startsWith('//');
  const target = internal || href.startsWith('#') ? '_self' : '_blank';

  const anchor = (
    <a
      css={css`
        word-break: break-all;
        text-decoration: underline;
        transition: color ease-in-out 0.15s;

        :hover {
          color: var(--cornflowerblue);
        }
      `}
      {...props}
      href={href}
      target={target}
      rel="noreferrer noopener"
    >
      {children}
    </a>
  );
  return internal ? (
    <NextLink href={href} passHref>
      {anchor}
    </NextLink>
  ) : (
    anchor
  );
}
