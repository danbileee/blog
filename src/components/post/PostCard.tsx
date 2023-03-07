import styled from '@emotion/styled';

import { Post } from '@constants/types';
import getEllipsisStyle from '@utils/getEllipsisStyle';
import getDisplayDate from '@utils/getDisplayDate';
import mediaQuery from '@styles/mediaQuery';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const {
    frontMatter: { title, publishedAt, description },
    slug,
  } = post;

  return (
    <Container href={`/blog/${slug}`}>
      {/* {category && <Subtitle>{category}</Subtitle>} */}
      <Title>{title}</Title>
      <Description>{description}</Description>
      <PublishedAt>{getDisplayDate(publishedAt)}</PublishedAt>
    </Container>
  );
}

const Container = styled.a`
  display: flex;
  flex-direction: column;
  width: 100%;
  transform: translateY(0);
  transition: transform ease-in-out 0.2s;

  ${mediaQuery.hover} {
    :hover {
      transform: translateY(-5px);

      > h3,
      h4 {
        color: ${({ theme }) => theme.colors.cornflowerblue};
      }
    }
  }
`;

// const Subtitle = styled.h4`
//   color: ${({ theme }) => theme.colors.gray900};
//   font-weight: 600;
//   transition: color ease-in-out 0.2s;
// `;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  margin: 8px 0 16px;
  transition: color ease-in-out 0.2s;
  ${getEllipsisStyle(2)}
`;

const PublishedAt = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray300};
  margin-top: 16px;
`;

const Description = styled.p`
  line-height: 1.6;
  ${getEllipsisStyle(2)}
`;
