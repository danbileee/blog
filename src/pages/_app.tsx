import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { GlobalContextProvider } from '@contexts/global';
import GlobalStyle from '@styles/GlobalStyle';
import { getMetaInfo } from '@utils/getMetaInfo';
import ThemeProvider from '@styles/ThemeProvider';

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const { title, description } = getMetaInfo(pathname) ?? {};

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${title} | Danbi Lee`}</title>
        <meta name="description" content={description} />
      </Head>
      <GlobalStyle />
      <ThemeProvider>
        <GlobalContextProvider>
          <Component {...pageProps} />
        </GlobalContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
