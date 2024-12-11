import { ComponentProps } from 'react';
import Heading, { HeadingElementType } from '../Heading';

export function getHeadingOverride(as: HeadingElementType, props: ComponentProps<typeof as>) {
  const getId = () => {
    if (!props.children) return '';

    return props.children.toString().split(' ').join('-');
  };

  return <Heading {...props} as={as} id={getId()} />;
}
