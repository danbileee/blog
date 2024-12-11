import { cloneElement, ComponentProps } from 'react';

export function cloneChildren({ children, ...props }: ComponentProps<any>) {
  return cloneElement(<>{children}</>, { ...props });
}
