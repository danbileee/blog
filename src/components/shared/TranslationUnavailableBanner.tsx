import { useLocale } from '../../i18n/context';
import { messages } from '../../i18n/messages';

export default function TranslationUnavailableBanner({ career = false }: { career?: boolean }) {
  const locale = useLocale();
  if (locale === 'ko') return null;
  return (
    <section
      style={{
        padding: '16px',
        marginBottom: '32px',
        background: 'rgba(0, 0, 0, 0.04)',
        borderRadius: '8px',
        lineHeight: 1.6,
      }}
      aria-label={messages[locale].original}
    >
      {messages[locale][career ? 'careerUnavailable' : 'unavailable']}
    </section>
  );
}
