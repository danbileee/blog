import styled from '@emotion/styled';
import { ComponentProps } from 'react';

export default function Table({ children, ...props }: ComponentProps<'table'>) {
  return <table {...props}>{children}</table>;
}

export function TableRow({ children, ...props }: ComponentProps<'tr'>) {
  return <Row {...props}>{children}</Row>;
}

const Row = styled.tr`
  > th {
    background-color: ${({ theme }) => theme.colors.gray200};
  }

  > td {
    background-color: ${({ theme }) => theme.colors.gray100};
  }

  > th,
  td {
    padding: 8px;
    border-radius: 2px;
  }
`;
