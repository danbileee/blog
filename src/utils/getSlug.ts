export function getSlug(path: string) {
  return decodeURIComponent(path)
    .split('/')
    .pop()!
    .replace(/\.mdx$/, '');
}
