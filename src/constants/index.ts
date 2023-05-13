import { MetaInfo } from './types';

export const menus = {
  about: 'about',
  blog: 'blog',
} as const;

export const pathnames = {
  home: '/',
  about: '/about',
  blog: '/blog',
} as const;

export type Pathname = keyof typeof pathnames;

export const pageMeta: Record<Pathname, MetaInfo> = {
  home: {
    title: 'Home',
    description: 'a front-end developer portfolio',
  },
  about: {
    title: 'About',
    description: '웹 에이전시, SaaS, 커머스 플랫폼에서\n프론트엔드 개발 경험이 있습니다.',
    menu: menus.about,
    emoji: ['1f4bb'],
  },
  blog: {
    title: 'Blog',
    description: 'Personal archive on web, development, and work',
    menu: menus.blog,
    emoji: ['1f4da'],
  },
};
