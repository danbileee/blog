import { MetaInfo } from './types';

export const menus = { career: 'career', blog: 'blog' } as const;
export const pathnames = { home: '/', career: '/career', blog: '/blog' } as const;
export type Pathname = keyof typeof pathnames;
export const pageMeta: Record<Pathname, MetaInfo> = {
  home: { title: '홈', description: '이단비의 포트폴리오' },
  career: { title: '경력', description: '프론트엔드 개발 경험', menu: menus.career },
  blog: { title: '블로그', description: '웹, 개발, 일에 대한 기록', menu: menus.blog },
};
