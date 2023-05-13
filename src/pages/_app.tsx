import { AppProps, NextWebVitalsMetric } from 'next/app';
import { useRouter } from 'next/router';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics, event } from 'nextjs-google-analytics';

import { GlobalContextProvider } from '@contexts/global';
import GlobalStyle from '@styles/GlobalStyle';
import { getMetaInfo } from '@utils/getMetaInfo';
import ThemeProvider from '@styles/ThemeProvider';
import Layout from '@components/layout';
import PageMeta from '@components/layout/PageMeta';

export function reportWebVitals({ id, name, label, value }: NextWebVitalsMetric) {
  event(name, {
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const { value, isDynamic } = getMetaInfo(pathname) ?? {};
  const { title, description } = value ?? {};

  return (
    <>
      <GoogleAnalytics trackPageViews={{ ignoreHashChange: true }} />
      {!isDynamic && <PageMeta title={title} description={description} />}
      <GlobalStyle />
      <ThemeProvider>
        <GlobalContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </GlobalContextProvider>
      </ThemeProvider>
      <Analytics />
    </>
  );
}

export default App;
