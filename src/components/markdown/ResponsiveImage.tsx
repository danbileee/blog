import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';
import Image from 'next/image';
import { ImgHTMLAttributes } from 'react';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'>;

export default function ResponsiveImage({ src, ...props }: Props) {
  const [alt, size] = props?.alt?.split('|') ?? [];

  // TODO: 이미지 전체보기 모달 구현
  return (
    <Figure size={size}>
      <Image src={src ?? ''} layout="fill" placeholder="empty" alt={alt} {...props} />
      <FigCaption aria-hidden>{alt}</FigCaption>
    </Figure>
  );
}

const Figure = styled.figure<{ size: string }>`
  position: relative;
  width: ${({ size }) => (size ? `${size}px` : '100%')};
  margin: 0 auto;

  > span {
    position: unset !important;

    > img {
      object-fit: contain !important;
      position: relative !important;
      height: auto !important;
    }
  }

  ${mediaQuery.mobile} {
    width: 100%;
  }
`;

const FigCaption = styled.figcaption`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 14px;
  margin-top: 12px;
`;
