import styled from '@emotion/styled';

import { PostFrontMatter } from '@constants/types';
import getDisplayDate from '@utils/getDisplayDate';

interface Props {
  frontMatter: PostFrontMatter;
}

export default function PostMeta({ frontMatter }: Props) {
  const { subtitle, title, publishedAt, updatedAt } = frontMatter;

  return (
    <Section id="postMeta">
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      <Title>{title}</Title>
      <Date>
        <span>작성 </span>
        {getDisplayDate(publishedAt)}
      </Date>
      <Date>
        <span>업데이트 </span>
        {getDisplayDate(updatedAt)}
      </Date>
    </Section>
  );
}

const Section = styled.section`
  margin-bottom: 60px;
`;

const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  line-height: 1.4;
  margin-bottom: 20px;
`;

const Date = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.gray300};
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 12px;

  :not(:last-of-type) {
    position: relative;
    margin-right: 22px;

    ::after {
      content: '|';
      display: block;
      position: absolute;
      right: -14px;
      top: 0;
      opacity: 0.4;
    }
  }
`;
