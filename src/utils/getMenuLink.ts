import { pageMeta } from '@constants';

export function getMenuLink(currentMenu: string) {
  const [link] = Object.entries(pageMeta).find(([, { menu }]) => menu === currentMenu) ?? [];

  return `/${link}` ?? '/';
}
