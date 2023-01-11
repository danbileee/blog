import throttle from 'lodash/throttle';
import { useEffect, useState } from 'react';

export type ScrollDirection = 'init' | 'up' | 'down';

export default function useScrollDirection(initPosition: number) {
  const [direction, setDirection] = useState<ScrollDirection>('init');

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = throttle(() => {
      if (window.scrollY < initPosition) {
        setDirection('init');

        return;
      }

      setDirection(window.scrollY > lastScrollY ? 'down' : 'up');

      lastScrollY = window.scrollY;
    }, 500);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [initPosition]);

  return direction;
}
