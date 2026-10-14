import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { useLocale } from '../../i18n/context';
import { messages } from '../../i18n/messages';
import { isLocale } from '../../i18n/locales';
import { switchLocale } from '../../i18n/routes';

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  return (
    <Select
      id="language"
      aria-label={messages[locale].language}
      value={locale}
      onChange={(event) => {
        const { value } = event.target;
        if (!isLocale(value)) return;
        try {
          document.cookie = `NEXT_LOCALE=${value}; Path=/; Max-Age=31536000; SameSite=Lax${
            process.env.NODE_ENV === 'production' ? '; Secure' : ''
          }`;
        } catch {
          /* URL navigation still works when cookies are unavailable. */
        }
        router.push(switchLocale(router.asPath, value));
      }}
    >
      <option value="ko">한국어</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
    </Select>
  );
}

const Select = styled.select`
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  color: inherit;
  background-color: transparent;
  border-radius: 8px;
  border-color: transparent;
  padding: 6px 28px 6px 10px;
  margin-left: 4px;
  min-width: 80px;
  flex-shrink: 0;
  transition background-color ease-in-out 0.15s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='m4 6 4 4 4-4' fill='none' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 12px 12px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  &:focus-visible {
    outline: 3px solid var(--cornflowerblue);
    outline-offset: 3px;
  }
`;
