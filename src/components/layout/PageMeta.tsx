import { theme } from '@styles/ThemeProvider';
import Head from 'next/head';
import type { PageSEO } from '../../lib/seo/page';
import { feedPath, productionOrigin } from '../../constants/site';
import { messages } from '../../i18n/messages';

export default function PageMeta({ seo }: { seo: PageSEO }) {
  const { title, description, tags, ogImage, locale, contentLocale } = seo;
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{`${title} | Danbi Lee`}</title>
      <meta name="description" content={description} key="description" />
      <meta
        name="robots"
        content={seo.indexable ? 'index,follow' : 'noindex,follow'}
        key="robots"
      />
      {seo.canonical && <link rel="canonical" href={seo.canonical} key="canonical" />}
      {seo.alternates.map((alternate) => (
        <link
          rel="alternate"
          hrefLang={alternate.locale}
          href={alternate.url}
          key={`language-${alternate.locale}`}
        />
      ))}
      {!seo.draft && (
        <>
          {' '}
          <link
            rel="alternate"
            type="application/rss+xml"
            title={messages[locale].rss}
            href={`${productionOrigin}${feedPath(locale)}`}
            key="rss"
          />
        </>
      )}
      <meta property="og:type" content={seo.type} />
      {!seo.draft && <meta property="og:url" content={seo.url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Danbi Lee" />
      <meta
        property="og:locale"
        content={{ ko: 'ko_KR', en: 'en_US', ja: 'ja_JP' }[contentLocale]}
      />
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="400" />
          <meta property="og:image:height" content="224" />
          <meta name="twitter:image" content={ogImage} />
        </>
      )}
      {Boolean(tags?.length) && <meta name="keywords" content={tags.join(',')} />}
      <meta name="msapplication-TileColor" content={theme.colors.cornflowerblue} />
      <meta name="theme-color" content={theme.colors.white} />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color={theme.colors.skyblue} />
      {process.env.NODE_ENV === 'production' && (
        <script
          id="yess-widget-script"
          dangerouslySetInnerHTML={{
            __html: `(function (w, d, m, i) { var s = d.createElement("script"); s.src = m; s.async = true; d.getElementsByTagName("head")[0].appendChild(s); s.onload = function () { if (w.yessWidget) w.yessWidget.init(i); }; })(window, document, "https://cdn.yess.io/sdk/main/main.js", "xL0JVCxJpMNIKlqocDDWL");`,
          }}
        />
      )}
    </Head>
  );
}
