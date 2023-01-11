import { ComponentProps, useEffect, useRef } from 'react';
import { css } from '@emotion/react';

import isSameNode from '@utils/isSameNode';

export function UnorderedList({ children }: ComponentProps<'ul'>) {
  return <ul css={listStyle}>{children}</ul>;
}

export function OrderedList({ children }: ComponentProps<'ol'>) {
  return <ol css={listStyle}>{children}</ol>;
}

function isListItem(el?: HTMLElement | null): el is HTMLLIElement {
  return isSameNode('li', el);
}

export function ListItem({ children }: ComponentProps<'li'>) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const { parentElement } = ref.current;

    if (isSameNode('ol', parentElement)) {
      ref.current.style.listStyleType = 'decimal';

      return;
    }

    if (
      isListItem(parentElement?.parentElement?.parentElement?.parentElement)
    ) {
      ref.current.style.listStyleType = 'square';

      return;
    }

    if (isListItem(parentElement?.parentElement)) {
      ref.current.style.listStyleType = 'circle';
    }
  }, [children]);

  return (
    <li ref={ref} css={listItemStyle}>
      {children}
    </li>
  );
}

const listStyle = css`
  margin: 0 0 12px 12px;
`;

const listItemStyle = css`
  line-height: 1.65;
  letter-spacing: 0.01em;
  list-style-type: disc;
  list-style-position: outside;
`;
