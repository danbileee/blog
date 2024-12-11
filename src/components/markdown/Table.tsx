import styled from '@emotion/styled';
import { ComponentProps } from 'react';
import Markdown from 'markdown-to-jsx';
import ResponsiveImage from './ResponsiveImage';
import { isChildString } from './utils/isChildString';
import Paragraph from './Paragraph';
import { cloneChildren } from './utils/cloneChildren';
import Anchor from './Anchor';
import { ListItem, OrderedList, UnorderedList } from './List';
import Code from './Code';
import Blockquote from './Blockquote';

export default function Table({ children, ...props }: ComponentProps<'table'>) {
  return <table {...props}>{children}</table>;
}

export function TableRow({ children, ...props }: ComponentProps<'tr'>) {
  return <Row {...props}>{children}</Row>;
}

export function TableData({ children, ...props }: ComponentProps<'td'>) {
  console.log({ children });
  if (typeof children !== 'string') return children;

  return (
    <Markdown
      {...props}
      options={{
        wrapper: 'td',
        overrides: {
          img: ResponsiveImage,
          p: (elementProps: ComponentProps<any>) => {
            if (elementProps?.children?.some(isChildString)) {
              return <Paragraph {...elementProps} />;
            }

            return cloneChildren(elementProps);
          },
          a: Anchor,
          ul: UnorderedList,
          ol: OrderedList,
          li: ListItem,
          pre: cloneChildren,
          code: Code,
          blockquote: Blockquote,
        },
      }}
    >
      {children}
    </Markdown>
  );
}

const Row = styled.tr`
  > th {
    background-color: ${({ theme }) => theme.colors.gray200};
  }

  > td {
    background-color: ${({ theme }) => theme.colors.gray100};
  }

  > th,
  td {
    padding: 8px;
    border-radius: 2px;
  }
`;
