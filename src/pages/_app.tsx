import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { GlobalContextProvider } from '@contexts/global';
import GlobalStyle from '@styles/GlobalStyle';
import { getMetaInfo } from '@utils/getMetaInfo';
import ThemeProvider from '@styles/ThemeProvider';
import Layout from '@components/layout';
import PageMeta from '@components/layout/PageMeta';

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const { value } = getMetaInfo(pathname) ?? {};
  const { title, description } = value ?? {};

  return (
    <>
      <PageMeta title={title} description={description} />
      <GlobalStyle />
      <ThemeProvider>
        <GlobalContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </GlobalContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
