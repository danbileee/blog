import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { ComponentProps } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import highlighterStyle from 'react-syntax-highlighter/dist/cjs/styles/prism/one-dark';

export default function Code({ children, ...props }: ComponentProps<'pre'>) {
  const language = props?.className?.replace('lang-', '');
  const { colors } = useTheme();

  if (language) {
    return (
      <Container>
        <SyntaxHighlighter
          language={language}
          style={highlighterStyle}
          customStyle={{
            fontFamily: 'monospace',
            background: colors.gray900,
            padding: 20,
            borderRadius: 6,
            margin: 0,
          }}
        >
          {children?.toString() ?? ''}
        </SyntaxHighlighter>
      </Container>
    );
  }

  return (
    <code css={{ color: 'var(--cornflowerblue)' }} {...props}>
      {children}
    </code>
  );
}

const Container = styled.div`
  > pre {
    ::-webkit-scrollbar {
      display: none;
    }

    > code {
      color: ${({ theme }) => theme.colors.gray100} !important;
      background: transparent !important;
      text-shadow: transparent !important;

      > span {
        font-family: 'Lucida Console', 'Monaco', monospace;
      }
    }
  }
`;
