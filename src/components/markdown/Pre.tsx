import { ComponentProps, useEffect } from 'react';
import Prism from 'prismjs';

export default function Pre({
  className,
  children,
  ...props
}: ComponentProps<'pre'>) {
  const language = className?.replace('lang-', '');

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre css={{ margin: 0 }} {...props}>
      <code className={`language-${language}`}>{children}</code>
    </pre>
  );
}
