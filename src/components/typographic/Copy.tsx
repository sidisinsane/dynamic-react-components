import React, { HTMLAttributes } from 'react';

export interface CopyProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  modifier?: string;
  elementOf?: string;
}

export default ({
  modifier, elementOf, children,
}: CopyProps) => {
  const baseClassName = elementOf ? `${elementOf}__copy` : 'copy';
  console.log({modifier, elementOf, children});

  return (
    <div
      className={`${baseClassName}${modifier ? ` ${baseClassName}--${modifier}` : ''}`}
    >
      {children}
    </div>
  )
};

