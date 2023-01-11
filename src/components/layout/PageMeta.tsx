import { theme } from '@styles/ThemeProvider';
import Head from 'next/head';

interface Props {
  title: string;
  description: string;
}

export default function PageMeta({ title, description }: Props) {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{`${title} | Danbi Lee`}</title>
      <meta name="description" content={description} />
      <meta
        name="msapplication-TileColor"
        content={theme.colors.cornflowerblue}
      />
      <meta name="theme-color" content={theme.colors.white} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/safari-pinned-tab.svg"
        color={theme.colors.skyblue}
      />
    </Head>
  );
}
