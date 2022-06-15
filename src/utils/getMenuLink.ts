import { metaInfo } from '@constants/meta-info';

export function getMenuLink(currentMenu: string) {
  const [link] =
    Object.entries(metaInfo).find(([, { menu }]) => menu === currentMenu) ?? [];

  return link ?? '/';
}
