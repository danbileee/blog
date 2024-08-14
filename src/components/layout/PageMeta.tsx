import { theme } from '@styles/ThemeProvider';
import Head from 'next/head';

interface Props {
  title: string;
  description: string;
  tags?: string[];
  category?: string;
  ogImage?: string;
}

export default function PageMeta({ title, description, tags = [], category, ogImage }: Props) {
  const siteName = `${title} | Danbi Lee`;
  const ogTitle = `${category ? `${category} - ` : ''}${title}`;

  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{siteName}</title>
      <meta property="og:type" content={ogImage ? 'blog' : 'website'} />
      <meta property="og:url" content="https://danbileee.com/" />
      <meta property="og:title" name="title" content={ogTitle} />
      <meta property="og:description" name="description" content={description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ko_KR" />
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="400" />
          <meta property="og:image:height" content="224" />
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
      <script
        id="yess-widget-script"
        async
        dangerouslySetInnerHTML={{
          __html: `(function (w, d, m, i) {
    s = d.createElement("script");
    s.src = m;
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);
    s.onload = function () {
      if (!w.yessWidget) return;
      w.yessWidget.init(i);
    }
  })(window, document, "https://cdn.betacat.app/sdk/main/main.js", "UOsR-zcs_y4w-lb6Bn4TU");`,
        }}
      />
    </Head>
  );
}
