import React, { HTMLAttributes } from 'react';
import {CopyProps} from "./Copy";

export interface HeadlineProps extends HTMLAttributes<HTMLElement> {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  modifier?: string;
  elementOf?: string;
}

export default ({
  as: Tag = 'h1', size = 'h1', modifier, elementOf, children,
}: HeadlineProps) => {
  const baseClassName = elementOf ? `${elementOf}__headline` : 'headline';
  console.log({Tag, size, children});

  return (
    <Tag
      className={`${baseClassName} ${baseClassName}--${size}${modifier ? ` ${baseClassName}--${modifier}` : ''}`}
    >
      {children}
    </Tag>
  )
};

