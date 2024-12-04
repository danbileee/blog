export function getSlug(url: string) {
  return url
    .replace('https://api.github.com/repos/danbileee/blog-docs/contents/posts%2F', '')
    .replace('.mdx', '');
}
