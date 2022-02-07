import React from 'react';
import Headline from '../typographic/Headline';

import type { BlockComponentProps } from '../BlockComponentProps';

export interface BarProps extends BlockComponentProps {
  block: {
    headline: HTMLElement | string;
  }
}

export default (props: BlockComponentProps) => {
  const baseClassName = 'foo';
  const { block } = (props as BarProps);

  return (
    <div className={baseClassName}>
      <Headline
        as="h2"
        size="h2"
        elementOf={baseClassName}
        dangerouslySetInnerHTML={{__html: block.headline}}
      />
    </div>
  )
};
