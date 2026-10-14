/* eslint-disable no-await-in-loop, no-restricted-syntax -- minimal deployment delivery probe */
import assert from 'assert';
import fs from 'fs';
import { request, parseXML, checkSEO, draftSlugs } from './smoke-helpers';
import { locales } from '../src/i18n/locales';
import { feedPath } from '../src/constants/site';
import { readSnapshot } from '../src/lib/content/snapshot';
import { pageSEO } from '../src/lib/seo/page';
import { sitemapEntries } from '../src/lib/seo/sitemap';

async function main() {
  const base = process.argv[2];
  assert(base, 'Usage: yarn probe:deployment https://preview-or-production-host');
  const snapshot = readSnapshot();
  const { slug } = snapshot.posts[0];
  for (const [headers, target] of [
    [{ 'Accept-Language': 'ja-JP' }, '/ja'],
    [{ Cookie: 'NEXT_LOCALE=en', 'Accept-Language': 'ko-KR' }, '/en'],
  ] as const) {
    const res = await request(base, '/', headers);
    assert.equal(res.status, 307);
    assert.equal(res.headers.location, target);
    assert(String(res.headers['cache-control']).includes('no-store'));
    assert(
      String(res.headers.vary).includes('Cookie') &&
        String(res.headers.vary).includes('Accept-Language'),
    );
  }
  for (const [old, target] of [
    ['/about', '/ko/career'],
    ['/blog', '/ko/blog'],
    [`/blog/${slug}`, `/ko/blog/${slug}`],
  ]) {
    const res = await request(base, old);
    assert.equal(res.status, 308);
    assert.equal(res.headers.location, target);
    assert.equal((await request(base, target)).status, 200);
  }
  for (const locale of locales) {
    const path = `/${locale}/blog/${slug}`;
    const res = await request(base, path);
    assert.equal(res.status, 200);
    checkSEO(
      res.body,
      locale,
      path,
      pageSEO(snapshot, 'article', locale, snapshot.posts[0]).indexable,
    );
    assert.equal((await request(base, `/${locale}/blog/${draftSlugs[0]}`)).status, 404);
    const feed = await request(base, feedPath(locale));
    assert.equal(feed.status, 200);
    assert(String(feed.headers['content-type']).startsWith('application/rss+xml'));
    const xml = parseXML(feed.body);
    assert.equal(xml.language, locale);
    if (locale === 'ko')
      assert.deepStrictEqual(
        xml.items,
        JSON.parse(fs.readFileSync('docs/20261014_i18n/rss-baseline.json', 'utf8')),
      );
  }
  for (const locale of ['en', 'ja'] as const) {
    const path = `/${locale}/blog`;
    const res = await request(base, path);
    assert.equal(res.status, 200);
    checkSEO(res.body, locale, path, false);
  }
  const translated = snapshot.posts.find(
    (record) => record.translations.en || record.translations.ja,
  );
  if (translated) {
    const locale = translated.translations.en ? 'en' : 'ja';
    const pathname = `/${locale}/blog/${translated.slug}`;
    const res = await request(base, pathname);
    assert.equal(res.status, 200);
    checkSEO(res.body, locale, pathname, true);
  }
  const draft = await request(base, `/blog/${draftSlugs[0]}`);
  assert.equal(draft.status, 308);
  assert.equal((await request(base, draft.headers.location!)).status, 404);
  const sitemap = await request(base, '/sitemap.xml');
  assert.equal(sitemap.status, 200);
  assert.deepStrictEqual(
    parseXML(sitemap.body).sort(),
    sitemapEntries(snapshot)
      .map((item) => item.url)
      .sort(),
  );
  const robots = await request(base, '/robots.txt');
  assert.equal(robots.status, 200);
  assert(robots.body.includes('Sitemap: https://danbileee.com/sitemap.xml'));
  assert(!/^Disallow:\s*\//m.test(robots.body));
  console.log(
    'Deployment routing/cache/privacy/SEO/RSS probe passed. Confirm provider build/start settings separately.',
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
