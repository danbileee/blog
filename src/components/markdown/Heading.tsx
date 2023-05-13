import LinkIcon from '@components/icons/LinkIcon';
import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';
import { HTMLAttributes } from 'react';

export type HeadingElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface Props extends HTMLAttributes<HTMLHeadingElement> {
  as: HeadingElementType;
  withHeadlineAnchor?: boolean;
}

export default function Heading({ id, as, children, withHeadlineAnchor = true, ...props }: Props) {
  const Component = as;

  return (
    <Component id={id} css={headingStyles[as]} {...props}>
      {children}
      {withHeadlineAnchor && (
        <Link href={`#${id}`}>
          <LinkIcon />
        </Link>
      )}
    </Component>
  );
}

const commonHeadingStyle = css`
  line-height: 1.65;

  :hover {
    > a {
      opacity: 1;
    }
  }
`;

const headingStyles: Record<HeadingElementType, SerializedStyles> = {
  h1: css`
    font-size: 28px;
    ${commonHeadingStyle}
  `,
  h2: css`
    font-size: 24px;
    ${commonHeadingStyle}
  `,
  h3: css`
    font-size: 20px;
    ${commonHeadingStyle}
  `,
  h4: css`
    font-size: 18px;
    ${commonHeadingStyle}
  `,
  h5: css`
    font-size: 17px;
    ${commonHeadingStyle}
  `,
  h6: css`
    font-size: 16px;
    ${commonHeadingStyle}
  `,
};

const Link = styled.a`
  cursor: pointer;
  opacity: 0;
  margin-left: 8px;
  transition: opacity ease-in-out 0.2s;

  ${mediaQuery.mobile} {
    opacity: 1;
  }
`;
