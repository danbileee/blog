import Document, { Html, Head, Main, NextScript } from 'next/document';
import { isLocale } from '../i18n/locales';

class MyDocument extends Document {
  render() {
    // eslint-disable-next-line no-underscore-dangle -- Next 12 serializes page props here.
    const locale = this.props.__NEXT_DATA__.props.pageProps?.locale;
    return (
      <Html lang={isLocale(locale) ? locale : 'ko'}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
