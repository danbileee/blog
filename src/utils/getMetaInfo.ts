import { pageMeta, Pathname } from '@constants';

export function getMetaInfo(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const menu = /^(ko|en|ja|\[locale\])$/.test(segments[0] ?? '') ? segments[1] : segments[0];
  const key: Pathname = menu === 'career' || menu === 'blog' ? menu : 'home';
  return { key, value: pageMeta[key], isDynamic: key === 'blog' && segments.length > 2 };
}
