import { GetServerSideProps } from 'next';
import { detectLocale } from '../i18n/detect';

export const getServerSideProps: GetServerSideProps = async ({ req, res, resolvedUrl }) => {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Cookie, Accept-Language');
  const locale = detectLocale(req.headers.cookie, req.headers['accept-language']);
  const query = resolvedUrl.includes('?') ? resolvedUrl.slice(resolvedUrl.indexOf('?')) : '';
  return { redirect: { destination: `/${locale}${query}`, permanent: false } };
};
export default function Entry() {
  return null;
}
