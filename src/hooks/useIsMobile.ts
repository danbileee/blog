import { useEffect, useState } from 'react';

import { BREAK_POINTS } from '@styles/mediaQuery';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  function resizeHandler() {
    setIsMobile(window.innerWidth <= BREAK_POINTS[0]);
  }

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    resizeHandler();

    return window.removeEventListener('resize', resizeHandler);
  }, []);

  return isMobile;
}
