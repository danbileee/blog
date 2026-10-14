import { GetStaticPropsContext } from 'next';
import styled from '@emotion/styled';
import mediaQuery from '@styles/mediaQuery';
import { locales, isLocale, Locale } from '../../i18n/locales';
import { messages } from '../../i18n/messages';
import { readSnapshot } from '../../lib/content/snapshot';
import { pageSEO } from '../../lib/seo/page';

export default function Home({ locale }: { locale: Locale }) {
  const text = messages[locale];
  return (
    <Container>
      <Title>{text.heading}</Title>
      {text.paragraphs.map((paragraph) => (
        <Text key={paragraph}>{paragraph}</Text>
      ))}
      <Text>
        {text.furiganaBefore}
        <Link href="https://furigana.app" target="_blank" rel="noopener noreferrer">
          Furigana
        </Link>
        {text.furiganaAfter}
      </Text>
    </Container>
  );
}
export function getStaticPaths() {
  return { paths: locales.map((locale) => ({ params: { locale } })), fallback: false };
}
export function getStaticProps({ params }: GetStaticPropsContext) {
  if (!params || !isLocale(params.locale)) return { notFound: true };
  const { locale } = params;
  return { props: { locale, seo: pageSEO(readSnapshot(), 'home', locale) } };
}
const Container = styled.div`
  width: 100%;
`;
const Title = styled.h1`
  font-weight: 900;
  font-size: 36px;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin-bottom: 32px;
  ${mediaQuery.mobile} {
    font-size: 26px;
  }
`;
const Link = styled.a`
  text-decoration: underline;
  text-underline-offset: 2px;
  &:hover {
    color: var(--cornflowerblue);
  }
`;
const Text = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 10px;
  ${mediaQuery.mobile} {
    font-size: 16px;
  }
`;
