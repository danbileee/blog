import { metaInfo, Pathname } from '@constants/metaInfo';
import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';
import getEmoji from '@utils/getEmoji';

interface Props {
  path: Pathname;
}

export default function PageMeta({ path }: Props) {
  const { description, emoji = [] } = metaInfo[path] ?? {};

  return <Title>{`${getEmoji(emoji)} ${description}`}</Title>;
}

const Title = styled.h2`
  font-size: 36px;
  font-weight: 700;
  line-height: 48px;
  letter-spacing: -0.02px;
  white-space: pre-line;
  text-align: center;
  margin-bottom: 80px;

  ${mediaQuery.mobile} {
    font-size: 22px;
    line-height: 32px;
    margin-bottom: 72px;
  }
`;
