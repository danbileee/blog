import '@emotion/react';
import { ThemeType } from '@styles/ThemeProvider';

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends ThemeType {}
}
