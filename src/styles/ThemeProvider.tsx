import { PropsWithChildren } from 'react';
import { ThemeProvider as Provider } from '@emotion/react';

const theme = {
  colors: {
    primary: '#47f6cb',
    secondary: '#4263eb',
    gray900: '#121111',
    gray300: '#c4c4c4',
    gray100: '#f5f5f5',
    white: '#ffffff',
  },
};

export type ThemeType = typeof theme;

export default function ThemeProvider({
  children,
}: PropsWithChildren<unknown>) {
  return <Provider theme={theme}>{children}</Provider>;
}
