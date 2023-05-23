import { ComponentProps } from 'react';

export default function Paragraph(props: ComponentProps<'p'>) {
  return <p css={{ lineHeight: '1.68', letterSpacing: '0.01em' }} {...props} />;
}
