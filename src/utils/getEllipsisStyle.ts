import { css } from '@emotion/react';

export default function getEllipsisStyle(clamp: number) {
  return css`
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${clamp};
    overflow: hidden;
  `;
}
