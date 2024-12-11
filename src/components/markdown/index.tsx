import { ComponentProps } from 'react';
import Markdown, { MarkdownToJSX } from 'markdown-to-jsx';

import ResponsiveImage from './ResponsiveImage';
import Paragraph from './Paragraph';
import { ListItem, OrderedList, UnorderedList } from './List';
import Code from './Code';
import Blockquote from './Blockquote';
import Table, { TableRow } from './Table';
import Anchor from './Anchor';
import { getHeadingOverride } from './utils/getHeadingOverride';
import { isChildString } from './utils/isChildString';
import { cloneChildren } from './utils/cloneChildren';

interface Props {
  content: string;
  withHeadlineAnchor?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MarkdownProps = ComponentProps<any>;

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
