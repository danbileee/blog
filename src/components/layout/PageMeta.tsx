import { metaInfo, Pathname } from '@constants/metaInfo';
import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';
import getEmoji from '@utils/getEmoji';

interface Props {
  path: Pathname;
}

export default function PageMeta({ path }: Props) {
  const { description, emoji = [] } = metaInfo[path] ?? {};

  return <Title>{`${getEmoji(emoji)}\n${description}`}</Title>;
}

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  line-height: 1.6;
  letter-spacing: -0.02em;
  white-space: pre-line;
  text-align: center;
  margin-bottom: 80px;

  ${mediaQuery.mobile} {
    font-size: 20px;
  }
`;
