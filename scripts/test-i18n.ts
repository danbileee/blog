/* eslint-disable no-await-in-loop, no-restricted-syntax, no-loop-func -- compact state and preparation fixtures */
import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { randomBytes } from 'crypto';
import { spawnSync } from 'child_process';
import { prepare } from './prepare-content';
import { prepareSnapshot, ReadSource, retry } from '../src/lib/content/github';
import { localize, parseDocument, translationDocument } from '../src/lib/content/localize';
import { localDraftPosts, isLocalDevelopment } from '../src/lib/content/snapshot';
import { detectLocale } from '../src/i18n/detect';
import { localizeContentLink, switchLocale } from '../src/i18n/routes';
import { locales } from '../src/i18n/locales';
import { pageSEO } from '../src/lib/seo/page';
import { feedItems, rssXML } from '../src/lib/seo/rss';
import { sitemapXML } from '../src/lib/seo/sitemap';
import { getSlug } from '../src/utils/getSlug';

const ref = 'a'.repeat(40);
const marker = randomBytes(24).toString('hex');
const original = (flag = '') =>
  `---\ntitle: Original\ndescription: Korean description\npublishedAt: '2020-01-01'\nupdatedAt: '2020-01-02'\ntags: [web]\nogImage: 'https://example.com/image.png'\n${flag}\n---\nKorean body`;
const translated = (locale: string, extra = '') =>
  `---\nlocale: ${locale}\ntranslationStatus: complete\ntitle: ${locale} title\ndescription: ${locale} description\n${extra}\n---\n${locale} whole body`;
const files: Record<string, string> = {
  'posts/public.mdx': original(),
  'posts/public.en.mdx': translated('en'),
  'posts/public.ja.mdx': translated('ja', "translationPublishedAt: '2020-02-01T00:00:00Z'"),
  'posts/second.mdx': original('devOnly: false'),
  'posts/second.en.mdx': translated('en', 'publishedAt: invalid'),
  'posts/draft.mdx': original('devOnly: true').replace('Korean body', marker),
  'posts/draft.en.mdx': translated('en').replace('en whole body', marker),
  'posts/orphan.en.mdx': translated('en'),
  'careers/company.mdx':
    '---\ncompany: Company\ndescription: Career\nstartYear: 2020\n---\nKorean career',
  'careers/company.en.mdx':
    '---\ncompany: Company EN\ndescription: Career EN\nlocale: en\ntranslationStatus: complete\n---\nEnglish career',
};
function source(data: Record<string, string>): ReadSource {
  return async (request) => {
    if (request === '/commits/HEAD') return JSON.stringify({ sha: ref });
    if (request.startsWith('/git/trees/'))
      return JSON.stringify({
        truncated: false,
        tree: Object.keys(data).map((file) => ({ path: file, type: 'blob' })),
      });
    const file = request.slice('/contents/'.length).split('?')[0];
    assert(request.endsWith(`?ref=${ref}`));
    if (!(file in data)) throw new Error('Unexpected file request');
    return data[file];
  };
}
async function main() {
  const read = source(files);
  const snapshot = await prepareSnapshot(read);
  assert.deepStrictEqual(
    snapshot.posts.map((record) => record.slug),
    ['public', 'second'],
  );
  assert(!JSON.stringify(snapshot).includes(marker));
  const record = snapshot.posts[0];
  assert.equal(localize(record, 'en').state, 'available');
  assert.equal(localize(record, 'ja').content.body, 'ja whole body');
  assert.equal(localize(snapshot.posts[1], 'en').state, 'invalid');
  assert.equal(localize(snapshot.posts[1], 'ja').state, 'missing');
  assert.equal(localize(snapshot.posts[1], 'en').content.body, 'Korean body');
  assert.throws(() => parseDocument(original('devOnly: "false"'), 'posts'));
  const publicDraft = await prepareSnapshot(source({ ...files, 'posts/draft.mdx': original() }));
  assert(
    publicDraft.posts.some(
      (entry) => entry.slug === 'draft' && localize(entry, 'en').translationAvailable,
    ),
  );
  const completed = await prepareSnapshot(
    source({ ...files, 'posts/second.en.mdx': translated('en') }),
  );
  assert.equal(localize(completed.posts[1], 'en').state, 'available');
  const draftRecord = { ...record, original: parseDocument(original('devOnly: true'), 'posts') };
  const draftSEO = pageSEO(snapshot, 'article', 'en', draftRecord);
  assert(draftSEO.draft);
  assert.equal(draftSEO.canonical, null);
  assert.deepStrictEqual(draftSEO.alternates, []);
  assert.equal(isLocalDevelopment(), false);
  assert.deepStrictEqual(await localDraftPosts(snapshot), []);
  const invalidOptional = await prepareSnapshot(
    source({ ...files, 'posts/public.en.mdx': translated('en', 'tags: invalid') }),
  );
  assert.equal(localize(invalidOptional.posts[0], 'en').state, 'invalid');
  assert.equal(localize(invalidOptional.posts[0], 'en').content.body, 'Korean body');
  const changed = await prepareSnapshot(
    source({
      ...files,
      'posts/public.en.mdx': translated(
        'en',
        "translationPublishedAt: '2020-03-01T00:00:00Z'",
      ).replace('en title', 'Edited title'),
    }),
  );
  assert.equal(feedItems(changed, 'en')[0].date, '2020-03-01T00:00:00.000Z');
  assert.equal(feedItems(snapshot, 'en')[0].date, '2020-01-01');
  ['not-a-date', '2020-01-01T00:00:00', '2020-02-30T00:00:00Z', '2999-01-01T00:00:00Z'].forEach(
    (date) =>
      assert.throws(() =>
        translationDocument(
          translated('en', `translationPublishedAt: '${date}'`),
          record.original,
          'posts',
          'en',
        ),
      ),
  );
  assert.equal(
    translationDocument(
      translated('en', 'translationPublishedAt: 2020-03-01T00:00:00Z'),
      record.original,
      'posts',
      'en',
    ).translationPublishedAt,
    '2020-03-01T00:00:00.000Z',
  );
  [
    ['', 'ja-JP,en;q=0.9', 'ja'],
    ['NEXT_LOCALE=en', 'ko-KR', 'en'],
    ['NEXT_LOCALE=bad', 'en;q=0,ja;q=0.5', 'ja'],
    ['NEXT_LOCALE=%ZZ', 'en-US;q=0.5,ko;q=0.8', 'ko'],
    ['', 'ja;q=0.8,en;q=0.8', 'ja'],
    ['', '*,fr-FR', 'ko'],
    ['', 'ja;q=bad,en;q=0', 'ko'],
  ].forEach(([cookie, header, expected]) => assert.equal(detectLocale(cookie, header), expected));
  assert.equal(switchLocale('/ko/blog/public?a=1#section', 'ja'), '/ja/blog/public?a=1#section');
  assert.equal(
    localizeContentLink('https://danbileee.com/blog/public?a=1#section', 'en'),
    '/en/blog/public?a=1#section',
  );
  [
    'https://other.com/blog/public',
    'https://danbileee.com.other.com/blog/public',
    'mailto:hello@example.com',
    '#heading',
    '/logo.png',
    '/rss.xml',
    '/api/posts',
  ].forEach((link) => assert.equal(localizeContentLink(link, 'en'), link));
  assert.equal(localizeContentLink('/about', 'ja'), '/ja/career');
  assert.equal(
    getSlug('https://api.github.com/repos/danbileee/blog-docs/contents/posts%2Fpublic.mdx'),
    'public',
  );
  assert.equal(
    pageSEO(snapshot, 'article', 'en', record).canonical,
    'https://danbileee.com/en/blog/public',
  );
  assert.deepStrictEqual(
    pageSEO(snapshot, 'article', 'ja', record).alternates.map((item) => item.locale),
    ['ko', 'en', 'ja'],
  );
  assert.equal(pageSEO(snapshot, 'article', 'en', snapshot.posts[1]).canonical, null);
  assert.equal(pageSEO(snapshot, 'career', 'en').indexable, true);
  assert.equal(pageSEO(snapshot, 'career', 'ja').indexable, false);
  for (const state of [snapshot, completed, { ...snapshot, posts: [] }]) {
    assert.equal(pageSEO(state, 'blog', 'en').indexable, false);
    assert.equal(pageSEO(state, 'blog', 'ja').canonical, null);
  }
  assert.equal(pageSEO(snapshot, 'home', 'ja').alternates[3].url, 'https://danbileee.com/');
  const xml: string[] = [sitemapXML(snapshot)];
  locales.forEach((locale) => {
    const feed = rssXML(snapshot, locale);
    assert.equal(feed, rssXML(snapshot, locale));
    assert.equal(
      JSON.parse(
        spawnSync(
          'python3',
          [
            '-c',
            'import sys,json,xml.etree.ElementTree as E; print(json.dumps(E.fromstring(sys.stdin.read()).findtext("channel/language")))',
          ],
          { input: feed, encoding: 'utf8' },
        ).stdout,
      ),
      locale,
    );
    assert(!feed.includes(marker));
    xml.push(feed);
  });
  const guid = /<guid[^>]*>([^<]+)<\/guid>/;
  assert.equal(rssXML(snapshot, 'en').match(guid)![1], rssXML(changed, 'en').match(guid)![1]);
  const empty = {
    ...snapshot,
    posts: snapshot.posts.map((entry) => ({ ...entry, translations: {} })),
  };
  xml.push(rssXML(empty, 'en'), rssXML(empty, 'ja'));
  assert(!rssXML(empty, 'en').includes('<item>'));
  const validation = spawnSync(
    'python3',
    [
      '-c',
      'import sys,json,xml.etree.ElementTree as E; [E.fromstring(x) for x in json.load(sys.stdin)]',
    ],
    { input: JSON.stringify(xml), encoding: 'utf8' },
  );
  assert.equal(validation.status, 0, validation.stderr);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-prepare-'));
  try {
    let attempts = 0;
    for (const failure of ['fetch', 'inventory']) {
      fs.mkdirSync(path.join(temp, '.cache/i18n'), { recursive: true });
      fs.writeFileSync(path.join(temp, '.cache/i18n/ready'), 'stale');
      fs.mkdirSync(path.join(temp, 'public'), { recursive: true });
      fs.writeFileSync(path.join(temp, 'public/rss.xml'), 'stale');
      const bad: ReadSource =
        failure === 'fetch'
          ? () =>
              retry(
                async () => {
                  attempts += 1;
                  throw new Error('Transient');
                },
                async () => Promise.resolve(),
              )
          : async (request) =>
              request.startsWith('/commits/')
                ? JSON.stringify({ sha: ref })
                : JSON.stringify({ truncated: true, tree: [] });
      await assert.rejects(prepare(temp, bad));
      assert(!fs.existsSync(path.join(temp, '.cache/i18n/ready')));
      assert(!fs.existsSync(path.join(temp, 'public/rss.xml')));
    }
    assert.equal(attempts, 3);
    await prepare(temp, read);
    assert.equal(fs.readFileSync(path.join(temp, '.cache/i18n/ready'), 'utf8'), ref);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
  console.log('Focused i18n/content/routing/SEO/RSS/preparation assertions passed.');
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
