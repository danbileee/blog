import { css } from '@emotion/react';
import { ComponentProps } from 'react';

export default function Anchor({ children, ...props }: ComponentProps<'a'>) {
  const target = props.href?.startsWith('#') ? '_self' : '_blank';

  return (
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
      target={target}
      rel="noreferrer noopener"
    >
      {children}
    </a>
  );
}
