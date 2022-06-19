import { metaInfo, Pathname, pathnames } from '@constants/metaInfo';

function isValidPath(pathname: string) {
  return pathname in pathnames;
}

export function getMetaInfo(pathname: string) {
  const [, menu] = pathname.split('/');
  const normalizedPath: Pathname = isValidPath(menu)
    ? (menu as Pathname)
    : 'home';

  return metaInfo[normalizedPath];
}
