import styled from '@emotion/styled';
import { ComponentProps } from 'react';

export default function Code({ children, ...props }: ComponentProps<'pre'>) {
  const language = props?.className?.replace('lang-', '');

  if (language) {
    return (
      <Pre {...props}>
        <code className={`language-${language}`}>{children}</code>
      </Pre>
    );
  }

  return (
    <code css={{ color: 'var(--cornflowerblue)' }} {...props}>
      {children}
    </code>
  );
}

const Pre = styled.pre`
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.gray800};
  padding: 20px;
  border-radius: 6px;
  margin: 0;
  overflow-x: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`;
