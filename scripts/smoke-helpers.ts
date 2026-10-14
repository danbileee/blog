import assert from 'assert';
import http from 'http';
import https from 'https';
import { spawnSync } from 'child_process';
import { productionOrigin } from '../src/constants/site';

export const draftSlugs = [
  'computer101-01-introduction',
  'how-to-use-useeffect',
  'regex-01-introduction',
  'regex-02-find-one-char',
  'regex-03-find-by-char-set',
  'shortqna-what-is-generator',
  'to-automate-or-not-to',
];
export function request(base: string, pathname: string, headers: http.OutgoingHttpHeaders = {}) {
  const url = new URL(pathname, base);
  assert(['http:', 'https:'].includes(url.protocol));
  return new Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }>(
    (resolve, reject) => {
      const req = (url.protocol === 'https:' ? https : http).get(url, { headers }, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (data) => {
          body += data;
        });
        res.on('end', () => resolve({ status: res.statusCode!, headers: res.headers, body }));
        res.on('error', reject);
      });
      req.setTimeout(15000, () => req.destroy(new Error(`Timed out: ${pathname}`)));
      req.on('error', reject);
    },
  );
}
export function parseXML(xml: string) {
  const result = spawnSync(
    'python3',
    [
      '-c',
      `import sys,json,xml.etree.ElementTree as E
r=E.fromstring(sys.stdin.read())
if r.tag=='rss':
 c=r.find('channel'); items=[]
 for x in c.findall('item'):
  g=x.find('guid'); items.append({'slug':x.findtext('link').rsplit('/',1)[-1],'guid':g.text,'isPermaLink':g.get('isPermaLink'),'pubDate':x.findtext('pubDate')})
 print(json.dumps({'language':c.findtext('language'),'items':items}))
else: print(json.dumps([x.text for x in r.findall('{*}url/{*}loc')]))`,
    ],
    { input: xml, encoding: 'utf8' },
  );
  assert.equal(result.status, 0, 'XML must parse');
  return JSON.parse(result.stdout);
}
export function checkSEO(body: string, locale: string, path: string, indexable: boolean) {
  assert(body.includes(`<html lang="${locale}"`), `HTML language: ${path}`);
  const canonical = body.match(/<link rel="canonical" href="([^"]+)"/);
  if (indexable) {
    assert.equal(canonical?.[1], `${productionOrigin}${path}`);
    assert(/name="robots" content="index,follow"/.test(body));
  } else {
    assert(!canonical, `No fallback canonical: ${path}`);
    assert(!body.includes('hrefLang='), `No fallback hreflang: ${path}`);
    assert(/name="robots" content="noindex,follow"/.test(body));
  }
  assert(body.includes(`type="application/rss+xml"`), `RSS discovery: ${path}`);
}
