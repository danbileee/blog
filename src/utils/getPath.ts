import path from 'path';

export function getContentsPath(...paths: string[]) {
  return path.join(process.cwd(), 'src', 'contents', ...paths);
}

export function getPublicPath(...paths: string[]) {
  return path.join(process.cwd(), 'public', ...paths);
}
