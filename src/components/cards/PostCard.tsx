import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';
import { Post } from '@constants/types';

const Container = styled.a`
  &:not(:last-of-type) {
    margin-bottom: 50px;
  }
`;

const Content = styled.div`
  width: 660px;

  ${mediaQuery.mobile} {
    width: 100%;
  }
`;

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
        <h2>{title}</h2>
        <p>{publishedAt}</p>
        <p>{description}</p>
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </Content>
    </Container>
  );
}
