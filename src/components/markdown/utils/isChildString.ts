import { ReactNode } from 'react';

export function isChildString(child: ReactNode): child is string {
  return typeof child === 'string';
}
