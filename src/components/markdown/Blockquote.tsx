import { css } from '@emotion/react';
import { ComponentProps } from 'react';

export default function Blockquote({ children, ...props }: ComponentProps<'blockquote'>) {
  return (
    <blockquote
      css={css`
        color: var(--gray600);
        padding-left: 16px;
        border-left: 4px solid var(--cornflowerblue);
        margin: 20px 0;

        > p {
          color: var(--gray-600);
        }
      `}
      {...props}
    >
      {children}
    </blockquote>
  );
}
