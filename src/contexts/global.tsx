import { createContext, PropsWithChildren, useContext } from 'react';

import { useIsMobile } from '@hooks/useIsMobile';

interface GlobalContextType {
  isMobile: boolean;
}

export const GlobalContext = createContext<GlobalContextType | null>(null);

export function GlobalContextProvider({ children }: PropsWithChildren<unknown>) {
  const isMobile = useIsMobile();

  return <GlobalContext.Provider value={{ isMobile }}>{children}</GlobalContext.Provider>;
}

export function useGlobalContext() {
  const state = useContext(GlobalContext);

  if (!state) {
    throw Error('state should not be null');
  }

  return state;
}
