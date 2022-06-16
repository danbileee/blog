import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';
import { Post } from '@constants/types';
import getEllipsisStyle from '@utils/getEllipsisStyle';

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const {
    frontMatter: { title, publishedAt, description, tags },
    slug,
  } = post;

  return (
    <Container href={slug}>
      <Content>
        <Title>{title}</Title>
        <PublishedAt>{publishedAt}</PublishedAt>
        <Description>{description}</Description>
        <Tags>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Tags>
      </Content>
    </Container>
  );
}

const Container = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-block: 40px;
  background-color: ${({ theme }) => theme.colors.white};
  transition: background-color ease-in-out 0.2s;

  @media (hover: hover) and (pointer: fine) {
    :hover {
      background-color: ${({ theme }) => theme.colors.gray100};

      li {
        background-color: ${({ theme }) => theme.colors.white};
      }
    }
  }
`;

const Content = styled.div`
  width: 75%;

  ${mediaQuery.mobile} {
    width: 100%;
  }
`;

const Title = styled.h3`
  font-size: 20px;
  ${getEllipsisStyle(2)}
`;

const PublishedAt = styled.p`
  color: ${({ theme }) => theme.colors.gray300};
  margin: 8px 0 12px;
`;

const Description = styled.p`
  line-height: 1.5;
  ${getEllipsisStyle(2)}
`;

const Tags = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
`;

const Tag = styled.li`
  font-size: 14px;
  padding: 4px 6px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.gray100};
  transition: background-color ease-in-out 0.2s;
`;
