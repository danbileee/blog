import { cloneElement, ComponentProps, ReactNode } from 'react';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';

import Heading, { HeadingElementType } from './Heading';
import ResponsiveImage from './ResponsiveImage';
import Paragraph from './Paragraph';
import { ListItem, OrderedList, UnorderedList } from './List';
import Code from './Code';
import Blockquote from './Blockquote';
import Table, { TableRow } from './Table';
import Anchor from './Anchor';

interface Props {
  content: string;
  withHeadlineAnchor?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MarkdownProps = ComponentProps<any>;

function getHeadingOverride(as: HeadingElementType, props: ComponentProps<typeof as>) {
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

const getOptions = ({
  withHeadlineAnchor,
}: Pick<Props, 'withHeadlineAnchor'>): MarkdownToJSX.Options => ({
  wrapper: 'article',
  overrides: {
    img: ResponsiveImage,
    h1: (props) => getHeadingOverride('h2', { ...props, withHeadlineAnchor }),
    h2: (props) => getHeadingOverride('h3', { ...props, withHeadlineAnchor }),
    h3: (props) => getHeadingOverride('h4', { ...props, withHeadlineAnchor }),
    h4: (props) => getHeadingOverride('h5', { ...props, withHeadlineAnchor }),
    h5: (props) => getHeadingOverride('h6', { ...props, withHeadlineAnchor }),
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
});

export default function MarkdownEntry({ content, withHeadlineAnchor }: Props) {
  return (
    <Markdown
      css={{ display: 'flex', flexDirection: 'column', gap: 28 }}
      options={getOptions({ withHeadlineAnchor })}
    >
      {content}
    </Markdown>
  );
}
