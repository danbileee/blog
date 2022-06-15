import path from 'path';

export function getPath(...paths: string[]) {
  return path.join('src', ...paths);
}
