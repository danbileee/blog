import styled from '@emotion/styled';
import Image from 'next/image';
import { ImgHTMLAttributes } from 'react';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'>;

export default function ResponsiveImage({ src, alt, ...props }: Props) {
  return (
    <Figure>
      <Image
        src={src ?? ''}
        layout="fill"
        placeholder="empty"
        alt={alt}
        {...props}
      />
      <FigCaption aria-hidden>{alt}</FigCaption>
    </Figure>
  );
}

const Figure = styled.figure`
  position: relative;
  width: 100%;
  margin: 0;

  > span {
    position: unset !important;

    > img {
      object-fit: contain !important;
      position: relative !important;
      height: auto !important;
    }
  }
`;

const FigCaption = styled.figcaption`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 14px;
  margin-top: 12px;
`;
