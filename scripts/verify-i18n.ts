/* eslint-disable no-await-in-loop, no-restricted-syntax -- focused serial HTTP/artifact verification */
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { readSnapshot } from '../src/lib/content/snapshot';
import { sourceInventory, loadRecords } from '../src/lib/content/github';
import { locales } from '../src/i18n/locales';
import { feedPath } from '../src/constants/site';
import { pageSEO } from '../src/lib/seo/page';
import { sitemapEntries } from '../src/lib/seo/sitemap';
import { request, parseXML, checkSEO, draftSlugs } from './smoke-helpers';

const baseline = JSON.parse(fs.readFileSync('docs/20261014_i18n/rss-baseline.json', 'utf8'));
const base = process.argv[2] ?? 'http://127.0.0.1:3000';
function filesUnder(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .flatMap((item) =>
      item.isDirectory() ? filesUnder(path.join(root, item.name)) : [path.join(root, item.name)],
    );
}
async function main() {
  createRequire(require.resolve('next/package.json'))('@next/env').loadEnvConfig(process.cwd());
  const snapshot = readSnapshot();
  const slugs = snapshot.posts.map((record) => record.slug).sort();
  assert.deepStrictEqual(
    slugs,
    baseline.map((item: { slug: string }) => item.slug).sort(),
    'Published slug regression',
  );
  const manifest = JSON.parse(fs.readFileSync('.next/prerender-manifest.json', 'utf8'));
  const expected = locales
    .flatMap((locale) => [
      `/${locale}`,
      `/${locale}/career`,
      `/${locale}/blog`,
      ...slugs.map((slug) => `/${locale}/blog/${slug}`),
    ])
    .sort();
  assert.deepStrictEqual(Object.keys(manifest.routes).sort(), expected);
  for (const route of expected) {
    const file = `.next/server/pages${route}.html`;
    assert(fs.readFileSync(file, 'utf8').includes(`<html lang="${route.split('/')[1]}"`));
  }
  // Read draft markers only in memory at the same ref, never write a raw-source cache.
  const { ref, files } = await sourceInventory(undefined, snapshot.ref);
  const drafts = await loadRecords(ref, files, undefined, true);
  assert.deepStrictEqual(
    drafts
      .filter((record) => record.kind === 'posts')
      .map((record) => record.slug)
      .sort(),
    [...draftSlugs].sort(),
  );
  const markers: string[] = [];
  drafts.forEach((record) => {
    markers.push(
      `/${record.kind}/${record.slug}`,
      record.kind === 'posts' ? `/${record.slug}` : `careers/${record.slug}.mdx`,
    );
    const documents = [record.original, ...Object.values(record.translations)];
    documents.forEach((doc) => {
      if (!doc) return;
      const meta = doc.meta as unknown as { title?: string; company?: string };
      if (meta.title) markers.push(meta.title);
      doc.body
        .split('\n')
        .filter((line) => line.trim().length > 60)
        .slice(0, 3)
        .forEach((line) => markers.push(line.trim()));
    });
  });
  const token = process.env.GITHUB_ACCESS_TOKEN;
  const scan = [
    ...filesUnder('.next'),
    ...filesUnder('.cache/i18n'),
    'public/sitemap.xml',
    ...locales.map((locale) => `public${feedPath(locale)}`),
  ];
  let bytes = 0;
  for (const file of scan) {
    const content = fs.readFileSync(file);
    bytes += content.length;
    const text = content.toString('utf8');
    for (const marker of markers)
      assert(
        !text.includes(marker) && !text.includes(JSON.stringify(marker).slice(1, -1)),
        `Draft leakage in ${file}`,
      );
    if (token) assert(!text.includes(token), `Credential leakage in ${file}`);
  }
  for (const [headers, destination] of [
    [{ 'Accept-Language': 'ja-JP,en;q=0.8' }, '/ja'],
    [{ Cookie: 'NEXT_LOCALE=en', 'Accept-Language': 'ko-KR' }, '/en'],
    [{ Cookie: 'NEXT_LOCALE=invalid', 'Accept-Language': 'fr;q=1,en;q=0' }, '/ko'],
  ] as const) {
    const res = await request(base, '/?utm_source=verify', headers);
    assert.equal(res.status, 307);
    assert.equal(res.headers.location, `${destination}?utm_source=verify`);
    assert.equal(res.headers['cache-control'], 'private, no-store');
    assert(
      String(res.headers.vary).includes('Cookie') &&
        String(res.headers.vary).includes('Accept-Language'),
    );
  }
  for (const [old, target] of [
    ['/about', '/ko/career'],
    ['/career', '/ko/career'],
    ['/blog', '/ko/blog'],
    ...slugs.map((slug) => [`/blog/${slug}`, `/ko/blog/${slug}`]),
  ]) {
    const res = await request(base, old);
    assert.equal(res.status, 308, old);
    assert.equal(res.headers.location, target);
    assert.equal((await request(base, target)).status, 200, target);
  }
  const query = await request(base, `/blog/${slugs[0]}?utm_source=x`);
  assert.equal(query.headers.location, `/ko/blog/${slugs[0]}?utm_source=x`);
  for (const locale of locales) {
    for (const kind of ['home', 'career', 'blog', 'article'] as const) {
      const record = snapshot.posts[0];
      let pathname = `/${locale}/${kind}`;
      if (kind === 'home') pathname = `/${locale}`;
      if (kind === 'article') pathname = `/${locale}/blog/${record.slug}`;
      const res = await request(base, pathname, {
        Cookie: 'NEXT_LOCALE=ja',
        'Accept-Language': 'en-US',
      });
      assert.equal(res.status, 200, pathname);
      checkSEO(
        res.body,
        locale,
        pathname,
        pageSEO(snapshot, kind, locale, kind === 'article' ? record : undefined).indexable,
      );
      if (kind === 'home') assert(res.body.includes('hrefLang="x-default"'));
      if (kind === 'article' && locale !== 'ko') {
        assert(res.body.includes('<article lang="ko"'));
        assert(res.body.includes('og:locale" content="ko_KR"'));
      }
    }
    assert.equal(
      (await request(base, `/${locale}/blog/${draftSlugs[0]}?preview=1&includeDrafts=true`)).status,
      404,
    );
    assert.equal((await request(base, `/${locale}/blog/unknown-slug`)).status, 404);
  }
  const buildId = fs.readFileSync('.next/BUILD_ID', 'utf8');
  assert.equal(
    (await request(base, `/_next/data/${buildId}/en/blog/${draftSlugs[0]}.json?preview=1`)).status,
    404,
  );
  for (const locale of locales) {
    const feed = await request(base, feedPath(locale));
    assert.equal(feed.status, 200);
    assert(String(feed.headers['content-type']).startsWith('application/rss+xml'));
    const parsed = parseXML(feed.body);
    assert.equal(parsed.language, locale);
    if (locale === 'ko')
      assert.deepStrictEqual(
        parsed.items,
        baseline,
        'Historical RSS GUID/date/order/permalink compatibility',
      );
    else assert.deepStrictEqual(parsed.items, []);
  }
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
  for (const resource of ['/logo.png', '/site.webmanifest'])
    assert.equal((await request(base, resource)).status, 200);
  assert.equal((await request(base, '/api/unknown')).status, 404);
  assert.equal((await request(base, '/fr')).status, 404);
  const staticFile = filesUnder('.next/static').find((file) => file.endsWith('.js'))!;
  assert.equal((await request(base, staticFile.replace('.next', '/_next'))).status, 200);
  console.log(
    `Production artifact and HTTP gates passed: ${expected.length} static pages, ${scan.length} scanned files (${bytes} bytes), ${slugs.length} legacy articles, three feeds.`,
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
