import path from 'path';

export function getContentsPath(...paths: string[]) {
  return path.join(process.cwd(), 'src', 'contents', ...paths);
}
