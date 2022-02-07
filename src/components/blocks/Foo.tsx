import React from 'react';

// import non-block components
import Headline from '../typographic/Headline';
import Copy from '../typographic/Copy';

// import gcd-props
import type { BlockComponentProps } from '../BlockComponentProps';

export interface FooProps extends BlockComponentProps {
  block: {
    headline: HTMLElement | string;
    copy?: HTMLElement | string;
  }
}

export default (props: BlockComponentProps) => {
  const baseClassName = 'foo';
  const { block } = (props as FooProps);

  return (
    <div className={baseClassName}>
      <Headline
        as="h1"
        size="h1"
        elementOf={baseClassName}
        dangerouslySetInnerHTML={{__html: block.headline}}
      />
      <Copy
        elementOf={baseClassName}
        dangerouslySetInnerHTML={{__html: block.copy}}
      />
    </div>
  )
};
