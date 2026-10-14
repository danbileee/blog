import { GetStaticPropsContext } from 'next';
import styled from '@emotion/styled';
import CareerMeta from '@components/about/CareerMeta';
import mediaQuery from '@styles/mediaQuery';
import { Career } from '@constants/types';
import Markdown from '@components/markdown';
import TranslationUnavailableBanner from '@components/shared/TranslationUnavailableBanner';
import { locales, isLocale, Locale } from '../../i18n/locales';
import { readSnapshot } from '../../lib/content/snapshot';
import { localize } from '../../lib/content/localize';
import { pageSEO } from '../../lib/seo/page';

interface Entry {
  career: Career;
  contentLocale: Locale;
}
export default function CareerPage({ careers }: { careers: Entry[] }) {
  return (
    <>
      {careers.some((entry) => entry.contentLocale === 'ko') && (
        <TranslationUnavailableBanner career />
      )}
      <CareerList>
        {careers.map(({ career, contentLocale }) => (
          <li key={career.id} lang={contentLocale}>
            <CareerMeta career={career} />
            <Markdown content={career.content} withHeadlineAnchor />
          </li>
        ))}
      </CareerList>
    </>
  );
}
export function getStaticPaths() {
  return { paths: locales.map((locale) => ({ params: { locale } })), fallback: false };
}
export function getStaticProps({ params }: GetStaticPropsContext) {
  if (!params || !isLocale(params.locale)) return { notFound: true };
  const { locale } = params;
  const snapshot = readSnapshot();
  const careers = snapshot.careers
    .map((record) => {
      const result = localize(record, locale);
      return {
        career: { ...result.content.meta, id: record.id, content: result.content.body } as Career,
        contentLocale: result.contentLocale,
      };
    })
    .sort((a, b) => Number(b.career.startYear) - Number(a.career.startYear));
  return { props: { locale, careers, seo: pageSEO(snapshot, 'career', locale) } };
}
const CareerList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 200px;
  ${mediaQuery.mobile} {
    gap: 160px;
  }
`;
