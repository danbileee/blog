import { createContext, useContext } from 'react';
import { Locale } from './locales';

export const LocaleContext = createContext<Locale>('ko');
export const useLocale = () => useContext(LocaleContext);
