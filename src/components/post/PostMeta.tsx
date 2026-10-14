import styled from '@emotion/styled';
import { PostFrontMatter } from '@constants/types';
import getDisplayDate from '@utils/getDisplayDate';
import { useLocale } from '../../i18n/context';
import { messages } from '../../i18n/messages';

interface Props {
  frontMatter: PostFrontMatter;
}

export default function PostMeta({ frontMatter }: Props) {
  const locale = useLocale();
  const { title, publishedAt, updatedAt } = frontMatter;

  return (
    <Section id="postMeta">
      {/* {category && <Subtitle>{category}</Subtitle>} */}
      <Title>{title}</Title>
      <Date lang={locale}>
        <span>{messages[locale].published} </span>
        {getDisplayDate(publishedAt, locale)}
      </Date>
      <Date lang={locale}>
        <span>{messages[locale].updated} </span>
        {getDisplayDate(updatedAt ?? publishedAt, locale)}
      </Date>
    </Section>
  );
}

const Section = styled.section`
  margin-bottom: 60px;
`;

// const Subtitle = styled.h2`
//   font-size: 18px;
//   font-weight: 600;
//   margin-bottom: 12px;
// `;

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
