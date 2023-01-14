import { cloneElement, ComponentProps, ReactNode } from 'react';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';

import Heading, { HeadingElementType } from '@components/markdown/Heading';
import ResponsiveImage from '@components/markdown/ResponsiveImage';
import Paragraph from '@components/markdown/Paragraph';
import {
  ListItem,
  OrderedList,
  UnorderedList,
} from '@components/markdown/List';
import Code from '@components/markdown/Code';
import Blockquote from '@components/markdown/Blockquote';
import Table, { TableRow } from '@components/markdown/Table';
import Anchor from '@components/markdown/Anchor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MarkdownProps = ComponentProps<any>;

function getHeadingOverride(
  as: HeadingElementType,
  props: ComponentProps<typeof as>,
) {
  const getId = () => {
    if (!props.children) return '';

    return props.children.toString().split(' ').join('-');
  };

  return <Heading {...props} as={as} id={getId()} />;
}

function isChildString(child: ReactNode): child is string {
  return typeof child === 'string';
}

function cloneChildren({ children, ...props }: MarkdownProps) {
  return cloneElement(<>{children}</>, { ...props });
}

const options: MarkdownToJSX.Options = {
  wrapper: 'article',
  overrides: {
    img: ResponsiveImage,
    h1: (props) => getHeadingOverride('h2', props),
    h2: (props) => getHeadingOverride('h3', props),
    h3: (props) => getHeadingOverride('h4', props),
    h4: (props) => getHeadingOverride('h5', props),
    h5: (props) => getHeadingOverride('h6', props),
    p: (props: MarkdownProps) => {
      if (props?.children?.some(isChildString)) {
        return <Paragraph {...props} />;
      }

      return cloneChildren(props);
    },
    a: Anchor,
    ul: UnorderedList,
    ol: OrderedList,
    li: ListItem,
    pre: cloneChildren,
    code: Code,
    blockquote: Blockquote,
    table: Table,
    tr: TableRow,
  },
};

interface Props {
  content: string;
}

export default function Post({ content }: Props) {
  return (
    <Markdown
      css={{ display: 'flex', flexDirection: 'column', gap: 28 }}
      options={options}
    >
      {content}
    </Markdown>
  );
}
