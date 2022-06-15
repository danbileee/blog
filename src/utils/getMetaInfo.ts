import { metaInfo, Pathname, pathnames } from '@constants/meta-info';

function isValidPath(pathname: string) {
  return pathname in pathnames;
}

export function getMetaInfo(pathname: string) {
  const replacedPath = pathname.replace('/', '');
  const normalizedPath: Pathname = isValidPath(replacedPath)
    ? (replacedPath as Pathname)
    : 'home';

  return metaInfo[normalizedPath];
}
