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
  font-family: 'Lato';
  font-size: 40px;
  font-weight: 900;
  line-height: 50px;
  letter-spacing: 0.01em;
  white-space: pre-line;
  margin-bottom: 40px;

  ${mediaQuery.mobile} {
    font-size: 32px;
    line-height: 38px;
  }
`;
