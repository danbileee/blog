import { pageMeta, Pathname, pathnames } from '@constants';

function isValidPath(pathname: string) {
  return pathname in pathnames;
}

export function getMetaInfo(pathname: string) {
  const [, menu, dynamic] = pathname.split('/');
  const normalizedPath: Pathname = isValidPath(menu) ? (menu as Pathname) : 'home';

  return {
    key: normalizedPath,
    value: pageMeta[normalizedPath],
    isDynamic: Boolean(dynamic),
  };
}
