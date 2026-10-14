/* eslint-disable no-await-in-loop, no-restricted-syntax, no-continue -- bounded server-only fetch workers and retries */
import https from 'https';
import { ContentKind, ContentRecord, Snapshot } from './types';
import { parseDocument, translateDocument, TranslationValidationError } from './localize';
import { Locale } from '../../i18n/locales';

const repo = '/repos/danbileee/blog-docs';
export async function retry<T>(
  operation: () => Promise<T>,
  pause = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)),
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const { status } = error as { status?: number };
      if (attempt === 2 || (status && status < 500 && ![403, 429].includes(status))) throw error;
      await pause(250 * (attempt + 1));
    }
  }
}
let requests = 0;
export function requestCount() {
  return requests;
}
export function githubRequest(path: string, raw = false): Promise<string> {
  return retry(
    () =>
      new Promise((resolve, reject) => {
        requests += 1;
        const token = process.env.GITHUB_ACCESS_TOKEN;
        const req = https.get(
          {
            hostname: 'api.github.com',
            path: `${repo}${path}`,
            headers: {
              'User-Agent': 'danbi-blog-build',
              Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              'X-GitHub-Api-Version': '2022-11-28',
            },
          },
          (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
              body += chunk;
            });
            res.on('end', () => {
              if (res.statusCode !== 200)
                reject(
                  Object.assign(new Error(`GitHub request failed (${res.statusCode})`), {
                    status: res.statusCode,
                  }),
                );
              else resolve(body);
            });
            res.on('error', reject);
          },
        );
        req.setTimeout(15000, () => req.destroy(new Error('GitHub request timed out')));
        req.on('error', reject);
      }),
  );
}
interface TreeEntry {
  path: string;
  type: string;
}
export type ReadSource = (path: string, raw?: boolean) => Promise<string>;
export async function sourceInventory(read: ReadSource = githubRequest, pinnedRef?: string) {
  const ref = pinnedRef ?? JSON.parse(await read('/commits/HEAD')).sha;
  if (!/^[a-f0-9]{40}$/.test(ref)) throw new Error('Invalid source commit');
  const tree = JSON.parse(await read(`/git/trees/${ref}?recursive=1`));
  if (tree.truncated !== false || !Array.isArray(tree.tree))
    throw new Error('Incomplete source tree');
  const entries: TreeEntry[] = tree.tree;
  const files = entries.filter((entry) => /^(posts|careers)\/[^/]+\.mdx$/.test(entry.path));
  if (
    !files.length ||
    files.some((entry) => entry.type !== 'blob') ||
    !files.some((entry) => entry.path.startsWith('posts/')) ||
    !files.some((entry) => entry.path.startsWith('careers/'))
  )
    throw new Error('Invalid content inventory');
  if (new Set(files.map((entry) => entry.path)).size !== files.length)
    throw new Error('Duplicate source identity');
  return { ref: ref as string, files: files.map((entry) => entry.path) };
}
export async function loadRecords(
  ref: string,
  files: string[],
  read: ReadSource = githubRequest,
  draftsOnly = false,
) {
  const originals = files.filter((path) => !/\.(en|ja)\.mdx$/.test(path));
  if (['posts', 'careers'].some((kind) => !originals.some((file) => file.startsWith(`${kind}/`))))
    throw new Error('Missing original inventory');
  const result: ContentRecord[] = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, originals.length) }, async () => {
      while (cursor < originals.length) {
        const path = originals[cursor];
        cursor += 1;
        const kind = path.split('/')[0] as ContentKind;
        const slug = path.split('/')[1].slice(0, -4);
        const raw = await read(`/contents/${path}?ref=${ref}`, true);
        let original;
        try {
          original = parseDocument(raw, kind);
        } catch {
          throw new Error(`Invalid original metadata: ${path}`);
        }
        if (Boolean(original.meta.devOnly) !== draftsOnly) continue;
        const record: ContentRecord = {
          id: path,
          slug,
          kind,
          original,
          translations: {},
          invalidLocales: [],
        };
        for (const locale of ['en', 'ja'] as Locale[]) {
          const sibling = `${kind}/${slug}.${locale}.mdx`;
          if (files.includes(sibling)) {
            const translatedRaw = await read(`/contents/${sibling}?ref=${ref}`, true);
            try {
              record.translations[locale] = translateDocument(
                translatedRaw,
                original,
                kind,
                locale,
              );
            } catch (error) {
              record.invalidLocales.push(locale);
              const reason =
                error instanceof TranslationValidationError
                  ? error.message
                  : 'Unable to parse or validate translation frontmatter';
              console.warn(`Invalid or incomplete translation: ${sibling}: ${reason}`);
            }
          }
        }
        result.push(record);
      }
    }),
  );
  files
    .filter((path) => /\.(en|ja)\.mdx$/.test(path))
    .forEach((path) => {
      if (!originals.includes(path.replace(/\.(en|ja)\.mdx$/, '.mdx')))
        console.warn(`Ignored orphan translation: ${path}`);
    });
  return result.sort((a, b) => a.slug.localeCompare(b.slug));
}
export async function prepareSnapshot(
  read: ReadSource = githubRequest,
  pinnedRef?: string,
): Promise<Snapshot> {
  const { ref, files } = await sourceInventory(read, pinnedRef);
  const records = await loadRecords(ref, files, read);
  return {
    version: 1,
    ref,
    posts: records.filter((record) => record.kind === 'posts'),
    careers: records.filter((record) => record.kind === 'careers'),
  };
}
