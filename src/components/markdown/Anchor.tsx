import { css } from '@emotion/react';
import { ComponentProps } from 'react';

export default function Anchor({ children, ...props }: ComponentProps<'a'>) {
  return (
    <a
      css={css`
        text-decoration: underline;
        transition: color ease-in-out 0.15s;

        :hover {
          color: var(--cornflowerblue);
        }
      `}
      {...props}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
    </a>
  );
}
