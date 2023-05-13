import path from 'path';

export function getPostsPath(...paths: string[]) {
  return path.join(process.cwd(), 'src', 'posts', ...paths);
}

export function getCareersPath(...paths: string[]) {
  return path.join(process.cwd(), 'src', 'careers', ...paths);
}

export function getPublicPath(...paths: string[]) {
  return path.join(process.cwd(), 'public', ...paths);
}
