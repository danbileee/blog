import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { prepareSnapshot, ReadSource, requestCount } from '../src/lib/content/github';
import { locales } from '../src/i18n/locales';
import { feedPath } from '../src/constants/site';
import { sitemapXML } from '../src/lib/seo/sitemap';
import { rssXML } from '../src/lib/seo/rss';
// A small parser keeps XML validation available on Node-only deployment hosts.
const sax = createRequire(__filename)('sax') as {
  parser: (strict: boolean) => { write: (xml: string) => { close: () => void } };
};

const { loadEnvConfig } = createRequire(require.resolve('next/package.json'))('@next/env');

export async function prepare(root: string, read?: ReadSource, ref?: string) {
  const cache = path.join(root, '.cache/i18n');
  fs.rmSync(cache, { recursive: true, force: true });
  const outputs = ['public/sitemap.xml', ...locales.map((locale) => `public${feedPath(locale)}`)];
  outputs.forEach((file) => fs.rmSync(path.join(root, file), { force: true }));
  const stage = path.join(cache, 'stage');
  fs.mkdirSync(stage, { recursive: true });
  try {
    const snapshot = await prepareSnapshot(read, ref);
    fs.writeFileSync(path.join(stage, 'content.json'), JSON.stringify(snapshot));
    const xml = [sitemapXML(snapshot), ...locales.map((locale) => rssXML(snapshot, locale))];
    // XML is emitted only by the RSS serializer and our escaping sitemap writer.
    // Reject invalid XML characters before marking the complete output ready.
    // eslint-disable-next-line no-control-regex -- XML 1.0 forbids these characters.
    if (xml.some((value) => /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/.test(value)))
      throw new Error('Invalid XML characters');
    xml.forEach((value) => sax.parser(true).write(value).close());
    outputs.forEach((file, index) => {
      const dest = path.join(root, file);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(path.join(stage, `asset-${index}`), xml[index]);
      fs.renameSync(path.join(stage, `asset-${index}`), dest);
    });
    fs.renameSync(path.join(stage, 'content.json'), path.join(cache, 'content.json'));
    fs.writeFileSync(path.join(cache, 'ready'), snapshot.ref);
    fs.rmSync(stage, { recursive: true, force: true });
    return snapshot;
  } catch (error) {
    fs.rmSync(cache, { recursive: true, force: true });
    outputs.forEach((file) => fs.rmSync(path.join(root, file), { force: true }));
    throw error;
  }
}
if (require.main === module) {
  loadEnvConfig(process.cwd());
  // Only build-owned output: dev HTML/data must not survive a production build.
  fs.rmSync(path.join(process.cwd(), '.next'), { recursive: true, force: true });
  const start = Date.now();
  prepare(process.cwd(), undefined, process.env.CONTENT_REF)
    .then((snapshot) => {
      console.log(
        `Prepared ${snapshot.posts.length} posts, ${snapshot.careers.length} careers at ${
          snapshot.ref
        }; ${requestCount()} GitHub requests; ${Date.now() - start}ms`,
      );
    })
    .catch((error) => {
      console.error(
        `Content preparation failed: ${error.message}; no ready snapshot or generated assets retained.`,
      );
      process.exitCode = 1;
    });
}
