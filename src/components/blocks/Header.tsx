import React from 'react';

// import non-block components and types
import { HeadlineProps } from '../typographic/Headline';
import { CopyProps } from '../typographic/Copy';

// import gcd-props
import type { BlockComponentProps } from '../BlockComponentProps';

export interface HeaderProps extends BlockComponentProps {
  modifier?: string;
  headline?: HeadlineProps;
  copy?: CopyProps;
}

export default (props: BlockComponentProps) => {
  const baseClassName = 'header';
  const { modifier, block } = (props as HeaderProps);

  const components = (block as any).components || [];

  return (
    <header
      className={`${baseClassName}${modifier ? ` ${baseClassName}--${modifier}` : ''}`}
    >
      {components.map(component => props.RenderBlock(component))}
    </header>
  )
};

