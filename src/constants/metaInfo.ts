import { MetaInfo } from './types';

export const menus = {
  career: 'career',
  // me: 'about me',
  blog: 'blog',
} as const;

export const pathnames = {
  home: '/',
  career: '/career',
  // me: '/me',
  blog: '/blog',
} as const;

export type Pathname = keyof typeof pathnames;

export const metaInfo: Record<Pathname, MetaInfo> = {
  home: {
    title: 'Home',
    description: 'a front-end developer portfolio',
  },
  career: {
    title: 'Career',
    description:
      '웹 에이전시, SaaS, 커머스 플랫폼에서\n프론트엔드 개발 경험이 있습니다.',
    menu: menus.career,
    emoji: ['1f4bb'],
  },
  // me: {
  //   title: 'About Me',
  //   description: '언어 배우기와 디자인을 좋아하는\n프론트엔드 개발자입니다.',
  //   menu: menus.me,
  //   emoji: ['1f44b'],
  // },
  blog: {
    title: 'Blog',
    description: '웹과 개발과 컴퓨터에 대해 배운 것을 기록합니다.',
    menu: menus.blog,
    emoji: ['1f4da'],
  },
};
