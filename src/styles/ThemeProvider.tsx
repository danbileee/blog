import { PropsWithChildren } from 'react';
import { ThemeProvider as Provider } from '@emotion/react';

export const theme = {
  colors: {
    purple: '#B200E9',
    cornflowerblue: '#4263eb',
    skyblue: '#47f6cb',
    green: '#94D82D',
    yellow: '#FFF30D',
    orange: '#FD7E14',
    red: '#F03E3E',
    gray900: '#121111',
    gray800: '#272822',
    gray600: '#757575',
    gray300: '#c4c4c4',
    gray200: '#e1e1e1',
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
