import { AppProps, NextWebVitalsMetric } from 'next/app';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics, event } from 'nextjs-google-analytics';

import { GlobalContextProvider } from '@contexts/global';
import GlobalStyle from '@styles/GlobalStyle';
import ThemeProvider from '@styles/ThemeProvider';
import Layout from '@components/layout';
import PageMeta from '@components/layout/PageMeta';
import { isLocale } from '../i18n/locales';
import { LocaleContext } from '../i18n/context';

export function reportWebVitals({ id, name, label, value }: NextWebVitalsMetric) {
  event(name, {
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

function App({ Component, pageProps }: AppProps) {
  const locale = isLocale(pageProps.locale) ? pageProps.locale : 'ko';
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics trackPageViews={{ ignoreHashChange: true }} />
      )}
      {pageProps.seo && <PageMeta seo={pageProps.seo} />}
      <GlobalStyle />
      <ThemeProvider>
        <GlobalContextProvider>
          <LocaleContext.Provider value={locale}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </LocaleContext.Provider>
        </GlobalContextProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </>
  );
}

export default App;
